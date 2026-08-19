import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { database } from '../config/db';

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;

    const userExistente = await database.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    
    if (userExistente.rows.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    const result = await database.query(
      'INSERT INTO usuarios (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, passwordEncriptada]
    );

    res.status(201).json({ 
      message: 'Usuario registrado con éxito',
      usuario: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Hubo un error en el servidor' });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  res.status(200).json({ message: 'Ruta de login conectada (pendiente de integrar PostgreSQL)' });
};