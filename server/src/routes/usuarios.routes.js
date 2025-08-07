import { Router } from 'express';
import { registrarUsuario, loginUsuario, obtenerUsuario } from '../controllers/usuarios.controller.js';
import { verificarToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Registro de usuario
router.post('/register', registrarUsuario);

// Login de usuario
router.post('/login', loginUsuario);

// Obtener perfil de usuario
router.get('/:id', verificarToken, obtenerUsuario);

export default router;
