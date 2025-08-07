import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EventosPage() {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchEventos = async () => {
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

                const response = await axios.get(`http://localhost:3000/api/eventos/${idFromToken}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setEventos(response.data);
            } catch (err) {
                console.error('Error al obtener eventos:', err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    setError('Tu sesión ha expirado o no tienes permiso. Por favor, inicia sesión de nuevo.');
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    setError('Error al cargar los eventos.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEventos();
    }, [navigate]);

    const handleDeleteEvento = async (eventoId) => {
        const token = localStorage.getItem('token');
        if (!token || !userId) {
            navigate('/login');
            return;
        }

        if (!window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/api/eventos/${userId}/${eventoId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEventos(eventos.filter((evento) => evento.id !== eventoId));
            alert('Evento eliminado exitosamente.');
        } catch (err) {
            console.error('Error al eliminar evento:', err);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                alert('Tu sesión ha expirado o no tienes permiso para eliminar este evento.');
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                alert('Error al eliminar el evento.');
            }
        }
    };

    const handleAddEvento = () => {
        navigate('/panel/eventos/crear');
    };

    const handleEditEvento = (eventoId) => {
        navigate(`/panel/eventos/editar/${eventoId}`);
    };

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
                <div className='bg-white p-8 rounded-lg shadow-sm text-center max-w-sm w-full border border-gray-200'>
                    <p className='text-gray-700'>Cargando eventos...</p>
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
                <h1 className='text-3xl font-light text-gray-800 mb-6 text-center'>Tus Eventos</h1>

                <div className='flex justify-end mb-6'>
                    <button onClick={handleAddEvento} className='bg-blue-500 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-600 transition-colors duration-200 ease-in-out'>
                        Añadir Nuevo Evento
                    </button>
                </div>

                {eventos.length === 0 ? (
                    <p className='text-center text-gray-600'>No tienes eventos guardados aún.</p>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {eventos.map((evento) => (
                            <div key={evento.id} className='border border-gray-200 p-4 rounded-md shadow-sm bg-gray-50'>
                                <h3 className='text-lg font-semibold text-gray-800 mb-2'>{evento.titulo}</h3>
                                <p className='text-gray-700 text-sm mb-1'>Descripción: {evento.descripcion}</p>
                                <p className='text-gray-600 text-xs'>Fecha Evento: {new Date(evento.fecha_evento).toLocaleDateString()}</p>
                                {evento.fecha_recordar && <p className='text-gray-600 text-xs'>Recordar: {new Date(evento.fecha_recordar).toLocaleDateString()}</p>}
                                <div className='mt-4 flex space-x-2 justify-end'>
                                    <button onClick={() => handleEditEvento(evento.id)} className='bg-yellow-400 text-white px-3 py-1 text-sm rounded-md hover:bg-yellow-500 transition-colors duration-200 ease-in-out'>
                                        Editar
                                    </button>
                                    <button onClick={() => handleDeleteEvento(evento.id)} className='bg-red-400 text-white px-3 py-1 text-sm rounded-md hover:bg-red-500 transition-colors duration-200 ease-in-out'>
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

export default EventosPage;
