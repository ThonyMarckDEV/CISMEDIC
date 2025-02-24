import API_BASE_URL from './urlHelper.js';
import { logout as logoutAndRedirect } from './logout.js';
import jwtUtils from '../utilities/jwtUtils';

export async function tokenExpirado() {
    const token = jwtUtils.getTokenFromCookie();
    if (!token) return true;
    
    const payload = jwtUtils.parseJwt(token);
    if (!payload || !payload.exp) return true;
    
    const exp = payload.exp * 1000;
    const timeLeft = exp - Date.now();
    const timeLeftInMinutes = Math.floor(timeLeft / 1000 / 60);
    
    // Renovar cuando falten 2 minutos para los 5 minutos de expiración
    const RENEWAL_THRESHOLD = 2 * 60 * 1000; // 2 minutos en milisegundos
    const isExpiring = timeLeft <= RENEWAL_THRESHOLD;
    
    if (isExpiring) {
        console.log(`Token próximo a expirar. Tiempo restante: ${timeLeftInMinutes} minutos`);
    }
    
    return isExpiring;
}

// Función para renovar el token
export async function RenovarToken() {
    const token = jwtUtils.getTokenFromCookie();
    if (!token) {
        // console.log("Token no encontrado en la cookie.");
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const nuevoToken = data.accessToken;

            // Verifica si el token renovado es diferente al actual
            if (nuevoToken !== token) {
                document.cookie = `jwt=${nuevoToken}; path=/`; // Actualiza la cookie
                return nuevoToken;
            } else {
                throw new Error("El token renovado es el mismo que el anterior.");
            }
        }
    } catch (error) {
        console.error("Error al intentar renovar el token:", error);
    }
}


// Función que verifica y renueva el token si es necesario
export async function verificarYRenovarToken() {
    if (tokenExpirado()) {
        const nuevoToken = await RenovarToken();
        if (nuevoToken) {
           // console.log("Renovación completada, el nuevo token se utilizará en la siguiente solicitud.");
        } else {
            console.log("No se pudo renovar el token");
            //logoutAndRedirect();
        }
    } else {
        //console.log("El token es válido y no necesita renovación.");
    }
}

