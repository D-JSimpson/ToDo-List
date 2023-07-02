// TODO: FIX projectsContainer's Height

import "./style.css";
import "./projectForm.css";
import { events } from "./pubsub";
import { createTodo, createProject } from "./todo";
import displayProjectInputField from "./projectForm";

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
  events.emit("openInbox");
});
// Circle That Displays Todo Count
const colorCircle = document.createElement("span");
colorCircle.classList.add("colorCircle-Inbox");
colorCircle.style.backgroundColor = "white";
sideBarInbox.appendChild(colorCircle);

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

function initializeSetup() {
  let todo = createTodo(
    "Study",
    "Now",
    "2023-01-10",
    "Priority 1",
    projectHome
  );
  projectHome.addToDo(todo);
  events.emit("addTodo", todo);
  todo = createTodo(
    "Walk",
    "Gotta Exercise",
    "2023-02-28",
    "Priority 2",
    projectHome
  );
  projectHome.addToDo(todo);
  events.emit("addTodo", todo);
  todo = createTodo(
    "Dinner",
    "Make Dinner For Parents",
    "2023-04-21",
    "Priority 3",
    projectHome
  );
  projectHome.addToDo(todo);
  events.emit("addTodo", todo);
  todo = createTodo(
    "Job Hunt",
    "Send Out Applications",
    "2024-04-19",
    "Priority 4",
    projectHome
  );
  projectHome.addToDo(todo);
  events.emit("addTodo", todo);

  todo = createTodo(
    "Report",
    "Report Due On Friday",
    "2023-02-28",
    "Priority 2",
    projectWork
  );
  projectWork.addToDo(todo);
  events.emit("addTodo", todo);
  todo = createTodo(
    "Meeting",
    "Attend Meeting For New Feature",
    "2023-04-21",
    "Priority 3",
    projectWork
  );
  projectWork.addToDo(todo);
  events.emit("addTodo", todo);
  todo = createTodo(
    "Staples",
    "No More Staples In Stapler",
    "2024-04-19",
    "Priority 4",
    projectWork
  );
  projectWork.addToDo(todo);
  events.emit("addTodo", todo);

  events.emit("addProject", projectHome);
  events.emit("addProject", projectWork);
  events.emit("addProject", projectEducation);
}
// Not Funtional Right Now But,
// Planned To Have Check For storageProjectList In Local Storage
function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}
if (storageAvailable("localStorage")) {
  if (!localStorage.getItem("storageProjectList")) {
    initializeSetup();
  } else {
    // Grab Object From Local Storage
    const projectObject = JSON.parse(
      localStorage.getItem("storageProjectList")
    );
    // Get The Projects
    const projectList = Object.keys(projectObject);

    // For Each Project In Storage
    projectList.forEach((projectString) => {
      // Property Name On The Object Stored Is
      // Split Into Project Name And Color
      // Ex: Home#DC143C
      const hashtagPosition = projectString.lastIndexOf("#"); // Incase Hashtag Is In Projects Name Of User
      const color = projectString.substring(hashtagPosition);
      const projectName = projectString.substring(0, hashtagPosition);
      // Project Reverse Engineered From localStorage
      const projectGenerated = createProject(projectName, color);

      // The Object Of Todos
      const todoObject = projectObject[projectString];
      // Each Todo On The Object
      const todoList = Object.keys(projectObject[projectString]);

      todoList.forEach((todoString) => {
        // Array Of Infromation About The Todo
        const todoInfo = Object.values(todoObject[todoString]);

        // Set Information Using Whats In The Array
        // Always Same Order
        const taskName = todoString;
        const connectedProject = projectGenerated;
        const dueDate = todoInfo[1];
        const priority = todoInfo[2];
        const description = todoInfo[3];
        const completed = todoInfo[4];
        // Make The Todo
        const todoGenerated = createTodo(
          taskName,
          description,
          dueDate,
          priority,
          connectedProject
        );
        // On Creation The Completion Of A Todo Is Set To False
        // So If The Todo Was Done Toggle It To Complete
        if (completed === true) {
          todoGenerated.toggleComplete();
        }

        console.log(
          `${todoGenerated.getTask()} | ${todoGenerated.getDescription()} | ${todoGenerated.getDueDate()} | ${todoGenerated.getPriority()}  | ${todoGenerated.getProject()}`
        );
        // Add Todo To Correct Project
        projectGenerated.addToDo(todoGenerated);
        events.emit("addTodo", todoGenerated);
      });

      console.log();
      console.log(projectGenerated.getToDo());
      events.emit("addProject", projectGenerated);
    });
  }
}
