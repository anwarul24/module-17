// Task 3 + 4: API integration and dynamic rendering
const API_URL = "https://jsonplaceholder.typicode.com/todos";

let apiTodos = [];
let currentFilter = "all";
let searchTerm = "";

const apiList = document.getElementById("apiList");
const apiStatus = document.getElementById("apiStatus");
const refreshBtn = document.getElementById("refreshBtn");
const searchInput = document.getElementById("searchInput");

// --- Fetching ---
async function fetchTodos() {
  apiStatus.className = "msg";
  apiStatus.textContent = "Loading todos...";
  apiList.innerHTML = "";
  refreshBtn.disabled = true;

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
    apiTodos = await response.json();
    apiStatus.textContent = "";
    renderApiTodos();
  } catch (error) {
    apiTodos = [];
    apiStatus.className = "msg error";
    apiStatus.textContent = `Could not load todos: ${error.message}. Check your connection and press Refresh.`;
  } finally {
    refreshBtn.disabled = false;
  }
}

// --- Filtering ---
function getVisibleTodos() {
  return apiTodos.filter((todo) => {
    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "completed" ? todo.completed : !todo.completed);
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });
}

// --- Rendering ---
function renderApiTodos() {
  const visible = getVisibleTodos();
  apiList.innerHTML = visible.length
    ? visible
        .map(
          (todo) => `
      <li class="${todo.completed ? "completed" : ""}">
        <small>#${todo.id}</small>
        <span class="title">${escapeHtml(todo.title)}</span>
        <span class="badge ${todo.completed ? "completed" : "pending"}">${todo.completed ? "Completed" : "Pending"}</span>
      </li>`
        )
        .join("")
    : '<li class="empty">No todos match this view.</li>';
}

// --- Events ---
document.getElementById("api-section").addEventListener("click", (event) => {
  const filter = event.target.dataset.filter;
  if (!filter) return;
  currentFilter = filter;
  document.querySelectorAll(".filter").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });
  renderApiTodos();
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  renderApiTodos();
});

refreshBtn.addEventListener("click", fetchTodos);

fetchTodos();
