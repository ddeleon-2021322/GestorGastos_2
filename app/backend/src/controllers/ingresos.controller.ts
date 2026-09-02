import { Response } from 'express';
import { database } from '../config/db'; 

export const getIngresos = async (req: any, res: Response): Promise<any> => {
  try {
    const usuarioId = req.usuario.id;

    const totalQuery = await database.query(
      'SELECT COALESCE(SUM(monto), 0) AS total FROM ingresos WHERE usuario_id = $1',
      [usuarioId]
    );

    const listaQuery = await database.query(
      'SELECT * FROM ingresos WHERE usuario_id = $1 ORDER BY fecha DESC LIMIT 5',
      [usuarioId]
    );

    res.status(200).json({
      total: totalQuery.rows[0].total,
      movimientos: listaQuery.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los ingresos' });
  }
};

export const crearIngreso = async (req: any, res: Response): Promise<any> => {
  try {
    const { titulo, monto } = req.body;
    const usuarioId = req.usuario.id;

    const nuevoIngreso = await database.query(
      'INSERT INTO ingresos (usuario_id, titulo, monto) VALUES ($1, $2, $3) RETURNING *',
      [usuarioId, titulo, monto]
    );

    res.status(201).json(nuevoIngreso.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el ingreso' });
  }
};