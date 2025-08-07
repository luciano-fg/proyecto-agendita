import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function RegisterPage() {
    const navigate = useNavigate();

    const [values, setValues] = useState({
        nombre: '',
        email: '',
        contraseña: '',
    });

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/api/usuarios/register', values);
            console.log(response);
            if (response.status === 201) {
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
            <div className='bg-white p-8 rounded-lg shadow-sm text-center max-w-sm w-full border border-gray-200'>
                <h2 className='text-2xl font-light text-gray-800 mb-6'>Crea tu Cuenta</h2>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label htmlFor='nombre' className='block text-sm text-left text-gray-700 mb-1'>
                            Nombre de usuario
                        </label>
                        <input
                            type='text'
                            id='nombre'
                            placeholder='Ingresa tu nombre de usuario'
                            className='border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300'
                            name='nombre'
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='email' className='block text-sm text-left text-gray-700 mb-1'>
                            Email
                        </label>
                        <input
                            type='email'
                            id='email'
                            placeholder='Ingresa tu email'
                            className='border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300'
                            name='email'
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='contraseña' className='block text-sm text-left text-gray-700 mb-1'>
                            Contraseña
                        </label>
                        <input
                            type='password'
                            id='contraseña'
                            placeholder='Ingresa tu contraseña'
                            className='border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-blue-300'
                            name='contraseña'
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        type='submit'
                        className='bg-blue-600 text-white px-6 py-2 w-full rounded-md font-medium hover:bg-blue-700 transition-colors duration-200 ease-in-out'
                    >
                        Registrarse
                    </button>
                </form>
                <div className='text-center mt-6'>
                    <p className='text-sm text-gray-600'>
                        ¿Ya tienes una cuenta?{' '}
                        <Link to='/login' className='text-blue-600 hover:underline'>
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;