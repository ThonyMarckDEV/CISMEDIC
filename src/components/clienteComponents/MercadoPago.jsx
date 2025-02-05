import React, { useEffect, useState } from 'react';
import API_BASE_URL from '../../js/urlHelper.js';
import LoadingScreen from '../home/LoadingScreen.jsx';
import SweetAlert from '../../components/SweetAlert';
import jwtUtils from '../../utilities/jwtUtils.jsx';
import { verificarYRenovarToken } from '../../js/authToken';

const MercadoPago = ({ cita }) => {
    const [loading, setLoading] = useState(false);
    const [mercadoPago, setMercadoPago] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const scriptId = "mercadoPagoScript";
        const existingScript = document.getElementById(scriptId);
        if (existingScript) {
            if (window.MercadoPago) {
                setMercadoPago(new window.MercadoPago('APP_USR-4005458516359674-020422-f715000cbaa8ad711e1250d1c9699d64-2099203345', { locale: 'es-PE' }));
            }
            return;
        }
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://sdk.mercadopago.com/js/v2';
        script.onload = () => {
            if (window.MercadoPago) {
                setMercadoPago(new window.MercadoPago('APP_USR-4005458516359674-020422-f715000cbaa8ad711e1250d1c9699d64-2099203345', { locale: 'es-PE' }));
            } else {
                setError('Error al cargar el SDK de MercadoPago.');
            }
        };
        script.onerror = () => setError('Error al cargar el SDK de MercadoPago.');
        document.body.appendChild(script);
        return () => {
            const loadedScript = document.getElementById(scriptId);
            if (loadedScript) {
                document.body.removeChild(loadedScript);
            }
        };
    }, []);

    const handlePago = async () => {
        if (!mercadoPago) {
            setError("MercadoPago no está disponible. Por favor, intenta más tarde.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Validar que existe el ID de la cita
            if (!cita?.idCita) {
                setError('No se encontró un ID de cita válido.');
                setLoading(false);
                return;
            }

            const token = jwtUtils.getTokenFromCookie();
            const decodedToken = decodeJWT(token);
            const correoUsuario = decodedToken ? decodedToken.correo : null;

            if (!correoUsuario) {
                setError('No se pudo obtener el correo del usuario.');
                setLoading(false);
                return;
            }

            await verificarYRenovarToken();

            // Crear la preferencia de pago
            const response = await fetch(`${API_BASE_URL}/api/payment/preference`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    idCita: cita.idCita,
                    monto: cita.monto,
                    correo: correoUsuario,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData?.message || 'Error al crear la preferencia de pago.');
                return;
            }

            const data = await response.json();

            if (data.success) {
                mercadoPago.checkout({
                    preference: { id: data.preference_id },
                    autoOpen: true,
                });
            } else {
                setError(data.message || 'Error al crear la preferencia de pago.');
            }
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            setError('Error al procesar el pago. Intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const decodeJWT = (token) => {
        try {
            const payloadBase64 = token.split('.')[1];
            const payload = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
            return JSON.parse(payload);
        } catch (error) {
            console.error('Error al decodificar el JWT:', error);
            return null;
        }
    };

    return (
        <div>
            {loading && <LoadingScreen />}
            {error && (
                <div className="py-2 text-center text-white bg-red-500 rounded-lg mb-2">
                    {error}
                </div>
            )}
            {!loading && (
                <button
                    onClick={handlePago}
                    className="w-full px-4 py-2.5 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors"
                    disabled={loading}
                >
                    {loading ? 'Procesando...' : 'Pagar Cita'}
                </button>
            )}
        </div>
    );
};

export default MercadoPago;