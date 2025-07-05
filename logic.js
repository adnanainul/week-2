
        class TodoApp {
            constructor() {
                this.tasks = [];
                this.currentPriority = 'low';
                this.init();
            }

            init() {
                this.loadTasks();
                this.bindEvents();
                this.updateStats();
                this.toggleEmptyState();
            }

            bindEvents() {
                document.getElementById('addBtn').addEventListener('click', () => this.addTask());
                
                document.getElementById('taskInput').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.addTask();
                });

                document.querySelectorAll('.priority-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => this.setPriority(e.target.dataset.priority));
                });
            }

            setPriority(priority) {
                this.currentPriority = priority;
                document.querySelectorAll('.priority-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                document.querySelector(`[data-priority="${priority}"]`).classList.add('active');
            }

            addTask() {
                const taskInput = document.getElementById('taskInput');
                const taskText = taskInput.value.trim();

                if (taskText === '') {
                    alert('Please enter a task!');
                    return;
                }

                const task = {
                    id: Date.now(),
                    text: taskText,
                    completed: false,
                    priority: this.currentPriority,
                    createdAt: new Date().toLocaleDateString()
                };

                this.tasks.push(task);
                this.saveTasks();
                this.renderTasks();
                taskInput.value = '';
                this.updateStats();
                this.toggleEmptyState();
            }

            deleteTask(id) {
                if (confirm('Are you sure you want to delete this task?')) {
                    this.tasks = this.tasks.filter(task => task.id !== id);
                    this.saveTasks();
                    this.renderTasks();
                    this.updateStats();
                    this.toggleEmptyState();
                }
            }

            toggleTask(id) {
                const task = this.tasks.find(task => task.id === id);
                if (task) {
                    task.completed = !task.completed;
                    this.saveTasks();
                    this.renderTasks();
                    this.updateStats();
                }
            }

            renderTasks() {
                const taskList = document.getElementById('taskList');
                const emptyState = document.getElementById('emptyState');
                
                taskList.querySelectorAll('.task-item').forEach(item => item.remove());

                const sortedTasks = this.tasks.sort((a, b) => {
                    if (a.completed !== b.completed) {
                        return a.completed - b.completed;
                    }
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                });

                sortedTasks.forEach(task => {
                    const taskElement = this.createTaskElement(task);
                    taskList.appendChild(taskElement);
                });
            }

            createTaskElement(task) {
                const taskDiv = document.createElement('div');
                taskDiv.className = `task-item ${task.completed ? 'completed' : ''}`;
                
                taskDiv.innerHTML = `
                    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                    <span class="task-text">${task.text}</span>
                    <span class="task-priority priority-${task.priority}">${task.priority}</span>
                    <span class="task-date">${task.createdAt}</span>
                    <button class="delete-btn">Delete</button>
                `;

                taskDiv.querySelector('.task-checkbox').addEventListener('change', () => {
                    this.toggleTask(task.id);
                });

                taskDiv.querySelector('.delete-btn').addEventListener('click', () => {
                    this.deleteTask(task.id);
                });

                return taskDiv;
            }

            updateStats() {
                const totalTasks = this.tasks.length;
                const completedTasks = this.tasks.filter(task => task.completed).length;
                const pendingTasks = totalTasks - completedTasks;

                document.getElementById('totalTasks').textContent = totalTasks;
                document.getElementById('completedTasks').textContent = completedTasks;
                document.getElementById('pendingTasks').textContent = pendingTasks;
            }

            toggleEmptyState() {
                const emptyState = document.getElementById('emptyState');
                if (this.tasks.length === 0) {
                    emptyState.style.display = 'block';
                } else {
                    emptyState.style.display = 'none';
                }
            }

            saveTasks() {
                const tasksJson = JSON.stringify(this.tasks);
           
                this.storedTasks = tasksJson;
            }

            loadTasks() {
                this.tasks = [];
            }
        }
        document.addEventListener('DOMContentLoaded', () => {
            new TodoApp();
        });
    