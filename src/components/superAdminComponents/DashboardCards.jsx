import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import API_BASE_URL from '../../js/urlHelper';
import jwtutils from '../../utilities/jwtUtils';

const DashboardCards = () => {
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const token = jwtutils.getTokenFromCookie();
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`${API_BASE_URL}/api/payment-history`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setPaymentData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();
  }, []);

  const processDataForChart = (data) => {
    return data.reduce((acc, payment) => {
      const month = new Date(payment.fecha_pago).toLocaleString('default', { month: 'short' });
      const existingMonth = acc.find(item => item.month === month);
      
      if (existingMonth) {
        existingMonth.amount += parseFloat(payment.monto);
        existingMonth.count += 1;
      } else {
        acc.push({
          month,
          amount: parseFloat(payment.monto),
          count: 1
        });
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

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error: {error}
      </div>
    );
  }

  const chartData = processDataForChart(paymentData);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Tarjeta de Pagos Totales */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Total de Pagos</h3>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900">
            S/. {paymentData.reduce((sum, payment) => sum + parseFloat(payment.monto), 0).toFixed(2)}
          </div>
          <p className="text-sm text-gray-500">
            {paymentData.length} transacciones realizadas
          </p>
        </div>
      </div>

      {/* Tarjeta de Último Pago */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Último Pago</h3>
        </div>
        <div className="space-y-2">
          {paymentData.length > 0 && (
            <>
              <div className="text-2xl font-bold text-gray-900">
                S/. {parseFloat(paymentData[0].monto).toFixed(2)}
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">
                  {new Date(paymentData[0].fecha_pago).toLocaleDateString()}
                </p>
                <p className="text-sm font-medium text-gray-700">
                  Cliente: {paymentData[0].nombre_cliente} {paymentData[0].apellidos_cliente}
                </p>
                <p className="text-sm font-medium text-gray-700">
                  Especialidad: {paymentData[0].especialidad}
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Gráfico de Pagos */}
      <div className="col-span-1 md:col-span-2 bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Tendencia de Pagos</h3>
        </div>
        <div className="h-[300px]">
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
        </div>
      </div>
    </div>
  );
};

export default DashboardCards;