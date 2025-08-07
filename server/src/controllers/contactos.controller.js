import { pool } from '../database.js';

// Obtener todos los contactos
export const obtenerContactos = async (req, res) => {
    const { id_usuario } = req.params;
    try {
        const [resultado] = await pool.query('SELECT * FROM contactos WHERE id_usuario = ?', [id_usuario]);
        res.json(resultado);
    } catch (error) {
        console.error('Error al obtener contactos:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener contactos.' });
    }
};

// Obtener un contacto por id
export const obtenerContactoId = async (req, res) => {
    const { id_usuario, id_contacto } = req.params;
    try {
        const [resultado] = await pool.query("SELECT * FROM contactos WHERE id_usuario = ? AND id = ?", [id_usuario, id_contacto]);
        if (resultado.length === 0) {
            return res.status(404).json({ message: "Contacto no encontrado o no pertenece al usuario." });
        } else {
            res.json(resultado[0]);
        }
    } catch (error) {
        console.error('Error al obtener contacto por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el contacto.' });
    }
};

// Crear un contacto
export const crearContacto = async (req, res) => {
    const { nombre, telefono, email, direccion, notas, id_usuario } = req.body;
    if (!nombre || !telefono || !id_usuario) {
        return res.status(400).json({ message: "Nombre, teléfono e ID de usuario son campos requeridos." });
    }
    try {
        const [resultado] = await pool.query(
            "INSERT INTO contactos(nombre, telefono, email, direccion, notas, id_usuario) VALUES (?, ?, ?, ?, ?, ?)",
            [nombre, telefono, email, direccion, notas, id_usuario]
        );
        res.status(201).json({ id: resultado.insertId, nombre, telefono, email, direccion, notas, id_usuario, message: "Contacto creado exitosamente." });
    } catch (error) {
        console.error('Error al crear contacto:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear el contacto.' });
    }
};

// Actualizar un contacto
export const actualizarContacto = async (req, res) => {
    const { id_usuario, id_contacto } = req.params;
    const { nombre, telefono, email, direccion, notas } = req.body;
    if (!nombre && !telefono && !email && !direccion && !notas) {
        return res.status(400).json({ message: "Se requiere al menos un campo para actualizar (nombre, teléfono, email, dirección, o notas)." });
    }
    try {
        const [resultado] = await pool.query(
            "UPDATE contactos SET nombre = IFNULL(?, nombre), telefono = IFNULL(?, telefono), email = IFNULL(?, email), direccion = IFNULL(?, direccion), notas = IFNULL(?, notas) WHERE id_usuario = ? AND id = ?",
            [nombre, telefono, email, direccion, notas, id_usuario, id_contacto]
        );
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: "Contacto no encontrado o no pertenece al usuario." });
        } else {
            const [contactoActualizado] = await pool.query("SELECT * FROM contactos WHERE id = ? AND id_usuario = ?", [id_contacto, id_usuario]);
            res.json({ message: "Contacto actualizado exitosamente.", contacto: contactoActualizado[0] });
        }
    } catch (error) {
        console.error('Error al actualizar contacto:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar el contacto.' });
    }
};

// Eliminar un contacto
export const eliminarContacto = async (req, res) => {
    const { id_usuario, id_contacto } = req.params;
    try {
        const [resultado] = await pool.query("DELETE FROM contactos WHERE id_usuario = ? AND id = ?", [id_usuario, id_contacto]);
        if (resultado.affectedRows === 0) {
            return res.status(404).json({ message: "Contacto no encontrado o no pertenece al usuario." });
        } else {
            res.json({ message: "Contacto eliminado correctamente." });
        }
    } catch (error) {
        console.error('Error al eliminar contacto:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el contacto.' });
    }
};