import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css'; // Archivo de estilos personalizado
import Swal from 'sweetalert2'; // Importa SweetAlert
import LoadingSpinner from '../../Components/Loading/Loading'; // Importa el componente LoadingSpinner
import { useNavigate } from 'react-router-dom'; // Importa useNavigate de React Router
import logo from '../../Resources/Images/Bettprime logo.svg';
import { login } from '../../api/users';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Estado para controlar la visibilidad de la contraseña
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); // Instancia useNavigate para manejar la navegación

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible); // Alternar la visibilidad de la contraseña
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true); // Activar el spinner de carga

        try {
            const response = await login(email, password);
            const { refresh, access } = response;
            console.log(response);
            // Guardar el token de acceso y de actualización en el almacenamiento local
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);

            // Mostrar mensaje de éxito con SweetAlert
            setIsLoading(false);
            Swal.fire({
                icon: 'success',
                title: 'Inicio de sesión exitoso',
                text: '¡Bienvenido!',
                confirmButtonText: 'OK'
            }).then(() => {
                navigate('/configuration'); // Redirigir al usuario a la página de Home
            });
        } catch (error) {
            // Mostrar mensaje de error con SweetAlert
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Credenciales incorrectas. Por favor, intenta de nuevo.',
                confirmButtonText: 'OK'
            });
            console.error('Error al iniciar sesión:', error);
            setIsLoading(false); // Desactivar el spinner de carga
        }
    };

    return (
        <div className="login-container">
            <LoadingSpinner isLoading={isLoading} />
            <div className="login-content">
                <div className="login-image">
                    <img src={logo} alt="Descripción de la imagen" />
                </div>
                <div className="login-box">
                    <h1 className='login-info'> Ingresa tus credenciales </h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                placeholder='Escribe tu correo electrónico'
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Contraseña:</label>
                            <div className="position-relative">
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'} // Cambia el tipo de input según el estado
                                    className="form-control"
                                    id="password"
                                    placeholder='Escribe tu contraseña'
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                />
                                <span
                                    className="toggle-password"
                                    onClick={togglePasswordVisibility}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {isPasswordVisible ? '🙈' : '👁️'}
                                </span>
                            </div>
                        </div>
                        <a className="password-forget" id="passwordForgetLink" href='/code'>Olvidaste tu contraseña?</a>
                        <button type="submit" className="btn">Iniciar sesión</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
