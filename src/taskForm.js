import { events } from "./pubsub";
import "./taskForm.css";
import { createTodo } from "./todo";

require("./todoController");

const body = document.querySelector("body");

// Delete Form Made By displayTaskInputField() When Needed
function removeTaskInputField(taskBackground) {
  // Clone Node To Remove Event Listeners Then Remove
  const newElement = taskBackground.cloneNode(true);
  body.replaceChild(newElement, taskBackground);
  body.removeChild(newElement);
}

// Handles When the User Submits the Project Form
function taskFormSubmission(taskForm, project, toDo) {
  const taskName = taskForm.elements.taskName.value;
  const taskDescription = taskForm.elements.taskDescription.value;
  const dueDate = taskForm.elements.dueDate.value;
  const selectPriority = taskForm.elements.selectPriority.value;
  const newTodo = createTodo(
    taskName,
    taskDescription,
    dueDate,
    selectPriority,
    project
  );
  // This Part Of The Function Is For Editing Todos
  // toDo will undefined when called by addTodoBtn
  // But not when called by editIcon
  if (toDo !== undefined) {
    project.removeToDo(toDo);
    events.emit("removeToDo", toDo);
  }
  // Link And Update
  project.addToDo(newTodo);
  events.emit("addTodo", newTodo);
  events.emit("updateTodo", project);
  events.emit("updateProjectTodoCount", project);
}

export default function displayTaskInputField(project, toDo) {
  // Create Necessary Elements
  const taskBackground = document.createElement("div");
  const taskUserInput = document.createElement("div");
  const taskForm = document.createElement("form");
  const taskName = document.createElement("input");
  const taskDescription = document.createElement("textarea");
  const dueDateBtn = document.createElement("input");
  const selectPriority = document.createElement("select");
  const taskOptionsContainer = document.createElement("div");
  const cancelBtn = document.createElement("button");
  const saveBtn = document.createElement("button");

  // Give Them IDs
  taskBackground.id = "taskBackground";
  taskUserInput.id = "taskUserInput";
  taskForm.id = "taskForm";
  taskName.id = "taskName";
  taskDescription.id = "taskDescription";
  dueDateBtn.id = "dueDate";
  selectPriority.id = "selectPriority";
  taskOptionsContainer.id = "taskOptionsContainer";

  // InnerText And Classes
  cancelBtn.innerText = "CANCEL";
  saveBtn.innerText = "SAVE";
  cancelBtn.classList.add("cancelBtn");
  saveBtn.classList.add("saveBtn");
  saveBtn.disabled = true;
  dueDateBtn.innerText = "mm/dd/yyyy";
  // Funtionality
  taskName.setAttribute("minlength", 1);
  taskName.setAttribute("maxlength", 20);
  taskName.setAttribute("placeholder", "Task Name");
  taskDescription.setAttribute("minlength", 1);
  taskDescription.setAttribute("placeholder", "Description");
  dueDateBtn.setAttribute("type", "date");
  saveBtn.setAttribute("type", "submit");
  saveBtn.setAttribute("form", "taskForm");
  saveBtn.setAttribute("title", "Fill Out All Fields");

  // Require Everything
  taskName.toggleAttribute("required");
  taskDescription.toggleAttribute("required");
  dueDateBtn.toggleAttribute("required");
  selectPriority.toggleAttribute("required");

  // Function To Check If Everything Is Valid
  function checkValidation() {
    if (
      taskName.validity.valid &&
      taskDescription.validity.valid &&
      dueDateBtn.validity.valid &&
      selectPriority.value !== "Priority?" // The Default Value
    ) {
      saveBtn.disabled = false;
    } else {
      saveBtn.disabled = true;
    }
  }

  // Validation
  taskName.addEventListener("keyup", () => {
    // Check if the form fields are valid.
    if (taskName.validity.valid) {
      taskName.classList.remove("Invalid");
      checkValidation();
    } else {
      // If not valid add invalid class to highlight red
      taskName.classList.add("Invalid");
      // Will Disable Sumbit Button
      checkValidation();
    }
  });

  // At least One Character In Description
  taskDescription.addEventListener("keyup", () => {
    // Check if the form fields are valid.
    if (taskDescription.validity.valid) {
      taskDescription.classList.remove("Invalid");
      checkValidation();
    } else {
      // If not valid add invalid class to highlight red
      taskDescription.classList.add("Invalid");
      // Will Disable Sumbit Button
      checkValidation();
    }
  });
  // A Date Selected
  dueDateBtn.addEventListener("change", () => {
    // Check if the form fields are valid.
    if (dueDateBtn.validity.valid) {
      dueDateBtn.classList.remove("Invalid");
      checkValidation();
    } else {
      // If not valid add invalid class to highlight red
      dueDateBtn.classList.add("Invalid");
      // Will Disable Sumbit Button
      checkValidation();
    }
  });
  // A Priority Selected
  // Once A Priority Is Selected It Can No Longer Go To Default
  // So No Need To Verify In The Same Fashion
  selectPriority.addEventListener("change", () => {
    // Check if the other form fields are valid.
    checkValidation();
  });

  // When Form Submitted
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Unsure If Needed, But prevents Webpack Reloading The Page
    taskFormSubmission(taskForm, project, toDo);
    removeTaskInputField(taskBackground);
  });
  // Checks If User Clicks Out Of Project Form
  taskBackground.addEventListener("click", (event) => {
    const withinBoundaries = event.composedPath().includes(taskUserInput);
    if (!withinBoundaries) removeTaskInputField(taskBackground);
  });
  // Can Not Call removeTaskInputField() For Some Reason
  cancelBtn.addEventListener("click", () => {
    body.removeChild(taskBackground);
  });

  // Create Priority Options
  const priorities = [
    "Priority?",
    "Priority 1",
    "Priority 2",
    "Priority 3",
    "Priority 4",
  ];
  priorities.forEach((element) => {
    const option = document.createElement("option");
    option.innerText = element;
    option.value = element;
    selectPriority.appendChild(option);
  });
  // First Child Is Only A Label For The Select
  const PriorityLabel = Array.from(selectPriority.children)[0];
  PriorityLabel.toggleAttribute("disabled");

  // This Part Of The Function Is For Editing Todos
  // toDo will undefined when called by addTodoBtn
  // But not when called by editIcon
  if (toDo !== undefined) {
    taskName.value = toDo.getTask();
    taskDescription.value = toDo.getDescription();
    dueDateBtn.value = toDo.getDueDate();
    selectPriority.value = toDo.getPriority();
  }

  // Append Everything Together
  taskForm.append(taskName, taskDescription, taskOptionsContainer);
  taskOptionsContainer.append(dueDateBtn, selectPriority, cancelBtn, saveBtn);
  taskUserInput.appendChild(taskForm);
  taskBackground.appendChild(taskUserInput);
  body.appendChild(taskBackground);
}
