'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth.config';



export const getUserAddress = async( userId: string ) => {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) return null;
  try {

    const address = await prisma.userAddress.findUnique({
      where: { userId }
    });

    if ( !address ) return null;

    const {  countryId, address2, ...rest } = address;

    return {
      ...rest,
      country: countryId,
      address2: address2 ? address2 : '',
    };


  } catch (error) {
    console.log(error);
    return null;
  }
}




