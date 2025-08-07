import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function NotasFormPage() {
    const [values, setValues] = useState({
        titulo: '',
        descripcion: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id_nota } = useParams();

    useEffect(() => {
        const fetchNota = async () => {
            if (id_nota) {
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

                    const response = await axios.get(`http://localhost:3000/api/notas/${userId}/${id_nota}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setValues(response.data);
                } catch (err) {
                    console.error('Error al cargar nota para edición:', err);
                    if (err.response && (err.response.status === 401 || err.response.status === 403 || err.response.status === 404)) {
                        setError('Nota no encontrada o no tienes permiso.');
                        localStorage.removeItem('token');
                        navigate('/login');
                    } else {
                        setError('Error al cargar los datos de la nota.');
                    }
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchNota();
    }, [id_nota, navigate]);

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

            if (id_nota) {
                await axios.put(`http://localhost:3000/api/notas/${userId}/${id_nota}`, values, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                alert('Nota actualizada exitosamente.');
            } else {
                await axios.post(
                    `http://localhost:3000/api/notas/${userId}`,
                    { ...values, id_usuario: userId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                alert('Nota añadida exitosamente.');
            }
            navigate('/panel/notas');
        } catch (err) {
            console.error('Error al guardar nota:', err);
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Error al guardar la nota. Inténtalo de nuevo.');
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
                <h2 className='text-3xl font-light text-gray-800 mb-6 text-center'>{id_nota ? 'Editar Nota' : 'Añadir Nueva Nota'}</h2>
                {error && <p className='text-red-500 text-center mb-4'>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label htmlFor='titulo' className='block text-sm font-medium text-gray-700 mb-1'>
                            Título
                        </label>
                        <input type='text' id='titulo' name='titulo' value={values.titulo} onChange={handleChange} className='border border-gray-300 p-2 w-full rounded-md focus:ring-blue-500 focus:border-blue-500' required />
                    </div>
                    <div className='mb-6'>
                        <label htmlFor='descripcion' className='block text-sm font-medium text-gray-700 mb-1'>
                            Descripción
                        </label>
                        <textarea id='descripcion' name='descripcion' value={values.descripcion} onChange={handleChange} className='border border-gray-300 p-2 w-full h-32 rounded-md resize-none focus:ring-blue-500 focus:border-blue-500'></textarea>
                    </div>
                    <div className='flex justify-between space-x-4'>
                        <button type='submit' className='flex-1 bg-blue-500 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-600 transition-colors duration-200 ease-in-out' disabled={loading}>
                            {loading ? 'Guardando...' : id_nota ? 'Actualizar Nota' : 'Añadir Nota'}
                        </button>
                        <button type='button' onClick={() => navigate('/panel/notas')} className='flex-1 bg-gray-400 text-white py-2 px-4 rounded-md font-medium hover:bg-gray-500 transition-colors duration-200 ease-in-out'>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NotasFormPage;
