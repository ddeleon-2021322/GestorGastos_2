import express from 'express';
import cors from 'cors';

// Importación de módulos/componentes
import authRoutes from './routes/auth.routes';
//import gastosRoutes from './routes/gastos.routes'; // Asumiendo que nombraste así al de gastos

const app = express();

// Middlewares globales
app.use(express.json());
app.use(cors());

// Registro de rutas
app.use('/api/auth', authRoutes);     // Maneja /api/auth/login y /api/auth/register
//app.use('/api/gastos', gastosRoutes); // Maneja todo lo de gastos

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});