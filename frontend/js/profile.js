async function initProfile() {
    try {
        const user = await getCurrentUser();
        if (user) {
            const usernameEl = document.getElementById('profileUsername');
            const emailEl = document.getElementById('profileEmail');
            const joinedEl = document.getElementById('profileJoined');
            
            if (usernameEl) usernameEl.innerText = user.username || 'N/A';
            if (emailEl) emailEl.innerText = user.email || 'N/A';
            if (joinedEl) joinedEl.innerText = user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'N/A';
        }
    } catch (error) {
        console.error('Profile init error:', error);
    }
}

async function getCurrentUser() {
    try {
        const res = await apiRequest('/me');
        return res.success ? res.data : null;
    } catch (error) {
        console.error('Get current user error:', error);
        return null;
    }
}