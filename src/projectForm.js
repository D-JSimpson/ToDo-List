import { createProject } from "./todo";
import { events } from "./pubsub";

const body = document.querySelector("body");

// Delete Form Made By displayProjectInputField() When Needed
function removeProjectInputField(projectUserInput) {
  // Clone Node To Remove Event Listeners Then Remove
  const newElement = projectUserInput.cloneNode(true);
  body.replaceChild(newElement, projectUserInput);
  body.removeChild(newElement);
}

// Handles When the User Submits the Project Form
function projectFormSubmission(form) {
  const name = form.elements.nameInput.value;
  const color = form.elements.colorsSelect.value;
  const newProject = createProject(name, color);
  events.emit("addProject", newProject);
}

export default function displayProjectInputField() {
  // Create Necessary Elements
  const projectUserInput = document.createElement("div");
  const inputContainer = document.createElement("div");
  const addProjectLabel = document.createElement("span");
  const nameInput = document.createElement("input");
  const nameInputLabel = document.createElement("label");
  const nameInputSpan = document.createElement("span");
  const projectForm = document.createElement("form");
  const colorsSelect = document.createElement("select");
  const buttonContainer = document.createElement("div");
  const cancel = document.createElement("button");
  const save = document.createElement("button");

  // Give Them IDs
  projectUserInput.id = "projectUserInput";
  inputContainer.id = "inputContainer";
  addProjectLabel.id = "addProjectLabel";
  buttonContainer.id = "buttonContainer";
  nameInputLabel.id = "nameInputLabel";
  nameInput.id = "nameInput";
  nameInputSpan.id = "nameInputSpan";
  projectForm.id = "projectForm";
  colorsSelect.id = "colorsSelect";

  // InnerText And Classes
  addProjectLabel.innerText = "Add Project";
  nameInputSpan.innerText = "NAME:";
  cancel.innerText = "CANCEL";
  save.innerText = "SAVE";
  cancel.classList.add("cancel");
  save.classList.add("save");
  save.disabled = true;

  // Funtionality
  nameInputLabel.setAttribute("for", "nameInput");
  nameInput.setAttribute("minlength", 1);
  nameInput.setAttribute("maxlength", 20);
  nameInput.toggleAttribute("required");
  colorsSelect.setAttribute("size", 5);
  save.setAttribute("type", "submit");
  save.setAttribute("form", "projectForm");
  // When Form Submitted
  projectForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Unsure If Needed, But prevents Webpack Reloading The Page
    projectFormSubmission(projectForm);
    removeProjectInputField(projectUserInput);
  });
  nameInput.addEventListener("keyup", () => {
    // Check if the form fields are valid.
    if (nameInput.validity.valid) {
      // If valid, enable submit button
      save.disabled = false;
    } else {
      // If valid, disable submit button
      save.disabled = true;
    }
  });
  // Checks If User Clicks Out Of Project Form
  projectUserInput.addEventListener("click", (event) => {
    const withinBoundaries = event.composedPath().includes(inputContainer);
    if (!withinBoundaries) removeProjectInputField(projectUserInput);
  });
  // Can Not Call removeProjectInputField() For Some Reason
  cancel.addEventListener("click", () => {
    body.removeChild(projectUserInput);
  });

  // Colors For The Selector
  const colors = [
    { Crimson: "#DC143C" },
    { Coral: "#FF7F50" },
    { Gold: "#FFD700" },
    { Lime: "#00FF00" },
    { Aqua: "#00FFFF" },
    { RoyalBlue: "#4169E1" },
    { Violet: "#EE82EE" },
    { Siena: "#A0522D" },
    { Lavender: "#E6E6FA" },
    { HoneyDew: "#F0FFF0" },
    { Black: "#000000" },
  ];
  colors.forEach((element) => {
    const option = document.createElement("option");
    const colorCircle = document.createElement("span");
    const [val] = Object.values(element);
    const [key] = Object.keys(element);
    option.classList.add("option");
    option.value = val;
    option.innerText = key;
    colorCircle.classList.add("colorCircle");
    colorCircle.style.backgroundColor = val;

    option.appendChild(colorCircle);
    colorsSelect.appendChild(option);
  });
  colorsSelect.firstChild.selected = true; // Default Value

  // Append Everything Together
  nameInputLabel.append(nameInputSpan, nameInput);
  projectForm.append(nameInputLabel, colorsSelect);
  inputContainer.append(addProjectLabel, projectForm, buttonContainer);
  projectUserInput.append(inputContainer);
  buttonContainer.append(cancel, save);
  body.appendChild(projectUserInput);
}
