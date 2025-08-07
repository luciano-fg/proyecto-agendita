import {Router} from 'express';
import { obtenerEventos, obtenerEventoId, crearEvento, actualizarEvento, eliminarEvento } from '../controllers/eventos.controller.js';

const router = Router();

router.get('/:id_usuario', obtenerEventos);
router.get('/:id_usuario/:id_evento', obtenerEventoId);
router.post('/:id_usuario', crearEvento);
router.put('/:id_usuario/:id_evento', actualizarEvento);
router.delete('/:id_usuario/:id_evento', eliminarEvento);

export default router;