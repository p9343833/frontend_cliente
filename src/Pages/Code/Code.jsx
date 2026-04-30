import React, { useState } from 'react';
import { handleGenerateCode} from '../../api/newpass'; // Importamos las funciones desde newpass.js
import { useNavigate } from 'react-router-dom';
import './Code.css'; // Asegúrate de tener los estilos adecuados
import LoadingSpinner from '../../Components/Loading/Loading'; // Importa el componente LoadingSpinner
import Swal from 'sweetalert2'; // Importa SweetAlert

const Code = () => {
  const navigate = useNavigate(); // Instancia useNavigate para manejar la navegación
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleEmailChange = (event) => {
    setEmail(event.target.value);
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, ingresa un correo válido.',
          confirmButtonText: 'OK',
        });
        return;
      }
    setIsLoading(true); // Activar el spinner de carga

    try {
        await handleGenerateCode(email);

        // Mostrar mensaje de éxito con SweetAlert
        setIsLoading(false);
        Swal.fire({
            icon: 'success',
            title: 'Correo Enviado',
            text: `Código de seguridad enviado a: ${email}`,
            confirmButtonText: 'OK',
          }).then(() => {
            navigate('/verify'); // Redirigir al usuario a la página de verificación de código
          });
    } catch (error) {
        // Mostrar mensaje de error con SweetAlert
        console.error('Error al generar el código:', error);
        setIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error de red. Por favor, intenta nuevamente.',
          confirmButtonText: 'OK',
        });
    }
};

  const handleBack = () => {
    navigate('/login');// Redirige a /login
  };

  return (
    <div className='body-code'>
        <LoadingSpinner isLoading={isLoading} />
        <div className="container-code">
        <button className="back-login" onClick={handleBack}>
            Volver
        </button>
        <h1 className="text-code">Ingresa tu correo para obtener el código de seguridad</h1>
        <input
            className='input-email-code'
            type="email"
            id="email"
            placeholder="Ingresa tu correo"
            required
            value={email}
            onChange={handleEmailChange}
        />
        <button className='generate-code' onClick={handleSubmit}>Generar</button>
        </div>
    </div>
  );
};

export default Code;
