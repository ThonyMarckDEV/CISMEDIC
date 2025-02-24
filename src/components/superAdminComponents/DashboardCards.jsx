import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState, useRef } from 'react';
import API_BASE_URL from '../../js/urlHelper';
import jwtutils from '../../utilities/jwtUtils';

const DashboardCards = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [statsData, setStatsData] = useState({
    topSpecialty: { especialidad: '', total: 0 },
    totalClients: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);
  const chartContainerRef = useRef(null);

  // Manejador de redimensionamiento para el gráfico
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const updateChartDimensions = () => {
      if (chartContainerRef.current) {
        setChartWidth(chartContainerRef.current.clientWidth || 0);
        setChartHeight(chartContainerRef.current.clientHeight || 0);
      }
    };

    // Inicialización
    updateChartDimensions();

    // Usar ResizeObserver con manejo de errores
    let resizeObserver;
    try {
      resizeObserver = new ResizeObserver((entries) => {
        window.requestAnimationFrame(() => {
          updateChartDimensions();
        });
      });
      resizeObserver.observe(chartContainerRef.current);
    } catch (e) {
      console.error("ResizeObserver error:", e);
      // Fallback a evento de resize para navegadores que no soporten ResizeObserver
      window.addEventListener('resize', updateChartDimensions);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener('resize', updateChartDimensions);
      }
    };
  }, [chartContainerRef.current]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = jwtutils.getTokenFromCookie();

        if (!token) {
          throw new Error('No token found');
        }

        // Añadir manejo de errores más específico con try/catch separados
        let payments = [];
        let stats = { topSpecialty: { especialidad: '', total: 0 }, totalClients: 0 };

        try {
          const paymentsResponse = await fetch(`${API_BASE_URL}/api/payment-history`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (!paymentsResponse.ok) {
            throw new Error(`Error en pagos: ${paymentsResponse.status}`);
          }

          payments = await paymentsResponse.json();
        } catch (err) {
          console.error("Error fetching payments:", err);
          // Continuar con la ejecución para intentar obtener al menos las estadísticas
        }

        try {
          const statsResponse = await fetch(`${API_BASE_URL}/api/dashboard-stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (!statsResponse.ok) {
            throw new Error(`Error en estadísticas: ${statsResponse.status}`);
          }

          stats = await statsResponse.json();
        } catch (err) {
          console.error("Error fetching stats:", err);
          // Continuar con la ejecución 
        }
        
        setPaymentData(payments);
        setStatsData(stats);
        
      } catch (err) {
        setError(err.message);
        console.error("Error general:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processDataForChart = (data) => {
    if (!Array.isArray(data) || data.length === 0) return [];
    
    return data.reduce((acc, payment) => {
      // Verificar que el pago tiene fecha válida
      if (!payment.fecha_pago) return acc;
      
      try {
        const date = new Date(payment.fecha_pago);
        if (isNaN(date.getTime())) return acc; // Verificar que la fecha es válida
        
        const month = date.toLocaleString('default', { month: 'short' });
        const existingMonth = acc.find(item => item.month === month);
        
        if (existingMonth) {
          existingMonth.amount += parseFloat(payment.monto || 0);
          existingMonth.count += 1;
        } else {
          acc.push({
            month,
            amount: parseFloat(payment.monto || 0),
            count: 1
          });
        }
      } catch (err) {
        console.error("Error procesando pago:", err, payment);
      }
      
      return acc;
    }, []);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Cargando datos...</div>
      </div>
    );
  }

  const chartData = processDataForChart(paymentData);

  // Renderización condicional para el gráfico
  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No hay datos suficientes para mostrar el gráfico</p>
        </div>
      );
    }
    
    // Si tenemos dimensiones válidas, renderizar el gráfico directamente sin ResponsiveContainer
    if (chartWidth > 0 && chartHeight > 0) {
      return (
        <LineChart 
          width={chartWidth} 
          height={chartHeight} 
          data={chartData}
          margin={{top: 5, right: 20, left: 10, bottom: 5}}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#22c55e" 
            strokeWidth={2}
            dot={{ fill: '#22c55e' }}
          />
        </LineChart>
      );
    }
    
    // Fallback usando ResponsiveContainer si no podemos obtener dimensiones explícitas
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#22c55e" 
            strokeWidth={2}
            dot={{ fill: '#22c55e' }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div>
      {/* Mensaje de Error (si existe) */}
      {error && (
        <div className="w-full mb-6 bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          <p className="font-medium">Error al cargar datos:</p>
          <p>{error}</p>
          <p className="text-sm mt-2">Puede que algunos datos no se muestren correctamente.</p>
        </div>
      )}

      {/* Contenedor principal - Cambiado a columnas con más espacio entre elementos */}
      <div className="flex flex-col gap-8">
        {/* Grid 2x2 para tarjetas de info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tarjeta de Pagos Totales */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Total de Pagos</h3>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">
                S/. {Array.isArray(paymentData) ? paymentData.reduce((sum, payment) => sum + parseFloat(payment.monto || 0), 0).toFixed(2) : '0.00'}
              </div>
              <p className="text-sm text-gray-500">
                {Array.isArray(paymentData) ? paymentData.length : 0} transacciones realizadas
              </p>
            </div>
          </div>

          {/* Tarjeta de Último Pago */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Último Pago</h3>
            </div>
            <div className="space-y-2">
              {Array.isArray(paymentData) && paymentData.length > 0 ? (
                <>
                  <div className="text-2xl font-bold text-gray-900">
                    S/. {parseFloat(paymentData[0].monto || 0).toFixed(2)}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      {new Date(paymentData[0].fecha_pago).toLocaleDateString()}
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      Cliente: {paymentData[0].nombre_cliente || 'N/A'} {paymentData[0].apellidos_cliente || ''}
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      Especialidad: {paymentData[0].especialidad || 'N/A'}
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No hay pagos registrados</p>
              )}
            </div>
          </div>

          {/* Tarjeta de Especialidad más Demandada */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Especialidad más Demandada</h3>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">
                {statsData?.topSpecialty?.especialidad || 'N/A'}
              </div>
              <p className="text-sm text-gray-500">
                {statsData?.topSpecialty?.total || 0} citas realizadas
              </p>
            </div>
          </div>

          {/* Tarjeta de Total de Clientes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Total de Clientes</h3>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">
                {statsData?.totalClients || 0}
              </div>
              <p className="text-sm text-gray-500">
                clientes registrados en el sistema
              </p>
            </div>
          </div>
        </div>

        {/* Gráfico en toda la anchura - Ahora separado con más espacio y ancho completo */}
        <div className="w-full bg-white rounded-lg shadow-md p-8">
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Tendencia de Pagos</h3>
          </div>
          <div 
            ref={chartContainerRef} 
            className="h-80 w-full"
          >
            {renderChart()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;