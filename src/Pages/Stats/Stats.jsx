import React, { useEffect, useState, useRef } from 'react';
import { fetchStatsData, fetchUsername } from '../../api/stats';
import './Stats.css';
import Chart from 'chart.js/auto';
import Navbar from '../../Components/Navbar/Navbar';
import LoadingSpinner from '../../Components/Loading/Loading'; // Componente de carga

const Stats = () => {
  const [username, setUsername] = useState('Cargando...');
  const [isLoading, setIsLoading] = useState(true);
  const [betCount, setBetCount] = useState(0);
  const [stats, setStats] = useState([]);
  const [filteredStats, setFilteredStats] = useState([]); // Nueva variable para estadísticas filtradas
  const [searchAccount, setSearchAccount] = useState(''); // Estado para el buscador
  const chartRefs = useRef({}); // Almacenar los refs de los canvas por account_id

  useEffect(() => {
    // Obtener nombre de usuario
    const loadUsername = async () => {
      try {
        const username = await fetchUsername();
        setUsername(username);
      } catch (error) {
        console.error('Error al obtener el nombre de usuario:', error);
      }
    };

    // Obtener estadísticas de apuestas
    const loadStats = async () => {
      setIsLoading(true);
      try {
        const data = await fetchStatsData();
        setBetCount(data.length); // Actualizar cantidad de apuestas
        setStats(data); // Guardar datos de apuestas
      } catch (error) {
        console.error('Error al obtener las estadísticas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsername();
    loadStats();
  }, []);

  useEffect(() => {
    if (stats.length > 0) {
      // Filtrar estadísticas por account_id ingresado
      const filtered = stats.filter(bet => bet.account_id === searchAccount);
      setFilteredStats(filtered);
    }
  }, [searchAccount, stats]);

  useEffect(() => {
    if (filteredStats.length > 0) {
      // Agrupar las apuestas por account_id
      const accountData = filteredStats.reduce((acc, bet) => {
        const { account_id, status } = bet;
        if (!acc[account_id]) {
          acc[account_id] = [];
        }
        acc[account_id].push(status);
        return acc;
      }, {});

      // Generar gráficos para la cuenta filtrada
      Object.keys(accountData).forEach(accountId => {
        const statuses = accountData[accountId];
        const statusCounts = statuses.reduce((acc, status) => {
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});

        const ctx = chartRefs.current[accountId]?.getContext('2d');
        if (ctx) {
          const statusColors = {
            'OPEN': '#F8B133',
            'WIN': '#39B54A',
            'LOST': '#29ABE2',
            'NULL': '#808080',
          };

          const backgroundColors = Object.keys(statusCounts).map(status => statusColors[status] || '#000000');

          // Destruir gráfico anterior si existe
          if (chartRefs.current[accountId]._chartInstance) {
            chartRefs.current[accountId]._chartInstance.destroy();
          }

          chartRefs.current[accountId]._chartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
              labels: Object.keys(statusCounts),
              datasets: [{
                label: 'Status Counts',
                data: Object.values(statusCounts),
                backgroundColor: backgroundColors,
                borderColor: backgroundColors,
                borderWidth: 1,
              }],
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'right',
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      let label = context.label || '';
                      if (label) {
                        label += ': ';
                      }
                      let value = context.raw;
                      let total = context.dataset.data.reduce((a, b) => a + b, 0);
                      let percentage = (value / total * 100).toFixed(2);
                      label += `${value} (${percentage}%)`;
                      return label;
                    },
                  },
                },
              },
            },
          });
        }
      });
    }
  }, [filteredStats]);

  return (
    <div className='body-stats'>
      <LoadingSpinner isLoading={isLoading} />
      <Navbar />
      <div className="container-stats">
        <div className="div-title">
          <h1 className="titulo">Estadísticas</h1>
        </div>
        <div className="div-stats">
          <div id="username" style={{ color: '#F8B133' }}>
            Usuario: <span id="usernameValue" style={{ color: '#ffffff' }}>{username}</span>
          </div>
          <div id="idCount" style={{ color: '#F8B133' }}>
            Cantidad de apuestas realizadas: <span id="idCountValue" style={{ color: '#ffffff' }}>{betCount}</span>
          </div>
        </div>
        <div id="statsContainer">
          <input
            type="text" 
            placeholder="Buscar por Cedula" 
            value={searchAccount} 
            onChange={(e) => setSearchAccount(e.target.value)} // Actualizar estado con el valor del input
            className="search-input"
          />
          {filteredStats.length > 0 ? (
            Object.keys(filteredStats.reduce((acc, bet) => {
              acc[bet.account_id] = true;
              return acc;
            }, {})).map(accountId => (
              <div key={accountId} className="div-charts">
                <div className="div-account">
                  <div id={`account-${accountId}`} style={{ color: '#F8B133' }}>
                    Cuenta: <span id={`accountValue-${accountId}`} style={{ color: '#ffffff' }}>{accountId}</span>
                  </div>
                </div>
                <div className="chart-div">
                  <div className="chart">
                    <canvas
                      ref={el => chartRefs.current[accountId] = el} // Asignar el ref al canvas
                      id={`statusChart-${accountId}`}
                      width="4%"
                      height="4%"
                    ></canvas>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='no-stats'><p>Ingresa el número de cédula de la cuenta para ver sus estadísticas.</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
