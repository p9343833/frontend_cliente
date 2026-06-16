import React, { useState, useEffect } from 'react';
import { getValidSubscriptions, getActiveBots } from '../../api/users'; // Importa las funciones de la API
import LoadingSpinner from '../../Components/Loading/Loading'; // Importa el componente de LoadingSpinner
import './Configuration.css'; // Asegúrate de importar los estilos
import Swal from 'sweetalert2';
import { sendBetRequest } from '../../api/bet';
import Navbar from '../../Components/Navbar/Navbar';
import logo from '../../Resources/Images/Bettprime-logo.png';

const Configuration = () => {
    const [account, setAccount] = useState({ accountNumber: '', password: '', value: '' , minValue: ''});
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [selectedApiOption, setSelectedApiOption] = useState(''); // Nuevo estado


    // Mapeo de opciones a variables de entorno
    const apiOptions = {
        'fabian_lv': {
            label: 'Fabian (LV)',
            envVar: process.env.REACT_APP_API_URL_LV_PN_FB
        },
        'sebastian_lv': {
            label: 'Sebastian (LV)',
            envVar: process.env.REACT_APP_API_URL_LV_AVG_ST
        },
        'fabian_all': {
            label: 'Fabian All',
            envVar: process.env.REACT_APP_API_URL_LV_PR_PN_FB
        },
        'sebastian_lv_fabian_pr': {
            label: 'Sebastian (LV) + Fabian (PR)',
            envVar: process.env.REACT_APP_API_URL_LV_AVG_ST_PR_PN_FB
        }
    };

    // Función para cargar los datos de suscripciones y bots activos
    const loadData = async () => {
        setIsLoading(true);
        try {
            const validSubscriptions = await getValidSubscriptions();
            const activeBots = await getActiveBots();
            const maxAccountsApi = validSubscriptions.length - activeBots.length;

            if (validSubscriptions.length === 0) {
                setErrorMessage('No tienes suscripciones activas. Renueva tus suscripciones para continuar usando Bettprime.');
            } else if (maxAccountsApi <= 0) {
                setErrorMessage('Todas tus cuentas se encuentran activas.');
            } else {
                setErrorMessage(''); // Reset error message if conditions are satisfied
            }
        } catch (error) {
            setErrorMessage('Error al cargar los datos. Por favor, intenta de nuevo.');
        }
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleInputChange = (field, value) => {
        setAccount((prevAccount) => ({
            ...prevAccount,
            [field]: value
        }));
    };

    const handleBet = async (event) => {
        event.preventDefault();

        // Validar que se haya seleccionado una opción
        if (!selectedApiOption) {
            Swal.fire({
                icon: 'warning',
                title: 'Selecciona una opción',
                text: 'Debes elegir una de las configuraciones antes de apostar.',
                confirmButtonText: 'OK'
            });
            return;
        }

        const baseUrl = apiOptions[selectedApiOption]?.envVar;

        if (!baseUrl) {
            Swal.fire({
                icon: 'error',
                title: 'Error de configuración URL FILTRO',
                text: 'No se encontró la URL en la configuracion, para el filtro seleccionado.',
                confirmButtonText: 'OK'
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await sendBetRequest(account, baseUrl);
            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Apuesta enviada',
                    text: 'Tu apuesta se ha enviado exitosamente.',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        loadData(); // Recarga los datos una vez confirmado el modal
                        setAccount({ accountNumber: '', password: '', value: '', minValue: '' }); // Limpia el formulario
                        setSelectedApiOption('');
                    }
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error al enviar la apuesta',
                text: error.data ? error.data.message : 'Error de red, intenta nuevamente.',
                confirmButtonText: 'OK'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <div className="configuration-container">
            <LoadingSpinner isLoading={isLoading} />
            <Navbar />
            {errorMessage && (
                <h1 style={{ textAlign: 'center', color: 'black' }}>{errorMessage}</h1>
            )}
            {errorMessage !== 'Todas tus cuentas se encuentran activas.' && (
                <form onSubmit={handleBet} className="accounts-form">
                    <div className="account-container">
                        <div className='configuration-logo'>
                            <img
                                className='configuration-logo-image'
                                src={logo}
                                alt="Bettprime Logo"
                                width="20%"
                                height="auto"
                            />
                        </div>

                        {/* NUEVO SELECT configuracion de filtro */}
                        <div className="input-field">
                            <label htmlFor="apiOption">Configuración de apuesta:</label>
                            <select
                                id="apiOption"
                                value={selectedApiOption}
                                onChange={(e) => setSelectedApiOption(e.target.value)}
                                required
                            >
                                <option value="" disabled>Selecciona una opción</option>
                                {Object.entries(apiOptions).map(([key, { label }]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>


                        <div className="input-field">
                            <label htmlFor="accountNumber">Usuario (Casa de apuestas):</label>
                            <input
                                type="text"
                                id="accountNumber"
                                placeholder="Usuario (Casa de apuestas)"
                                value={account.accountNumber}
                                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-field">
                            <label htmlFor="password">Contraseña (Casa de apuestas):</label>
                            <div className="password-wrapper">
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    id="password"
                                    placeholder="Contraseña (Casa de apuestas)"
                                    value={account.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
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
                        <div className="input-field-value">
                            <div className="input-bet"> 
                                <label htmlFor="value">Valor de Apuesta (500 - 12.000):</label>
                                <input
                                    type="number"
                                    id="value"
                                    placeholder="Valor de Apuesta (500 - 12.000)"
                                    min="500"
                                    max="12000"
                                    value={account.value}
                                    onChange={(e) => handleInputChange('value', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-min-bet">
                                <label htmlFor="value">Valor Minimo de Apuesta (500 - 4,000):</label>
                                <input
                                    type="number"
                                    id="value"
                                    placeholder="Valor Minimo de Apuesta (500 - 4.000)"
                                    min="500"
                                    max="4000"
                                    value={account.minValue}
                                    onChange={(e) => handleInputChange('minValue', e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="bet-button-container">
                            <button type="submit" className="bet-btn">
                                Apostar
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Configuration;
