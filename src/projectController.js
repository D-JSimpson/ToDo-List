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
      case "edit":
        projectList.splice(addLocation - 1, 1, projectList.pop());
        // Reset Last Action To Nothing
        addOperation = "";
        addLocation = -1;
        break;
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
    const name = document.createElement("span");
    // Functionality
    colorCircle.style.backgroundColor = project.getColor();
    name.innerText += project.getName();
    elem.title = project.getName();
    colorCircle.classList.add("colorCircle-P");

    // Go To The Project's ToDos
    elem.addEventListener("click", () => {
      projectModule(project);
    });

    // Append Together
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

    // Get Project Information From User
    // Do Not Need To Add If Removing
    if (operation !== "remove") displayProjectInputField();
    else {
      events.emit("render"); // But Will Have To Rerender If Removing
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
  // Listen For Project Creation And Deletion
  events.on("addProject", addProjectToSideBar);
  events.on("addProject", addProjectToPage);
  events.on("addProject", updateProjectList);
  events.on("addProjectSidebarOnly", addProjectToSideBar);
  events.on("addProjectSidebarOnly", updateProjectList);
  events.on("renderSidebar", renderSideBar);
  events.on("render", render);
})();
