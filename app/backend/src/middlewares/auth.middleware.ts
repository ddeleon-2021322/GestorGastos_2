import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const verificarToken = (req: any, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'clave_secreta_para_mis_tokens';
    const decoded = jwt.verify(token, secret);
    req.usuario = decoded; 
    next();
  } catch (error) {
    res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};