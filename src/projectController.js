import { events } from "./pubsub";
import displayProjectInputField from "./projectForm";
import projectModule from "./projectModule";
import "./projectController.css";
import "./projectForm.css";

const body = document.querySelector("body");
const content = document.getElementById("content");
const contentHome = document.getElementById("contentHome");
const projectLabel = document.getElementById("projectLabel");
const projectsContainer = document.getElementById("projectsContainer");

// Go To The Home For All Projects
projectLabel.addEventListener("click", () => {
  events.emit("clearOperations");
  events.emit("render");
});
// Add Project To The Sidebar and Page Using The Factory Function
const projectController = (() => {
  const projectList = [];
  let addOperation = "";
  let addLocation = -1;

  const reOrderProjects = () => {
    // Perform Correct Operation
    // Based On Project Option Pressed
    switch (addOperation) {
      case "addAbove":
        projectList.splice(addLocation - 1, 0, projectList.pop());
        // Reset Last Action To Nothing
        addOperation = "";
        addLocation = -1;
        break;
      case "addBelow":
        projectList.splice(addLocation, 0, projectList.pop());
        // Reset Last Action To Nothing
        addOperation = "";
        addLocation = -1;
        break;
      case "edit": {
        const newProject = projectList.pop();
        newProject.clone(newProject, projectList[addLocation - 1]);
        projectList.splice(addLocation - 1, 1, newProject);
        // Reset Last Action To Nothing
        addOperation = "";
        addLocation = -1;
        break;
      }
      case "remove":
        projectList.splice(addLocation - 1, 1);
        // Reset Last Action To Nothing
        addOperation = "";
        addLocation = -1;
        break;
      default:
        break;
    }
  };
  // Rerender All Projects Performing The Correct Operation,
  // Only Used For Project Options, Otherwise Does Nothing
  const renderSideBar = () => {
    // Remove All Projects From Sidebar
    projectsContainer.replaceChildren();
    // Reorder All The Projects
    reOrderProjects();
    // Then Add Them Back So The Ordering Is Correct
    projectList.forEach((prjct) => {
      events.emit("addProjectSidebarOnly", prjct);
      projectList.pop(); // updateProjectList Will Add Duplicates, So Remove Them
    });
  };
  const render = () => {
    // Remove All Projects From Content Home
    content.replaceChildren(contentHome);
    // Remove All Projects From Sidebar
    projectsContainer.replaceChildren();
    // Reorder All The Projects
    reOrderProjects();
    // Then Add Them Back So The Ordering Is Correct
    // Currently Rerenders When Not Needed: Project Added to End
    projectList.forEach((prjct) => {
      events.emit("addProject", prjct);
      projectList.pop(); // updateProjectList Will Add Duplicates, So Remove Them
    });
  };
  const addProjectToSideBar = (project) => {
    // Create Needed Elements
    const elem = document.createElement("a");
    const colorCircle = document.createElement("span");
    const todoCount = document.createElement("span");
    const name = document.createElement("span");
    // Functionality
    colorCircle.style.backgroundColor = project.getColor();
    name.innerText += project.getName();
    elem.title = project.getName();
    colorCircle.classList.add("colorCircle-P");

    // Set Todo Count Of The Project
    // Based On What Completed
    const todoList = project.getToDo();
    let completeCtr = 0;
    todoList.forEach((toDo) => {
      if (toDo.getStatus() !== true) {
        completeCtr += 1;
      }
    });
    todoCount.innerText = completeCtr;

    // Go To The Project's ToDos
    elem.addEventListener("click", () => {
      projectModule(project);
    });

    // Append Together
    colorCircle.appendChild(todoCount);
    elem.appendChild(colorCircle);
    elem.appendChild(name);
    projectsContainer.appendChild(elem);
  };
  // Delete pop up Made By addProjectToPage() When Needed
  const removeProjectOptions = (projectOptions, tools) => {
    // Clone Node To Remove Event Listeners Then Remove From Page
    const newElement = projectOptions.cloneNode(true);
    body.replaceChild(newElement, projectOptions);
    body.removeChild(newElement);
    tools.remove();
  };
  const optionEventListeners = (operation, tools, element) => {
    // Get project Of Option Clicked
    const project = element.parentElement.parentElement.parentElement;
    // Get Position
    const index = Array.from(content.children).indexOf(project);
    // Get Rid Of BG Disabling Page As Well As The Options
    const projectOptionsBG = document.querySelector(".projectOptionsBG");
    removeProjectOptions(projectOptionsBG, tools);
    // Change These So That When Render Is Called The Correct Operation Is Performed
    addOperation = operation;
    addLocation = index;

    // Perform Needed Action Based On Button Clicked
    if (operation === "remove")
      events.emit("render"); // Will Have To Rerender If Removing
    else if (operation === "edit") {
      // Pass The Project Clicked To Display Its Information
      const prjct = projectList[addLocation - 1];
      displayProjectInputField(prjct);
    } else {
      // Get Project Information From User
      displayProjectInputField();
    }
  };
  // Add the options themselves
  const addProjectOptions = (tools) => {
    // Create Needed Elements
    const optionsContainer = document.createElement("div");
    const addAbove = document.createElement("a");
    const addBelow = document.createElement("a");
    const edit = document.createElement("a");
    const remove = document.createElement("a");

    // Functionality
    addAbove.addEventListener("click", () =>
      optionEventListeners("addAbove", tools, addAbove)
    );
    addBelow.addEventListener("click", () =>
      optionEventListeners("addBelow", tools, addBelow)
    );
    edit.addEventListener("click", () =>
      optionEventListeners("edit", tools, edit)
    );
    remove.addEventListener("click", () =>
      optionEventListeners("remove", tools, remove)
    );
    // InnerText and ID
    optionsContainer.id = "optionsContainer";
    addAbove.innerText = "Add Above";
    addBelow.innerText = "Add Below";
    edit.innerText = "Edit Project";
    remove.innerText = "Remove Project";
    optionsContainer.append(addAbove, addBelow, edit, remove);
    tools.appendChild(optionsContainer);
  };
  const createOptionsBox = (pageProjectContainer) => {
    const projectOptionsBG = document.createElement("div"); // To Make Rest Of Webiste Unclickable
    const tools = document.createElement("div");
    // Functionality
    projectOptionsBG.classList.add("projectOptionsBG");
    tools.classList.add("tools");
    body.appendChild(projectOptionsBG);
    pageProjectContainer.appendChild(tools);
    // Add the options to created box
    addProjectOptions(tools);
    // Checks If User Clicks Anywhere else on page to remove options
    projectOptionsBG.addEventListener("click", (event) => {
      const withinBoundaries = event.composedPath().includes(tools);
      if (!withinBoundaries) removeProjectOptions(projectOptionsBG, tools);
    });
  };
  const addProjectToPage = (project) => {
    // Create Needed Elements
    const pageProjectContainer = document.createElement("div");
    const elem = document.createElement("a");
    const colorCircle = document.createElement("span");
    const name = document.createElement("span");
    const ellipse = document.createElement("span");

    // Classes
    pageProjectContainer.classList.add("pageProjectContainer");
    elem.classList.add("pageProject");
    colorCircle.classList.add("colorCircle-P");
    ellipse.classList.add("ellipse");

    // Get Project Info
    name.innerText += project.getName();
    colorCircle.style.backgroundColor = project.getColor();

    // Functionality
    // Go To The Project's ToDos
    elem.addEventListener("click", () => {
      projectModule(project);
    });
    // Open Project Options
    ellipse.innerText = "\u2026"; // An ellipse
    ellipse.title = "PROJECT OPTIONS";
    ellipse.addEventListener("click", () =>
      createOptionsBox(pageProjectContainer)
    );

    // Append Together
    elem.append(colorCircle, name);
    pageProjectContainer.append(elem, ellipse);
    content.appendChild(pageProjectContainer);
  };
  const updateProjectList = (project) => {
    projectList.push(project);
  };
  const updateProjectTodoCount = (project) => {
    // Update Todo Count On A Project
    // Perform Operations To Get Color Circle
    // Of Selected Project
    const listPosition = projectList.indexOf(project);
    const container = document.querySelector("#projectsContainer");
    const projectElement = Array.from(container.children)[listPosition];
    const colorCircle = projectElement.firstChild;

    const todoList = project.getToDo();
    let completeCtr = 0;
    todoList.forEach((toDo) => {
      if (toDo.getStatus() !== true) {
        completeCtr += 1;
      }
    });
    colorCircle.innerText = completeCtr;
  };
  const updateLocalStorage = () => {
    // Represent The Configuration Of Current Project And Todo Setup
    // This Is Gonna Be An Obeject Of Objects
    // Each Project Is A Property With An Object As Its Value
    // Then Inside That Object Value Is Another Object With A Single Property
    // That Property Is The Todos Name
    // That Todo Will Have An Object As Its Value
    // And Finally Those Properties Are The Todos Information
    const storageProjectList = {};
    projectList.forEach((project) => {
      const projectName = project.getName();
      const projectNameAndColor = project.getName() + project.getColor();
      const todoList = project.getToDo();
      const todoObject = {};

      // Set A Property On todoObject For Each Todo
      todoList.forEach((todo) => {
        // Infromation About The Todo
        const info = {};
        const connectedProject = projectName;
        const dueDate = todo.getDueDate();
        const priority = todo.getPriority();
        const description = todo.getDescription();
        const status = todo.getStatus();
        // Store In An Object
        Object.defineProperties(info, {
          Project: {
            value: connectedProject,
            enumerable: true,
            writable: true,
          },
          DueDate: {
            value: dueDate,
            enumerable: true,
            writable: true,
          },
          Priority: {
            value: priority,
            enumerable: true,
            writable: true,
          },
          Description: {
            value: description,
            enumerable: true,
            writable: true,
          },
          Status: {
            value: status,
            enumerable: true,
            writable: true,
          },
        });

        //  console.log(`Keys: ${Object.keys(info)}`);
        // Use Todos Name To Set Property
        // Pass Information Related To The Task
        const taskName = todo.getTask();
        Object.defineProperty(todoObject, taskName, {
          value: info,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      });

      Object.defineProperty(storageProjectList, projectNameAndColor, {
        value: todoObject,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    });

    // Put Into Local Storage
    localStorage.setItem(
      "storageProjectList",
      JSON.stringify(storageProjectList)
    );
    // Check What Is Stored
    // const projects = JSON.parse(localStorage.getItem("storageProjectList"));
    // console.log(projects);
  };
  const clearOperations = () => {
    addOperation = "";
  };
  // Listen For Project Creation And Deletion
  events.on("addProject", addProjectToSideBar);
  events.on("addProject", addProjectToPage);
  events.on("addProject", updateProjectList);

  // Will Probably Create New events For These
  events.on("addProject", updateLocalStorage);
  events.on("addProjectSidebarOnly", updateLocalStorage);
  events.on("removeToDo", updateLocalStorage);
  events.on("addTodo", updateLocalStorage);
  events.on("updateTodoCount", updateLocalStorage);

  events.on("addProjectSidebarOnly", addProjectToSideBar);
  events.on("addProjectSidebarOnly", updateProjectList);
  events.on("renderSidebar", renderSideBar);
  events.on("render", render);
  events.on("updateProjectTodoCount", updateProjectTodoCount);
  events.on("clearOperations", clearOperations);
})();
