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
        const userId = jwtUtils.getIdCarrito(token);

        const response = await fetch(`${API_BASE_URL}/api/update-activity`, {
            method: 'POST',
            credentials: 'include',
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
    }finally{
        checkUserStatus();
    }
}