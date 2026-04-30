import React, { useState, useEffect } from 'react';
import { getActiveBots, terminateBot } from '../../api/bet'; // Importar las funciones de API
import Swal from 'sweetalert2'; // Para mostrar alertas
import LoadingSpinner from '../../Components/Loading/Loading'; // Componente de carga
import Navbar from '../../Components/Navbar/Navbar'; // Navbar
import './Accounts.css';
import futImage from '../../Resources/Images/carrusel/fut.png';
import atletismoImage from '../../Resources/Images/carrusel/atletismo.png';
import tennisImage from '../../Resources/Images/carrusel/tennis.png';
import basketImage from '../../Resources/Images/carrusel/basket.png';
import bolosImage from '../../Resources/Images/carrusel/bolos.png';
import f1Image from '../../Resources/Images/carrusel/f1.png';
import futbolAmericanoImage from '../../Resources/Images/carrusel/futbol-americano.png';
import golfImage from '../../Resources/Images/carrusel/golf.png';
import natacionImage from '../../Resources/Images/carrusel/natacion.png';
import voleibolImage from '../../Resources/Images/carrusel/voleibol.png';

const Accounts = () => {
    const [bots, setBots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [imageIndexes, setImageIndexes] = useState({});
    const imagePaths = [
        futImage,
        atletismoImage,
        tennisImage,
        basketImage,
        bolosImage,
        f1Image,
        futbolAmericanoImage,
        golfImage,
        natacionImage,
        voleibolImage,
    ];

    useEffect(() => {
        const fetchBots = async () => {
            setIsLoading(true);
            try {
                const activeBots = await getActiveBots();
                setBots(activeBots);
                // Inicializar indices de imagen para cada bot
                const initialImageIndexes = {};
                activeBots.forEach((bot, index) => {
                    initialImageIndexes[bot.id] = index % imagePaths.length;
                });
                setImageIndexes(initialImageIndexes);
            } catch (error) {
                Swal.fire('Error', 'No se pudo obtener la lista de bots activos', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        // Llama inicialmente a fetchBots
        fetchBots();

        // Intervalo para cambiar imágenes
        const imageInterval = setInterval(() => {
            setImageIndexes(prevIndexes => {
                const newIndexes = { ...prevIndexes };
                Object.keys(newIndexes).forEach(key => {
                    newIndexes[key] = (newIndexes[key] + 1) % imagePaths.length;
                });
                return newIndexes;
            });
        }, 500); // Cambia imagen cada 0.5 segundos

        // Intervalo para actualizar la lista de bots cada 20 segundos
        const botsInterval = setInterval(() => {
            fetchBots();
        }, 20000); // Actualiza los bots cada 20 segundos

        // Limpiar ambos intervalos cuando el componente se desmonta
        return () => {
            clearInterval(imageInterval);
            clearInterval(botsInterval);
        };
    }, [imagePaths.length]);  // Dependencias en el array


    const handleTerminateBot = async (botId) => {
        setIsLoading(true);
        try {
            await terminateBot(botId);
            Swal.fire('Éxito', 'La cuenta ha sido terminada correctamente', 'success');
            // Actualizar estado para remover bot y su índice de imagen
            setBots(prev => prev.filter((bot) => bot.id !== botId));
            setImageIndexes(prev => {
                const newIndexes = { ...prev };
                delete newIndexes[botId];
                return newIndexes;
            });
        } catch (error) {
            Swal.fire('Error', 'No se pudo terminar la cuenta', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="accounts-container">
            <LoadingSpinner isLoading={isLoading} />
            <Navbar />
            <h2 className="title">INFORMACION DE TUS CUENTAS</h2>
            <p className="bot-count">{bots.length > 0 ? `Tienes ${bots.length} cuenta(s) corriendo.` : 'No tienes cuentas corriendo en este momento.'}</p>

            <div className="bots-list">
                {bots.map((bot) => (
                    <div key={bot.id} className="bot-container">
                        <img
                            src={imagePaths[imageIndexes[bot.id]]}
                            alt="Bot"
                            className="bot-image"
                        />
                        <div className="bot-info">
                            <p>Sitio de apuestas: {bot.betting_site}</p>
                            <p>Usuario: {bot.betting_username}</p>
                            <p>Estado: {bot.status}</p>
                            <p>Valor de apuesta: {bot.bet_value}</p>
                            <button
                                className="terminate-button"
                                onClick={() => handleTerminateBot(bot.id)}
                                disabled={bot.status === 'creating'}  // Deshabilitar si el estado es 'creating'
                            >
                                Terminar Cuenta
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Accounts;
