import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Asegúrate de tener un archivo de estilos similar a tu "index.css".
import logo from '../../Resources/Images/Bettprime logo.svg'; // Importa la imagen SVG

const Home = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/login'); // Redirige a /login
  };

  return (
    <div className="container-index">
      <div className="logo">
        <img 
          src={logo} 
          alt="Bettprime Logo" 
          width="100%" 
          height="auto" 
        />
      </div>
      <div className="inicio">
        <h1 className="titulo">BIENVENIDO</h1>
        <p className="slogan">Ahora eres parte del club de los ganadores</p>
        <button onClick={handleStart} className="boton-index">INICIAR</button>
      </div>
    </div>
  );
};

export default Home;
