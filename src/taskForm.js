import "./taskForm.css";

const body = document.querySelector("body");

// Delete Form Made By displayTaskInputField() When Needed
function removeTaskInputField(taskBackground) {
  // Clone Node To Remove Event Listeners Then Remove
  const newElement = taskBackground.cloneNode(true);
  body.replaceChild(newElement, taskBackground);
  body.removeChild(newElement);
}

export default function displayTaskInputField() {
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

  // Funtionality
  taskName.setAttribute("minlength", 1);
  taskName.setAttribute("maxlength", 20);
  taskName.toggleAttribute("required");
  taskName.setAttribute("placeholder", "Task Name");
  taskDescription.setAttribute("placeholder", "Description");
  dueDateBtn.setAttribute("type", "date");
  saveBtn.setAttribute("type", "submit");
  saveBtn.setAttribute("form", "taskForm");

  // Validation
  taskName.addEventListener("keyup", () => {
    // Check if the form fields are valid.
    if (taskName.validity.valid) {
      // If valid, enable submit button
      saveBtn.disabled = false;
    } else {
      // If not valid, disable submit button
      saveBtn.disabled = true;
    }
  });

  // When Form Submitted
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Unsure If Needed, But prevents Webpack Reloading The Page
    // projectFormSubmission(taskForm);
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
    "Priority",
    "Priority 1",
    "Priority 2",
    "Priority 3",
    "Priority 4",
  ];
  priorities.forEach((element) => {
    const option = document.createElement("option");
    option.innerText = element;
    selectPriority.appendChild(option);
  });
  // First Child Is Only A Label For The Select
  const PriorityLabel = Array.from(selectPriority.children)[0];
  PriorityLabel.toggleAttribute("disabled");

  // Append Everything Together
  taskForm.append(taskName, taskDescription);
  taskOptionsContainer.append(dueDateBtn, selectPriority, cancelBtn, saveBtn);
  taskUserInput.append(taskForm, taskOptionsContainer);
  taskBackground.appendChild(taskUserInput);
  body.appendChild(taskBackground);
}
