import React, { useState } from 'react';
import './Verify.css';
import Swal from 'sweetalert2'; // Importa SweetAlert
import { useNavigate } from 'react-router-dom';
import { handleVerifyCode } from '../../api/newpass'; // Importamos las funciones desde newpass.js

const Verify = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate(); // Instancia useNavigate para manejar la navegación

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleVerificationCodeChange = (event) => {
    setVerificationCode(event.target.value);
  };

  const handleVerify = async (event) => {
    event.preventDefault();

    // Verificar si ambos campos están llenos
    if (!email || !verificationCode) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, ingresa un correo y un código de verificación válidos.',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      // Llamar a la API para verificar el código
      const response = await handleVerifyCode(email, verificationCode);

      // Si la respuesta tiene éxito, almacenar el accessToken
      const { access } = response;
      localStorage.setItem('accessToken', access);

      // Mostrar mensaje de éxito con SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Código correcto',
        text: `Código de verificación correcto: ${verificationCode}`,
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/newpass'); // Redirigir al usuario a la página de nueva contraseña
      });

    } catch (error) {
      // Mostrar mensaje de error con SweetAlert
      const errorMessage = error.response?.data?.message || 'Error al verificar el código. Por favor, intenta nuevamente.';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className='body-verify'>
      <div className="container-verify-code">
        <h1 className="text-verify-code">Ingresa tu correo y el código de seguridad que se envió al correo</h1>
        <input
          className='input-verify-code'
          type="email"
          id="email"
          placeholder="Ingresa tu correo"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <input
          className='input-verify-code'
          type="text"
          id="verificationCode"
          placeholder="Ingresa el código de verificación"
          value={verificationCode}
          onChange={handleVerificationCodeChange}
          required
        />
        <button id="verifyCodeButton" className='verify-code-button' onClick={handleVerify}>
          Verificar
        </button>
      </div>
    </div>
  );
};

export default Verify;
