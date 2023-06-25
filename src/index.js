// TODO: FIX projectsContainer's Height

import "./style.css";
import "./projectForm.css";
import { events } from "./pubsub";
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
addProjects.addEventListener("click", getProjectInformation, false);

// Dummy content for site
const content = document.createElement("div");
const contentHome = document.createElement("div");
const homeAddProjectBtn = document.createElement("button");
// ID's and InnerText
content.id = "content";
content.classList.add("contentPushed");
contentHome.id = "contentHome";
contentHome.innerText = "Projects";
homeAddProjectBtn.innerText = "\u2795 Add Project";
homeAddProjectBtn.id = "homeAddProjectBtn";
// Functionality
homeAddProjectBtn.addEventListener("click", getProjectInformation, false);
// Append Children
contentHome.appendChild(homeAddProjectBtn);

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

// Add Project To The Sidebar and Page Using The Factory Function
const projectController = (() => {
  const addProjectToSideBar = (project) => {
    // Create Needed Elements
    const elem = document.createElement("a");
    const colorCircle = document.createElement("span");
    const name = document.createElement("span");
    // Functionality
    colorCircle.style.backgroundColor = project.getColor();
    name.innerText += project.getName();
    colorCircle.classList.add("colorCircle-P");
    // Append Together
    elem.appendChild(colorCircle);
    elem.appendChild(name);
    projectsContainer.appendChild(elem);
  };
  const deleteProject = () => {};
  // Delete pop up Made By addProjectToPage() When Needed
  const removeProjectOptions = (projectOptions, tools) => {
    // Clone Node To Remove Event Listeners Then Remove From Page
    const newElement = projectOptions.cloneNode(true);
    body.replaceChild(newElement, projectOptions);
    body.removeChild(newElement);
    tools.remove();
  };
  // Add the options themselves
  const addProjectOptions = (tools) => {
    // Create Needed Elements
    const optionsContainer = document.createElement("div");
    const addAbove = document.createElement("a");
    const addBelow = document.createElement("a");
    const edit = document.createElement("a");
    const remove = document.createElement("a");

    optionsContainer.id = "optionsContainer";
    // InnerText
    addAbove.innerText = "Add Above";
    addBelow.innerText = "Add Below";
    edit.innerText = "Edit Project";
    remove.innerText = "Remove Project";
    optionsContainer.append(addAbove, addBelow, edit, remove);
    tools.appendChild(optionsContainer);
  };
  const addProjectToPage = (project) => {
    // Create Needed Elements
    const pageProjectContainer = document.createElement("div");
    const elem = document.createElement("a");
    const colorCircle = document.createElement("span");
    const name = document.createElement("span");

    const ellipse = document.createElement("span");
    // Functionality
    pageProjectContainer.classList.add("pageProjectContainer");
    elem.classList.add("pageProject");
    colorCircle.classList.add("colorCircle-P");

    ellipse.classList.add("ellipse");
    name.innerText += project.getName();
    colorCircle.style.backgroundColor = project.getColor();

    // Open Project Options
    ellipse.innerText = "\u2026"; // An ellipse
    ellipse.addEventListener("click", () => {
      const projectOptionsBG = document.createElement("div"); // To Make Rest Of Webiste Unclickable
      const tools = document.createElement("div");
      // Functionality
      projectOptionsBG.classList.add("projectOptionsBG");
      tools.classList.add("tools");
      body.appendChild(projectOptionsBG);
      pageProjectContainer.appendChild(tools);
      // Add the orijects to reated box
      addProjectOptions(tools);
      // Checks If User Clicks Anywhere else on page to remove options
      projectOptionsBG.addEventListener("click", (event) => {
        const withinBoundaries = event.composedPath().includes(tools);
        console.log(event.composedPath());
        if (!withinBoundaries) removeProjectOptions(projectOptionsBG, tools);
      });
    });

    // Append Together
    elem.append(colorCircle, name);
    pageProjectContainer.append(elem, ellipse);
    content.appendChild(pageProjectContainer);
  };

  // Listen For Project Creation And Deletion
  events.on("addProject", addProjectToSideBar);
  events.on("addProject", addProjectToPage);
  events.on("deleteProject", deleteProject);
})();
// The Projects Themselves
const projectHome = createProject("Home", "#DC143C");
const projectWork = createProject("Work", "#00FF00");
const projectEducation = createProject("Education", "#FFD700");
events.emit("addProject", projectHome);
events.emit("addProject", projectWork);
events.emit("addProject", projectEducation);

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
// Hamburger In Top left
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
content.appendChild(contentHome);
sidbarButtonContainer.append(addProjects, openClose);
projectLabelContainer.append(projectLabel, sidbarButtonContainer);
mySidebar.append(projectLabelContainer, projectsContainer);
/*---------------*/
