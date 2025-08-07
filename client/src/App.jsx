import { Route, Routes } from 'react-router-dom';
import InicioPage from './pages/InicioPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import PanelPage from './pages/PanelPage';
import ContactosPage from './pages/contactos/ContactosPage';
import ContactoFormPage from './pages/contactos/ContactoFormPage';
import EventosPage from './pages/eventos/EventosPage';
import EventosFormPage from './pages/eventos/EventosFormPage';
import CuentasPage from './pages/cuentas/CuentasPage';
import CuentasFormPage from './pages/cuentas/CuentasFormPage';
import NotasPage from './pages/notas/NotasPage';
import NotasFormPage from './pages/notas/NotasFormPage';

function App() {
    return (
        <Routes>
            <Route path='/' element={<InicioPage />}></Route>
            <Route path='/register' element={<RegisterPage />}></Route>
            <Route path='/login' element={<LoginPage />}></Route>
            <Route path='/panel' element={<PanelPage />}></Route>

            <Route path='/panel/contactos' element={<ContactosPage />}></Route>
            <Route path='/panel/contactos/crear' element={<ContactoFormPage />}></Route>
            <Route path='/panel/contactos/editar/:id_contacto' element={<ContactoFormPage />}></Route>

            <Route path='/panel/eventos' element={<EventosPage />}></Route>
            <Route path='/panel/eventos/crear' element={<EventosFormPage />}></Route>
            <Route path='/panel/eventos/editar/:id_evento' element={<EventosFormPage />}></Route>

            <Route path='/panel/cuentas' element={<CuentasPage />}></Route>
            <Route path='/panel/cuentas/crear' element={<CuentasFormPage />}></Route>
            <Route path='/panel/cuentas/editar/:id_cuenta' element={<CuentasFormPage />}></Route>

            <Route path='/panel/notas' element={<NotasPage />}></Route>
            <Route path='/panel/notas/crear' element={<NotasFormPage />}></Route>
            <Route path='/panel/notas/editar/:id_nota' element={<NotasFormPage />}></Route>
        </Routes>
    );
}

export default App;
