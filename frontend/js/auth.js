const auth = {
    checkLogin() {
        const token = localStorage.getItem('token');
        const pathname = window.location.pathname;
        const isLoginPage = /login(\.html)?$/.test(pathname);
        const isRegisterPage = /register(\.html)?$/.test(pathname);

        if (!token && !isLoginPage && !isRegisterPage) {
            window.location.href = 'login.html';
            return;
        }

        if (token && (isLoginPage || isRegisterPage)) {
            window.location.href = 'index.html';
        }
    },
    logout() {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    },
    async login(event) {
        event.preventDefault();
        const email = document.getElementById('email')?.value?.trim();
        const password = document.getElementById('password')?.value?.trim();

        if (!email || !password) {
            document.getElementById('msg').innerText = 'Vui lòng nhập đầy đủ thông tin.';
            return;
        }

        const res = await apiRequest('/auth/login', 'POST', { email, password });
        if (res && res.token) {
            localStorage.setItem('token', res.token);
            window.location.href = 'index.html';
        } else {
            document.getElementById('msg').innerText = res.message || res.error || 'Đăng nhập không thành công.';
        }
    },
    async register(event) {
        event.preventDefault();
        const username = document.getElementById('username')?.value?.trim();
        const email = document.getElementById('email')?.value?.trim();
        const password = document.getElementById('password')?.value?.trim();

        if (!username || !email || !password) {
            document.getElementById('msg').innerText = 'Vui lòng nhập đầy đủ thông tin.';
            return;
        }

        const res = await apiRequest('/auth/register', 'POST', { username, email, password });
        if (res && res.token) {
            localStorage.setItem('token', res.token);
            window.location.href = 'index.html';
        } else {
            document.getElementById('msg').innerText = res.message || res.error || 'Đăng ký không thành công.';
        }
    }
};

window.addEventListener('DOMContentLoaded', () => {
    auth.checkLogin();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', auth.login.bind(auth));
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', auth.register.bind(auth));
    }
});
