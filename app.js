const form = document.getElementById("todoForm");
const input = document.getElementById("todoInput");
const list = document.getElementById("todoList");
const counter = document.getElementById("counter");
const clearDoneBtn = document.getElementById("clearDone");

const STORAGE_KEY = "mini-webapp-todos";

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

let todos = loadTodos();

function render() {
  list.innerHTML = "";

  for (const t of todos) {
    const li = document.createElement("li");
    li.className = "item" + (t.done ? " done" : "");

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = t.done;
    cb.addEventListener("change", () => {
      t.done = cb.checked;
      saveTodos(todos);
      render();
    });

    const span = document.createElement("span");
    span.className = "text";
    span.textContent = t.text;

    const del = document.createElement("button");
    del.className = "delete";
    del.type = "button";
    del.textContent = "Borrar";
    del.addEventListener("click", () => {
      todos = todos.filter(x => x.id !== t.id);
      saveTodos(todos);
      render();
    });

    li.append(cb, span, del);
    list.appendChild(li);
  }

  const pending = todos.filter(t => !t.done).length;
  counter.textContent = `${pending} pendiente${pending === 1 ? "" : "s"}`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.unshift({ id: crypto.randomUUID(), text, done: false });
  input.value = "";
  saveTodos(todos);
  render();
});

clearDoneBtn.addEventListener("click", () => {
  todos = todos.filter(t => !t.done);
  saveTodos(todos);
  render();
});

render();