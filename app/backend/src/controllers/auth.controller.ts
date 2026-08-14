import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY || 'mi_clave_secreta_super_segura';

// Base de datos simulada (arreglo en memoria)
export const users: any[] = [];

export const register = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    // Verificar si el usuario ya existe
    const userExists = users.find(u => u.email === email);
    if (userExists) {
        return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar el usuario
    const newUser = { id: users.length + 1, email, password: hashedPassword };
    users.push(newUser);

    return res.status(201).json({ message: 'Usuario registrado exitosamente' });
};

export const login = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    // Buscar al usuario
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Comparar contraseñas
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Generar el JWT
    const token = jwt.sign(
        { id: user.id, email: user.email },
        SECRET_KEY,
        { expiresIn: '2h' }
    );

    return res.json({ token, message: 'Login exitoso' });
};