"use server";

import prisma from '@/lib/prisma';
import { auth } from '@/auth.config';
import { PayPalOrderStatusResponse } from '@/interfaces';
import { revalidatePath } from 'next/cache';

export const paypalCheckPayment = async (paypalTransactionId: string) => {
  const session = await auth();
  const merchantId = process.env.PAYPAL_MERCHANT_ID;
  if (!session?.user?.id || typeof paypalTransactionId !== 'string' || !paypalTransactionId.trim() || paypalTransactionId.length > 255 || !merchantId) {
    return { ok: false, message: 'No autorizado o configuracion de pago incompleta' };
  }

  try {
    const order = await prisma.order.findFirst({
      where: { transactionId: paypalTransactionId, userId: session.user.id },
    });
    if (!order) return { ok: false, message: 'Orden no disponible' };

    const authToken = await getPayPalBearerToken();
    if (!authToken) return { ok: false, message: 'No se pudo verificar el pago' };
    const response = await verifyPayPalPayment(paypalTransactionId, authToken);
    const unit = response?.purchase_units?.length === 1 ? response.purchase_units[0] : undefined;
    const captures = unit?.payments?.captures;
    const capture = captures?.length === 1 ? captures[0] : undefined;
    const matchesAmount = (amount: { currency_code: string; value: string } | undefined) =>
      amount?.currency_code === 'USD' && typeof amount.value === 'string' &&
      /^\d+(?:\.\d{1,2})?$/.test(amount.value) && Number.isFinite(Number(amount.value)) &&
      Math.round(Number(amount.value) * 100) === Math.round(order.total * 100);

    if (response?.id !== paypalTransactionId || response.status !== 'COMPLETED' ||
        unit?.invoice_id !== order.id || unit.payee?.merchant_id !== merchantId ||
        !matchesAmount(unit.amount) || capture?.status !== 'COMPLETED' ||
        capture.final_capture !== true || !matchesAmount(capture.amount)) {
      return { ok: false, message: 'El pago no corresponde a la orden' };
    }

    if (order.isPaid) return { ok: true };
    const updated = await prisma.order.updateMany({
      where: { id: order.id, userId: session.user.id, transactionId: paypalTransactionId, isPaid: false },
      data: { isPaid: true, paidAt: new Date() },
    });
    if (updated.count !== 1) return { ok: false, message: 'No se pudo actualizar la orden' };

    revalidatePath(`/orders/${order.id}`);
    return { ok: true };
  } catch {
    return { ok: false, message: 'No se pudo verificar el pago' };
  }
};

const getPayPalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
  const oauth2Url = process.env.PAYPAL_OAUTH_URL ?? "";

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", `Basic ${base64Token}`);

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "client_credentials");

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: urlencoded,
  };

  try {
    const result = await fetch(oauth2Url, {
      ...requestOptions,
      cache: 'no-store'
    }).then((r) => r.ok ? r.json() : null);
    return typeof result?.access_token === 'string' ? result.access_token : null;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const verifyPayPalPayment = async (
  paypalTransactionId: string,
  bearerToken: string
): Promise<PayPalOrderStatusResponse|null>  => {

  const paypalOrderUrl = `${ process.env.PAYPAL_ORDERS_URL }/${ encodeURIComponent(paypalTransactionId) }`;

  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${ bearerToken }`
  );

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
  };

  try {
    const resp = await fetch(paypalOrderUrl, {
      ...requestOptions,
      cache: 'no-store'
    }).then( r => r.ok ? r.json() : null );
    return resp;
    
  } catch (error) {
    console.log(error);
    return null;
  }

};
