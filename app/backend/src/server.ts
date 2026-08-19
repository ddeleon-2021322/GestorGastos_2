import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);    

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});