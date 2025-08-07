import { Router } from "express";
import { obtenerCuentas, obtenerCuentaId, crearCuenta, actualizarCuenta, eliminarCuenta } from "../controllers/cuentas.controller.js";

const router = Router();

router.get("/:id_usuario", obtenerCuentas);
router.get("/:id_usuario/:id_cuenta", obtenerCuentaId);
router.post("/:id_usuario", crearCuenta);
router.put("/:id_usuario/:id_cuenta", actualizarCuenta);
router.delete("/:id_usuario/:id_cuenta", eliminarCuenta);

export default router;