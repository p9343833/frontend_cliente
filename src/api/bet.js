import axios from 'axios';

const BASE_URL = 'https://bot.juanbailon.xyz/';

// Función para realizar la petición POST con una sola cuenta
export const sendBetRequest = async (account) => {
    const bettingSite = 'betplay'; // Sitio de apuestas
    const accessToken = localStorage.getItem('accessToken'); // Obtener el token del localStorage

    if (!accessToken) {
        throw new Error('No se encontró el token de acceso en el localStorage');
    }

    const postData = {
        betting_site: bettingSite,
        betting_username: account.accountNumber,
        betting_password: account.password,
        bet_value: account.value,
        min_bet_value: account.minValue,
        desired_total_bets: 2000,
    };

    try {
        // Hacer la solicitud POST y devolver la respuesta del servidor
        const response = await axios.post(`${BASE_URL}api/remote/bots/`, postData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        console.log(response);
        return response; // Retornar solo los datos de la respuesta
    } catch (error) {
        // Retornar la respuesta de error del servidor
        throw error.response ? error.response : new Error('Error de red');
    }
};

// Obtener los bots activos
export const getActiveBots = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        throw new Error('No se encontró el token de acceso en el localStorage');
    }

    try {
        const response = await axios.get(`${BASE_URL}api/remote/bots/active/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Retorna los bots activos
    } catch (error) {
        throw error.response ? error.response.data : new Error('Error de red');
    }
};

// Terminar un bot activo
export const terminateBot = async (botId) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        throw new Error('No se encontró el token de acceso en el localStorage');
    }

    try {
        const response = await axios.post(`${BASE_URL}api/remote/bots/${botId}/terminate/`, null, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Retorna la confirmación de la terminación
    } catch (error) {
        throw error.response ? error.response.data : new Error('Error de red');
    }
};
