import API_BASE_URL from './urlHelper.js';
import jwtUtils from '../utilities/jwtUtils.jsx';

export async function logout() {


    const token = jwtUtils.getTokenFromCookie();

    const decodedToken = parseJwt(token);

    if (token && decodedToken) {
        try {
            // Eliminar el token de localStorage
            jwtUtils.removeTokenFromCookie();
            jwtUtils.clearSessionCookie();

            // Redirigir a la página de inicio de sesión en el dominio raíz
            window.location.href = `/`;
        } catch (error) {
            console.error("Error al desloguear al usuario:", error);
        }
    }
    
}

// Decodificar el token
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
}


window.logout = logout;