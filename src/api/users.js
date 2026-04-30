import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = 'https://bot.juanbailon.xyz/';

// Función para iniciar sesión
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}users/api/token/`, { email, password });
        return response.data; // Retorna los datos de respuesta (por ejemplo, tokens)
    } catch (error) {
        throw error; // Manejar errores en el componente que llama a esta función
    }
};

// Función para cerrar sesión (logout)
export const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken'); // Obtener el refresh token desde localStorage

    if (!refreshToken) {
        throw new Error('No se encontró el token de actualización en el localStorage');
    }

    try {
        const response = await axios.post(`${BASE_URL}auth/api/token/blacklist`, { refresh: refreshToken }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Si la solicitud es exitosa, limpiar los tokens en localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return response.data; // Retornar los datos de la respuesta de logout (si es necesario)
    } catch (error) {
        throw error.response ? error.response.data : new Error('Error de red');
    }
};


// Función para obtener las suscripciones válidas
export const getValidSubscriptions = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        console.error('No access token found in localStorage');
        alert('No access token found. Please log in again.');
        return [];
    }

    try {
        const userId = getUserIdFromToken(accessToken);
        const response = await axios.get(`${BASE_URL}users/api/customers/${userId}/valid-suscriptions/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data; // Retorna el arreglo completo de suscripciones válidas
    } catch (error) {
        console.error('Error fetching valid subscriptions:', error);
        return [];
    }
};

// Función para obtener los bots activos
export const getActiveBots = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        console.error('No access token found in localStorage');
        alert('No access token found. Please log in again.');
        return [];
    }

    try {
        const response = await axios.get(`${BASE_URL}api/remote/bots/active/`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data; // Retorna el arreglo completo de bots activos
    } catch (error) {
        console.error('Error fetching active bots:', error);
        return [];
    }
};

// Función para decodificar el token JWT y obtener el user_id
function getUserIdFromToken(token) {
    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.user_id; // Reemplaza 'user_id' por la clave real en tu token
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}
