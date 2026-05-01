import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = process.env.REACT_APP_API_URL; // Asegúrate de que esta variable esté definida en tu archivo .env

export const fetchStatsData = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    console.error('No access token found in localStorage');
    alert('No access token found. Please log in again.');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}value-bets/api/bets/`, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;

  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert('Unauthorized. Please log in again.');
    } else {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Please try again.');
    }
    throw error;
  }
};

export const fetchUsername = async () => {
  const accessToken = localStorage.getItem('accessToken');
  if (!accessToken) {
    console.error('No access token found in localStorage');
    alert('Tu sesion ha caducado. Vuelve a loguearte');
    return;
  }

  const userId = getUserIdFromToken(accessToken);
  if (!userId) {
    console.error('No user ID found in token');
    alert('Tu sesion ha caducado. Vuelve a loguearte');
    return;
  }

  try {
    const response = await axios.get(`${BASE_URL}users/api/customers/${userId}/`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data.username;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      alert('Unauthorized. Please log in again.');
    } else {
      console.error('Error fetching username:', error);
      alert('Error fetching username. Please try again.');
    }
    throw error;
  }
};

export function getUserIdFromToken(token) {
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.user_id;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}
