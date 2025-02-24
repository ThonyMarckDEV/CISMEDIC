// import API_BASE_URL from './urlHelper.js';
// import { logout as logoutAndRedirect } from './logout.js';
// import jwtUtils from '../utilities/jwtUtils.jsx';

// export const checkUserStatus = async () => {
//     try {
//        // Agrega este console.log en checkUserStatus.js
//         const token = jwtUtils.getTokenFromCookie();
//       //  console.log('Token actual:', token);
//         // También decodifica el token para ver su contenido
//        // console.log('Token decodificado:', jwtUtils.parseJwt(token));

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
//             console.log('Sesión inválida:', data.message);
//            // await logoutAndRedirect();
//             return;
//         }

//     } catch (error) {
//         console.log('Error en checkUserStatus:', error);
//         if (!(error instanceof TypeError)) {
//           //  await logoutAndRedirect();
//         }
//     }
// };


// import API_BASE_URL from './urlHelper.js';
// import { logout as logoutAndRedirect } from './logout.js';
// import jwtUtils from '../utilities/jwtUtils.jsx';

// export const checkUserStatus = async (retryCount = 0) => {
//     const MAX_RETRIES = 3; // Número máximo de reintentos
//     const RETRY_DELAY = 5000; // 5 segundos de espera entre reintentos

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
//             console.log('Sesión inválida:', data.message);
//            await logoutAndRedirect();
//             return;
//         }

//     } catch (error) {
//         console.log('Error en checkUserStatus:', error);

//         if (retryCount < MAX_RETRIES) {
//             console.log(`Reintentando en ${RETRY_DELAY / 1000} segundos...`);
//             setTimeout(() => checkUserStatus(retryCount + 1), RETRY_DELAY);
//         } else {
//             console.log('Número máximo de reintentos alcanzado. No se pudo verificar el estado del usuario.');
//             // Aquí puedes decidir si desloguear al usuario después de varios intentos fallidos
//             // await logoutAndRedirect();
//         }
//     }
// };