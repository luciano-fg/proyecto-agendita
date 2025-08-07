import { pool } from "../database.js";

//Obtener todos los eventos
export const obtenerEventos = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const [resultado] = await pool.query("SELECT * FROM eventos WHERE id_usuario = ?", [id_usuario]);
        res.json(resultado);
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener eventos.' });
    }
};

//Obtener evento por id
export const obtenerEventoId = async (req, res) => {
    const { id_usuario, id_evento } = req.params;
    try {
        const [resultado] = await pool.query("SELECT * FROM eventos WHERE id_usuario = ? AND id = ?", [id_usuario, id_evento]);
        if (resultado.length === 0) {
            return res.status(404).json({ message: "Evento no encontrado o no pertenece al usuario." });
        } else {
            res.json(resultado[0]);
        }
    } catch (error) {
        console.error('Error al obtener evento por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el evento.' });
    }
};

//Crear evento
export const crearEvento = async (req, res) => {
    const { titulo, descripcion, fecha_evento, fecha_recordar, id_usuario } = req.body;
    if (!titulo || !descripcion || !fecha_evento || !fecha_recordar || !id_usuario) {
        return res.status(400).json({ message: "Título, descripción, fecha del evento, fecha de recordatorio e ID de usuario son campos requeridos." });
    }

    try {
        const [resultado] = await pool.query(
            "INSERT INTO eventos(titulo, descripcion, fecha_evento, fecha_recordar, id_usuario) VALUES (?, ?, ?, ?, ?)",
            [titulo, descripcion, fecha_evento, fecha_recordar, id_usuario]
        );
        res.status(201).json({ id: resultado.insertId, titulo, descripcion, fecha_evento, fecha_recordar, id_usuario, message: "Evento creado exitosamente." });
    } catch (error) {
        console.error('Error al crear evento:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear el evento.' });
    }
};

//Actualizar evento
export const actualizarEvento = async (req, res) => {
    const { id_usuario, id_evento } = req.params;
    const { titulo, descripcion, fecha_evento, fecha_recordar } = req.body;
    if (!titulo && !descripcion && !fecha_evento && !fecha_recordar) {
        return res.status(400).json({ message: "Se requiere al menos un campo para actualizar (título, descripción, fecha del evento, o fecha de recordatorio)." });
    }

    try {
        const [resultado] = await pool.query(
            "UPDATE eventos SET titulo = IFNULL(?, titulo), descripcion = IFNULL(?, descripcion), fecha_evento = IFNULL(?, fecha_evento), fecha_recordar = IFNULL(?, fecha_recordar) WHERE id_usuario = ? AND id = ?",
            [titulo, descripcion, fecha_evento, fecha_recordar, id_usuario, id_evento]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: "Evento no encontrado o no pertenece al usuario." });
        } else {
            const [eventoActualizado] = await pool.query("SELECT * FROM eventos WHERE id = ? AND id_usuario = ?", [id_evento, id_usuario]);
            res.json({ message: "Evento actualizado exitosamente.", evento: eventoActualizado[0] });
        }
    } catch (error) {
        console.error('Error al actualizar evento:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el evento.' });
    }
};

//Eliminar evento
export const eliminarEvento = async (req, res) => {
    const { id_usuario, id_evento } = req.params;
    try {
        const [resultado] = await pool.query("DELETE FROM eventos WHERE id_usuario = ? AND id = ?", [id_usuario, id_evento]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: "Evento no encontrado o no pertenece al usuario." });
        } else {
            res.json({ message: "Evento eliminado correctamente." });
        }
    } catch (error) {
        console.error('Error al eliminar evento:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el evento.' });
    }
};