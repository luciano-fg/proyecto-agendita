import { pool } from '../database.js';

//Obtener todas las notas
export const obtenerNotas = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const [resultado] = await pool.query("SELECT * FROM notas WHERE id_usuario = ?", [id_usuario]);
        res.json(resultado);
    } catch (error) {
        console.error('Error al obtener notas:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener notas.' });
    }
};

//Obtener nota por id
export const obtenerNotaId = async (req, res) => {
    const { id_usuario, id_nota } = req.params;
    try {
        const [resultado] = await pool.query("SELECT * FROM notas WHERE id_usuario = ? AND id = ?", [id_usuario, id_nota]);
        if (resultado.length === 0) {
            return res.status(404).json({ message: "Nota no encontrada o no pertenece al usuario." });
        } else {
            res.json(resultado[0]);
        }
    } catch (error) {
        console.error('Error al obtener nota por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener la nota.' });
    }
};

//Crear nota
export const crearNota = async (req, res) => {
    const { titulo, descripcion, id_usuario } = req.body;
    if (!titulo || !descripcion || !id_usuario) {
        return res.status(400).json({ message: "Título, descripción e ID de usuario son campos requeridos." });
    }

    try {
        const [resultado] = await pool.query("INSERT INTO notas(titulo, descripcion, id_usuario) VALUES (?, ?, ?)", [titulo, descripcion, id_usuario]);
        res.status(201).json({ id: resultado.insertId, titulo, descripcion, id_usuario, message: "Nota creada exitosamente." });
    } catch (error) {
        console.error('Error al crear nota:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear la nota.' });
    }
};

//Actualizar nota
export const actualizarNota = async (req, res) => {
    const { id_usuario, id_nota } = req.params;
    const { titulo, descripcion } = req.body;
    if (!titulo && !descripcion) {
        return res.status(400).json({ message: "Se requiere al menos un campo para actualizar (título o descripción)." });
    }

    try {
        const [resultado] = await pool.query(
            "UPDATE notas SET titulo = IFNULL(?, titulo), descripcion = IFNULL(?, descripcion) WHERE id_usuario = ? AND id = ?",
            [titulo, descripcion, id_usuario, id_nota]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: "Nota no encontrada o no pertenece al usuario." });
        } else {
            const [notaActualizada] = await pool.query("SELECT * FROM notas WHERE id = ? AND id_usuario = ?", [id_nota, id_usuario]);
            res.json({ message: "Nota actualizada exitosamente.", nota: notaActualizada[0] });
        }
    } catch (error) {
        console.error('Error al actualizar nota:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar la nota.' });
    }
};

//Eliminar nota
export const eliminarNota = async (req, res) => {
    const { id_usuario, id_nota } = req.params;
    try {
        const [resultado] = await pool.query("DELETE FROM notas WHERE id_usuario = ? AND id = ?", [id_usuario, id_nota]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: "Nota no encontrada o no pertenece al usuario." });
        } else {
            res.json({ message: "Nota eliminada correctamente." });
        }
    } catch (error) {
        console.error('Error al eliminar nota:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar la nota.' });
    }
};