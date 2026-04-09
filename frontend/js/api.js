// Development: http://localhost:5000, Production: https://task-managementt-3bda.onrender.com
// Nếu đã deploy backend lên Render
const API_URL = "https://task-managementt-3bda.onrender.com/api";
const api = {
    async get(endpoint) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}${endpoint}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!res.ok) {
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return await res.json();
        } catch (error) {
            console.error('API GET Error:', error);
            return { error: error.message };
        }
    },
    
    async post(endpoint, data, isFormData = false) {
        try {
            const token = localStorage.getItem('token');
            const headers = isFormData ? {} : { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: headers,
                body: isFormData ? data : JSON.stringify(data)
            });
            if (!res.ok) {
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return await res.json();
        } catch (error) {
            console.error('API POST Error:', error);
            return { error: error.message };
        }
    },
    
    async put(endpoint, data) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (!res.ok) {
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return await res.json();
        } catch (error) {
            console.error('API PUT Error:', error);
            return { error: error.message };
        }
    },
    
    async delete(endpoint) {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) {
                if (res.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                }
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return await res.json();
        } catch (error) {
            console.error('API DELETE Error:', error);
            return { error: error.message };
        }
    }
};

// Hàm helper để gọi API dễ hơn
async function apiRequest(endpoint, method = 'GET', data = null) {
    const methodLower = method.toLowerCase();
    if (methodLower === 'get') {
        return api.get(endpoint);
    } else if (methodLower === 'post') {
        return api.post(endpoint, data);
    } else if (methodLower === 'put') {
        return api.put(endpoint, data);
    } else if (methodLower === 'delete') {
        return api.delete(endpoint);
    }
}