let allTasks = [];

async function fetchTasks() {
    try {
        const res = await apiRequest('/tasks');
        allTasks = Array.isArray(res) ? res : [];
        return allTasks;
    } catch (error) {
        console.error('Fetch tasks error:', error);
        allTasks = [];
        return [];
    }
}

function renderTaskList(tasks, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn('Container not found:', containerId);
        return;
    }
    
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
                    <strong>${escapeHtml(task.title)}</strong>
                    ${task.description ? `<small>${escapeHtml(task.description.substring(0, 80))}</small>` : ''}
                    <div class="task-meta">
                        <span class="deadline">📅 ${deadline}</span>
                        <span class="status-badge status-${task.status}">
                            ${statusText}
                        </span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="edit-task-btn" onclick="event.stopPropagation(); openEditTask('${task._id || task.id}')">✏️ Sửa</button>
                    <button class="delete-btn" onclick="event.stopPropagation(); deleteTask('${task._id || task.id}')">🗑️ Xóa</button>
                </div>
            </div>
        `;
    }).join('');
}

async function initTasksPage() {
    await fetchTasks();
    updateTasksDisplay();
}

function updateTasksDisplay() {
    const searchValue = document.getElementById('searchTask')?.value.toLowerCase() || '';
    const statusValue = document.getElementById('statusFilter')?.value || 'all';
    
    let filtered = [...allTasks];
    if (searchValue) {
        filtered = filtered.filter(t => t.title.toLowerCase().includes(searchValue));
    }
    if (statusValue !== 'all') {
        filtered = filtered.filter(t => t.status === statusValue);
    }
    
    renderTaskList(filtered, 'allTasksList');
    
    // Cập nhật thống kê
    const totalEl = document.getElementById('totalTasks');
    const doneEl = document.getElementById('doneTasks');
    const inProgressEl = document.getElementById('inProgressTasks');
    
    if (totalEl) totalEl.innerText = allTasks.length;
    if (doneEl) doneEl.innerText = allTasks.filter(t => t.status === 'done').length;
    if (inProgressEl) inProgressEl.innerText = allTasks.filter(t => t.status === 'in-progress').length;
}

function filterTasks() {
    updateTasksDisplay();
}

function openAddTask() {
    const modal = document.getElementById('taskModal');
    if (!modal) return;
    
    document.getElementById('modalTitle').innerText = '➕ Thêm Task mới';
    document.getElementById('taskForm').reset();
    document.getElementById('taskId').value = '';
    modal.classList.add('show');
}

async function openEditTask(taskId) {
    const task = allTasks.find(t => (t._id || t.id) === taskId);
    if (task) {
        document.getElementById('modalTitle').innerText = '✏️ Sửa Task';
        document.getElementById('taskId').value = task._id || task.id;
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDesc').value = task.description || '';
        
        if (task.deadline) {
            const date = new Date(task.deadline);
            const isoString = date.toISOString().slice(0, 16);
            document.getElementById('taskDeadline').value = isoString;
        } else {
            document.getElementById('taskDeadline').value = '';
        }
        
        document.getElementById('taskStatus').value = task.status || 'todo';
        document.getElementById('taskModal').classList.add('show');
    }
}

async function deleteTask(taskId) {
    if (!confirm('Bạn chắc chắn muốn xóa task này?')) return;
    
    try {
        const res = await apiRequest(`/tasks/${taskId}`, 'DELETE');
        if (res && res.message) {
            alert('Xóa thành công!');
            await fetchTasks();
            updateTasksDisplay();
        } else {
            alert('Lỗi khi xóa task');
        }
    } catch (error) {
        alert('Lỗi: ' + error.message);
    }
}

// Submit form task
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
                    await fetchTasks();
                    if (currentPage === 'dashboard' && typeof initDashboard === 'function') {
                        initDashboard();
                    } else if (currentPage === 'tasks') {
                        updateTasksDisplay();
                    }
                } else {
                    alert('Lỗi: Không thể lưu task');
                }
            } catch (error) {
                alert('Lỗi: ' + error.message);
            }
        });
    }
    
    // Đóng modal
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('taskModal').classList.remove('show');
        });
    }
    
    // Click outside modal
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('taskModal');
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}