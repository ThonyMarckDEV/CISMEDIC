import API_BASE_URL from './urlHelper.js';
import { verificarYRenovarToken } from './authToken.js';
import { checkUserStatus } from './checkUserStatus';
import jwtUtils from '../utilities/jwtUtils.jsx';


export async function updateLastActivity() {
    try {
        const tokenValid = await verificarYRenovarToken();
        if (!tokenValid) return;

        const token = jwtUtils.getTokenFromCookie();
        const userId = jwtUtils.getIdUsuario(token);
        const sessionId = jwtUtils.getSessionIdFromCookie();

        // Verificar si la sesión actual es válida
        const responseCheck = await fetch(`${API_BASE_URL}/api/check-active-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ idUsuario: userId, sessionId: sessionId }) // Enviar el sessionId
        });

        if (!responseCheck.ok) {
            throw new Error(`Error en check-active-session: ${responseCheck.status}`);
        }

        const { validSession } = await responseCheck.json();

        if (!validSession) {
            // Si la sesión no es válida, cerrar la sesión actual
            console.log('Sesión no válida, cerrando sesión...');

            await fetch(`${API_BASE_URL}/api/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ idUsuario: userId })
            });

            // Eliminar el token y el sessionId de las cookies
            jwtUtils.removeTokenFromCookie();
            jwtUtils.removeSessionIdFromCookie();

            // Redirigir a la página de inicio de sesión
            window.location.href = `/`;
            return;
        }

        // Actualizar la última actividad
        const response = await fetch(`${API_BASE_URL}/api/update-activity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ idUsuario: userId })
        });

        if (!response.ok) {
            throw new Error(`Error en updateLastActivity: ${response.status}`);
        }
    } catch (error) {
        console.error('Error en updateLastActivity:', error);
    }
}