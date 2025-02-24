// //checkuserstatus.js
// import API_BASE_URL from './urlHelper.js';
// import { logout as logoutAndRedirect } from './logout.js';
// import jwtUtils from '../utilities/jwtUtils.jsx';

// export const checkUserStatus = async () => {
//     try {
//         const token = jwtUtils.getTokenFromCookie();

//         if (!token) {
//             console.warn('No hay token en las cookies');
//             await logoutAndRedirect();
//             return;
//         }

//         const idUsuario = jwtUtils.getIdUsuario(token);
        
//         if (!idUsuario) {
//             console.warn('No se pudo obtener el ID de usuario del token');
//             await logoutAndRedirect();
//             return;
//         }

//         const response = await fetch(`${API_BASE_URL}/api/check-status`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${token}`
//             },
//             body: JSON.stringify({ idUsuario })
//         });

//         const contentType = response.headers.get("content-type");
//         if (!contentType || !contentType.includes("application/json")) {
//             throw new Error("Respuesta no válida del servidor");
//         }

//         const data = await response.json();

//         if (!response.ok || data.status === 'error' || data.force_logout) {
//             console.warn('Sesión inválida:', data.message);
//             await logoutAndRedirect();
//             return;
//         }

//     } catch (error) {
//         console.error('Error en checkUserStatus:', error);
//         if (!(error instanceof TypeError)) {
//             await logoutAndRedirect();
//         }
//     }
// };


// checkUserStatus.js
import API_BASE_URL from './urlHelper.js';
import { logout as logoutAndRedirect } from './logout.js';
import jwtUtils from '../utilities/jwtUtils';
import { verificarYRenovarToken } from './authToken';

export const checkUserStatus = async () => {
    try {
        // Get and validate token
        const token = jwtUtils.getTokenFromCookie();
        
        if (!token) {
            console.log('No token found, logging out');
            await logoutAndRedirect();
            return;
        }

        const idUsuario = jwtUtils.getIdUsuario(token);
        
        if (!idUsuario) {
            console.log('No user ID found in token, logging out');
            await logoutAndRedirect();
            return;
        }

        // Verify and renew token if needed
        try {
            await verificarYRenovarToken();
        } catch (tokenError) {
            console.error('Token verification failed:', tokenError);
            await logoutAndRedirect();
            return;
        }

        // Make the status check request
        const response = await fetch(`${API_BASE_URL}/api/check-status`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "User-Agent": navigator.userAgent
            },
            body: JSON.stringify({ 
                idUsuario,
                dispositivo: navigator.userAgent 
            })
        });

        // Handle different response scenarios
        if (response.status === 403) {
            console.log('Authentication failed, logging out');
            await logoutAndRedirect();
            return;
        }

        if (!response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();
                if (data.force_logout) {
                    await logoutAndRedirect();
                }
            }// else {
            //     console.error('Invalid response format');
            //     // Only logout for authentication-related errors
            //     if (response.status >= 400 && response.status < 500) {
            //         await logoutAndRedirect();
            //     }
            // }
            return;
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Error in checkUserStatus:', error);
        
        // // Only force logout for authentication errors, not network/server errors
        // if (!(error instanceof TypeError) && !(error.name === 'SyntaxError')) {
        //     await logoutAndRedirect();
        // }
    }
};