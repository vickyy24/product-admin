export function isAuthenticated() {
    return typeof window !== 'undefined' && Boolean(localStorage.getItem('auth_token'));
}

export function getUser() {
    if (typeof window === 'undefined') return null;
    try {
        const inputUsername = localStorage.getItem('auth_username');
        if (inputUsername) return { username: inputUsername };
        const userStr = localStorage.getItem('auth_user');
        return userStr ? JSON.parse(userStr) : null;
    } catch {
        return null;
    }
}

export function logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_username');
}
