const app = {
    pages: {
        dashboard: `
            <div class="dashboard-container">
                <div class="dashboard-header">
                    <div class="welcome-section">
                        <h1>Chào buổi sáng! ☀️</h1>
                        <p class="slogan">"Kỷ luật là cầu nối giữa mục tiêu và thành tựu."</p>
                    </div>
                    <div class="dashboard-actions">
                        <div class="search-box dashboard-search">
                            <span class="material-icons">search</span>
                            <input type="text" id="dashboardSearch" placeholder="🔍 Tìm task..." onkeyup="app.filterDashboardTasks()">
                        </div>
                        <div class="avatar avatar-top" onclick="app.navigateTo('profile')">👤</div>
                    </div>
                </div>
                <div id="dashboardStats" class="dashboard-stats">
                    <div class="stat-card pending"><h3 id="todoCount">0</h3><p>Chờ xử lý</p></div>
                    <div class="stat-card progress"><h3 id="inProgressCount">0</h3><p>Đang làm</p></div>
                    <div class="stat-card done"><h3 id="doneCount">0</h3><p>Hoàn thành</p></div>
                </div>
                <div class="recent-tasks">
                    <h2>Công việc gần đây</h2>
                    <div id="recentTaskList"></div>
                </div>
            </div>
        `,
        tasks: `
            <div class="task-header">
                <h2>Danh sách Task</h2>
                <button onclick="app.openAddTask()" class="btn-add">+ Thêm Task</button>
            </div>
            <div class="search-bar">
                <input type="text" id="searchTask" placeholder="🔍 Tìm kiếm task..." onkeyup="app.filterTasks()">
                <select id="statusFilter" onchange="app.filterTasks()">
                    <option value="all">Tất cả</option>
                    <option value="todo">Chưa hoàn thành</option>
                    <option value="in-progress">Đang thực hiện</option>
                    <option value="done">Hoàn thành</option>
                </select>
            </div>
            <div class="stats-mini">
                <span>📊 Tổng: <strong id="totalTasks">0</strong></span>
                <span>✅ Hoàn thành: <strong id="doneTasks">0</strong></span>
                <span>⏳ Đang làm: <strong id="inProgressTasks">0</strong></span>
            </div>
            <div id="allTasksList" class="task-container"></div>
        `,
        profile: `
            <div class="profile-container">
                <div class="profile-header">
                    <div>
                        <h2>Thông tin tài khoản</h2>
                        <p class="profile-subtitle">Quản lý thông tin cá nhân và xem chi tiết tài khoản của bạn.</p>
                    </div>
                    <div class="profile-actions">
                        <button class="btn-secondary" onclick="app.navigateTo('tasks')">Xem Task của tôi</button>
                    </div>
                </div>
                <div class="profile-card">
                    <div class="profile-avatar-large">👤</div>
                    <div class="profile-details">
                        <div class="info-row">
                            <span class="info-label">Tên đăng nhập</span>
                            <strong id="profileUsername">Loading...</strong>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Email</span>
                            <strong id="profileEmail">Loading...</strong>
                        </div>
                        <div class="info-row info-note">
                            <span>Ghi chú</span>
                            <span>Chỉ bạn mới có quyền xem thông tin này.</span>
                        </div>
                    </div>
                </div>
            </div>
        `,
        settings: `
            <div class="settings-container">
                <div class="settings-header">
                    <div>
                        <h2>⚙️ Cài đặt</h2>
                        <p class="profile-subtitle">Tùy chỉnh trải nghiệm và bảo mật tài khoản.</p>
                    </div>
                </div>
                <div class="settings-section card-block">
                    <h3>🎨 Giao diện</h3>
                    <p>Chuyển đổi giữa giao diện sáng và tối để làm việc thoải mái hơn.</p>
                    <div class="setting-item">
                        <label class="toggle-label">
                            <span class="toggle-text">Chế độ tối</span>
                            <div class="toggle-switch">
                                <input type="checkbox" id="darkModeToggle" onchange="app.toggleDarkMode()">
                                <span class="toggle-slider"></span>
                            </div>
                        </label>
                    </div>
                </div>
                <div class="settings-section card-block">
                    <h3>🔐 Đổi mật khẩu</h3>
                    <p>Thay đổi mật khẩu định kỳ để bảo mật tài khoản tốt hơn.</p>
                    <form id="changePasswordForm" onsubmit="app.changePassword(event)">
                        <div class="form-row-single">
                            <input type="password" id="oldPassword" placeholder="Mật khẩu cũ" required>
                        </div>
                        <div class="form-row-single">
                            <input type="password" id="newPassword" placeholder="Mật khẩu mới" required>
                        </div>
                        <div class="form-row-single">
                            <input type="password" id="confirmPassword" placeholder="Xác nhận mật khẩu mới" required>
                        </div>
                        <button type="submit" class="auth-btn">Đổi mật khẩu</button>
                    </form>
                </div>
            </div>
        `
    },

    currentPage: 'dashboard',
    allTasks: [],

    init() {
        this.checkLogin();
        this.bindEvents();
        this.navigateTo('dashboard');
    },

    checkLogin() {
        const token = localStorage.getItem('token');
        if (!token && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
            window.location.href = 'login.html';
        }
    },

    bindEvents() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.navigateTo(page);
            });
        });
        
        document.getElementById('logoutBtn')?.addEventListener('click', () => {
            localStorage.removeItem('token');
            window.location.href = 'login.html';
        });
    },

    navigateTo(page) {
        this.currentPage = page;
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
        
        document.getElementById('mainContent').innerHTML = this.pages[page];
        
        if (page === 'dashboard') this.loadDashboard();
        if (page === 'tasks') this.loadTasks();
        if (page === 'profile') this.loadProfile();
        if (page === 'settings') this.loadSettings();
    },

    async loadDashboard() {
        console.log("Đang tải dữ liệu trang chủ...");
        try {
            this.allTasks = await apiRequest('/tasks');
            if (Array.isArray(this.allTasks)) {
                const todo = this.allTasks.filter(t => t.status === 'todo').length;
                const inProgress = this.allTasks.filter(t => t.status === 'in-progress').length;
                const done = this.allTasks.filter(t => t.status === 'done').length;
                
                const todoEl = document.getElementById('todoCount');
                const inProgressEl = document.getElementById('inProgressCount');
                const doneEl = document.getElementById('doneCount');
                
                if (todoEl) todoEl.innerText = todo;
                if (inProgressEl) inProgressEl.innerText = inProgress;
                if (doneEl) doneEl.innerText = done;
                
                this.filterDashboardTasks();
            } else {
                this.allTasks = [];
                this.renderTaskList([], 'recentTaskList');
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.allTasks = [];
            this.renderTaskList([], 'recentTaskList');
        }
    },

    filterDashboardTasks() {
        const query = document.getElementById('dashboardSearch')?.value.toLowerCase().trim() || '';
        let tasks = Array.isArray(this.allTasks) ? [...this.allTasks] : [];

        if (query) {
            tasks = tasks.filter(task => (task.title || '').toLowerCase().includes(query));
        }

        const recentTasks = tasks.slice(0, 5);
        this.renderTaskList(recentTasks, 'recentTaskList');
    },

    async loadTasks() {
        console.log("Đang tải danh sách task...");
        try {
            this.allTasks = await apiRequest('/tasks');
            if (Array.isArray(this.allTasks)) {
                this.updateTasksDisplay();
            } else {
                this.allTasks = [];
                this.updateTasksDisplay();
            }
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.allTasks = [];
        }
    },

    async loadProfile() {
        console.log("Đang tải thông tin tài khoản...");
        try {
            const user = await apiRequest('/auth/profile');
            if (user && !user.error) {
                document.getElementById('profileUsername').innerText = user.username || 'N/A';
                document.getElementById('profileEmail').innerText = user.email || 'N/A';
            } else {
                document.getElementById('profileUsername').innerText = 'Không thể tải';
                document.getElementById('profileEmail').innerText = 'Vui lòng đăng nhập lại';
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            document.getElementById('profileUsername').innerText = 'Lỗi kết nối';
            document.getElementById('profileEmail').innerText = 'Vui lòng kiểm tra server';
        }
    },

    loadSettings() {
        console.log("Đang tải cài đặt...");
        const darkMode = localStorage.getItem('darkMode') === 'true';
        document.getElementById('darkModeToggle').checked = darkMode;
    },

    toggleDarkMode() {
        const isDark = document.getElementById('darkModeToggle').checked;
        localStorage.setItem('darkMode', isDark);
        if (isDark) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    },

    async changePassword(e) {
        e.preventDefault();
        const newPass = document.getElementById('newPassword').value;
        const confirmPass = document.getElementById('confirmPassword').value;
        
        if (newPass !== confirmPass) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }
        
        try {
            const res = await apiRequest('/auth/change-password', 'POST', {
                old_password: document.getElementById('oldPassword').value,
                new_password: newPass
            });
            if (res && res.message) {
                alert(res.message);
                document.getElementById('changePasswordForm').reset();
            }
        } catch (error) {
            alert('Lỗi: ' + error.message);
        }
    },

    updateTasksDisplay() {
        const searchValue = document.getElementById('searchTask')?.value.toLowerCase() || '';
        const statusValue = document.getElementById('statusFilter')?.value || 'all';
        
        let filtered = [...this.allTasks];
        if (searchValue) {
            filtered = filtered.filter(t => t.title.toLowerCase().includes(searchValue));
        }
        if (statusValue !== 'all') {
            filtered = filtered.filter(t => t.status === statusValue);
        }
        
        this.renderTaskList(filtered, 'allTasksList');
        
        const totalEl = document.getElementById('totalTasks');
        const doneEl = document.getElementById('doneTasks');
        const inProgressEl = document.getElementById('inProgressTasks');
        
        if (totalEl) totalEl.innerText = this.allTasks.length;
        if (doneEl) doneEl.innerText = this.allTasks.filter(t => t.status === 'done').length;
        if (inProgressEl) inProgressEl.innerText = this.allTasks.filter(t => t.status === 'in-progress').length;
    },

    filterTasks() {
        this.updateTasksDisplay();
    },

    renderTaskList(tasks, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        if (!tasks || tasks.length === 0) {
            container.innerHTML = '<div class="empty-state">📭 Chưa có task nào</div>';
            return;
        }
        
        container.innerHTML = tasks.map(task => {
            const deadline = task.deadline ? new Date(task.deadline).toLocaleDateString('vi-VN') : 'Không có hạn';
            const statusText = task.status === 'done' ? '✅ Hoàn thành' : task.status === 'in-progress' ? '⏳ Đang làm' : '⏰ Chưa làm';
            return `
                <div class="task-item ${task.status === 'done' ? 'completed' : ''}" data-id="${task._id || task.id}">
                    <div class="task-info">
                        <strong>${this.escapeHtml(task.title)}</strong>
                        ${task.description ? `<small>${this.escapeHtml(task.description.substring(0, 80))}</small>` : ''}
                        <div class="task-meta">
                            <span class="deadline">📅 ${deadline}</span>
                            <span class="status-badge status-${task.status}">${statusText}</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="edit-task-btn" onclick="app.openEditTask('${task._id || task.id}')">✏️ Sửa</button>
                        <button class="delete-btn" onclick="app.deleteTask('${task._id || task.id}')">🗑️ Xóa</button>
                    </div>
                </div>
            `;
        }).join('');
    },

    openAddTask() {
        document.getElementById('modalTitle').innerText = '➕ Thêm Task mới';
        document.getElementById('taskForm').reset();
        document.getElementById('taskId').value = '';
        document.getElementById('taskModal').classList.add('show');
    },

    openEditTask(taskId) {
        const task = this.allTasks.find(t => (t._id || t.id) === taskId);
        if (task) {
            document.getElementById('modalTitle').innerText = '✏️ Sửa Task';
            document.getElementById('taskId').value = task._id || task.id;
            document.getElementById('taskTitle').value = task.title;
            document.getElementById('taskDesc').value = task.description || '';
            
            if (task.deadline) {
                const date = new Date(task.deadline);
                document.getElementById('taskDeadline').value = date.toISOString().slice(0, 16);
            }
            
            document.getElementById('taskStatus').value = task.status || 'todo';
            document.getElementById('taskModal').classList.add('show');
        }
    },

    async deleteTask(taskId) {
        if (!confirm('Bạn chắc chắn muốn xóa task này?')) return;
        
        try {
            const res = await apiRequest(`/tasks/${taskId}`, 'DELETE');
            if (res && res.message) {
                alert('Xóa thành công!');
                await this.loadTasks();
            }
        } catch (error) {
            alert('Lỗi: ' + error.message);
        }
    },

    escapeHtml(str) {
        if (!str) return '';
        return str.replace(/[&<>]/g, m => {
            if (m === '&') return '&amp;';
            if (m === '<') return '&lt;';
            if (m === '>') return '&gt;';
            return m;
        });
    }
};

document.addEventListener('DOMContentLoaded', () => app.init());

// Task form submit handler
document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const taskId = document.getElementById('taskId').value;
            const data = {
                title: document.getElementById('taskTitle').value,
                description: document.getElementById('taskDesc').value,
                deadline: document.getElementById('taskDeadline').value,
                status: document.getElementById('taskStatus').value
            };
            
            try {
                let res;
                if (taskId) {
                    res = await apiRequest(`/tasks/${taskId}`, 'PUT', data);
                } else {
                    res = await apiRequest('/tasks', 'POST', data);
                }
                
                if (res) {
                    alert(taskId ? 'Cập nhật thành công!' : 'Thêm task thành công!');
                    document.getElementById('taskModal').classList.remove('show');
                    await app.loadTasks();
                }
            } catch (error) {
                alert('Lỗi: ' + error.message);
            }
        });
    }
    
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('taskModal').classList.remove('show');
        });
    }
    
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('taskModal');
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});