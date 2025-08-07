import { Router } from 'express';
import { obtenerNotas, obtenerNotaId, crearNota, actualizarNota, eliminarNota } from '../controllers/notas.controller.js';

const router = Router();

router.get('/:id_usuario', obtenerNotas);
router.get('/:id_usuario/:id_nota', obtenerNotaId);
router.post('/:id_usuario', crearNota);
router.put('/:id_usuario/:id_nota', actualizarNota);
router.delete('/:id_usuario/:id_nota', eliminarNota);

export default router;