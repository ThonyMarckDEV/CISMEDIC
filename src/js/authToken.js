// authToken.js
import API_BASE_URL from './urlHelper.js';
import { logout } from './logout.js';
import jwtUtils from '../utilities/jwtUtils';

const REFRESH_THRESHOLD = 120000; // 2 minutos en milisegundos
let refreshPromise = null; // Para prevenir múltiples llamadas simultáneas

function tokenNeedsRefresh() {
    const token = jwtUtils.getTokenFromCookie();
    if (!token) return true;

    const payload = jwtUtils.parseJwt(token);
    if (!payload || !payload.exp) return true;

    const timeLeft = (payload.exp * 1000) - Date.now();
    console.log(`Token expira en ${Math.floor(timeLeft / 60000)} minutos`);
    
    return timeLeft <= REFRESH_THRESHOLD;
}

async function refreshToken() {
    // Si ya hay una renovación en curso, esperar a que termine
    if (refreshPromise) {
        return refreshPromise;
    }

    const token = jwtUtils.getTokenFromCookie();
    if (!token) {
        throw new Error("No hay token disponible");
    }

    refreshPromise = fetch(`${API_BASE_URL}/api/refresh-token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    .then(async (response) => {
        if (!response.ok) {
            throw new Error(`Error en refresh: ${response.status}`);
        }
        const data = await response.json();
        if (data.accessToken && data.accessToken !== token) {
            document.cookie = `jwt=${data.accessToken}; path=/`;
            return data.accessToken;
        }
        throw new Error("Token renovado inválido");
    })
    .finally(() => {
        refreshPromise = null;
    });

    return refreshPromise;
}

export async function verificarYRenovarToken() {
    try {
        if (tokenNeedsRefresh()) {
            const nuevoToken = await refreshToken();
            if (!nuevoToken) {
                console.error("Fallo en la renovación del token");
                logout();
                return false;
            }
            return true;
        }
        return true;
    } catch (error) {
        console.error("Error en verificarYRenovarToken:", error);
        logout();
        return false;
    }
}