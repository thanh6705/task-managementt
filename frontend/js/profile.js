async function initProfile() {
    try {
        const user = await getCurrentUser();
        if (user) {
            const usernameEl = document.getElementById('profileUsername');
            const emailEl = document.getElementById('profileEmail');
            
            if (usernameEl) usernameEl.innerText = user.username || 'N/A';
            if (emailEl) emailEl.innerText = user.email || 'N/A';
        }
    } catch (error) {
        console.error('Profile init error:', error);
    }
}

async function getCurrentUser() {
    try {
        const res = await apiRequest('/auth/profile');
        return res && !res.error ? res : null;
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
}