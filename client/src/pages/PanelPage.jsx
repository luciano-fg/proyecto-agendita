import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function PanelPage() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
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

                const response = await axios.get(`http://localhost:3000/api/usuarios/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserData(response.data);
            } catch (err) {
                console.error('Error al obtener datos del usuario:', err);
                setError('Error al cargar los datos del usuario. ¿Quizás tu sesión expiró?');
                localStorage.removeItem('token');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
                <div className='bg-white p-8 rounded-lg shadow-sm text-center max-w-sm w-full border border-gray-200'>
                    <p className='text-gray-700'>Cargando datos del usuario...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
                <div className='bg-white p-8 rounded-lg shadow-sm text-center max-w-sm w-full border border-gray-200'>
                    <p className='text-red-500'>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
            <div className='bg-white p-8 rounded-lg shadow-sm text-center max-w-sm w-full border border-gray-200'>
                <h1 className='text-3xl font-light text-gray-800 mb-3'>Panel Principal</h1>
                {userData && (
                    <div className='mb-6 text-gray-600'>
                        <p>
                            Hola, <span className='font-medium'>{userData.nombre}</span>!
                        </p>
                        <p>Email: {userData.email}</p>
                        <p>Fecha de Registro: {new Date(userData.fecha_registro).toLocaleDateString()}</p>
                    </div>
                )}
                <p className='mb-6 text-sm text-gray-500'>Aquí puedes acceder a todas las funciones de tu Agendita.</p>
                <div className='space-y-3'>
                    <Link to='/panel/contactos' className='block bg-blue-100 text-blue-700 px-6 py-3 rounded-md font-medium text-base hover:bg-blue-200 transition-colors duration-200 ease-in-out'>
                        Ver Contactos
                    </Link>
                    <Link to='/panel/eventos' className='block bg-green-100 text-green-700 px-6 py-3 rounded-md font-medium text-base hover:bg-green-200 transition-colors duration-200 ease-in-out'>
                        Gestionar Eventos
                    </Link>
                    <Link to='/panel/notas' className='block bg-purple-100 text-purple-700 px-6 py-3 rounded-md font-medium text-base hover:bg-purple-200 transition-colors duration-200 ease-in-out'>
                        Mis Notas
                    </Link>
                    <Link to='/panel/cuentas' className='block bg-yellow-100 text-yellow-700 px-6 py-3 rounded-md font-medium text-base hover:bg-yellow-200 transition-colors duration-200 ease-in-out'>
                        Administrar Cuentas
                    </Link>
                    <button onClick={handleLogout} className='block bg-red-400 text-white px-6 py-3 w-full rounded-md font-medium text-base hover:bg-red-500 transition-colors duration-200 ease-in-out mt-4'>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PanelPage;
