import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import './Loading.css'; // Importa los estilos CSS del spinner

const LoadingSpinner = ({ isLoading }) => {
    return (
            <div className="progress-spinner-container">
                {isLoading && <ProgressSpinner />}
            </div>
    );
}

export default LoadingSpinner;