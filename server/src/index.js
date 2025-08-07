import express from 'express';
import cors from 'cors';
import usuariosRoutes from './routes/usuarios.routes.js';
import contactosRoutes from './routes/contactos.routes.js';
import cuentasRoutes from './routes/cuentas.routes.js';
import eventosRoutes from './routes/eventos.routes.js';
import notasRoutes from './routes/notas.routes.js';

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API de Agenda');
});

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/contactos', contactosRoutes);
app.use('/api/cuentas', cuentasRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/notas', notasRoutes);

app.listen(PORT);
console.log('Server corriendo en el puerto', + PORT);