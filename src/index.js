// TODO: FIX projectsContainer's Height

import "./style.css";
import "./projectForm.css";
import { events } from "./pubsub";
import { createTodo, createProject } from "./todo";
import displayProjectInputField from "./projectForm";
import openInbox from "./openInbox";

const body = document.querySelector("body");

// Bars
const navBar = document.createElement("header");
navBar.id = "navBar";
const mySidebar = document.createElement("nav");
mySidebar.classList.add("sidebar");
mySidebar.classList.add("sidebarOpen");

// Inbox Where All The ToDos Will Be Kept
const sideBarInbox = document.createElement("div");
sideBarInbox.id = "sideBarInbox";
sideBarInbox.innerText = "ToDo Inbox";
sideBarInbox.title = "TODO INBOX";
sideBarInbox.addEventListener("click", () => {
  openInbox();
});

// Projects For the SideBar
// Label
const projectLabelContainer = document.createElement("section");
const projectLabel = document.createElement("span");
projectLabelContainer.id = "projectLabelContainer";
projectLabel.id = "projectLabel";
projectLabel.innerText = "PROJECTS";
projectLabel.title = "PROJECTS";
// Buttons For Projects
const sidbarButtonContainer = document.createElement("div");
const openClose = document.createElement("span");
const addProjects = document.createElement("span");

sidbarButtonContainer.id = "sidbarButtonContainer";
openClose.innerText = "\u142F"; //   -\u2796 | +\u2795 | downArrow \u142F
addProjects.innerText = "\u2795";
addProjects.title = "ADD PROJECTS";
openClose.title = "TOGGLE PROJECT LIST";

addProjects.addEventListener("click", displayProjectInputField, false);

// Dummy content for site
const content = document.createElement("main");
const contentHome = document.createElement("h1");
const homeAddProjectBtn = document.createElement("button");
// ID's and InnerText
content.id = "content";
content.classList.add("contentPushed");
contentHome.id = "contentHome";
contentHome.innerText = "Projects";
homeAddProjectBtn.innerText = "\u2795 Add Project";
homeAddProjectBtn.id = "homeAddProjectBtn";
// Functionality
homeAddProjectBtn.addEventListener("click", displayProjectInputField, false);
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
mySidebar.append(sideBarInbox, projectLabelContainer, projectsContainer);
/*---------------*/

require("./projectController");

// The Projects Themselves
const projectHome = createProject("Home", "#DC143C");
const projectWork = createProject("Work", "#00FF00");
const projectEducation = createProject("Education", "#FFD700");

let todo = createTodo("Study", "Now", "1/10/2023", "1");
projectHome.addToDo(todo);
todo = createTodo("Walk", "Gotta Exercise", "2/28/2023", "2");
projectHome.addToDo(todo);
todo = createTodo("Dinner", "Make Dinner For Parents", "4/21/2023", "3");
projectHome.addToDo(todo);
todo = createTodo("Job Hunt", "Send Out Applications", "4/19/2024", "4");
projectHome.addToDo(todo);

events.emit("addProject", projectHome);
events.emit("addProject", projectWork);
events.emit("addProject", projectEducation);

const p1 = createProject("P1", "#FFD700");
const t1 = createTodo("Study", "Now", "1/10/2023", "1");
p1.addToDo(t1);
console.log(p1.getToDo());
