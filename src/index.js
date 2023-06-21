import "./style.css";
import "./projectForm.css";
import { createTodo, createProject } from "./todo";

const body = document.querySelector("body");

// Bars
const navBar = document.createElement("div");
navBar.id = "navBar";
const mySidebar = document.createElement("div");
mySidebar.classList.add("sidebar");
mySidebar.classList.add("sidebarOpen");

// Projects For the SideBar
// Label
const projectLabelContainer = document.createElement("div");
projectLabelContainer.id = "projectLabelContainer";
const projectLabel = document.createElement("span");
projectLabel.innerText = "PROJECTS";

// Buttons For Projects
const sidbarButtonContainer = document.createElement("div");
sidbarButtonContainer.id = "sidbarButtonContainer";
const openClose = document.createElement("span");
openClose.innerText = "\u142F"; //   -\u2796 | +\u2795 | downArrow \u142F

const addProjects = document.createElement("span");
addProjects.innerText = "\u2795";
function displayProjectInputField() {
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
  nameInput.toggleAttribute("required");
  colorsSelect.setAttribute("size", 5);
  save.setAttribute("type", "submit");
  save.setAttribute("form", "projectForm");

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

  // Append Everything Together
  nameInputLabel.append(nameInputSpan, nameInput);
  projectForm.append(nameInputLabel, colorsSelect);
  inputContainer.append(addProjectLabel, projectForm, buttonContainer);
  projectUserInput.append(inputContainer);
  buttonContainer.append(cancel, save);
  body.appendChild(projectUserInput);
}
function getProjectInformation() {
  displayProjectInputField();
}
function projectController() {
  getProjectInformation();
}
addProjects.addEventListener("click", projectController, false);
// Handles projects
const projectsContainer = document.createElement("div");
projectsContainer.id = "projectsContainer";
function collapeProjects(evt) {
  const el = evt.target;
  el.innerText === "\u142F"
    ? (el.innerText = "\u1438")
    : (el.innerText = "\u142F");
  projectsContainer.classList.toggle("projectsOpen");
}
openClose.addEventListener("click", collapeProjects, false);

projectsContainer.classList.add("projectsOpen");
const projectHome = document.createElement("a");
projectHome.innerText = "Home";
const projectWork = document.createElement("a");
projectWork.innerText = "Work";
const projectEducation = document.createElement("a");
projectEducation.innerText = "Education";

// Dummy content for site
const content = document.createElement("div");
content.id = "content";
content.classList.add("contentPushed");
const contentHome = document.createElement("div");
contentHome.innerText = "Projects";
const p = document.createElement("span");
p.innerText = "Content...";

/* Hamburger Switch Toggle Functions */
function handleClickEvent(evt) {
  const el = evt.target;
  /* eslint no-unused-expressions: ["error", { "allowTernary": true }] */
  el.getAttribute("aria-checked") === "true"
    ? el.setAttribute("aria-checked", "false")
    : el.setAttribute("aria-checked", "true");
  mySidebar.classList.toggle("sidebarOpen");
  content.classList.toggle("contentPushed");
}

/*--------------------------------------------*/
// Hamburger In Top Right
const sidebarHamburger = document.createElement("button");
sidebarHamburger.classList.add("openBtn");
sidebarHamburger.innerHTML = "&#9776";
sidebarHamburger.setAttribute("type", "button");
sidebarHamburger.setAttribute("role", "switch");
sidebarHamburger.setAttribute("aria-checked", "true");
sidebarHamburger.addEventListener("click", handleClickEvent, false);
// sidebarHamburger.addEventListener("click", handleClickEvent, false);

/* Append Children */
body.append(navBar, mySidebar, content);
navBar.appendChild(sidebarHamburger);
content.append(contentHome, p);
projectsContainer.append(projectHome, projectWork, projectEducation);
sidbarButtonContainer.append(addProjects, openClose);
projectLabelContainer.append(projectLabel, sidbarButtonContainer);
mySidebar.append(projectLabelContainer, projectsContainer);
/*---------------*/
