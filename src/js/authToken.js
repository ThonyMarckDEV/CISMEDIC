// import API_BASE_URL from './urlHelper';
// import jwtUtils from '../utilities/jwtUtils';

// // Constantes para la renovación del token
// const TIEMPO_ANTES_RENOVAR_MS = 120000; // 2 minutos en milisegundos
// const INTERVALO_VERIFICACION_MS = 10000; // Verificar cada 10 segundos

// // Función para verificar si el token está expirado o próximo a expirar
// function tokenEstaExpirando() {
//     const token = jwtUtils.getTokenFromCookie();
    
//     if (!token) {
//         console.log("No se encontró token en la cookie");
//         return true;
//     }
    
//     try {
//         const payload = parseJwt(token);
//         if (!payload?.exp) {
//             console.error("Token inválido o sin fecha de expiración");
//             return true;
//         }

//         const tiempoExpiracion = payload.exp * 1000; // Convertir a milisegundos
//         const tiempoActual = Date.now();
//         const tiempoRestante = tiempoExpiracion - tiempoActual;
        
//         // Registrar tiempo restante (para depuración)
//         const minutosRestantes = Math.floor(tiempoRestante / 60000);
//         console.log(`El token expira en ${minutosRestantes} minutos`);
        
//         return tiempoRestante <= TIEMPO_ANTES_RENOVAR_MS;
//     } catch (error) {
//         console.error("Error al verificar la expiración del token:", error);
//         return true;
//     }
// }

// // Función para decodificar el token JWT
// function parseJwt(token) {
//     try {
//         const base64Url = token.split('.')[1];
//         const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//         const jsonPayload = decodeURIComponent(
//             atob(base64)
//                 .split('')
//                 .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//                 .join('')
//         );
//         return JSON.parse(jsonPayload);
//     } catch (error) {
//         console.error("Error al decodificar JWT:", error);
//         return null;
//     }
// }

// // Función para renovar el token
// async function renovarToken() {
//     const tokenActual = jwtUtils.getTokenFromCookie();
    
//     if (!tokenActual) {
//         return null;
//     }
    
//     try {
//         const respuesta = await fetch(`${API_BASE_URL}/api/refresh-token`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${tokenActual}`
//             }
//         });

//         if (!respuesta.ok) {
//             throw new Error(`Fallo en renovación del token: ${respuesta.status}`);
//         }

//         const { accessToken } = await respuesta.json();
        
//         // Solo actualizar si recibimos un token nuevo
//         if (accessToken && accessToken !== tokenActual) {
//             document.cookie = `jwt=${accessToken}; path=/; secure; samesite=strict`;
//             console.log("Token renovado exitosamente");
//             return accessToken;
//         } else {
//             console.warn("El servidor devolvió el mismo token o ningún token");
//             return null;
//         }
//     } catch (error) {
//         console.error("Error en renovación del token:", error);
//         return null;
//     }
// }

// // Función principal de verificación y renovación del token
// let renovacionEnProceso = false;

// export async function verificarYRenovarToken() {
//     // Prevenir múltiples intentos simultáneos de renovación
//     if (renovacionEnProceso) {
//         return;
//     }
    
//     try {
//         renovacionEnProceso = true;
        
//         if (tokenEstaExpirando()) {
//             console.log("Token próximo a expirar, intentando renovar");
//             const nuevoToken = await renovarToken();
            
//             if (!nuevoToken) {
//                 console.warn("Falló la renovación del token");
//                 // Aquí podrías activar un cierre de sesión o mostrar una advertencia al usuario
//             }
//         }
//     } finally {
//         renovacionEnProceso = false;
//     }
// }

// // Configurar el intervalo de renovación del token
// export function configurarRenovacionToken() {
//     // Verificación inicial
//     verificarYRenovarToken();
    
//     // Verificaciones regulares
//     const intervalId = setInterval(verificarYRenovarToken, INTERVALO_VERIFICACION_MS);
    
//     // Retornar función de limpieza
//     return () => clearInterval(intervalId);
// }


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

    const payload = jwtUtils.parseJwt(token);
    if (!payload || !payload.exp) {
        // console.error("El token es inválido o no contiene un campo de expiración.");
        return true;
    }

    const exp = payload.exp * 1000; // Convertir a milisegundos
    const timeLeft = exp - Date.now(); // Tiempo restante en milisegundos
    const timeLeftInMinutes = Math.floor(timeLeft / 1000 / 60); // Tiempo restante en minutos

  //  console.log(`El token expira en ${timeLeftInMinutes} minutos.`);

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
       // logoutAndRedirect();
    }
}

// Función que verifica y renueva el token si es necesario
export async function verificarYRenovarToken() {
    if (tokenExpirado()) {
        const nuevoToken = await renovarToken();
        if (nuevoToken) {
          //  console.log("Renovación completada, el nuevo token se utilizará en la siguiente solicitud.");
        } else {
            console.log("No se pudo renovar el token");
        }
    } else {
        //console.log("El token es válido y no necesita renovación.");
    }
}
