'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth.config';


export const setTransactionId = async( orderId: string, transactionId: string ) => {
  const session = await auth();
  if (!session?.user?.id || typeof orderId !== 'string' || !orderId.trim() || orderId.length > 255 ||
      typeof transactionId !== 'string' || !transactionId.trim() || transactionId.length > 255) {
    return { ok: false, message: 'No autorizado o transaccion invalida' };
  }

  try {
    
    const order = await prisma.order.updateMany({
      where: { id: orderId, userId: session.user.id, isPaid: false },
      data: { transactionId: transactionId }
    });

    if ( order.count !== 1 ) {
      return {
        ok:false,
        message: `No se encontró una orden con el ${ orderId }`,
      }
    }

    return { ok: true }


  } catch (error) {
    
    console.log(error);

    return {
      ok: false,
      message: 'No se pudo actualizar el id de la transacción'
    }

  }


}
