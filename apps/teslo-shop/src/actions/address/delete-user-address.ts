'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/auth.config';



export const deleteUserAddress = async( userId: string ) => {
  const session = await auth();
  if (!session?.user?.id || session.user.id !== userId) {
    return { ok: false, message: 'No autorizado' };
  }

  try {

    const deleted = await prisma.userAddress.delete({
      where: { userId }
    });

    return { ok: true };
    
  } catch (error) {
    console.log(error);
  
    return {
      ok: false,
      message: 'No se pudo eliminar la direccion'
    }


}
}
