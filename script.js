console.log("To-Do List Started");

const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");

const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

const allBtn = document.getElementById("allBtn");
const completedBtn = document.getElementById("completedBtn");
const pendingBtn = document.getElementById("pendingBtn");

const darkModeBtn = document.getElementById("darkModeBtn");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

const categoryFilter = document.getElementById("categoryFilter");

const sortTasks = document.getElementById("sortTasks");

// Load App
loadTasks();

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    checkOverdueTasks();
}

// Save Tasks
function saveTasks() {
    localStorage.setItem("tasks", taskList.innerHTML);
    updateTaskStats();
    checkOverdueTasks();
}

// Update Stats + Progress
function updateTaskStats() {

    const tasks = document.querySelectorAll("#taskList li");
    const completed = document.querySelectorAll("#taskList .completed").length;
    const total = tasks.length;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = total - completed;

    let percentage = 0;

    if (total > 0) {
        percentage = Math.round((completed / total) * 100);
    }

    progressBar.style.width = percentage + "%";
    progressText.textContent = percentage + "% Complete";
}

// Load Tasks
function loadTasks() {

    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
        taskList.innerHTML = savedTasks;
        attachEvents();
    }

    updateTaskStats();
    checkOverdueTasks();
}



// Reattach Events
function attachEvents() {

    document.querySelectorAll("#taskList li").forEach(li => {

        const taskSpan = li.querySelector("span");
        const deleteBtn = li.querySelector("button");

        taskSpan.addEventListener("click", () => {
            taskSpan.classList.toggle("completed");
            saveTasks();
        });

        deleteBtn.addEventListener("click", () => {
            li.remove();
            saveTasks();
        });

    });

}

// Add Task
function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const li = document.createElement("li");

    const taskSpan = document.createElement("span");

      showToast("✅ Task Added");

    taskSpan.innerHTML = `
    ${taskText}

    <small class="due-date">
        📅 ${dueDate.value || "No Date"}
    </small>

    <small class="priority ${priority.value.toLowerCase()}">
        ${priority.value}
    </small>

    <small class="category">
        📂 ${category.value}
    </small>
`;

category.value = "Work";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";

    deleteBtn.addEventListener("click", () => {
        li.remove();
        saveTasks();
    });

    li.appendChild(taskSpan);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);

    taskInput.value = "";
    dueDate.value = "";
    priority.value = "Low";

    saveTasks();
}

// Add Button
addBtn.addEventListener("click", addTask);

// Enter Key
taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

// Search
searchInput.addEventListener("keyup", () => {

    const searchText = searchInput.value.toLowerCase();

    document.querySelectorAll("#taskList li").forEach(task => {

        const taskName = task.textContent.toLowerCase();

        if (taskName.includes(searchText)) {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }

    });

});

// All Filter
allBtn.addEventListener("click", () => {

    document.querySelectorAll("#taskList li").forEach(task => {
        task.style.display = "flex";
    });

});

// Completed Filter
completedBtn.addEventListener("click", () => {

    document.querySelectorAll("#taskList li").forEach(task => {

        const span = task.querySelector("span");

        if (span.classList.contains("completed")) {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }

    });

});

// Pending Filter
pendingBtn.addEventListener("click", () => {

    document.querySelectorAll("#taskList li").forEach(task => {

        const span = task.querySelector("span");

        if (!span.classList.contains("completed")) {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }

    });

});

// Dark Mode
darkModeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }

});

const clearAllBtn = document.getElementById("clearAllBtn");

clearAllBtn.addEventListener("click", () => {

    if(confirm("Delete all tasks?")){

        taskList.innerHTML = "";
        saveTasks();

    }

});


const exportBtn = document.getElementById("exportBtn");

exportBtn.addEventListener("click", () => {

    const tasks = document.querySelectorAll("#taskList li");

    let data = "My To-Do List\n\n";

    tasks.forEach((task, index) => {
        data += `${index + 1}. ${task.innerText}\n`;
    });

    const blob = new Blob([data], { type: "text/plain" });

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);
    a.download = "todo-list.txt";

    a.click();
});

function checkOverdueTasks() {

    const today = new Date();
     today.setHours(0,0,0,0);

    document.querySelectorAll("#taskList li").forEach(task => {

        const text = task.innerText;

        const match = text.match(/\d{4}-\d{2}-\d{2}/);

        if(match){

            const due = new Date(match[0]);
             due.setHours(0,0,0,0);

            const span = task.querySelector("span");

            if (due < today && !span.classList.contains("completed")) {
    task.classList.add("overdue");
} else {
         task.classList.remove("overdue");
}

        }

    });

}

categoryFilter.addEventListener("change", () => {

    const selected = categoryFilter.value;

    document.querySelectorAll("#taskList li").forEach(task => {

        if (selected === "All") {
            task.style.display = "flex";
            return;
        }

        const taskText = task.innerText;

        if (taskText.includes(selected)) {
            task.style.display = "flex";
        } else {
            task.style.display = "none";
        }

    });

});


sortTasks.addEventListener("change", () => {

    const tasks = Array.from(taskList.children);

    if (sortTasks.value === "az") {

        tasks.sort((a, b) => {
            return a.querySelector("span").innerText
                .localeCompare(b.querySelector("span").innerText);
        });

    } else if (sortTasks.value === "priority") {

        const order = {
            High: 1,
            Medium: 2,
            Low: 3
        };

        tasks.sort((a, b) => {

            const p1 = a.querySelector(".priority").innerText.trim();
            const p2 = b.querySelector(".priority").innerText.trim();

            return order[p1] - order[p2];

        });

    } else if (sortTasks.value === "date") {

        tasks.sort((a, b) => {

            const d1 = new Date(
                a.innerText.match(/\d{4}-\d{2}-\d{2}/)?.[0] || "9999-12-31"
            );

            const d2 = new Date(
                b.innerText.match(/\d{4}-\d{2}-\d{2}/)?.[0] || "9999-12-31"
            );

            return d1 - d2;

        });

    }

    taskList.innerHTML = "";

    tasks.forEach(task => taskList.appendChild(task));

    attachEvents();
    saveTasks();

});

function showToast(message){

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    },2000);

}

