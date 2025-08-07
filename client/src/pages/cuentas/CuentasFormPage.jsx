import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function CuentasFormPage() {
    const [values, setValues] = useState({
        titulo: '',
        nombre_usuario: '',
        contraseña_usuario: '',
        notas: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id_cuenta } = useParams();

    useEffect(() => {
        const fetchCuenta = async () => {
            if (id_cuenta) {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const decodedToken = JSON.parse(window.atob(base64));
                    const userId = decodedToken.id;

                    if (!userId) {
                        setError('ID de usuario no encontrado en el token.');
                        setLoading(false);
                        localStorage.removeItem('token');
                        navigate('/login');
                        return;
                    }

                    const response = await axios.get(`http://localhost:3000/api/cuentas/${userId}/${id_cuenta}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setValues(response.data);
                } catch (err) {
                    console.error('Error al cargar cuenta para edición:', err);
                    if (err.response && (err.response.status === 401 || err.response.status === 403 || err.response.status === 404)) {
                        setError('Cuenta no encontrada o no tienes permiso.');
                        localStorage.removeItem('token');
                        navigate('/login');
                    } else {
                        setError('Error al cargar los datos de la cuenta.');
                    }
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchCuenta();
    }, [id_cuenta, navigate]);

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decodedToken = JSON.parse(window.atob(base64));
            const userId = decodedToken.id;

            if (!userId) {
                setError('ID de usuario no encontrado en el token.');
                setLoading(false);
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }

            if (id_cuenta) {
                await axios.put(`http://localhost:3000/api/cuentas/${userId}/${id_cuenta}`, values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert('Cuenta actualizada exitosamente.');
            } else {
                await axios.post(
                    `http://localhost:3000/api/cuentas/${userId}`,
                    { ...values, id_usuario: userId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                alert('Cuenta añadida exitosamente.');
            }
            navigate('/panel/cuentas');
        } catch (err) {
            console.error('Error al guardar cuenta:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Error al guardar la cuenta. Inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
                <div className='bg-white p-8 rounded-lg shadow-sm text-center max-w-sm w-full border border-gray-200'>
                    <p className='text-gray-700'>Cargando formulario...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
            <div className='bg-white p-8 rounded-lg shadow-sm max-w-md w-full border border-gray-200'>
                <h2 className='text-3xl font-light text-gray-800 mb-6 text-center'>{id_cuenta ? 'Editar Cuenta' : 'Añadir Nueva Cuenta'}</h2>
                {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label htmlFor='titulo' className='block text-sm font-medium text-gray-700 mb-1'>
                            Título
                        </label>
                        <input type='text' id='titulo' name='titulo' value={values.titulo} onChange={handleChange} className='border border-gray-300 p-2 w-full rounded-md focus:ring-blue-500 focus:border-blue-500' required />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='nombre_usuario' className='block text-sm font-medium text-gray-700 mb-1'>
                            Nombre de Usuario
                        </label>
                        <input type='text' id='nombre_usuario' name='nombre_usuario' value={values.nombre_usuario} onChange={handleChange} className='border border-gray-300 p-2 w-full rounded-md focus:ring-blue-500 focus:border-blue-500' />
                    </div>
                    <div className='mb-4'>
                        <label htmlFor='contraseña_usuario' className='block text-sm font-medium text-gray-700 mb-1'>
                            Contraseña
                        </label>
                        <input
                            type='text' // Consider changing to 'password' for security
                            id='contraseña_usuario'
                            name='contraseña_usuario'
                            value={values.contraseña_usuario}
                            onChange={handleChange}
                            className='border border-gray-300 p-2 w-full rounded-md focus:ring-blue-500 focus:border-blue-500'
                        />
                    </div>
                    <div className='mb-6'>
                        <label htmlFor='notas' className='block text-sm font-medium text-gray-700 mb-1'>
                            Notas Adicionales
                        </label>
                        <textarea id='notas' name='notas' value={values.notas} onChange={handleChange} className='border border-gray-300 p-2 w-full h-24 rounded-md resize-none focus:ring-blue-500 focus:border-blue-500'></textarea>
                    </div>
                    <div className='flex justify-between space-x-4'>
                        <button type='submit' className='flex-1 bg-blue-500 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 transition-colors duration-200 ease-in-out' disabled={loading}>
                            {loading ? 'Guardando...' : id_cuenta ? 'Actualizar Cuenta' : 'Añadir Cuenta'}
                        </button>
                        <button type='button' onClick={() => navigate('/panel/cuentas')} className='flex-1 bg-gray-400 text-white py-2 px-4 rounded-md font-medium hover:bg-gray-500 transition-colors duration-200 ease-in-out'>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CuentasFormPage;
