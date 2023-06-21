import "./style.css";
import "./projectForm.css";
import { createTodo, createProject } from "./todo";
import displayProjectInputField from "./projectForm";

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

// The Projects Themselvesd
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
