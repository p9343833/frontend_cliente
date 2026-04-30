import React, { useState } from 'react';
import './Newpass.css';
import { handleSetNewPassword } from '../../api/newpass'; // Importar la función desde newpass.js
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Newpass = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handlePasswordChange = (event) => {
        setNewPassword(event.target.value);
    };
    
    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };
  
    const handleVerify = async (event) => {
      event.preventDefault();
      const accessToken = localStorage.getItem('accessToken');
  
      if (!newPassword || !confirmPassword || newPassword !== confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, ingresa y confirma tu nueva contraseña.',
          confirmButtonText: 'OK',
        });
        return;
      }
  
      try {
        await handleSetNewPassword(newPassword, confirmPassword, accessToken);
        localStorage.clear(); // Limpiar el almacenamiento local
        Swal.fire({
          icon: 'success',
          title: 'Contraseña cambiada',
          text: 'Contraseña cambiada exitosamente. Por favor, inicia sesión.',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate('/login'); // Redirigir al login
        });
      } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al cambiar la contraseña. Por favor, intenta nuevamente.',
          confirmButtonText: 'OK',
        });
      }
    };

  return (
    <div className='body-newpass'>
        <div className="container-newpass">
        <h1 className="text-newpass">Ingresa tu nueva contraseña</h1>
        <input
            className='input-newpass'
            type="password"
            id="newpass"
            placeholder="Ingresa la nueva contraseña"
            value={newPassword}
            onChange={handlePasswordChange}
            required
        />
        <input
            className='input-newpass'
            type="password"
            id="confirmpass"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
        />
        <button id="verifyCodeButton" className='verify-newpass-button' onClick={handleVerify}>
            Verificar
        </button>
        </div>
    </div>
  );
};

export default Newpass;
