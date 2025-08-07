import { Link } from 'react-router-dom';

function InicioPage() {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 p-4'>
      <div className='bg-white p-8 rounded-lg shadow-sm text-center max-w-sm w-full border border-gray-200'>
        <h1 className='text-3xl font-light text-gray-800 mb-3'>
          Agendita
        </h1>
        <h3 className='text-md text-gray-600 mb-6'>
          Tu agenda personal para organizacion
        </h3>

        <p className='mt-6 text-sm text-gray-500'>
          ¿Ya tienes una cuenta?
        </p>
        <Link
          to='/login'
          className='inline-block bg-blue-100 text-blue-700 px-6 py-2 mt-2 rounded-md font-medium text-sm hover:bg-blue-200 transition-colors duration-200 ease-in-out'
        >
          Iniciar Sesión
        </Link>

        <p className='mt-6 text-sm text-gray-500'>
          ¿No tienes cuenta?
        </p>
        <Link
          to='/register'
          className='inline-block bg-green-100 text-green-700 px-6 py-2 mt-2 rounded-md font-medium text-sm hover:bg-green-200 transition-colors duration-200 ease-in-out'
        >
          Registrarse
        </Link>
      </div>
    </div>
  );
}

export default InicioPage;