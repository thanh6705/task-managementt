async function initSettings() {
    // Dark mode toggle
    const isDark = localStorage.getItem('theme') === 'dark';
    const darkToggle = document.getElementById('darkModeToggle');
    if (darkToggle) {
        darkToggle.checked = isDark;
        darkToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        });
    }
    
    // Change password form
    const changePasswordForm = document.getElementById('changePasswordForm');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const oldPassword = document.getElementById('oldPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (newPassword !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp!');
                return;
            }
            
            const res = await apiRequest('/change-password', 'POST', {
                old_password: oldPassword,
                new_password: newPassword
            });
            
            alert(res.message || (res.success ? 'Đổi mật khẩu thành công!' : 'Đổi mật khẩu thất bại'));
            if (res.success) {
                changePasswordForm.reset();
            }
        });
    }
}

// Load theme khi khởi động
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
}