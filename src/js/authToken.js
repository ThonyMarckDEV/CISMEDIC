import API_BASE_URL from './urlHelper.js';
import { logout as logoutAndRedirect } from './logout.js';
import jwtUtils from '../utilities/jwtUtils';

// Función para verificar si el token está próximo a expirar
function tokenExpirado() {
    const token = jwtUtils.getTokenFromCookie();
    if (!token) {
        // console.log("Token no encontrado en la cookie.");
        return true;
    }

    const payload = parseJwt(token);
    if (!payload || !payload.exp) {
        // console.error("El token es inválido o no contiene un campo de expiración.");
        return true;
    }

    const exp = payload.exp * 1000; // Convertir a milisegundos
    const timeLeft = exp - Date.now(); // Tiempo restante en milisegundos
    const timeLeftInMinutes = Math.floor(timeLeft / 1000 / 60); // Tiempo restante en minutos

    console.log(`El token expira en ${timeLeftInMinutes} minutos.`);

    const isExpiring = timeLeft <= 120000; // Renovar 2 minutos antes de expirar
    return isExpiring;
}

// Función para renovar el token
export async function renovarToken() {
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
        //logoutAndRedirect();
    }
}

// Función que verifica y renueva el token si es necesario
export async function verificarYRenovarToken() {
    if (tokenExpirado()) {
        const nuevoToken = await renovarToken();
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

// Función para decodificar el token
function parseJwt(token) {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('') 
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error al decodificar el token JWT:", error);
        return null;
    }
}
