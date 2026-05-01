import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL; // Asegúrate de que esta variable esté definida en tu archivo .env

export const handleGenerateCode = async (email) => {
    try {
        const response = await axios.post(`${BASE_URL}auth/forgot-password/send/email`, { email});
        return response.data; 
    } catch (error) {
        throw error; // Manejar errores en el componente que llama a esta función
    }
};  

export const handleVerifyCode = async (email, verificationCode) => {
    try {
        const response = await axios.post(`${BASE_URL}auth/forgot-password/validate/email/otp`, {email, OTP: verificationCode});
        return response.data; 
    } catch (error) {
        throw error; // Manejar errores en el componente que llama a esta función
    }
};  

export const handleSetNewPassword = async (newPassword, confirmNewPassword, accessToken) => {
    try {
      const response = await axios.put(
        `${BASE_URL}auth/forgot-password/set-new-password`,
        {
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error; // Manejo de errores en el componente que llama esta función
    }
  };