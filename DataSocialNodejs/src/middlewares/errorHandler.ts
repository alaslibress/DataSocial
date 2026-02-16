import { Request, Response, NextFunction } from 'express';

//El middlewares ante cualquier error devolverá un error 500 para indicar problemas de back
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction
): void =>{
  //Mostramos el error en consola para debug
  console.error('Error no manejado:', err.message);

  //Respondemos al cliente con un error genérico
  res.status(500).json({
    error: 'Error interno del servidor',
    //Solo mostramos detalles del error en desarrollo
    detalle: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};
