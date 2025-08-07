import { Router } from "express";
import { obtenerContactos, obtenerContactoId, crearContacto, actualizarContacto, eliminarContacto } from "../controllers/contactos.controller.js";

const router = Router();

router.get("/:id_usuario", obtenerContactos);
router.get("/:id_usuario/:id_contacto",  obtenerContactoId);
router.post("/:id_usuario",  crearContacto);
router.put("/:id_usuario/:id_contacto",  actualizarContacto);
router.delete("/:id_usuario/:id_contacto", eliminarContacto);

export default router;