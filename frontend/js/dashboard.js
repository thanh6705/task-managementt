async function initDashboard() {
    try {
        const tasks = await fetchTasks();
        
        const done = tasks.filter(t => t.status === 'done').length;
        const inProgress = tasks.filter(t => t.status === 'in-progress').length;
        const todo = tasks.filter(t => t.status === 'todo').length;
        const recentTasks = tasks.slice(0, 5);
        
        const doneEl = document.getElementById('completedCount');
        const inProgressEl = document.getElementById('inProgressCount');
        const todoEl = document.getElementById('pendingCount');
        
        if (doneEl) doneEl.innerText = done;
        if (inProgressEl) inProgressEl.innerText = inProgress;
        if (todoEl) todoEl.innerText = todo;
        
        renderTaskList(recentTasks, 'recentTasksList');
        
        // Avatar click
        const avatarBtn = document.getElementById('avatarBtn');
        if (avatarBtn) {
            avatarBtn.addEventListener('click', () => loadPage('profile'));
        }
    } catch (error) {
        console.error('Dashboard init error:', error);
    }
}