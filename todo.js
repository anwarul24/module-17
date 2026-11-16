// Task 2: Todo app (state array + action functions + one render function)
let todos = [];

const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoError = document.getElementById("todoError");
const todoList = document.getElementById("todoList");
const todoStats = document.getElementById("todoStats");

// Shared helper (also used by api.js, which loads after this file)
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// --- State changes ---
function addTodo(title) {
  todos.push({ id: Date.now(), title, completed: false });
}

function toggleTodo(id) {
  todos = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
}

function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
}

// --- Rendering ---
function renderTodos() {
  const completed = todos.filter((t) => t.completed).length;
  todoStats.innerHTML =
    `<span>Total: <strong>${todos.length}</strong></span>` +
    `<span>Completed: <strong>${completed}</strong></span>` +
    `<span>Pending: <strong>${todos.length - completed}</strong></span>`;

  todoList.innerHTML = todos.length
    ? todos
        .map(
          (t) => `
      <li class="${t.completed ? "completed" : ""}" data-id="${t.id}">
        <input type="checkbox" data-action="toggle" ${t.completed ? "checked" : ""} aria-label="Mark as completed" style="width:auto">
        <span class="title">${escapeHtml(t.title)}</span>
        <button class="del" data-action="delete">Delete</button>
      </li>`
        )
        .join("")
    : '<li class="empty">No tasks yet. Add your first task above.</li>';
}

// --- Events ---
todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = todoInput.value.trim();
  if (!title) {
    todoError.textContent = "Task cannot be empty. Type something first.";
    todoError.hidden = false;
    return;
  }
  todoError.hidden = true;
  addTodo(title);
  todoInput.value = "";
  renderTodos();
});

todoList.addEventListener("click", (event) => {
  const action = event.target.dataset.action;
  const item = event.target.closest("li[data-id]");
  if (!action || !item) return;
  const id = Number(item.dataset.id);
  if (action === "toggle") toggleTodo(id);
  if (action === "delete") deleteTodo(id);
  renderTodos();
});

renderTodos();
