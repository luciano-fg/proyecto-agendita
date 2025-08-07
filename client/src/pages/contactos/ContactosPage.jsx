import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ContactosPage() {
    const [contactos, setContactos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchContactos = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const decodedToken = JSON.parse(window.atob(base64));
                const idFromToken = decodedToken.id;
                setUserId(idFromToken);

                if (!idFromToken) {
                    setError('ID de usuario no encontrado en el token.');
                    setLoading(false);
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`http://localhost:3000/api/contactos/${idFromToken}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setContactos(response.data);
            } catch (err) {
                console.error('Error al obtener contactos:', err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    setError('Tu sesión ha expirado o no tienes permiso. Por favor, inicia sesión de nuevo.');
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError('Error al cargar los contactos.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchContactos();
    }, [navigate]);

    const handleDeleteContacto = async (contactoId) => {
        const token = localStorage.getItem('token');
        if (!token || !userId) {
            navigate('/login');
            return;
        }

        if (!window.confirm('¿Estás seguro de que quieres eliminar este contacto?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/api/contactos/${userId}/${contactoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setContactos(contactos.filter((contacto) => contacto.id !== contactoId));
            alert('Contacto eliminado exitosamente.');
        } catch (err) {
            console.error('Error al eliminar contacto:', err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                alert('Tu sesión ha expirado o no tienes permiso para eliminar este contacto.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                alert('Error al eliminar el contacto.');
            }
        }
    };

    const handleAddContacto = () => {
        navigate('/panel/contactos/crear');
    };

    const handleEditContacto = (contactoId) => {
        navigate(`/panel/contactos/editar/${contactoId}`);
    };

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
                <div className='bg-white p-8 rounded-lg shadow-sm text-center max-w-sm w-full border border-gray-200'>
                    <p className='text-gray-700'>Cargando contactos...</p>
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
            <div className='bg-white p-8 rounded-lg shadow-sm max-w-2xl w-full border border-gray-200'>
                <h1 className='text-3xl font-light text-gray-800 mb-6 text-center'>Tus Contactos</h1>

                <div className='flex justify-end mb-6'>
                    <button onClick={handleAddContacto} className='bg-blue-500 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-600 transition-colors duration-200 ease-in-out'>
                        Añadir Nuevo Contacto
                    </button>
                </div>

                {contactos.length === 0 ? (
                    <p className='text-center text-gray-600'>No tienes contactos guardados aún.</p>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {contactos.map((contacto) => (
                            <div key={contacto.id} className='border border-gray-200 p-4 rounded-md shadow-sm bg-gray-50'>
                                <h3 className='text-lg font-semibold text-gray-800 mb-2'>{contacto.nombre}</h3>
                                <p className='text-gray-700 text-sm mb-1'>Teléfono: {contacto.telefono}</p>
                                <p className='text-gray-700 text-sm mb-1'>Email: {contacto.email}</p>
                                <div className='mt-4 flex space-x-2 justify-end'>
                                    <button onClick={() => handleEditContacto(contacto.id)} className='bg-yellow-400 text-white px-3 py-1 text-sm rounded-md hover:bg-yellow-500 transition-colors duration-200 ease-in-out'>
                                        Editar
                                    </button>
                                    <button onClick={() => handleDeleteContacto(contacto.id)} className='bg-red-400 text-white px-3 py-1 text-sm rounded-md hover:bg-red-500 transition-colors duration-200 ease-in-out'>
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className='text-center mt-8'>
                    <button onClick={() => navigate('/panel')} className='bg-gray-400 text-white px-6 py-2 rounded-md font-medium hover:bg-gray-500 transition-colors duration-200 ease-in-out'>
                        Volver al Panel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ContactosPage;
