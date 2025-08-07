import { pool } from '../database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Registro de usuario
export const registrarUsuario = async (req, res) => {
    const { nombre, email, contraseña } = req.body;
    if (!nombre || !email || !contraseña) {
        return res.status(400).json({ error: 'Nombre, email y contraseña son campos requeridos.' });
    }

    try {
        const [existeUsuario] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existeUsuario.length > 0) {
            return res.status(409).json({ error: 'El email ya está registrado.' });
        }

        const contraseñaEncriptada = await bcrypt.hash(contraseña, 10);
        const [result] = await pool.query('INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)', [nombre, email, contraseñaEncriptada]);
        res.status(201).json({ id: result.insertId, nombre, email, message: 'Usuario registrado exitosamente.' });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor al registrar el usuario.' });
    }
};

// Login de usuario
export const loginUsuario = async (req, res) => {
    const { email, contraseña } = req.body;
    if (!email || !contraseña) {
        return res.status(400).json({ error: 'Email y contraseña son campos requeridos.' });
    }

    try {
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        const usuario = rows[0];

        const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!contraseñaValida) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET no está definido en las variables de entorno.');
            return res.status(500).json({ error: 'Error de configuración del servidor.' });
        }

        const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({
            token,
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
            },
            message: 'Inicio de sesión exitoso.',
        });
    } catch (error) {
        console.error('Error en el login de usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor durante el inicio de sesión.' });
    }
};

// Obtener usuario por ID
export const obtenerUsuario = async (req, res) => {
    const userIdFromToken = req.user.id;
    const { id } = req.params;

    if (parseInt(id) !== userIdFromToken) {
        return res.status(403).json({ error: 'No tienes permiso para ver este perfil.' });
    }

    try {
        const [rows] = await pool.query('SELECT id, nombre, email, fecha_registro FROM usuarios WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener el usuario.' });
    }
};
