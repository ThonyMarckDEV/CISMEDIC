import React, { useEffect, useState } from 'react';
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = jwtutils.getTokenFromCookie();

        if (!token) {
          throw new Error('No token found');
        }

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
    
    // Ordenar por fecha para asegurar que los meses aparezcan en orden cronológico
    const sortedData = [...data].sort((a, b) => 
      new Date(a.fecha_pago) - new Date(b.fecha_pago)
    );
    
    return sortedData.reduce((acc, payment) => {
      if (!payment.fecha_pago) return acc;
      
      try {
        const date = new Date(payment.fecha_pago);
        if (isNaN(date.getTime())) return acc;
        
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

  // Calcular el total de pagos
  const totalPayments = Array.isArray(paymentData) 
    ? paymentData.reduce((sum, payment) => sum + parseFloat(payment.monto || 0), 0).toFixed(2) 
    : '0.00';
  
  // Obtener el último pago
  const lastPayment = Array.isArray(paymentData) && paymentData.length > 0 
    ? paymentData[0] 
    : null;

  const chartData = processDataForChart(paymentData);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Mensaje de Error (si existe) */}
      {error && (
        <div className="w-full p-4 mb-6 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {/* SVG del ícono de alerta */}
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error al cargar datos</h3>
              <div className="mt-1 text-sm text-red-700">
                <p>{error}</p>
                <p className="mt-2 text-xs">Puede que algunos datos no se muestren correctamente.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid de tarjetas de información */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarjeta de Pagos Totales */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Total de Pagos</h3>
            <div className="p-2 bg-green-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">
              S/. {totalPayments}
            </div>
            <p className="text-sm text-gray-500">
              {Array.isArray(paymentData) ? paymentData.length : 0} transacciones realizadas
            </p>
          </div>
        </div>

        {/* Tarjeta de Último Pago */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Último Pago</h3>
            <div className="p-2 bg-blue-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            {lastPayment ? (
              <>
                <div className="text-3xl font-bold text-gray-900">
                  S/. {parseFloat(lastPayment.monto || 0).toFixed(2)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">
                    {new Date(lastPayment.fecha_pago).toLocaleDateString()}
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    Cliente: {lastPayment.nombre_cliente || 'N/A'} {lastPayment.apellidos_cliente || ''}
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    Especialidad: {lastPayment.especialidad || 'N/A'}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-gray-500">No hay pagos registrados</p>
            )}
          </div>
        </div>

        {/* Tarjeta de Especialidad más Demandada */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Especialidad más Demandada</h3>
            <div className="p-2 bg-amber-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">
              {statsData?.topSpecialty?.especialidad || 'N/A'}
            </div>
            <p className="text-sm text-gray-500">
              {statsData?.topSpecialty?.total || 0} citas realizadas
            </p>
          </div>
        </div>

        {/* Tarjeta de Total de Clientes */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Total de Clientes</h3>
            <div className="p-2 bg-indigo-100 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-gray-900">
              {statsData?.totalClients || 0}
            </div>
            <p className="text-sm text-gray-500">
              clientes registrados en el sistema
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico mejorado */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Tendencia de Pagos</h3>
          <p className="text-sm text-gray-500 mt-1">
            Evolución mensual de los ingresos
          </p>
        </div>
        <div className="h-80 w-full">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No hay datos suficientes para mostrar el gráfico</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0'
                  }}
                  formatter={(value) => [`S/. ${value.toFixed(2)}`, 'Monto']}
                  labelFormatter={(label) => `Mes: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorAmount)" 
                  strokeWidth={3}
                  activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2, fill: '#ffffff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;