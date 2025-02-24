import API_BASE_URL from './urlHelper.js';
import { verificarYRenovarToken } from './authToken.js';
import { checkUserStatus } from './checkUserStatus';
import jwtUtils from '../utilities/jwtUtils.jsx';


// updateLastActivity.js
export async function updateLastActivity() {
    try {
        const tokenValid = await verificarYRenovarToken();
        if (!tokenValid) return;

        const token = jwtUtils.getTokenFromCookie();
        const userId = jwtUtils.getIdUsuario(token);

        // Verificar si hay una sesión activa en otro dispositivo
        const responseCheck = await fetch(`${API_BASE_URL}/api/check-active-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ idUsuario: userId })
        });

        if (!responseCheck.ok) {
            throw new Error(`Error en check-active-session: ${responseCheck.status}`);
        }

        const { activeSession } = await responseCheck.json();

        if (activeSession) {
            // Si hay una sesión activa en otro dispositivo, cerrar la sesión actual
            await fetch(`${API_BASE_URL}/api/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ idUsuario: userId })
            });

            // Eliminar el token de localStorage
            jwtUtils.removeTokenFromCookie();

            // Redirigir a la página de inicio de sesión en el dominio raíz
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