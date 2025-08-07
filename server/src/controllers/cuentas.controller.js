import { pool } from "../database.js";

//Obtener todas las cuentas
export const obtenerCuentas = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const [resultado] = await pool.query("SELECT * FROM cuentas WHERE id_usuario = ?", [id_usuario]);
        res.json(resultado);
    } catch (error) {
        console.error('Error al obtener cuentas:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener cuentas.' });
    }
};

//Obtener cuenta por id
export const obtenerCuentaId = async (req, res) => {
    const { id_usuario, id_cuenta } = req.params;
    try {
        const [resultado] = await pool.query("SELECT * FROM cuentas WHERE id_usuario = ? AND id = ?", [id_usuario, id_cuenta]);
        if (resultado.length === 0) {
            return res.status(404).json({ message: "Cuenta no encontrada o no pertenece al usuario." });
        } else {
            res.json(resultado[0]);
        }
    } catch (error) {
        console.error('Error al obtener cuenta por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener la cuenta.' });
    }
};

//Crear cuenta
export const crearCuenta = async (req, res) => {
    const { titulo, nombre_usuario, contraseña_usuario, notas, id_usuario } = req.body;
    if (!titulo || !nombre_usuario || !contraseña_usuario || !id_usuario) {
        return res.status(400).json({ message: "Título, nombre de usuario, contraseña e ID de usuario son campos requeridos." });
    }
    try {
        const [resultado] = await pool.query(
            "INSERT INTO cuentas(titulo, nombre_usuario, contraseña_usuario, notas, id_usuario) VALUES (?, ?, ?, ?, ?)",
            [titulo, nombre_usuario, contraseña_usuario, notas, id_usuario]
        );
        res.status(201).json({ id: resultado.insertId, titulo, nombre_usuario, contraseña_usuario, notas, id_usuario, message: "Cuenta creada exitosamente." });
    } catch (error) {
        console.error('Error al crear cuenta:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear la cuenta.' });
    }
};

//Actualizar cuenta
export const actualizarCuenta = async (req, res) => {
    const { id_usuario, id_cuenta } = req.params;
    const { titulo, nombre_usuario, contraseña_usuario, notas } = req.body;
    if (!titulo && !nombre_usuario && !contraseña_usuario && !notas) {
        return res.status(400).json({ message: "Se requiere al menos un campo para actualizar (título, nombre de usuario, contraseña, o notas)." });
    }
    try {
        const [resultado] = await pool.query(
            "UPDATE cuentas SET titulo = IFNULL(?, titulo), nombre_usuario = IFNULL(?, nombre_usuario), contraseña_usuario = IFNULL(?, contraseña_usuario), notas = IFNULL(?, notas) WHERE id_usuario = ? AND id = ?",
            [titulo, nombre_usuario, contraseña_usuario, notas, id_usuario, id_cuenta]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: "Cuenta no encontrada o no pertenece al usuario." });
        } else {
            const [cuentaActualizada] = await pool.query("SELECT * FROM cuentas WHERE id = ? AND id_usuario = ?", [id_cuenta, id_usuario]);
            res.json({ message: "Cuenta actualizada exitosamente.", cuenta: cuentaActualizada[0] });
        }
    } catch (error) {
        console.error('Error al actualizar cuenta:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar la cuenta.' });
    }
};

//Eliminar cuenta
export const eliminarCuenta = async (req, res) => {
    const { id_usuario, id_cuenta } = req.params;
    try {
        const [resultado] = await pool.query("DELETE FROM cuentas WHERE id_usuario = ? AND id = ?", [id_usuario, id_cuenta]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: "Cuenta no encontrada o no pertenece al usuario." });
        } else {
            res.json({ message: "Cuenta eliminada correctamente." });
        }
    } catch (error) {
        console.error('Error al eliminar cuenta:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar la cuenta.' });
    }
};