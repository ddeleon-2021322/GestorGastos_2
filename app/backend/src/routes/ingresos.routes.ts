import { Router } from 'express';
import { getIngresos, crearIngreso } from '../controllers/ingresos.controller';
import { verificarToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', verificarToken, getIngresos);
router.post('/', verificarToken, crearIngreso);

export default router;