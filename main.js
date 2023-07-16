/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/openInbox.js":
/*!**************************!*\
  !*** ./src/openInbox.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ openInbox)
/* harmony export */ });
/* harmony import */ var _openInbox_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./openInbox.css */ "./src/openInbox.css");
/* harmony import */ var _projectModule__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./projectModule */ "./src/projectModule.js");


function openInbox(todoList) {
  // Make Space For Todos
  const content = document.querySelector("#content");
  content.replaceChildren();
  // The Label For The Page
  const inbox = document.createElement("div");
  const inboxLabel = document.createElement("span");

  // Inner Text And ID's
  inbox.id = "inbox";
  inboxLabel.id = "inboxLabel";
  inboxLabel.innerText = "Inbox";
  inbox.appendChild(inboxLabel);

  // Add Todos To The Page
  todoList.forEach(toDo => {
    // Get The Project And Create Element
    // Use Function Already Made Before
    const project = toDo.getProject();
    const todo = (0,_projectModule__WEBPACK_IMPORTED_MODULE_1__.makeTodo)(project, toDo);
    inbox.appendChild(todo);
  });
  // Append To Show On Page
  content.appendChild(inbox);
}

/***/ }),

/***/ "./src/projectController.js":
/*!**********************************!*\
  !*** ./src/projectController.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pubsub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubsub */ "./src/pubsub.js");
/* harmony import */ var _projectForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./projectForm */ "./src/projectForm.js");
/* harmony import */ var _projectModule__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./projectModule */ "./src/projectModule.js");
/* harmony import */ var _projectController_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./projectController.css */ "./src/projectController.css");
/* harmony import */ var _projectForm_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./projectForm.css */ "./src/projectForm.css");





const body = document.querySelector("body");
const content = document.getElementById("content");
const contentHome = document.getElementById("contentHome");
const projectLabel = document.getElementById("projectLabel");
const projectsContainer = document.getElementById("projectsContainer");

// Go To The Home For All Projects
projectLabel.addEventListener("click", () => {
  _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.emit("clearOperations");
  _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.emit("render");
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
        {
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
    projectList.forEach(prjct => {
      _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.emit("addProjectSidebarOnly", prjct);
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
    projectList.forEach(prjct => {
      _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.emit("addProject", prjct);
      projectList.pop(); // updateProjectList Will Add Duplicates, So Remove Them
    });
  };

  const addProjectToSideBar = project => {
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
    todoList.forEach(toDo => {
      if (toDo.getStatus() !== true) {
        completeCtr += 1;
      }
    });
    todoCount.innerText = completeCtr;

    // Go To The Project's ToDos
    elem.addEventListener("click", () => {
      (0,_projectModule__WEBPACK_IMPORTED_MODULE_2__["default"])(project);
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
    if (operation === "remove") _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.emit("render"); // Will Have To Rerender If Removing
    else if (operation === "edit") {
      // Pass The Project Clicked To Display Its Information
      const prjct = projectList[addLocation - 1];
      (0,_projectForm__WEBPACK_IMPORTED_MODULE_1__["default"])(prjct);
    } else {
      // Get Project Information From User
      (0,_projectForm__WEBPACK_IMPORTED_MODULE_1__["default"])();
    }
  };
  // Add the options themselves
  const addProjectOptions = tools => {
    // Create Needed Elements
    const optionsContainer = document.createElement("div");
    const addAbove = document.createElement("a");
    const addBelow = document.createElement("a");
    const edit = document.createElement("a");
    const remove = document.createElement("a");

    // Functionality
    addAbove.addEventListener("click", () => optionEventListeners("addAbove", tools, addAbove));
    addBelow.addEventListener("click", () => optionEventListeners("addBelow", tools, addBelow));
    edit.addEventListener("click", () => optionEventListeners("edit", tools, edit));
    remove.addEventListener("click", () => optionEventListeners("remove", tools, remove));
    // InnerText and ID
    optionsContainer.id = "optionsContainer";
    addAbove.innerText = "Add Above";
    addBelow.innerText = "Add Below";
    edit.innerText = "Edit Project";
    remove.innerText = "Remove Project";
    optionsContainer.append(addAbove, addBelow, edit, remove);
    tools.appendChild(optionsContainer);
  };
  const createOptionsBox = pageProjectContainer => {
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
    projectOptionsBG.addEventListener("click", event => {
      const withinBoundaries = event.composedPath().includes(tools);
      if (!withinBoundaries) removeProjectOptions(projectOptionsBG, tools);
    });
  };
  const addProjectToPage = project => {
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
      (0,_projectModule__WEBPACK_IMPORTED_MODULE_2__["default"])(project);
    });
    // Open Project Options
    ellipse.innerText = "\u2026"; // An ellipse
    ellipse.title = "PROJECT OPTIONS";
    ellipse.addEventListener("click", () => createOptionsBox(pageProjectContainer));

    // Append Together
    elem.append(colorCircle, name);
    pageProjectContainer.append(elem, ellipse);
    content.appendChild(pageProjectContainer);
  };
  const updateProjectList = project => {
    projectList.push(project);
  };
  const updateProjectTodoCount = project => {
    // Update Todo Count On A Project
    // Perform Operations To Get Color Circle
    // Of Selected Project
    const listPosition = projectList.indexOf(project);
    const container = document.querySelector("#projectsContainer");
    const projectElement = Array.from(container.children)[listPosition];
    const colorCircle = projectElement.firstChild;
    const todoList = project.getToDo();
    let completeCtr = 0;
    todoList.forEach(toDo => {
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
    projectList.forEach(project => {
      const projectName = project.getName();
      const projectNameAndColor = project.getName() + project.getColor();
      const todoList = project.getToDo();
      const todoObject = {};

      // Set A Property On todoObject For Each Todo
      todoList.forEach(todo => {
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
            writable: true
          },
          DueDate: {
            value: dueDate,
            enumerable: true,
            writable: true
          },
          Priority: {
            value: priority,
            enumerable: true,
            writable: true
          },
          Description: {
            value: description,
            enumerable: true,
            writable: true
          },
          Status: {
            value: status,
            enumerable: true,
            writable: true
          }
        });

        //  console.log(`Keys: ${Object.keys(info)}`);
        // Use Todos Name To Set Property
        // Pass Information Related To The Task
        const taskName = todo.getTask();
        Object.defineProperty(todoObject, taskName, {
          value: info,
          writable: true,
          enumerable: true,
          configurable: true
        });
      });
      Object.defineProperty(storageProjectList, projectNameAndColor, {
        value: todoObject,
        writable: true,
        enumerable: true,
        configurable: true
      });
    });

    // Put Into Local Storage
    localStorage.setItem("storageProjectList", JSON.stringify(storageProjectList));
    // Check What Is Stored
    // const projects = JSON.parse(localStorage.getItem("storageProjectList"));
    // console.log(projects);
  };

  const clearOperations = () => {
    addOperation = "";
  };
  // Listen For Project Creation And Deletion
  _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.on("addProject", addProjectToSideBar);
  _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.on("addProject", addProjectToPage);
  _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.on("addProject", updateProjectList);

  // Will Probably Create New events For These
  _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.on("addProject", updateLocalStorage);
  _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.on("addProjectSidebarOnly", updateLocalStorage);
  _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.on("removeToDo", updateLocalStorage);
  _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.on("addTodo", updateLocalStorage);
  _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.on("updateTodoCount", updateLocalStorage);
  _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.on("addProjectSidebarOnly", addProjectToSideBar);
  _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.on("addProjectSidebarOnly", updateProjectList);
  _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.on("renderSidebar", renderSideBar);
  _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.on("render", render);
  _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.on("updateProjectTodoCount", updateProjectTodoCount);
  _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.on("clearOperations", clearOperations);
})();

/***/ }),

/***/ "./src/projectForm.js":
/*!****************************!*\
  !*** ./src/projectForm.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ displayProjectInputField)
/* harmony export */ });
/* harmony import */ var _todo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./todo */ "./src/todo.js");
/* harmony import */ var _pubsub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pubsub */ "./src/pubsub.js");
/* harmony import */ var _projectModule__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./projectModule */ "./src/projectModule.js");



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
  const newProject = (0,_todo__WEBPACK_IMPORTED_MODULE_0__.createProject)(name, color);
  _pubsub__WEBPACK_IMPORTED_MODULE_1__.events.emit("addProjectSidebarOnly", newProject);
  _pubsub__WEBPACK_IMPORTED_MODULE_1__.events.emit("renderSidebar", newProject);
  (0,_projectModule__WEBPACK_IMPORTED_MODULE_2__["default"])(newProject);
}
function displayProjectInputField(project) {
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
  projectForm.addEventListener("submit", event => {
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
      // If not valid, disable submit button
      save.disabled = true;
    }
  });
  // Checks If User Clicks Out Of Project Form
  projectUserInput.addEventListener("click", event => {
    const withinBoundaries = event.composedPath().includes(inputContainer);
    if (!withinBoundaries) removeProjectInputField(projectUserInput);
  });
  // Can Not Call removeProjectInputField() For Some Reason
  cancel.addEventListener("click", () => {
    body.removeChild(projectUserInput);
  });

  // Colors For The Selector
  const colors = [{
    Crimson: "#DC143C"
  }, {
    Coral: "#FF7F50"
  }, {
    Gold: "#FFD700"
  }, {
    Lime: "#00FF00"
  }, {
    Aqua: "#00FFFF"
  }, {
    RoyalBlue: "#4169E1"
  }, {
    Violet: "#EE82EE"
  }, {
    Siena: "#A0522D"
  }, {
    Lavender: "#E6E6FA"
  }, {
    HoneyDew: "#F0FFF0"
  }, {
    Silver: "#C0C0C0"
  }];
  colors.forEach(element => {
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

  // This Part Of The Function Is For Editing Projects
  // project will undefined when called by anything else
  // But not when called by the edit project button
  const isProject = Object.hasOwn(project, "getName"); // Make Sure Its a Project
  if (isProject) {
    addProjectLabel.innerText = "Edit Project";
    nameInput.value = project.getName();
    const color = project.getColor();
    const options = Array.from(colorsSelect.childNodes);
    options.forEach(option => {
      const el = option;
      if (option.value === color) el.selected = true;
    });
  }

  // Append Everything Together
  nameInputLabel.append(nameInputSpan, nameInput);
  projectForm.append(nameInputLabel, colorsSelect);
  inputContainer.append(addProjectLabel, projectForm, buttonContainer);
  projectUserInput.append(inputContainer);
  buttonContainer.append(cancel, save);
  body.appendChild(projectUserInput);
}

/***/ }),

/***/ "./src/projectModule.js":
/*!******************************!*\
  !*** ./src/projectModule.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ projectModule),
/* harmony export */   makeTodo: () => (/* binding */ makeTodo)
/* harmony export */ });
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! date-fns */ "./node_modules/date-fns/esm/format/index.js");
/* harmony import */ var _projectModule_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./projectModule.scss */ "./src/projectModule.scss");
/* harmony import */ var _projectModule_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./projectModule.css */ "./src/projectModule.css");
/* harmony import */ var _taskForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./taskForm */ "./src/taskForm.js");
/* harmony import */ var _pubsub__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./pubsub */ "./src/pubsub.js");





const body = document.querySelector("body");

// Delete Form Made By displayDetails() When Needed
function removeDetails(taskBackground) {
  // Clone Node To Remove Event Listeners Then Remove
  const newElement = taskBackground.cloneNode(true);
  body.replaceChild(newElement, taskBackground);
  body.removeChild(newElement);
}
function displayDetails(toDo) {
  // Create Necessary Elements
  const taskBackground = document.createElement("div");
  const taskInfo = document.createElement("ul");
  const closeIcon = document.createElement("li");
  const taskName = document.createElement("li");
  const forProject = document.createElement("li");
  const dueDateEl = document.createElement("li");
  const priority = document.createElement("li");
  const taskDescription = document.createElement("li");

  // Give Them IDs
  taskBackground.id = "taskBackground";
  taskInfo.id = "taskInfo";
  closeIcon.id = "closeIcon";
  taskName.id = "taskDetailsName";

  // Get The Due Date Of The Todo
  // Then Set It Up To Be Formated By dates-fns
  let dueDate = toDo.getDueDate();
  const year = dueDate.substring(0, dueDate.indexOf("-"));
  const day = dueDate.substring(dueDate.lastIndexOf("-") + 1);
  const month = parseInt(dueDate.substring(dueDate.indexOf("-") + 1, dueDate.lastIndexOf("-")), 10) - 1; // Subtract 1 for dates-fns format
  dueDate = (0,date_fns__WEBPACK_IMPORTED_MODULE_4__["default"])(new Date(year, month, day), "MMM d yyyy");

  // Assign Task Information
  taskName.innerText = toDo.getTask();
  forProject.innerText = `Project: ${toDo.getProject().getName()}`;
  dueDateEl.innerText = `Due Date: ${dueDate}`;
  priority.innerText = `Priority: ${toDo.getPriority()}`;
  taskDescription.innerText = `Description: ${toDo.getDescription()}`;

  // Icon To Close Details
  closeIcon.innerText = "\u2716";

  // Functionality
  // Checks If User Clicks Out Of Project Form
  taskBackground.addEventListener("click", event => {
    const withinBoundaries = event.composedPath().includes(taskInfo);
    if (!withinBoundaries) removeDetails(taskBackground);
  });

  // Close Details If Icon Clicked
  closeIcon.addEventListener("click", () => {
    body.removeChild(taskBackground);
  });
  taskInfo.append(closeIcon, taskName, forProject, dueDateEl, priority, taskDescription);
  taskBackground.appendChild(taskInfo);
  body.appendChild(taskBackground);
}
// Export So openInbox Can Use As Well
function makeTodo(project, toDo) {
  // The ToDos For The Project
  const todo = document.createElement("section");
  const priorityColor = document.createElement("span");
  const todoCheckbox = document.createElement("input");
  const taskName = document.createElement("label");
  const detailsBtn = document.createElement("button");
  const dueDateEl = document.createElement("span");
  const trashCan = document.createElement("span");
  const editIcon = document.createElement("span");

  // Classes and Innertext
  todo.classList.add("todo");
  priorityColor.classList.add("priorityColor");
  todoCheckbox.classList.add("todoCheckbox");
  taskName.classList.add("taskName");
  detailsBtn.classList.add("detailsBtn");
  dueDateEl.classList.add("dueDateEl");
  trashCan.classList.add("trashCan");
  editIcon.classList.add("editIcon");
  taskName.innerText = toDo.getTask();
  detailsBtn.innerText = "DETAILS";

  // Get The Due Date Of The Todo
  // Then Set It Up To Be Formated By dates-fns
  const dueDate = toDo.getDueDate();
  const year = dueDate.substring(0, dueDate.indexOf("-"));
  const day = dueDate.substring(dueDate.lastIndexOf("-") + 1);
  const month = parseInt(dueDate.substring(dueDate.indexOf("-") + 1, dueDate.lastIndexOf("-")), 10) - 1; // Subtract 1 for dates-fns format
  dueDateEl.innerText = (0,date_fns__WEBPACK_IMPORTED_MODULE_4__["default"])(new Date(year, month, day), "MMM d");

  // Funtionality
  todoCheckbox.setAttribute("type", "checkbox");
  todoCheckbox.setAttribute("name", "checkbox");
  taskName.setAttribute("for", "checkbox");

  // Marking A Todo As Done
  todoCheckbox.addEventListener("click", () => {
    toDo.toggleComplete();
    todoCheckbox.toggleAttribute("checked");
    taskName.classList.toggle("strikeThrough");
    detailsBtn.classList.toggle("detailsBtnChecked");
    trashCan.classList.toggle("trashCanChecked");
    editIcon.classList.toggle("editIconChecked");
    _pubsub__WEBPACK_IMPORTED_MODULE_3__.events.emit("updateTodoCount");
    _pubsub__WEBPACK_IMPORTED_MODULE_3__.events.emit("updateProjectTodoCount", project);
  });

  // Equal To True Means The Todo Is Complete
  // This Is So That If A Todo Is Checked Somwhere,
  // It Will Appear Checked Elsewhere
  if (toDo.getStatus() === true) {
    todoCheckbox.toggleAttribute("checked");
    taskName.classList.toggle("strikeThrough");
    detailsBtn.classList.toggle("detailsBtnChecked");
    trashCan.classList.toggle("trashCanChecked");
    editIcon.classList.toggle("editIconChecked");
  }

  // Display Details Of The Todo
  detailsBtn.addEventListener("click", () => {
    displayDetails(toDo);
  });

  // Edit The Todo Information
  // displayTaskInputField() has two parameters
  // If it is passed a todo it will display its information
  editIcon.addEventListener("click", () => {
    (0,_taskForm__WEBPACK_IMPORTED_MODULE_2__["default"])(project, toDo);
  });

  // Delete The Todo From The Project
  // Then Update Page
  trashCan.addEventListener("click", () => {
    project.removeToDo(toDo);
    _pubsub__WEBPACK_IMPORTED_MODULE_3__.events.emit("removeToDo", toDo);
    _pubsub__WEBPACK_IMPORTED_MODULE_3__.events.emit("updateTodo", project);
    _pubsub__WEBPACK_IMPORTED_MODULE_3__.events.emit("updateTodoCount");
    _pubsub__WEBPACK_IMPORTED_MODULE_3__.events.emit("updateProjectTodoCount", project);
  });

  // Append
  todo.append(priorityColor, todoCheckbox, taskName, detailsBtn, dueDateEl, editIcon, trashCan);
  return todo;
}
function projectModule(project) {
  // Make Space For New Project Todos
  const content = document.querySelector("#content");
  content.replaceChildren();
  // Display The Project That Was Clicked/Created
  const selectedProject = document.createElement("h1");
  const addTodoBtn = document.createElement("button");
  selectedProject.id = "selectedProject";
  selectedProject.innerText = project.getName();
  addTodoBtn.innerText = "\u2795 Add Task";
  addTodoBtn.id = "addTodoBtn";
  // Functionality
  addTodoBtn.addEventListener("click", () => {
    (0,_taskForm__WEBPACK_IMPORTED_MODULE_2__["default"])(project);
  });

  // Create The Different Priority Levels
  const priorityOne = document.createElement("div");
  const priorityTwo = document.createElement("div");
  const priorityThree = document.createElement("div");
  const priorityFour = document.createElement("div");
  // Classlist For Each: For Color
  priorityOne.classList.add("priorityOne");
  priorityTwo.classList.add("priorityTwo");
  priorityThree.classList.add("priorityThree");
  priorityFour.classList.add("priorityFour");
  // Correct InnerText For Each
  priorityOne.innerText = "Priority 1";
  priorityTwo.innerText = "Priority 2";
  priorityThree.innerText = "Priority 3";
  priorityFour.innerText = "Priority 4";

  // Append To Show On Page
  selectedProject.appendChild(addTodoBtn);
  content.append(selectedProject, priorityOne, priorityTwo, priorityThree, priorityFour);
  const todoList = project.getToDo();
  todoList.forEach(todo => {
    const priority = todo.getPriority();
    switch (priority) {
      case "1":
      case "Priority 1":
        priorityOne.append(makeTodo(project, todo));
        break;
      case "2":
      case "Priority 2":
        priorityTwo.append(makeTodo(project, todo));
        break;
      case "3":
      case "Priority 3":
        priorityThree.append(makeTodo(project, todo));
        break;
      case "4":
      case "Priority 4":
        priorityFour.append(makeTodo(project, todo));
        break;
      default:
        break;
    }
  });
}

/***/ }),

/***/ "./src/pubsub.js":
/*!***********************!*\
  !*** ./src/pubsub.js ***!
  \***********************/
/***/ ((module) => {

// events - a super-basic Javascript (publish subscribe) pattern

const events = {
  events: {},
  on(eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  },
  off(eventName, fn) {
    if (this.events[eventName]) {
      for (let i = 0; i < this.events[eventName].length; i += 1) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
  },
  emit(eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(fn => {
        fn(data);
      });
    }
  }
};
module.exports.events = events;

/***/ }),

/***/ "./src/taskForm.js":
/*!*************************!*\
  !*** ./src/taskForm.js ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ displayTaskInputField)
/* harmony export */ });
/* harmony import */ var _pubsub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubsub */ "./src/pubsub.js");
/* harmony import */ var _taskForm_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./taskForm.css */ "./src/taskForm.css");
/* harmony import */ var _todo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./todo */ "./src/todo.js");



__webpack_require__(/*! ./todoController */ "./src/todoController.js");
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
  const newTodo = (0,_todo__WEBPACK_IMPORTED_MODULE_2__.createTodo)(taskName, taskDescription, dueDate, selectPriority, project);
  // This Part Of The Function Is For Editing Todos
  // toDo will undefined when called by addTodoBtn
  // But not when called by editIcon
  if (toDo !== undefined) {
    project.removeToDo(toDo);
    _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.emit("removeToDo", toDo);
  }
  // Link And Update
  project.addToDo(newTodo);
  _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.emit("addTodo", newTodo);
  _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.emit("updateTodo", project);
  _pubsub__WEBPACK_IMPORTED_MODULE_0__.events.emit("updateProjectTodoCount", project);
}
function displayTaskInputField(project, toDo) {
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
    if (taskName.validity.valid && taskDescription.validity.valid && dueDateBtn.validity.valid && selectPriority.value !== "Priority?" // The Default Value
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
  taskForm.addEventListener("submit", event => {
    event.preventDefault(); // Unsure If Needed, But prevents Webpack Reloading The Page
    taskFormSubmission(taskForm, project, toDo);
    removeTaskInputField(taskBackground);
  });
  // Checks If User Clicks Out Of Project Form
  taskBackground.addEventListener("click", event => {
    const withinBoundaries = event.composedPath().includes(taskUserInput);
    if (!withinBoundaries) removeTaskInputField(taskBackground);
  });
  // Can Not Call removeTaskInputField() For Some Reason
  cancelBtn.addEventListener("click", () => {
    body.removeChild(taskBackground);
  });

  // Create Priority Options
  const priorities = ["Priority?", "Priority 1", "Priority 2", "Priority 3", "Priority 4"];
  priorities.forEach(element => {
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

/***/ }),

/***/ "./src/todo.js":
/*!*********************!*\
  !*** ./src/todo.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createProject: () => (/* binding */ createProject),
/* harmony export */   createTodo: () => (/* binding */ createTodo)
/* harmony export */ });
function createProject(name, color) {
  let toDO = [];
  const getName = () => name;
  const getColor = () => color;
  const addToDo = todo => {
    toDO.push(todo);
    toDO.sort((last, next) => {
      if (last.getDueDate() >= next.getDueDate()) {
        return 1;
      }
      return -1;
    });
  };
  const getToDo = () => toDO;
  const removeToDo = todo => {
    const location = toDO.indexOf(todo);
    toDO.splice(location, 1);
  };
  const clone = (projectOne, projectTwo) => {
    const todoList = projectTwo.getToDo();
    toDO = [...todoList];
    toDO.forEach(todo => {
      todo.setProject(projectOne);
    });
  };
  return {
    getName,
    getColor,
    addToDo,
    getToDo,
    removeToDo,
    clone
  };
}
function createTodo(task, description, dueDate, priority, project) {
  const type = "Todo";
  let complete = false;
  const getTask = () => task;
  const getDescription = () => description;
  const getDueDate = () => dueDate;
  const getPriority = () => priority;
  const getProject = () => project;
  const setProject = newProject => {
    // eslint-disable-next-line no-param-reassign
    project = newProject;
  };
  const toggleComplete = () => {
    if (complete === true) {
      complete = false;
    } else {
      complete = true;
    }
  };
  const getStatus = () => complete;
  return {
    getTask,
    getDescription,
    getDueDate,
    getPriority,
    getProject,
    type,
    setProject,
    toggleComplete,
    getStatus
  };
}

/***/ }),

/***/ "./src/todoController.js":
/*!*******************************!*\
  !*** ./src/todoController.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _projectModule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./projectModule */ "./src/projectModule.js");
/* harmony import */ var _pubsub__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./pubsub */ "./src/pubsub.js");
/* harmony import */ var _openInbox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./openInbox */ "./src/openInbox.js");



const todoController = (() => {
  const todoList = [];
  // Used To Render Todo After Deletion Or Checked
  const updateTodo = project => {
    const selectedProject = document.querySelector("#selectedProject");
    // selectedProject will be null when a project is
    // Deleted from the todo inbox but,
    // Not When a Project Is Selected
    if (selectedProject !== null) {
      (0,_projectModule__WEBPACK_IMPORTED_MODULE_0__["default"])(project);
    } else {
      (0,_openInbox__WEBPACK_IMPORTED_MODULE_2__["default"])(todoList);
    }
  };
  const updateTodoList = todo => {
    // Only Add If has tpye set to Todo
    const {
      type
    } = todo;
    if (type === "Todo") todoList.push(todo);
    // Sort The Todos By DueDate
    todoList.sort((last, next) => {
      if (last.getDueDate() >= next.getDueDate()) {
        return 1;
      }
      return -1;
    });
  };
  const getTodoList = () => {
    console.log(todoList);
  };
  const todoInbox = () => {
    (0,_openInbox__WEBPACK_IMPORTED_MODULE_2__["default"])(todoList);
  };
  const removeToDo = todo => {
    const location = todoList.indexOf(todo);
    todoList.splice(location, 1);
  };
  const updateTodoCount = () => {
    // Update Todo Count
    const sideBarInbox = document.querySelector("#sideBarInbox");
    const colorCircle = sideBarInbox.lastChild;
    let completeCtr = 0;
    todoList.forEach(toDo => {
      if (toDo.getStatus() !== true) {
        completeCtr += 1;
      }
    });
    colorCircle.innerText = completeCtr;
  };
  _pubsub__WEBPACK_IMPORTED_MODULE_1__.events.on("updateTodo", updateTodo);
  _pubsub__WEBPACK_IMPORTED_MODULE_1__.events.on("addTodo", updateTodoList);
  _pubsub__WEBPACK_IMPORTED_MODULE_1__.events.on("openInbox", todoInbox);
  _pubsub__WEBPACK_IMPORTED_MODULE_1__.events.on("removeToDo", removeToDo);
  _pubsub__WEBPACK_IMPORTED_MODULE_1__.events.on("updateTodoCount", updateTodoCount);
  _pubsub__WEBPACK_IMPORTED_MODULE_1__.events.on("addTodo", updateTodoCount);
  return {
    getTodoList
  };
})();
todoController.getTodoList();

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/projectModule.scss":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/projectModule.scss ***!
  \*************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/*This File Is To Color The Todos By Priority*/
/*On Projects Page*/
/*Instead Of The Default Black*/
/*Show Priority color*/
/* Priority 1 */
.priorityOne .todo:hover {
  box-shadow: 3px 5px 5px #ff0066; }

.priorityOne .todo .priorityColor {
  background-color: #ff0066; }

.priorityOne .todo .todoCheckbox {
  accent-color: #ff0066; }

.priorityOne .todo .detailsBtn {
  border: 2px solid #ff0066;
  color: #ff0066; }

.priorityOne .todo .detailsBtn:hover {
  background-color: #ff0066;
  color: #ffffff; }

.priorityOne .todo .dueDateEl {
  color: #ff0066; }

.priorityOne .todo .trashCan,
.priorityOne .todo .editIcon {
  color: #ff0066; }

.priorityOne .todo .trashCan:hover,
.priorityOne .todo .editIcon:hover {
  color: violet; }

/* Priority 2 */
.priorityTwo .todo:hover {
  box-shadow: 3px 5px 5px #ffd700; }

.priorityTwo .todo .priorityColor {
  background-color: #ffd700; }

.priorityTwo .todo .todoCheckbox {
  accent-color: #ffd700; }

.priorityTwo .todo .detailsBtn {
  border: 2px solid #ffd700;
  color: #ffd700; }

.priorityTwo .todo .detailsBtn:hover {
  background-color: #ffd700;
  color: #ffffff; }

.priorityTwo .todo .dueDateEl {
  color: #ffd700; }

.priorityTwo .todo .trashCan,
.priorityTwo .todo .editIcon {
  color: #ffd700; }

.priorityTwo .todo .trashCan:hover,
.priorityTwo .todo .editIcon:hover {
  color: #ff5e00; }

/* Priority 3 */
.priorityThree .todo:hover {
  box-shadow: 3px 5px 5px #09ff32; }

.priorityThree .todo .priorityColor {
  background-color: #09ff32; }

.priorityThree .todo .todoCheckbox {
  accent-color: #09ff32; }

.priorityThree .todo .detailsBtn {
  border: 2px solid #09ff32;
  color: #09ff32; }

.priorityThree .todo .detailsBtn:hover {
  background-color: #09ff32;
  color: #ffffff; }

.priorityThree .todo .dueDateEl {
  color: #09ff32; }

.priorityThree .todo .trashCan,
.priorityThree .todo .editIcon {
  color: #09ff32; }

.priorityThree .todo .trashCan:hover,
.priorityThree .todo .editIcon:hover {
  color: #00740e; }

/* Priority 4 */
.priorityFour .todo:hover {
  box-shadow: 3px 5px 5px #2850ff; }

.priorityFour .todo .priorityColor {
  background-color: #2850ff; }

.priorityFour .todo .todoCheckbox {
  accent-color: #2850ff; }

.priorityFour .todo .detailsBtn {
  border: 2px solid #2850ff;
  color: #2850ff; }

.priorityFour .todo .detailsBtn:hover {
  background-color: #2850ff;
  color: #ffffff; }

.priorityFour .todo .dueDateEl {
  color: #2850ff; }

.priorityFour .todo .trashCan,
.priorityFour .todo .editIcon {
  color: #2850ff; }

.priorityFour .todo .trashCan:hover,
.priorityFour .todo .editIcon:hover {
  color: #8c28ff; }
`, "",{"version":3,"sources":["webpack://./src/projectModule.scss"],"names":[],"mappings":"AAAA,8CAAA;AACA,mBAAA;AACA,+BAAA;AAKA,sBAAA;AACA,eAAA;AACA;EAEI,+BARuB,EAAA;;AAM3B;EAMM,yBAZqB,EAAA;;AAM3B;EASM,qBAfqB,EAAA;;AAM3B;EAYM,yBAlBqB;EAmBrB,cAnBqB,EAAA;;AAM3B;EAgBM,yBAtBqB;EAuBrB,cAAc,EAAA;;AAjBpB;EAoBM,cA1BqB,EAAA;;AAM3B;;EAwBM,cA9BqB,EAAA;;AAM3B;;EA4BM,aAAa,EAAA;;AAInB,eAAA;AACA;EAEI,+BAxCuB,EAAA;;AAsC3B;EAMM,yBA5CqB,EAAA;;AAsC3B;EASM,qBA/CqB,EAAA;;AAsC3B;EAYM,yBAlDqB;EAmDrB,cAnDqB,EAAA;;AAsC3B;EAgBM,yBAtDqB;EAuDrB,cAAc,EAAA;;AAjBpB;EAoBM,cA1DqB,EAAA;;AAsC3B;;EAwBM,cA9DqB,EAAA;;AAsC3B;;EA4BM,cAAc,EAAA;;AAIpB,eAAA;AACA;EAEI,+BAxEiC,EAAA;;AAsErC;EAMM,yBA5E+B,EAAA;;AAsErC;EASM,qBA/E+B,EAAA;;AAsErC;EAYM,yBAlF+B;EAmF/B,cAnF+B,EAAA;;AAsErC;EAgBM,yBAtF+B;EAuF/B,cAAc,EAAA;;AAjBpB;EAoBM,cA1F+B,EAAA;;AAsErC;;EAwBM,cA9F+B,EAAA;;AAsErC;;EA4BM,cAAsB,EAAA;;AAI5B,eAAA;AACA;EAEI,+BAxGwB,EAAA;;AAsG5B;EAMM,yBA5GsB,EAAA;;AAsG5B;EASM,qBA/GsB,EAAA;;AAsG5B;EAYM,yBAlHsB;EAmHtB,cAnHsB,EAAA;;AAsG5B;EAgBM,yBAtHsB;EAuHtB,cAAc,EAAA;;AAjBpB;EAoBM,cA1HsB,EAAA;;AAsG5B;;EAwBM,cA9HsB,EAAA;;AAsG5B;;EA4BM,cAAc,EAAA","sourcesContent":["/*This File Is To Color The Todos By Priority*/\n/*On Projects Page*/\n/*Instead Of The Default Black*/\n$priorityOne-color: #ff0066;\n$priorityTwo-color: #ffd700;\n$priorityThree-color: rgb(9, 255, 50);\n$priorityFour-color: #2850ff;\n/*Show Priority color*/\n/* Priority 1 */\n.priorityOne {\n  .todo:hover {\n    box-shadow: 3px 5px 5px $priorityOne-color;\n  }\n  .todo {\n    .priorityColor {\n      background-color: $priorityOne-color;\n    }\n    .todoCheckbox {\n      accent-color: $priorityOne-color;\n    }\n    .detailsBtn {\n      border: 2px solid $priorityOne-color;\n      color: $priorityOne-color;\n    }\n    .detailsBtn:hover {\n      background-color: $priorityOne-color;\n      color: #ffffff;\n    }\n    .dueDateEl {\n      color: $priorityOne-color;\n    }\n    .trashCan,\n    .editIcon {\n      color: $priorityOne-color;\n    }\n    .trashCan:hover,\n    .editIcon:hover {\n      color: violet;\n    }\n  }\n}\n/* Priority 2 */\n.priorityTwo {\n  .todo:hover {\n    box-shadow: 3px 5px 5px $priorityTwo-color;\n  }\n  .todo {\n    .priorityColor {\n      background-color: $priorityTwo-color;\n    }\n    .todoCheckbox {\n      accent-color: $priorityTwo-color;\n    }\n    .detailsBtn {\n      border: 2px solid $priorityTwo-color;\n      color: $priorityTwo-color;\n    }\n    .detailsBtn:hover {\n      background-color: $priorityTwo-color;\n      color: #ffffff;\n    }\n    .dueDateEl {\n      color: $priorityTwo-color;\n    }\n    .trashCan,\n    .editIcon {\n      color: $priorityTwo-color;\n    }\n    .trashCan:hover,\n    .editIcon:hover {\n      color: #ff5e00;\n    }\n  }\n}\n/* Priority 3 */\n.priorityThree {\n  .todo:hover {\n    box-shadow: 3px 5px 5px $priorityThree-color;\n  }\n  .todo {\n    .priorityColor {\n      background-color: $priorityThree-color;\n    }\n    .todoCheckbox {\n      accent-color: $priorityThree-color;\n    }\n    .detailsBtn {\n      border: 2px solid $priorityThree-color;\n      color: $priorityThree-color;\n    }\n    .detailsBtn:hover {\n      background-color: $priorityThree-color;\n      color: #ffffff;\n    }\n    .dueDateEl {\n      color: $priorityThree-color;\n    }\n    .trashCan,\n    .editIcon {\n      color: $priorityThree-color;\n    }\n    .trashCan:hover,\n    .editIcon:hover {\n      color: rgb(0, 116, 14);\n    }\n  }\n}\n/* Priority 4 */\n.priorityFour {\n  .todo:hover {\n    box-shadow: 3px 5px 5px $priorityFour-color;\n  }\n  .todo {\n    .priorityColor {\n      background-color: $priorityFour-color;\n    }\n    .todoCheckbox {\n      accent-color: $priorityFour-color;\n    }\n    .detailsBtn {\n      border: 2px solid $priorityFour-color;\n      color: $priorityFour-color;\n    }\n    .detailsBtn:hover {\n      background-color: $priorityFour-color;\n      color: #ffffff;\n    }\n    .dueDateEl {\n      color: $priorityFour-color;\n    }\n    .trashCan,\n    .editIcon {\n      color: $priorityFour-color;\n    }\n    .trashCan:hover,\n    .editIcon:hover {\n      color: #8c28ff;\n    }\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/openInbox.css":
/*!*****************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/openInbox.css ***!
  \*****************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `#inbox {
  width: 100%;
  height: 121px;
  margin-top: 30px;
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 10px;
  height: fit-content;
  font-size: min(64px, 10vw);
}
#inboxLabel {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d4d4d8;
}
`, "",{"version":3,"sources":["webpack://./src/openInbox.css"],"names":[],"mappings":"AAAA;EACE,WAAW;EACX,aAAa;EACb,gBAAgB;EAChB,mBAAmB;EACnB,aAAa;EACb,0BAA0B;EAC1B,aAAa;EACb,mBAAmB;EACnB,0BAA0B;AAC5B;AACA;EACE,aAAa;EACb,mBAAmB;EACnB,gCAAgC;AAClC","sourcesContent":["#inbox {\n  width: 100%;\n  height: 121px;\n  margin-top: 30px;\n  margin-bottom: 30px;\n  display: grid;\n  grid-template-columns: 1fr;\n  row-gap: 10px;\n  height: fit-content;\n  font-size: min(64px, 10vw);\n}\n#inboxLabel {\n  display: flex;\n  align-items: center;\n  border-bottom: 1px solid #d4d4d8;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/projectController.css":
/*!*************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/projectController.css ***!
  \*************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* Projects on Home Screen */
.pageProjectContainer {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}
.pageProject {
  display: flex;
  align-items: center;
  height: 50px;
  width: 88%;
  border-radius: 10px;
  padding-left: 20px;
}
.pageProjectContainer:hover > .pageProject {
  background-color: #d4d4d8;
  transition: 0.2s;
  cursor: pointer;
}
.pageProjectContainer:hover > .ellipse {
  display: block !important;
}
/* ellipse next to projects */
.ellipse {
  margin-left: auto;
  margin-right: 20px;
  height: 90%;
  width: 5%;
  font-size: 1.5em;
  color: #111;
  text-align: center;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-items: center;
}
.ellipse:hover {
  cursor: pointer;
  transition: 0.2s;
  background-color: #e4e4e7;
}
/* Options that come up when ellipse is pressed */

.projectOptionsBG {
  position: fixed;
  height: 100vh;
  width: 100vw;
  z-index: 4;
}
.tools {
  height: 200px;
  width: 200px;
  background-color: #0f172a;
  border-radius: 5px;
  position: absolute;
  left: 100%;
  top: 100%;
  margin-left: -200px;
  z-index: 6;
}
#optionsContainer {
  height: 100%;
  width: calc(100% - 20px);
  padding-left: 10px;
  padding-right: 10px;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  align-items: center;
  background: linear-gradient(180deg, #ff0066, #2850ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
#optionsContainer a {
  display: block;
  width: 100%;
  border-bottom: solid 1px;
}
#optionsContainer > :hover {
  cursor: pointer;
  opacity: 0.5;
}
`, "",{"version":3,"sources":["webpack://./src/projectController.css"],"names":[],"mappings":"AAAA,4BAA4B;AAC5B;EACE,kBAAkB;EAClB,aAAa;EACb,mBAAmB;EACnB,WAAW;AACb;AACA;EACE,aAAa;EACb,mBAAmB;EACnB,YAAY;EACZ,UAAU;EACV,mBAAmB;EACnB,kBAAkB;AACpB;AACA;EACE,yBAAyB;EACzB,gBAAgB;EAChB,eAAe;AACjB;AACA;EACE,yBAAyB;AAC3B;AACA,6BAA6B;AAC7B;EACE,iBAAiB;EACjB,kBAAkB;EAClB,WAAW;EACX,SAAS;EACT,gBAAgB;EAChB,WAAW;EACX,kBAAkB;EAClB,mBAAmB;EACnB,aAAa;EACb,mBAAmB;EACnB,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,gBAAgB;EAChB,yBAAyB;AAC3B;AACA,iDAAiD;;AAEjD;EACE,eAAe;EACf,aAAa;EACb,YAAY;EACZ,UAAU;AACZ;AACA;EACE,aAAa;EACb,YAAY;EACZ,yBAAyB;EACzB,kBAAkB;EAClB,kBAAkB;EAClB,UAAU;EACV,SAAS;EACT,mBAAmB;EACnB,UAAU;AACZ;AACA;EACE,YAAY;EACZ,wBAAwB;EACxB,kBAAkB;EAClB,mBAAmB;EACnB,aAAa;EACb,0BAA0B;EAC1B,wBAAwB;EACxB,mBAAmB;EACnB,qDAAqD;EACrD,qBAAqB;EACrB,6BAA6B;EAC7B,oCAAoC;AACtC;AACA;EACE,cAAc;EACd,WAAW;EACX,wBAAwB;AAC1B;AACA;EACE,eAAe;EACf,YAAY;AACd","sourcesContent":["/* Projects on Home Screen */\n.pageProjectContainer {\n  position: relative;\n  display: flex;\n  align-items: center;\n  width: 100%;\n}\n.pageProject {\n  display: flex;\n  align-items: center;\n  height: 50px;\n  width: 88%;\n  border-radius: 10px;\n  padding-left: 20px;\n}\n.pageProjectContainer:hover > .pageProject {\n  background-color: #d4d4d8;\n  transition: 0.2s;\n  cursor: pointer;\n}\n.pageProjectContainer:hover > .ellipse {\n  display: block !important;\n}\n/* ellipse next to projects */\n.ellipse {\n  margin-left: auto;\n  margin-right: 20px;\n  height: 90%;\n  width: 5%;\n  font-size: 1.5em;\n  color: #111;\n  text-align: center;\n  border-radius: 10px;\n  display: flex;\n  align-items: center;\n  justify-items: center;\n}\n.ellipse:hover {\n  cursor: pointer;\n  transition: 0.2s;\n  background-color: #e4e4e7;\n}\n/* Options that come up when ellipse is pressed */\n\n.projectOptionsBG {\n  position: fixed;\n  height: 100vh;\n  width: 100vw;\n  z-index: 4;\n}\n.tools {\n  height: 200px;\n  width: 200px;\n  background-color: #0f172a;\n  border-radius: 5px;\n  position: absolute;\n  left: 100%;\n  top: 100%;\n  margin-left: -200px;\n  z-index: 6;\n}\n#optionsContainer {\n  height: 100%;\n  width: calc(100% - 20px);\n  padding-left: 10px;\n  padding-right: 10px;\n  display: grid;\n  grid-template-columns: 1fr;\n  grid-template-rows: auto;\n  align-items: center;\n  background: linear-gradient(180deg, #ff0066, #2850ff);\n  background-clip: text;\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}\n#optionsContainer a {\n  display: block;\n  width: 100%;\n  border-bottom: solid 1px;\n}\n#optionsContainer > :hover {\n  cursor: pointer;\n  opacity: 0.5;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/projectForm.css":
/*!*******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/projectForm.css ***!
  \*******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Indie+Flower&family=Signika&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* The input field for new projects */
#projectUserInput {
  position: fixed;
  height: 100vh;
  width: 100vw;
  background-color: rgb(0, 0, 0, 0.5);
  z-index: 5;
}
/* Where Things are Inputed */
#inputContainer {
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: min(80%, 600px);
  max-width: min(80%, 400px);
  top: 50%;
  left: 50%;
  margin-top: -300px;
  margin-left: -200px;
  background-color: #fafafa;
  border-radius: 20px;
  padding-top: 50px;
  padding-left: 40px;
  padding-right: 40px;
  row-gap: 20px;
  transition: padding 0.3s ease;
}
/* Only Push Content If Screen Is Certain Size */
@media screen and (max-width: 600px), (max-height: 650px) {
  #projectUserInput {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #inputContainer {
    top: 0;
    left: 0;
    margin-top: 0px;
    margin-left: 0px;
    padding-top: 25px;
    padding-left: 20px;
    padding-right: 20px;
  }
}
@media screen and (max-height: 650px) {
  #colorsSelect {
    height: 100px;
  }
  #addProjectLabel {
    font-size: 20px !important;
  }
}

#addProjectLabel {
  font-size: 48px;
  padding-bottom: 5px;
  border-bottom: solid rgb(0, 0, 0, 0.3);
}
/* Project Form */
#projectForm {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: min(80%, 600px);
  width: 100%;
  row-gap: 20px;
}
/* Name Field */
#nameInput {
  width: 100%;
  height: 30px;
  margin-top: 10px;
  margin-left: -13px;
  border-radius: 30px;
  border-style: solid;
  padding-left: 20px;
  align-self: center;
  border-color: black;
}
#nameInput:focus-visible {
  border-color: white;
}
#nameInputLabel {
  width: 100%;
}
#nameInputSpan {
  margin-left: 10px;
}
/* Color Field */
#colorsSelect {
  align-self: center;
  width: 100%;
  max-height: min(50%, 600px);
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 10fr;
  grid-template-rows: repeat(11, 1fr);
  overflow-y: scroll;
}
.option {
  font-size: 36px;
  display: flex;
  align-items: center;
}
option:checked {
  background: linear-gradient(#64748b, #94a3b8);
}
.option:hover {
  background-color: #d4d4d8;
}
.colorCircle {
  display: inline-block;
  height: 20px;
  width: 20px;
  border-radius: 360px;
  margin-left: auto;
  margin-right: 20px;
}
/* Buttons Container*/
#buttonContainer {
  margin-left: auto;
  display: flex;
  column-gap: 20px;
  margin-top: auto;
  margin-bottom: 20px;
}
#buttonContainer > button {
  width: 100px;
  height: 35px;
  border-radius: 10px;
}
/* Buttons */
.cancel {
  background-color: #f4f4f5;
  border-style: solid;
  border-color: #d4d4d8;
}
.save {
  background-color: #fca5a5;
  border-style: solid;
  border-color: #ef4444;
  color: #111;
}
.save:disabled {
  background-color: #fbd0d0;
  border-color: #fbd0d0;
  cursor: not-allowed;
}
.cancel:hover,
.save:enabled:hover {
  cursor: pointer;
}
.cancel:hover {
  background-color: #d4d4d8;
  transition: 0.2s;
}
.save:enabled:hover {
  background-color: #ef4444;
  transition: 0.2s;
}
/*--------------------------------------------*/
`, "",{"version":3,"sources":["webpack://./src/projectForm.css"],"names":[],"mappings":"AACA,qCAAqC;AACrC;EACE,eAAe;EACf,aAAa;EACb,YAAY;EACZ,mCAAmC;EACnC,UAAU;AACZ;AACA,6BAA6B;AAC7B;EACE,kBAAkB;EAClB,aAAa;EACb,sBAAsB;EACtB,2BAA2B;EAC3B,0BAA0B;EAC1B,QAAQ;EACR,SAAS;EACT,kBAAkB;EAClB,mBAAmB;EACnB,yBAAyB;EACzB,mBAAmB;EACnB,iBAAiB;EACjB,kBAAkB;EAClB,mBAAmB;EACnB,aAAa;EACb,6BAA6B;AAC/B;AACA,gDAAgD;AAChD;EACE;IACE,aAAa;IACb,mBAAmB;IACnB,uBAAuB;EACzB;EACA;IACE,MAAM;IACN,OAAO;IACP,eAAe;IACf,gBAAgB;IAChB,iBAAiB;IACjB,kBAAkB;IAClB,mBAAmB;EACrB;AACF;AACA;EACE;IACE,aAAa;EACf;EACA;IACE,0BAA0B;EAC5B;AACF;;AAEA;EACE,eAAe;EACf,mBAAmB;EACnB,sCAAsC;AACxC;AACA,iBAAiB;AACjB;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,2BAA2B;EAC3B,WAAW;EACX,aAAa;AACf;AACA,eAAe;AACf;EACE,WAAW;EACX,YAAY;EACZ,gBAAgB;EAChB,kBAAkB;EAClB,mBAAmB;EACnB,mBAAmB;EACnB,kBAAkB;EAClB,kBAAkB;EAClB,mBAAmB;AACrB;AACA;EACE,mBAAmB;AACrB;AACA;EACE,WAAW;AACb;AACA;EACE,iBAAiB;AACnB;AACA,gBAAgB;AAChB;EACE,kBAAkB;EAClB,WAAW;EACX,2BAA2B;EAC3B,aAAa;EACb,mBAAmB;EACnB,+BAA+B;EAC/B,mCAAmC;EACnC,kBAAkB;AACpB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;AACrB;AACA;EACE,6CAA6C;AAC/C;AACA;EACE,yBAAyB;AAC3B;AACA;EACE,qBAAqB;EACrB,YAAY;EACZ,WAAW;EACX,oBAAoB;EACpB,iBAAiB;EACjB,kBAAkB;AACpB;AACA,qBAAqB;AACrB;EACE,iBAAiB;EACjB,aAAa;EACb,gBAAgB;EAChB,gBAAgB;EAChB,mBAAmB;AACrB;AACA;EACE,YAAY;EACZ,YAAY;EACZ,mBAAmB;AACrB;AACA,YAAY;AACZ;EACE,yBAAyB;EACzB,mBAAmB;EACnB,qBAAqB;AACvB;AACA;EACE,yBAAyB;EACzB,mBAAmB;EACnB,qBAAqB;EACrB,WAAW;AACb;AACA;EACE,yBAAyB;EACzB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;;EAEE,eAAe;AACjB;AACA;EACE,yBAAyB;EACzB,gBAAgB;AAClB;AACA;EACE,yBAAyB;EACzB,gBAAgB;AAClB;AACA,+CAA+C","sourcesContent":["@import url(\"https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Indie+Flower&family=Signika&display=swap\");\n/* The input field for new projects */\n#projectUserInput {\n  position: fixed;\n  height: 100vh;\n  width: 100vw;\n  background-color: rgb(0, 0, 0, 0.5);\n  z-index: 5;\n}\n/* Where Things are Inputed */\n#inputContainer {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  max-height: min(80%, 600px);\n  max-width: min(80%, 400px);\n  top: 50%;\n  left: 50%;\n  margin-top: -300px;\n  margin-left: -200px;\n  background-color: #fafafa;\n  border-radius: 20px;\n  padding-top: 50px;\n  padding-left: 40px;\n  padding-right: 40px;\n  row-gap: 20px;\n  transition: padding 0.3s ease;\n}\n/* Only Push Content If Screen Is Certain Size */\n@media screen and (max-width: 600px), (max-height: 650px) {\n  #projectUserInput {\n    display: flex;\n    align-items: center;\n    justify-content: center;\n  }\n  #inputContainer {\n    top: 0;\n    left: 0;\n    margin-top: 0px;\n    margin-left: 0px;\n    padding-top: 25px;\n    padding-left: 20px;\n    padding-right: 20px;\n  }\n}\n@media screen and (max-height: 650px) {\n  #colorsSelect {\n    height: 100px;\n  }\n  #addProjectLabel {\n    font-size: 20px !important;\n  }\n}\n\n#addProjectLabel {\n  font-size: 48px;\n  padding-bottom: 5px;\n  border-bottom: solid rgb(0, 0, 0, 0.3);\n}\n/* Project Form */\n#projectForm {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  max-height: min(80%, 600px);\n  width: 100%;\n  row-gap: 20px;\n}\n/* Name Field */\n#nameInput {\n  width: 100%;\n  height: 30px;\n  margin-top: 10px;\n  margin-left: -13px;\n  border-radius: 30px;\n  border-style: solid;\n  padding-left: 20px;\n  align-self: center;\n  border-color: black;\n}\n#nameInput:focus-visible {\n  border-color: white;\n}\n#nameInputLabel {\n  width: 100%;\n}\n#nameInputSpan {\n  margin-left: 10px;\n}\n/* Color Field */\n#colorsSelect {\n  align-self: center;\n  width: 100%;\n  max-height: min(50%, 600px);\n  display: grid;\n  align-items: center;\n  grid-template-columns: 1fr 10fr;\n  grid-template-rows: repeat(11, 1fr);\n  overflow-y: scroll;\n}\n.option {\n  font-size: 36px;\n  display: flex;\n  align-items: center;\n}\noption:checked {\n  background: linear-gradient(#64748b, #94a3b8);\n}\n.option:hover {\n  background-color: #d4d4d8;\n}\n.colorCircle {\n  display: inline-block;\n  height: 20px;\n  width: 20px;\n  border-radius: 360px;\n  margin-left: auto;\n  margin-right: 20px;\n}\n/* Buttons Container*/\n#buttonContainer {\n  margin-left: auto;\n  display: flex;\n  column-gap: 20px;\n  margin-top: auto;\n  margin-bottom: 20px;\n}\n#buttonContainer > button {\n  width: 100px;\n  height: 35px;\n  border-radius: 10px;\n}\n/* Buttons */\n.cancel {\n  background-color: #f4f4f5;\n  border-style: solid;\n  border-color: #d4d4d8;\n}\n.save {\n  background-color: #fca5a5;\n  border-style: solid;\n  border-color: #ef4444;\n  color: #111;\n}\n.save:disabled {\n  background-color: #fbd0d0;\n  border-color: #fbd0d0;\n  cursor: not-allowed;\n}\n.cancel:hover,\n.save:enabled:hover {\n  cursor: pointer;\n}\n.cancel:hover {\n  background-color: #d4d4d8;\n  transition: 0.2s;\n}\n.save:enabled:hover {\n  background-color: #ef4444;\n  transition: 0.2s;\n}\n/*--------------------------------------------*/\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/projectModule.css":
/*!*********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/projectModule.css ***!
  \*********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `#selectedProject {
  font-size: min(96px, 10vw);
  display: flex;
  align-items: center;
  border-top: none;
}
#selectedProject,
.priorityOne,
.priorityTwo,
.priorityThree,
.priorityFour {
  width: 100%;
  height: 121px;
  margin-top: 30px;
  margin-bottom: 30px;
}
/* Styling For Where The Todos Will Go */
.priorityOne,
.priorityTwo,
.priorityThree,
.priorityFour {
  display: grid;
  grid-template-columns: 1fr;
  row-gap: 10px;
  height: fit-content;
  font-size: min(64px, 10vw);
  border-top: 1px solid #d4d4d8;
}
/* Color The Priorities, More Red, More Urgent */
.priorityOne {
  color: #ff0066;
}
.priorityTwo {
  color: #ffd700;
}
.priorityThree {
  color: rgb(9, 255, 50);
}
.priorityFour {
  color: #2850ff;
}
/* Button To Add Todos */
#addTodoBtn {
  margin-left: auto;
  background-color: #ffffff;
  border-style: solid;
  border-color: #ffffff;
  color: #111;
  border-radius: 10px;
  height: 40px;
}
#addTodoBtn:hover {
  background-color: #d4d4d8;
  transition: 0.2s;
  cursor: pointer;
}
/*All Todos*/
.todo {
  display: flex;
  align-items: center;
  column-gap: 10px;
  background-color: #f4f4f5;
  height: 60px;
  padding-right: 20px;
  justify-self: center;
  width: 95%;
  transition: width 0.2s;
  transition: box-shadow 0.2s;
}
.todo:hover {
  height: 65px;
  box-shadow: 3px 5px 5px #000000;
  width: 96%;
}
/*Show Priority color*/
.priorityColor {
  width: 5px;
  height: 100%;
  background-color: #000000;
}
/*Checkbox For Todos*/
.todoCheckbox {
  height: 18px;
  width: 18px;
  margin-left: 10px;
  margin-right: 10px;
  accent-color: #000000;
  border: #111;
}
@keyframes strikeThrough {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
.strikeThrough {
  position: relative;
  color: #d4d4d8 !important;
}
.strikeThrough::after {
  content: " ";
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background: black;
  animation-name: strikeThrough;
  animation-duration: 0.2s;
  animation-timing-function: linear;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
.taskName {
  font-size: min(24px, 10vw);
  color: #111;
  transition: color 0.2s;
  width: auto;
  max-width: 500px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.detailsBtn {
  height: 35px;
  width: 100px;
  margin-left: auto;
  background-color: transparent;
  border: 2px solid #000000;
  color: #000000;
  font-family: "Signika";
  font-size: min(16px, 10vw);
  font-weight: bold;
}
.detailsBtn:hover {
  background-color: #000000;
  color: #ffffff;
  cursor: pointer;
  transition: 0.2s;
}
.detailsBtnChecked {
  opacity: 0.5;
}
.dueDateEl {
  font-size: min(18px, 10vw);
  color: #000000;
}
.trashCan,
.editIcon {
  height: fit-content;
  font-size: min(40px, 10vw);
  transition: 0.2s;
  color: rgb(0, 0, 0);
}
.trashCan:hover,
.editIcon:hover {
  color: rgb(129, 129, 129);
  cursor: pointer;
}
.trashCan::before {
  content: "\\01F5D1";
}
.editIcon::before {
  content: "\\01F589";
}
.trashCanChecked,
.editIconChecked {
  opacity: 0.5;
}

/* For The Display Of A Todos Details */
#taskInfo {
  display: flex;
  flex-direction: column;
  height: min(80%, 400px);
  width: min(80%, 600px);
  background-color: #fafafa;
  border-radius: 20px;
  padding-top: 10px;
  padding-left: 40px;
  padding-right: 40px;
  row-gap: 20px;
  transition: padding 0.3s ease;
}
#closeIcon {
  margin-left: auto;
  width: fit-content;
  font-size: 2em;
}
#closeIcon:hover {
  cursor: pointer;
  color: red;
}

#taskInfo li {
  list-style: none;
}
#taskDetailsName {
  font-size: 2em;
}

@media screen and (max-width: 800px) {
  .taskName {
    max-width: 300px;
  }
}
@media screen and (max-width: 600px) {
  .taskName {
    max-width: 150px;
  }

  #taskInfo {
    padding-top: 10px;
    padding-left: 20px;
    padding-right: 20px;
  }
}
`, "",{"version":3,"sources":["webpack://./src/projectModule.css"],"names":[],"mappings":"AAAA;EACE,0BAA0B;EAC1B,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;;;;;EAKE,WAAW;EACX,aAAa;EACb,gBAAgB;EAChB,mBAAmB;AACrB;AACA,wCAAwC;AACxC;;;;EAIE,aAAa;EACb,0BAA0B;EAC1B,aAAa;EACb,mBAAmB;EACnB,0BAA0B;EAC1B,6BAA6B;AAC/B;AACA,gDAAgD;AAChD;EACE,cAAc;AAChB;AACA;EACE,cAAc;AAChB;AACA;EACE,sBAAsB;AACxB;AACA;EACE,cAAc;AAChB;AACA,wBAAwB;AACxB;EACE,iBAAiB;EACjB,yBAAyB;EACzB,mBAAmB;EACnB,qBAAqB;EACrB,WAAW;EACX,mBAAmB;EACnB,YAAY;AACd;AACA;EACE,yBAAyB;EACzB,gBAAgB;EAChB,eAAe;AACjB;AACA,YAAY;AACZ;EACE,aAAa;EACb,mBAAmB;EACnB,gBAAgB;EAChB,yBAAyB;EACzB,YAAY;EACZ,mBAAmB;EACnB,oBAAoB;EACpB,UAAU;EACV,sBAAsB;EACtB,2BAA2B;AAC7B;AACA;EACE,YAAY;EACZ,+BAA+B;EAC/B,UAAU;AACZ;AACA,sBAAsB;AACtB;EACE,UAAU;EACV,YAAY;EACZ,yBAAyB;AAC3B;AACA,qBAAqB;AACrB;EACE,YAAY;EACZ,WAAW;EACX,iBAAiB;EACjB,kBAAkB;EAClB,qBAAqB;EACrB,YAAY;AACd;AACA;EACE;IACE,QAAQ;EACV;EACA;IACE,WAAW;EACb;AACF;AACA;EACE,kBAAkB;EAClB,yBAAyB;AAC3B;AACA;EACE,YAAY;EACZ,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,WAAW;EACX,WAAW;EACX,iBAAiB;EACjB,6BAA6B;EAC7B,wBAAwB;EACxB,iCAAiC;EACjC,4BAA4B;EAC5B,6BAA6B;AAC/B;AACA;EACE,0BAA0B;EAC1B,WAAW;EACX,sBAAsB;EACtB,WAAW;EACX,gBAAgB;EAChB,gBAAgB;EAChB,uBAAuB;AACzB;AACA;EACE,YAAY;EACZ,YAAY;EACZ,iBAAiB;EACjB,6BAA6B;EAC7B,yBAAyB;EACzB,cAAc;EACd,sBAAsB;EACtB,0BAA0B;EAC1B,iBAAiB;AACnB;AACA;EACE,yBAAyB;EACzB,cAAc;EACd,eAAe;EACf,gBAAgB;AAClB;AACA;EACE,YAAY;AACd;AACA;EACE,0BAA0B;EAC1B,cAAc;AAChB;AACA;;EAEE,mBAAmB;EACnB,0BAA0B;EAC1B,gBAAgB;EAChB,mBAAmB;AACrB;AACA;;EAEE,yBAAyB;EACzB,eAAe;AACjB;AACA;EACE,kBAAkB;AACpB;AACA;EACE,kBAAkB;AACpB;AACA;;EAEE,YAAY;AACd;;AAEA,uCAAuC;AACvC;EACE,aAAa;EACb,sBAAsB;EACtB,uBAAuB;EACvB,sBAAsB;EACtB,yBAAyB;EACzB,mBAAmB;EACnB,iBAAiB;EACjB,kBAAkB;EAClB,mBAAmB;EACnB,aAAa;EACb,6BAA6B;AAC/B;AACA;EACE,iBAAiB;EACjB,kBAAkB;EAClB,cAAc;AAChB;AACA;EACE,eAAe;EACf,UAAU;AACZ;;AAEA;EACE,gBAAgB;AAClB;AACA;EACE,cAAc;AAChB;;AAEA;EACE;IACE,gBAAgB;EAClB;AACF;AACA;EACE;IACE,gBAAgB;EAClB;;EAEA;IACE,iBAAiB;IACjB,kBAAkB;IAClB,mBAAmB;EACrB;AACF","sourcesContent":["#selectedProject {\n  font-size: min(96px, 10vw);\n  display: flex;\n  align-items: center;\n  border-top: none;\n}\n#selectedProject,\n.priorityOne,\n.priorityTwo,\n.priorityThree,\n.priorityFour {\n  width: 100%;\n  height: 121px;\n  margin-top: 30px;\n  margin-bottom: 30px;\n}\n/* Styling For Where The Todos Will Go */\n.priorityOne,\n.priorityTwo,\n.priorityThree,\n.priorityFour {\n  display: grid;\n  grid-template-columns: 1fr;\n  row-gap: 10px;\n  height: fit-content;\n  font-size: min(64px, 10vw);\n  border-top: 1px solid #d4d4d8;\n}\n/* Color The Priorities, More Red, More Urgent */\n.priorityOne {\n  color: #ff0066;\n}\n.priorityTwo {\n  color: #ffd700;\n}\n.priorityThree {\n  color: rgb(9, 255, 50);\n}\n.priorityFour {\n  color: #2850ff;\n}\n/* Button To Add Todos */\n#addTodoBtn {\n  margin-left: auto;\n  background-color: #ffffff;\n  border-style: solid;\n  border-color: #ffffff;\n  color: #111;\n  border-radius: 10px;\n  height: 40px;\n}\n#addTodoBtn:hover {\n  background-color: #d4d4d8;\n  transition: 0.2s;\n  cursor: pointer;\n}\n/*All Todos*/\n.todo {\n  display: flex;\n  align-items: center;\n  column-gap: 10px;\n  background-color: #f4f4f5;\n  height: 60px;\n  padding-right: 20px;\n  justify-self: center;\n  width: 95%;\n  transition: width 0.2s;\n  transition: box-shadow 0.2s;\n}\n.todo:hover {\n  height: 65px;\n  box-shadow: 3px 5px 5px #000000;\n  width: 96%;\n}\n/*Show Priority color*/\n.priorityColor {\n  width: 5px;\n  height: 100%;\n  background-color: #000000;\n}\n/*Checkbox For Todos*/\n.todoCheckbox {\n  height: 18px;\n  width: 18px;\n  margin-left: 10px;\n  margin-right: 10px;\n  accent-color: #000000;\n  border: #111;\n}\n@keyframes strikeThrough {\n  0% {\n    width: 0;\n  }\n  100% {\n    width: 100%;\n  }\n}\n.strikeThrough {\n  position: relative;\n  color: #d4d4d8 !important;\n}\n.strikeThrough::after {\n  content: \" \";\n  position: absolute;\n  top: 50%;\n  left: 0;\n  width: 100%;\n  height: 1px;\n  background: black;\n  animation-name: strikeThrough;\n  animation-duration: 0.2s;\n  animation-timing-function: linear;\n  animation-iteration-count: 1;\n  animation-fill-mode: forwards;\n}\n.taskName {\n  font-size: min(24px, 10vw);\n  color: #111;\n  transition: color 0.2s;\n  width: auto;\n  max-width: 500px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.detailsBtn {\n  height: 35px;\n  width: 100px;\n  margin-left: auto;\n  background-color: transparent;\n  border: 2px solid #000000;\n  color: #000000;\n  font-family: \"Signika\";\n  font-size: min(16px, 10vw);\n  font-weight: bold;\n}\n.detailsBtn:hover {\n  background-color: #000000;\n  color: #ffffff;\n  cursor: pointer;\n  transition: 0.2s;\n}\n.detailsBtnChecked {\n  opacity: 0.5;\n}\n.dueDateEl {\n  font-size: min(18px, 10vw);\n  color: #000000;\n}\n.trashCan,\n.editIcon {\n  height: fit-content;\n  font-size: min(40px, 10vw);\n  transition: 0.2s;\n  color: rgb(0, 0, 0);\n}\n.trashCan:hover,\n.editIcon:hover {\n  color: rgb(129, 129, 129);\n  cursor: pointer;\n}\n.trashCan::before {\n  content: \"\\01F5D1\";\n}\n.editIcon::before {\n  content: \"\\01F589\";\n}\n.trashCanChecked,\n.editIconChecked {\n  opacity: 0.5;\n}\n\n/* For The Display Of A Todos Details */\n#taskInfo {\n  display: flex;\n  flex-direction: column;\n  height: min(80%, 400px);\n  width: min(80%, 600px);\n  background-color: #fafafa;\n  border-radius: 20px;\n  padding-top: 10px;\n  padding-left: 40px;\n  padding-right: 40px;\n  row-gap: 20px;\n  transition: padding 0.3s ease;\n}\n#closeIcon {\n  margin-left: auto;\n  width: fit-content;\n  font-size: 2em;\n}\n#closeIcon:hover {\n  cursor: pointer;\n  color: red;\n}\n\n#taskInfo li {\n  list-style: none;\n}\n#taskDetailsName {\n  font-size: 2em;\n}\n\n@media screen and (max-width: 800px) {\n  .taskName {\n    max-width: 300px;\n  }\n}\n@media screen and (max-width: 600px) {\n  .taskName {\n    max-width: 150px;\n  }\n\n  #taskInfo {\n    padding-top: 10px;\n    padding-left: 20px;\n    padding-right: 20px;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/*!*************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/style.css ***!
  \*************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Indie+Flower&family=Signika&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `body {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 0;
  margin: 0;
}
/*Hamburger Switch*/
[role="switch"][aria-checked="false"] {
  background: rgb(0, 255, 0);
  color: #eef;
}
[role="switch"][aria-checked="true"] {
  background: rgb(255, 0, 0);
  color: #eef;
}
/*-----------------*/

/* The navBar menu */
#navBar {
  display: flex;
  align-items: center;
  background-image: linear-gradient(
    to left,
    violet,
    indigo,
    #2850ff,
    green,
    yellow,
    orange,
    red
  );
  position: fixed;
  width: 100%;
  height: 5vh;
  min-height: min-content;
}
/*------------------*/

/* The Sidebar Inbox */
#sideBarInbox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: "Signika";
  /* background-image: linear-gradient(
    to left,
    violet,
    indigo,
    #2850ff,
    green,
    yellow,
    orange,
    red
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;*/
  color: white;
  font-size: 2em;
  padding-left: 5%;
  margin-bottom: 30px; /* Place content 60px from the top */
  margin-top: 30px;
}
/* The sidebar menu */
.sidebar {
  font-family: "Signika";
  height: 100%; /* 90% Full-height */
  width: 0; /* 0 width - change this with JavaScript */
  position: fixed; /* Stay in place */
  z-index: 1; /* Stay on top */
  top: 5vh;
  left: 0;
  background-color: #0f172a; /* Blue*/
  overflow-x: hidden; /* Disable horizontal scroll */
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidebar */
}
/* Collapse Classes for Sidebar and Content */
.sidebarOpen {
  width: 250px;
}
/* Only Push Content If Screen Is Certain Size */
@media screen and (min-width: 450px) {
  .contentPushed {
    margin-left: 250px;
  }
}
.projectsOpen {
  max-height: 1440px !important;
}
/* The Sidebar Project Container*/
#projectsContainer {
  /*  background: linear-gradient(180deg, #ff0066, #2850ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  */
  max-height: 0px;
  overflow: hidden;
  transition: max-height 0.3s ease;
}
/* The Sidebar Project Label*/
#projectLabelContainer {
  height: auto;
  color: white;
  display: flex;
  font-size: 2em;
  padding-left: 5%;
  background: -webkit-linear-gradient(180deg, #ff0000, #8400ff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
#projectLabelContainer > :first-child:hover,
#sidbarButtonContainer > :hover,
#projectsContainer > :hover,
#sideBarInbox:hover {
  cursor: pointer;
  opacity: 0.5;
}
/* The Sidebar Project Buttons*/
#sidbarButtonContainer {
  margin-left: auto;
  margin-right: 10%;
  display: flex;
  gap: 20%;
}
/* The sidebar links */
.sidebar a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 25px;
  color: #ffffff;
  display: block;
  transition: 0.3s;
  width: 80%;
  display: flex;
  align-items: center;
}
/* Same as color circle in projectForm.css just without margin-left */
.colorCircle-P {
  display: inline-block;
  height: 30px;
  width: 30px;
  border-radius: 360px;
  margin-right: 20px;
  text-align: center;
  color: #111;
}
.colorCircle-Inbox {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  border-radius: 360px;
  margin-right: 20px;
  text-align: center;
  color: #111;
}
/* When you mouse over the navigation links, change their color */
.sidebar a:hover {
  color: #f1f1f1;
}

/* Position and style the close button (top right corner) */
.sidebar .closebtn {
  position: absolute;
  top: 0;
  right: 25px;
  font-size: 36px;
  margin-left: 50px;
}

/* The button used to open the sidebar */
.openBtn {
  font-size: 20px;
  height: 100%;
  cursor: pointer;
  background-color: #111;
  color: white;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 3vh;
  border: none;
}

.openBtn:hover {
  background-color: #444;
}

/* On smaller screens, where height is less than 450px, change the style of the sidenav (less padding and a smaller font size) */
@media screen and (max-height: 450px) {
  .sidebar {
    padding-top: 15px;
  }
  .sidebar a {
    font-size: 18px;
  }
}

/* Style page content - use this if you want to push the page content to the right when you open the side navigation */
#content {
  font-family: "Signika";
  transition: margin-left 0.5s; /* If you want a transition effect */
  padding: 5vh 0px 0px 0px;
  /* height: 200vh;*/
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  max-width: min(100%, 800px);
  padding-left: calc(50% - min(50%, 400px)); /* center element */
}
/* Projects Home Screen Itself */
#contentHome {
  width: 100%;
  height: 121px;
  font-size: min(92px, 10vw);
  display: flex;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 30px;
  border-bottom: 1px solid #d4d4d8;
  grid-row: 1;
}
/* Button to add Projects on Home Screen */
#homeAddProjectBtn {
  margin-left: auto;
  background-color: #ffffff;
  border-style: solid;
  border-color: #ffffff;
  color: #111;
  border-radius: 10px;
  height: 40px;
}
#homeAddProjectBtn:hover {
  background-color: #d4d4d8;
  transition: 0.2s;
  cursor: pointer;
}
`, "",{"version":3,"sources":["webpack://./src/style.css"],"names":[],"mappings":"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","sourcesContent":["@import url(\"https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Indie+Flower&family=Signika&display=swap\");\n\nbody {\n  display: flex;\n  flex-direction: column;\n  flex-wrap: wrap;\n  padding: 0;\n  margin: 0;\n}\n/*Hamburger Switch*/\n[role=\"switch\"][aria-checked=\"false\"] {\n  background: rgb(0, 255, 0);\n  color: #eef;\n}\n[role=\"switch\"][aria-checked=\"true\"] {\n  background: rgb(255, 0, 0);\n  color: #eef;\n}\n/*-----------------*/\n\n/* The navBar menu */\n#navBar {\n  display: flex;\n  align-items: center;\n  background-image: linear-gradient(\n    to left,\n    violet,\n    indigo,\n    #2850ff,\n    green,\n    yellow,\n    orange,\n    red\n  );\n  position: fixed;\n  width: 100%;\n  height: 5vh;\n  min-height: min-content;\n}\n/*------------------*/\n\n/* The Sidebar Inbox */\n#sideBarInbox {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  font-family: \"Signika\";\n  /* background-image: linear-gradient(\n    to left,\n    violet,\n    indigo,\n    #2850ff,\n    green,\n    yellow,\n    orange,\n    red\n  );\n  background-clip: text;\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;*/\n  color: white;\n  font-size: 2em;\n  padding-left: 5%;\n  margin-bottom: 30px; /* Place content 60px from the top */\n  margin-top: 30px;\n}\n/* The sidebar menu */\n.sidebar {\n  font-family: \"Signika\";\n  height: 100%; /* 90% Full-height */\n  width: 0; /* 0 width - change this with JavaScript */\n  position: fixed; /* Stay in place */\n  z-index: 1; /* Stay on top */\n  top: 5vh;\n  left: 0;\n  background-color: #0f172a; /* Blue*/\n  overflow-x: hidden; /* Disable horizontal scroll */\n  transition: 0.5s; /* 0.5 second transition effect to slide in the sidebar */\n}\n/* Collapse Classes for Sidebar and Content */\n.sidebarOpen {\n  width: 250px;\n}\n/* Only Push Content If Screen Is Certain Size */\n@media screen and (min-width: 450px) {\n  .contentPushed {\n    margin-left: 250px;\n  }\n}\n.projectsOpen {\n  max-height: 1440px !important;\n}\n/* The Sidebar Project Container*/\n#projectsContainer {\n  /*  background: linear-gradient(180deg, #ff0066, #2850ff);\n  background-clip: text;\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  */\n  max-height: 0px;\n  overflow: hidden;\n  transition: max-height 0.3s ease;\n}\n/* The Sidebar Project Label*/\n#projectLabelContainer {\n  height: auto;\n  color: white;\n  display: flex;\n  font-size: 2em;\n  padding-left: 5%;\n  background: -webkit-linear-gradient(180deg, #ff0000, #8400ff);\n  -webkit-background-clip: text;\n  background-clip: text;\n  -webkit-text-fill-color: transparent;\n}\n#projectLabelContainer > :first-child:hover,\n#sidbarButtonContainer > :hover,\n#projectsContainer > :hover,\n#sideBarInbox:hover {\n  cursor: pointer;\n  opacity: 0.5;\n}\n/* The Sidebar Project Buttons*/\n#sidbarButtonContainer {\n  margin-left: auto;\n  margin-right: 10%;\n  display: flex;\n  gap: 20%;\n}\n/* The sidebar links */\n.sidebar a {\n  padding: 8px 8px 8px 32px;\n  text-decoration: none;\n  font-size: 25px;\n  color: #ffffff;\n  display: block;\n  transition: 0.3s;\n  width: 80%;\n  display: flex;\n  align-items: center;\n}\n/* Same as color circle in projectForm.css just without margin-left */\n.colorCircle-P {\n  display: inline-block;\n  height: 30px;\n  width: 30px;\n  border-radius: 360px;\n  margin-right: 20px;\n  text-align: center;\n  color: #111;\n}\n.colorCircle-Inbox {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  height: 40px;\n  width: 40px;\n  border-radius: 360px;\n  margin-right: 20px;\n  text-align: center;\n  color: #111;\n}\n/* When you mouse over the navigation links, change their color */\n.sidebar a:hover {\n  color: #f1f1f1;\n}\n\n/* Position and style the close button (top right corner) */\n.sidebar .closebtn {\n  position: absolute;\n  top: 0;\n  right: 25px;\n  font-size: 36px;\n  margin-left: 50px;\n}\n\n/* The button used to open the sidebar */\n.openBtn {\n  font-size: 20px;\n  height: 100%;\n  cursor: pointer;\n  background-color: #111;\n  color: white;\n  padding-left: 20px;\n  padding-right: 20px;\n  font-size: 3vh;\n  border: none;\n}\n\n.openBtn:hover {\n  background-color: #444;\n}\n\n/* On smaller screens, where height is less than 450px, change the style of the sidenav (less padding and a smaller font size) */\n@media screen and (max-height: 450px) {\n  .sidebar {\n    padding-top: 15px;\n  }\n  .sidebar a {\n    font-size: 18px;\n  }\n}\n\n/* Style page content - use this if you want to push the page content to the right when you open the side navigation */\n#content {\n  font-family: \"Signika\";\n  transition: margin-left 0.5s; /* If you want a transition effect */\n  padding: 5vh 0px 0px 0px;\n  /* height: 200vh;*/\n  display: grid;\n  grid-template-columns: 1fr;\n  grid-template-rows: auto;\n  max-width: min(100%, 800px);\n  padding-left: calc(50% - min(50%, 400px)); /* center element */\n}\n/* Projects Home Screen Itself */\n#contentHome {\n  width: 100%;\n  height: 121px;\n  font-size: min(92px, 10vw);\n  display: flex;\n  align-items: center;\n  margin-top: 30px;\n  margin-bottom: 30px;\n  border-bottom: 1px solid #d4d4d8;\n  grid-row: 1;\n}\n/* Button to add Projects on Home Screen */\n#homeAddProjectBtn {\n  margin-left: auto;\n  background-color: #ffffff;\n  border-style: solid;\n  border-color: #ffffff;\n  color: #111;\n  border-radius: 10px;\n  height: 40px;\n}\n#homeAddProjectBtn:hover {\n  background-color: #d4d4d8;\n  transition: 0.2s;\n  cursor: pointer;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/taskForm.css":
/*!****************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/taskForm.css ***!
  \****************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Indie+Flower&family=Signika&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `/* The Background For The Input Field */
#taskBackground {
  position: fixed;
  height: 100vh;
  width: 100vw;
  background-color: rgb(0, 0, 0, 0.5);
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Signika";
}
/* Where Things are Inputed */
#taskUserInput {
  display: flex;
  flex-direction: column;
  height: min(80%, 400px);
  max-width: min(80%, 600px);
  background-color: #fafafa;
  border-radius: 20px;
  padding-top: 10px;
  padding-left: 40px;
  padding-right: 40px;
  row-gap: 20px;
  transition: padding 0.3s ease;
}
/* Task Form */
#taskForm {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  row-gap: 20px;
}
/* Task Name Field */
#taskName {
  width: 100%;
  height: 60px;
  align-self: center;
  border: none;
  background-color: #fafafa;
  font-size: min(36px, 10vw);
  padding: 0;
  font-weight: bold;
}
.Invalid {
  background-color: #fca5a5 !important;
}

#taskName:focus-visible,
#taskDescription:focus-visible {
  outline: none;
}
/* Task Name Field */
#taskDescription {
  width: 100%;
  height: min(50%, 600px);
  font-size: min(24px, 10vw);
  background-color: #fafafa;
  border: none;
  padding: 0;
  resize: none;
  color: #52525b;
}
/* Buttons Container*/
#taskOptionsContainer {
  display: flex;
  justify-content: center;
  column-gap: 20px;
  margin-top: auto;
  margin-bottom: 20px;
}
#taskOptionsContainer > button {
  width: 100px;
  height: 35px;
  border-radius: 10px;
}

@media screen and (max-width: 600px) {
  /* Where Things are Inputed */
  #taskUserInput {
    border-radius: 20px;
    padding-top: 5px;
    padding-left: 20px;
    padding-right: 20px;
  }
  #taskOptionsContainer {
    display: grid;
    justify-items: center;
    row-gap: 10px;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
  }
}

#selectPriority {
  /* Reset Select */
  outline: 0;
  border: 0;
  box-shadow: none;
  /* Personalize */
  padding: 0 1em;
  color: #ffffff;
  background-color: #0f172a;
  background-image: none;
  cursor: pointer;
}
/* Buttons */
.cancelBtn,
#dueDate {
  background-color: #f4f4f5;
  border-style: solid;
  border-color: #d4d4d8;
}
.saveBtn {
  background-color: #fca5a5;
  border-style: solid;
  border-color: #ef4444;
  color: #111;
}
.saveBtn:disabled {
  background-color: #fbd0d0;
  border-color: #fbd0d0;
  cursor: not-allowed;
}
.cancelBtn:hover,
.saveBtn:enabled:hover {
  cursor: pointer;
}
.cancelBtn:hover,
#dueDate:hover {
  background-color: #d4d4d8;
  transition: 0.2s;
}
.saveBtn:enabled:hover {
  background-color: #ef4444;
  transition: 0.2s;
}
`, "",{"version":3,"sources":["webpack://./src/taskForm.css"],"names":[],"mappings":"AACA,uCAAuC;AACvC;EACE,eAAe;EACf,aAAa;EACb,YAAY;EACZ,mCAAmC;EACnC,UAAU;EACV,aAAa;EACb,mBAAmB;EACnB,uBAAuB;EACvB,sBAAsB;AACxB;AACA,6BAA6B;AAC7B;EACE,aAAa;EACb,sBAAsB;EACtB,uBAAuB;EACvB,0BAA0B;EAC1B,yBAAyB;EACzB,mBAAmB;EACnB,iBAAiB;EACjB,kBAAkB;EAClB,mBAAmB;EACnB,aAAa;EACb,6BAA6B;AAC/B;AACA,cAAc;AACd;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,YAAY;EACZ,WAAW;EACX,aAAa;AACf;AACA,oBAAoB;AACpB;EACE,WAAW;EACX,YAAY;EACZ,kBAAkB;EAClB,YAAY;EACZ,yBAAyB;EACzB,0BAA0B;EAC1B,UAAU;EACV,iBAAiB;AACnB;AACA;EACE,oCAAoC;AACtC;;AAEA;;EAEE,aAAa;AACf;AACA,oBAAoB;AACpB;EACE,WAAW;EACX,uBAAuB;EACvB,0BAA0B;EAC1B,yBAAyB;EACzB,YAAY;EACZ,UAAU;EACV,YAAY;EACZ,cAAc;AAChB;AACA,qBAAqB;AACrB;EACE,aAAa;EACb,uBAAuB;EACvB,gBAAgB;EAChB,gBAAgB;EAChB,mBAAmB;AACrB;AACA;EACE,YAAY;EACZ,YAAY;EACZ,mBAAmB;AACrB;;AAEA;EACE,6BAA6B;EAC7B;IACE,mBAAmB;IACnB,gBAAgB;IAChB,kBAAkB;IAClB,mBAAmB;EACrB;EACA;IACE,aAAa;IACb,qBAAqB;IACrB,aAAa;IACb,8BAA8B;IAC9B,2BAA2B;EAC7B;AACF;;AAEA;EACE,iBAAiB;EACjB,UAAU;EACV,SAAS;EACT,gBAAgB;EAChB,gBAAgB;EAChB,cAAc;EACd,cAAc;EACd,yBAAyB;EACzB,sBAAsB;EACtB,eAAe;AACjB;AACA,YAAY;AACZ;;EAEE,yBAAyB;EACzB,mBAAmB;EACnB,qBAAqB;AACvB;AACA;EACE,yBAAyB;EACzB,mBAAmB;EACnB,qBAAqB;EACrB,WAAW;AACb;AACA;EACE,yBAAyB;EACzB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;;EAEE,eAAe;AACjB;AACA;;EAEE,yBAAyB;EACzB,gBAAgB;AAClB;AACA;EACE,yBAAyB;EACzB,gBAAgB;AAClB","sourcesContent":["@import url(\"https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Indie+Flower&family=Signika&display=swap\");\n/* The Background For The Input Field */\n#taskBackground {\n  position: fixed;\n  height: 100vh;\n  width: 100vw;\n  background-color: rgb(0, 0, 0, 0.5);\n  z-index: 5;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-family: \"Signika\";\n}\n/* Where Things are Inputed */\n#taskUserInput {\n  display: flex;\n  flex-direction: column;\n  height: min(80%, 400px);\n  max-width: min(80%, 600px);\n  background-color: #fafafa;\n  border-radius: 20px;\n  padding-top: 10px;\n  padding-left: 40px;\n  padding-right: 40px;\n  row-gap: 20px;\n  transition: padding 0.3s ease;\n}\n/* Task Form */\n#taskForm {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  height: 100%;\n  width: 100%;\n  row-gap: 20px;\n}\n/* Task Name Field */\n#taskName {\n  width: 100%;\n  height: 60px;\n  align-self: center;\n  border: none;\n  background-color: #fafafa;\n  font-size: min(36px, 10vw);\n  padding: 0;\n  font-weight: bold;\n}\n.Invalid {\n  background-color: #fca5a5 !important;\n}\n\n#taskName:focus-visible,\n#taskDescription:focus-visible {\n  outline: none;\n}\n/* Task Name Field */\n#taskDescription {\n  width: 100%;\n  height: min(50%, 600px);\n  font-size: min(24px, 10vw);\n  background-color: #fafafa;\n  border: none;\n  padding: 0;\n  resize: none;\n  color: #52525b;\n}\n/* Buttons Container*/\n#taskOptionsContainer {\n  display: flex;\n  justify-content: center;\n  column-gap: 20px;\n  margin-top: auto;\n  margin-bottom: 20px;\n}\n#taskOptionsContainer > button {\n  width: 100px;\n  height: 35px;\n  border-radius: 10px;\n}\n\n@media screen and (max-width: 600px) {\n  /* Where Things are Inputed */\n  #taskUserInput {\n    border-radius: 20px;\n    padding-top: 5px;\n    padding-left: 20px;\n    padding-right: 20px;\n  }\n  #taskOptionsContainer {\n    display: grid;\n    justify-items: center;\n    row-gap: 10px;\n    grid-template-columns: 1fr 1fr;\n    grid-template-rows: 1fr 1fr;\n  }\n}\n\n#selectPriority {\n  /* Reset Select */\n  outline: 0;\n  border: 0;\n  box-shadow: none;\n  /* Personalize */\n  padding: 0 1em;\n  color: #ffffff;\n  background-color: #0f172a;\n  background-image: none;\n  cursor: pointer;\n}\n/* Buttons */\n.cancelBtn,\n#dueDate {\n  background-color: #f4f4f5;\n  border-style: solid;\n  border-color: #d4d4d8;\n}\n.saveBtn {\n  background-color: #fca5a5;\n  border-style: solid;\n  border-color: #ef4444;\n  color: #111;\n}\n.saveBtn:disabled {\n  background-color: #fbd0d0;\n  border-color: #fbd0d0;\n  cursor: not-allowed;\n}\n.cancelBtn:hover,\n.saveBtn:enabled:hover {\n  cursor: pointer;\n}\n.cancelBtn:hover,\n#dueDate:hover {\n  background-color: #d4d4d8;\n  transition: 0.2s;\n}\n.saveBtn:enabled:hover {\n  background-color: #ef4444;\n  transition: 0.2s;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/addLeadingZeros/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/addLeadingZeros/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ addLeadingZeros)
/* harmony export */ });
function addLeadingZeros(number, targetLength) {
  var sign = number < 0 ? '-' : '';
  var output = Math.abs(number).toString();
  while (output.length < targetLength) {
    output = '0' + output;
  }
  return sign + output;
}

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/defaultLocale/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/defaultLocale/index.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _locale_en_US_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../locale/en-US/index.js */ "./node_modules/date-fns/esm/locale/en-US/index.js");

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_locale_en_US_index_js__WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/defaultOptions/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/defaultOptions/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDefaultOptions: () => (/* binding */ getDefaultOptions),
/* harmony export */   setDefaultOptions: () => (/* binding */ setDefaultOptions)
/* harmony export */ });
var defaultOptions = {};
function getDefaultOptions() {
  return defaultOptions;
}
function setDefaultOptions(newOptions) {
  defaultOptions = newOptions;
}

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/format/formatters/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/format/formatters/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_getUTCDayOfYear_index_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../_lib/getUTCDayOfYear/index.js */ "./node_modules/date-fns/esm/_lib/getUTCDayOfYear/index.js");
/* harmony import */ var _lib_getUTCISOWeek_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../_lib/getUTCISOWeek/index.js */ "./node_modules/date-fns/esm/_lib/getUTCISOWeek/index.js");
/* harmony import */ var _lib_getUTCISOWeekYear_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../_lib/getUTCISOWeekYear/index.js */ "./node_modules/date-fns/esm/_lib/getUTCISOWeekYear/index.js");
/* harmony import */ var _lib_getUTCWeek_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../_lib/getUTCWeek/index.js */ "./node_modules/date-fns/esm/_lib/getUTCWeek/index.js");
/* harmony import */ var _lib_getUTCWeekYear_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../_lib/getUTCWeekYear/index.js */ "./node_modules/date-fns/esm/_lib/getUTCWeekYear/index.js");
/* harmony import */ var _addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../addLeadingZeros/index.js */ "./node_modules/date-fns/esm/_lib/addLeadingZeros/index.js");
/* harmony import */ var _lightFormatters_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../lightFormatters/index.js */ "./node_modules/date-fns/esm/_lib/format/lightFormatters/index.js");







var dayPeriodEnum = {
  am: 'am',
  pm: 'pm',
  midnight: 'midnight',
  noon: 'noon',
  morning: 'morning',
  afternoon: 'afternoon',
  evening: 'evening',
  night: 'night'
};
/*
 * |     | Unit                           |     | Unit                           |
 * |-----|--------------------------------|-----|--------------------------------|
 * |  a  | AM, PM                         |  A* | Milliseconds in day            |
 * |  b  | AM, PM, noon, midnight         |  B  | Flexible day period            |
 * |  c  | Stand-alone local day of week  |  C* | Localized hour w/ day period   |
 * |  d  | Day of month                   |  D  | Day of year                    |
 * |  e  | Local day of week              |  E  | Day of week                    |
 * |  f  |                                |  F* | Day of week in month           |
 * |  g* | Modified Julian day            |  G  | Era                            |
 * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
 * |  i! | ISO day of week                |  I! | ISO week of year               |
 * |  j* | Localized hour w/ day period   |  J* | Localized hour w/o day period  |
 * |  k  | Hour [1-24]                    |  K  | Hour [0-11]                    |
 * |  l* | (deprecated)                   |  L  | Stand-alone month              |
 * |  m  | Minute                         |  M  | Month                          |
 * |  n  |                                |  N  |                                |
 * |  o! | Ordinal number modifier        |  O  | Timezone (GMT)                 |
 * |  p! | Long localized time            |  P! | Long localized date            |
 * |  q  | Stand-alone quarter            |  Q  | Quarter                        |
 * |  r* | Related Gregorian year         |  R! | ISO week-numbering year        |
 * |  s  | Second                         |  S  | Fraction of second             |
 * |  t! | Seconds timestamp              |  T! | Milliseconds timestamp         |
 * |  u  | Extended year                  |  U* | Cyclic year                    |
 * |  v* | Timezone (generic non-locat.)  |  V* | Timezone (location)            |
 * |  w  | Local week of year             |  W* | Week of month                  |
 * |  x  | Timezone (ISO-8601 w/o Z)      |  X  | Timezone (ISO-8601)            |
 * |  y  | Year (abs)                     |  Y  | Local week-numbering year      |
 * |  z  | Timezone (specific non-locat.) |  Z* | Timezone (aliases)             |
 *
 * Letters marked by * are not implemented but reserved by Unicode standard.
 *
 * Letters marked by ! are non-standard, but implemented by date-fns:
 * - `o` modifies the previous token to turn it into an ordinal (see `format` docs)
 * - `i` is ISO day of week. For `i` and `ii` is returns numeric ISO week days,
 *   i.e. 7 for Sunday, 1 for Monday, etc.
 * - `I` is ISO week of year, as opposed to `w` which is local week of year.
 * - `R` is ISO week-numbering year, as opposed to `Y` which is local week-numbering year.
 *   `R` is supposed to be used in conjunction with `I` and `i`
 *   for universal ISO week-numbering date, whereas
 *   `Y` is supposed to be used in conjunction with `w` and `e`
 *   for week-numbering date specific to the locale.
 * - `P` is long localized date format
 * - `p` is long localized time format
 */

var formatters = {
  // Era
  G: function G(date, token, localize) {
    var era = date.getUTCFullYear() > 0 ? 1 : 0;
    switch (token) {
      // AD, BC
      case 'G':
      case 'GG':
      case 'GGG':
        return localize.era(era, {
          width: 'abbreviated'
        });
      // A, B
      case 'GGGGG':
        return localize.era(era, {
          width: 'narrow'
        });
      // Anno Domini, Before Christ
      case 'GGGG':
      default:
        return localize.era(era, {
          width: 'wide'
        });
    }
  },
  // Year
  y: function y(date, token, localize) {
    // Ordinal number
    if (token === 'yo') {
      var signedYear = date.getUTCFullYear();
      // Returns 1 for 1 BC (which is year 0 in JavaScript)
      var year = signedYear > 0 ? signedYear : 1 - signedYear;
      return localize.ordinalNumber(year, {
        unit: 'year'
      });
    }
    return _lightFormatters_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].y(date, token);
  },
  // Local week-numbering year
  Y: function Y(date, token, localize, options) {
    var signedWeekYear = (0,_lib_getUTCWeekYear_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(date, options);
    // Returns 1 for 1 BC (which is year 0 in JavaScript)
    var weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;

    // Two digit year
    if (token === 'YY') {
      var twoDigitYear = weekYear % 100;
      return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(twoDigitYear, 2);
    }

    // Ordinal number
    if (token === 'Yo') {
      return localize.ordinalNumber(weekYear, {
        unit: 'year'
      });
    }

    // Padding
    return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(weekYear, token.length);
  },
  // ISO week-numbering year
  R: function R(date, token) {
    var isoWeekYear = (0,_lib_getUTCISOWeekYear_index_js__WEBPACK_IMPORTED_MODULE_3__["default"])(date);

    // Padding
    return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(isoWeekYear, token.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function u(date, token) {
    var year = date.getUTCFullYear();
    return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(year, token.length);
  },
  // Quarter
  Q: function Q(date, token, localize) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case 'Q':
        return String(quarter);
      // 01, 02, 03, 04
      case 'QQ':
        return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case 'Qo':
        return localize.ordinalNumber(quarter, {
          unit: 'quarter'
        });
      // Q1, Q2, Q3, Q4
      case 'QQQ':
        return localize.quarter(quarter, {
          width: 'abbreviated',
          context: 'formatting'
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case 'QQQQQ':
        return localize.quarter(quarter, {
          width: 'narrow',
          context: 'formatting'
        });
      // 1st quarter, 2nd quarter, ...
      case 'QQQQ':
      default:
        return localize.quarter(quarter, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // Stand-alone quarter
  q: function q(date, token, localize) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case 'q':
        return String(quarter);
      // 01, 02, 03, 04
      case 'qq':
        return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case 'qo':
        return localize.ordinalNumber(quarter, {
          unit: 'quarter'
        });
      // Q1, Q2, Q3, Q4
      case 'qqq':
        return localize.quarter(quarter, {
          width: 'abbreviated',
          context: 'standalone'
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case 'qqqqq':
        return localize.quarter(quarter, {
          width: 'narrow',
          context: 'standalone'
        });
      // 1st quarter, 2nd quarter, ...
      case 'qqqq':
      default:
        return localize.quarter(quarter, {
          width: 'wide',
          context: 'standalone'
        });
    }
  },
  // Month
  M: function M(date, token, localize) {
    var month = date.getUTCMonth();
    switch (token) {
      case 'M':
      case 'MM':
        return _lightFormatters_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].M(date, token);
      // 1st, 2nd, ..., 12th
      case 'Mo':
        return localize.ordinalNumber(month + 1, {
          unit: 'month'
        });
      // Jan, Feb, ..., Dec
      case 'MMM':
        return localize.month(month, {
          width: 'abbreviated',
          context: 'formatting'
        });
      // J, F, ..., D
      case 'MMMMM':
        return localize.month(month, {
          width: 'narrow',
          context: 'formatting'
        });
      // January, February, ..., December
      case 'MMMM':
      default:
        return localize.month(month, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // Stand-alone month
  L: function L(date, token, localize) {
    var month = date.getUTCMonth();
    switch (token) {
      // 1, 2, ..., 12
      case 'L':
        return String(month + 1);
      // 01, 02, ..., 12
      case 'LL':
        return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(month + 1, 2);
      // 1st, 2nd, ..., 12th
      case 'Lo':
        return localize.ordinalNumber(month + 1, {
          unit: 'month'
        });
      // Jan, Feb, ..., Dec
      case 'LLL':
        return localize.month(month, {
          width: 'abbreviated',
          context: 'standalone'
        });
      // J, F, ..., D
      case 'LLLLL':
        return localize.month(month, {
          width: 'narrow',
          context: 'standalone'
        });
      // January, February, ..., December
      case 'LLLL':
      default:
        return localize.month(month, {
          width: 'wide',
          context: 'standalone'
        });
    }
  },
  // Local week of year
  w: function w(date, token, localize, options) {
    var week = (0,_lib_getUTCWeek_index_js__WEBPACK_IMPORTED_MODULE_4__["default"])(date, options);
    if (token === 'wo') {
      return localize.ordinalNumber(week, {
        unit: 'week'
      });
    }
    return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(week, token.length);
  },
  // ISO week of year
  I: function I(date, token, localize) {
    var isoWeek = (0,_lib_getUTCISOWeek_index_js__WEBPACK_IMPORTED_MODULE_5__["default"])(date);
    if (token === 'Io') {
      return localize.ordinalNumber(isoWeek, {
        unit: 'week'
      });
    }
    return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(isoWeek, token.length);
  },
  // Day of the month
  d: function d(date, token, localize) {
    if (token === 'do') {
      return localize.ordinalNumber(date.getUTCDate(), {
        unit: 'date'
      });
    }
    return _lightFormatters_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].d(date, token);
  },
  // Day of year
  D: function D(date, token, localize) {
    var dayOfYear = (0,_lib_getUTCDayOfYear_index_js__WEBPACK_IMPORTED_MODULE_6__["default"])(date);
    if (token === 'Do') {
      return localize.ordinalNumber(dayOfYear, {
        unit: 'dayOfYear'
      });
    }
    return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dayOfYear, token.length);
  },
  // Day of week
  E: function E(date, token, localize) {
    var dayOfWeek = date.getUTCDay();
    switch (token) {
      // Tue
      case 'E':
      case 'EE':
      case 'EEE':
        return localize.day(dayOfWeek, {
          width: 'abbreviated',
          context: 'formatting'
        });
      // T
      case 'EEEEE':
        return localize.day(dayOfWeek, {
          width: 'narrow',
          context: 'formatting'
        });
      // Tu
      case 'EEEEEE':
        return localize.day(dayOfWeek, {
          width: 'short',
          context: 'formatting'
        });
      // Tuesday
      case 'EEEE':
      default:
        return localize.day(dayOfWeek, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // Local day of week
  e: function e(date, token, localize, options) {
    var dayOfWeek = date.getUTCDay();
    var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (Nth day of week with current locale or weekStartsOn)
      case 'e':
        return String(localDayOfWeek);
      // Padded numerical value
      case 'ee':
        return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(localDayOfWeek, 2);
      // 1st, 2nd, ..., 7th
      case 'eo':
        return localize.ordinalNumber(localDayOfWeek, {
          unit: 'day'
        });
      case 'eee':
        return localize.day(dayOfWeek, {
          width: 'abbreviated',
          context: 'formatting'
        });
      // T
      case 'eeeee':
        return localize.day(dayOfWeek, {
          width: 'narrow',
          context: 'formatting'
        });
      // Tu
      case 'eeeeee':
        return localize.day(dayOfWeek, {
          width: 'short',
          context: 'formatting'
        });
      // Tuesday
      case 'eeee':
      default:
        return localize.day(dayOfWeek, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // Stand-alone local day of week
  c: function c(date, token, localize, options) {
    var dayOfWeek = date.getUTCDay();
    var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (same as in `e`)
      case 'c':
        return String(localDayOfWeek);
      // Padded numerical value
      case 'cc':
        return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(localDayOfWeek, token.length);
      // 1st, 2nd, ..., 7th
      case 'co':
        return localize.ordinalNumber(localDayOfWeek, {
          unit: 'day'
        });
      case 'ccc':
        return localize.day(dayOfWeek, {
          width: 'abbreviated',
          context: 'standalone'
        });
      // T
      case 'ccccc':
        return localize.day(dayOfWeek, {
          width: 'narrow',
          context: 'standalone'
        });
      // Tu
      case 'cccccc':
        return localize.day(dayOfWeek, {
          width: 'short',
          context: 'standalone'
        });
      // Tuesday
      case 'cccc':
      default:
        return localize.day(dayOfWeek, {
          width: 'wide',
          context: 'standalone'
        });
    }
  },
  // ISO day of week
  i: function i(date, token, localize) {
    var dayOfWeek = date.getUTCDay();
    var isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    switch (token) {
      // 2
      case 'i':
        return String(isoDayOfWeek);
      // 02
      case 'ii':
        return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(isoDayOfWeek, token.length);
      // 2nd
      case 'io':
        return localize.ordinalNumber(isoDayOfWeek, {
          unit: 'day'
        });
      // Tue
      case 'iii':
        return localize.day(dayOfWeek, {
          width: 'abbreviated',
          context: 'formatting'
        });
      // T
      case 'iiiii':
        return localize.day(dayOfWeek, {
          width: 'narrow',
          context: 'formatting'
        });
      // Tu
      case 'iiiiii':
        return localize.day(dayOfWeek, {
          width: 'short',
          context: 'formatting'
        });
      // Tuesday
      case 'iiii':
      default:
        return localize.day(dayOfWeek, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // AM or PM
  a: function a(date, token, localize) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am';
    switch (token) {
      case 'a':
      case 'aa':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        });
      case 'aaa':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        }).toLowerCase();
      case 'aaaaa':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'narrow',
          context: 'formatting'
        });
      case 'aaaa':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // AM, PM, midnight, noon
  b: function b(date, token, localize) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue;
    if (hours === 12) {
      dayPeriodEnumValue = dayPeriodEnum.noon;
    } else if (hours === 0) {
      dayPeriodEnumValue = dayPeriodEnum.midnight;
    } else {
      dayPeriodEnumValue = hours / 12 >= 1 ? 'pm' : 'am';
    }
    switch (token) {
      case 'b':
      case 'bb':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        });
      case 'bbb':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        }).toLowerCase();
      case 'bbbbb':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'narrow',
          context: 'formatting'
        });
      case 'bbbb':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function B(date, token, localize) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue;
    if (hours >= 17) {
      dayPeriodEnumValue = dayPeriodEnum.evening;
    } else if (hours >= 12) {
      dayPeriodEnumValue = dayPeriodEnum.afternoon;
    } else if (hours >= 4) {
      dayPeriodEnumValue = dayPeriodEnum.morning;
    } else {
      dayPeriodEnumValue = dayPeriodEnum.night;
    }
    switch (token) {
      case 'B':
      case 'BB':
      case 'BBB':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'abbreviated',
          context: 'formatting'
        });
      case 'BBBBB':
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'narrow',
          context: 'formatting'
        });
      case 'BBBB':
      default:
        return localize.dayPeriod(dayPeriodEnumValue, {
          width: 'wide',
          context: 'formatting'
        });
    }
  },
  // Hour [1-12]
  h: function h(date, token, localize) {
    if (token === 'ho') {
      var hours = date.getUTCHours() % 12;
      if (hours === 0) hours = 12;
      return localize.ordinalNumber(hours, {
        unit: 'hour'
      });
    }
    return _lightFormatters_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].h(date, token);
  },
  // Hour [0-23]
  H: function H(date, token, localize) {
    if (token === 'Ho') {
      return localize.ordinalNumber(date.getUTCHours(), {
        unit: 'hour'
      });
    }
    return _lightFormatters_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].H(date, token);
  },
  // Hour [0-11]
  K: function K(date, token, localize) {
    var hours = date.getUTCHours() % 12;
    if (token === 'Ko') {
      return localize.ordinalNumber(hours, {
        unit: 'hour'
      });
    }
    return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(hours, token.length);
  },
  // Hour [1-24]
  k: function k(date, token, localize) {
    var hours = date.getUTCHours();
    if (hours === 0) hours = 24;
    if (token === 'ko') {
      return localize.ordinalNumber(hours, {
        unit: 'hour'
      });
    }
    return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(hours, token.length);
  },
  // Minute
  m: function m(date, token, localize) {
    if (token === 'mo') {
      return localize.ordinalNumber(date.getUTCMinutes(), {
        unit: 'minute'
      });
    }
    return _lightFormatters_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].m(date, token);
  },
  // Second
  s: function s(date, token, localize) {
    if (token === 'so') {
      return localize.ordinalNumber(date.getUTCSeconds(), {
        unit: 'second'
      });
    }
    return _lightFormatters_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].s(date, token);
  },
  // Fraction of second
  S: function S(date, token) {
    return _lightFormatters_index_js__WEBPACK_IMPORTED_MODULE_0__["default"].S(date, token);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function X(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    if (timezoneOffset === 0) {
      return 'Z';
    }
    switch (token) {
      // Hours and optional minutes
      case 'X':
        return formatTimezoneWithOptionalMinutes(timezoneOffset);

      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case 'XXXX':
      case 'XX':
        // Hours and minutes without `:` delimiter
        return formatTimezone(timezoneOffset);

      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XXX`
      case 'XXXXX':
      case 'XXX': // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ':');
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function x(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      // Hours and optional minutes
      case 'x':
        return formatTimezoneWithOptionalMinutes(timezoneOffset);

      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case 'xxxx':
      case 'xx':
        // Hours and minutes without `:` delimiter
        return formatTimezone(timezoneOffset);

      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xxx`
      case 'xxxxx':
      case 'xxx': // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ':');
    }
  },
  // Timezone (GMT)
  O: function O(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      // Short
      case 'O':
      case 'OO':
      case 'OOO':
        return 'GMT' + formatTimezoneShort(timezoneOffset, ':');
      // Long
      case 'OOOO':
      default:
        return 'GMT' + formatTimezone(timezoneOffset, ':');
    }
  },
  // Timezone (specific non-location)
  z: function z(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      // Short
      case 'z':
      case 'zz':
      case 'zzz':
        return 'GMT' + formatTimezoneShort(timezoneOffset, ':');
      // Long
      case 'zzzz':
      default:
        return 'GMT' + formatTimezone(timezoneOffset, ':');
    }
  },
  // Seconds timestamp
  t: function t(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timestamp = Math.floor(originalDate.getTime() / 1000);
    return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(timestamp, token.length);
  },
  // Milliseconds timestamp
  T: function T(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timestamp = originalDate.getTime();
    return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(timestamp, token.length);
  }
};
function formatTimezoneShort(offset, dirtyDelimiter) {
  var sign = offset > 0 ? '-' : '+';
  var absOffset = Math.abs(offset);
  var hours = Math.floor(absOffset / 60);
  var minutes = absOffset % 60;
  if (minutes === 0) {
    return sign + String(hours);
  }
  var delimiter = dirtyDelimiter || '';
  return sign + String(hours) + delimiter + (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(minutes, 2);
}
function formatTimezoneWithOptionalMinutes(offset, dirtyDelimiter) {
  if (offset % 60 === 0) {
    var sign = offset > 0 ? '-' : '+';
    return sign + (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(Math.abs(offset) / 60, 2);
  }
  return formatTimezone(offset, dirtyDelimiter);
}
function formatTimezone(offset, dirtyDelimiter) {
  var delimiter = dirtyDelimiter || '';
  var sign = offset > 0 ? '-' : '+';
  var absOffset = Math.abs(offset);
  var hours = (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(Math.floor(absOffset / 60), 2);
  var minutes = (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(absOffset % 60, 2);
  return sign + hours + delimiter + minutes;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formatters);

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/format/lightFormatters/index.js":
/*!************************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/format/lightFormatters/index.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../addLeadingZeros/index.js */ "./node_modules/date-fns/esm/_lib/addLeadingZeros/index.js");

/*
 * |     | Unit                           |     | Unit                           |
 * |-----|--------------------------------|-----|--------------------------------|
 * |  a  | AM, PM                         |  A* |                                |
 * |  d  | Day of month                   |  D  |                                |
 * |  h  | Hour [1-12]                    |  H  | Hour [0-23]                    |
 * |  m  | Minute                         |  M  | Month                          |
 * |  s  | Second                         |  S  | Fraction of second             |
 * |  y  | Year (abs)                     |  Y  |                                |
 *
 * Letters marked by * are not implemented but reserved by Unicode standard.
 */
var formatters = {
  // Year
  y: function y(date, token) {
    // From http://www.unicode.org/reports/tr35/tr35-31/tr35-dates.html#Date_Format_tokens
    // | Year     |     y | yy |   yyy |  yyyy | yyyyy |
    // |----------|-------|----|-------|-------|-------|
    // | AD 1     |     1 | 01 |   001 |  0001 | 00001 |
    // | AD 12    |    12 | 12 |   012 |  0012 | 00012 |
    // | AD 123   |   123 | 23 |   123 |  0123 | 00123 |
    // | AD 1234  |  1234 | 34 |  1234 |  1234 | 01234 |
    // | AD 12345 | 12345 | 45 | 12345 | 12345 | 12345 |

    var signedYear = date.getUTCFullYear();
    // Returns 1 for 1 BC (which is year 0 in JavaScript)
    var year = signedYear > 0 ? signedYear : 1 - signedYear;
    return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(token === 'yy' ? year % 100 : year, token.length);
  },
  // Month
  M: function M(date, token) {
    var month = date.getUTCMonth();
    return token === 'M' ? String(month + 1) : (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(month + 1, 2);
  },
  // Day of the month
  d: function d(date, token) {
    return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(date.getUTCDate(), token.length);
  },
  // AM or PM
  a: function a(date, token) {
    var dayPeriodEnumValue = date.getUTCHours() / 12 >= 1 ? 'pm' : 'am';
    switch (token) {
      case 'a':
      case 'aa':
        return dayPeriodEnumValue.toUpperCase();
      case 'aaa':
        return dayPeriodEnumValue;
      case 'aaaaa':
        return dayPeriodEnumValue[0];
      case 'aaaa':
      default:
        return dayPeriodEnumValue === 'am' ? 'a.m.' : 'p.m.';
    }
  },
  // Hour [1-12]
  h: function h(date, token) {
    return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(date.getUTCHours() % 12 || 12, token.length);
  },
  // Hour [0-23]
  H: function H(date, token) {
    return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(date.getUTCHours(), token.length);
  },
  // Minute
  m: function m(date, token) {
    return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(date.getUTCMinutes(), token.length);
  },
  // Second
  s: function s(date, token) {
    return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(date.getUTCSeconds(), token.length);
  },
  // Fraction of second
  S: function S(date, token) {
    var numberOfDigits = token.length;
    var milliseconds = date.getUTCMilliseconds();
    var fractionalSeconds = Math.floor(milliseconds * Math.pow(10, numberOfDigits - 3));
    return (0,_addLeadingZeros_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(fractionalSeconds, token.length);
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formatters);

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/format/longFormatters/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/format/longFormatters/index.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var dateLongFormatter = function dateLongFormatter(pattern, formatLong) {
  switch (pattern) {
    case 'P':
      return formatLong.date({
        width: 'short'
      });
    case 'PP':
      return formatLong.date({
        width: 'medium'
      });
    case 'PPP':
      return formatLong.date({
        width: 'long'
      });
    case 'PPPP':
    default:
      return formatLong.date({
        width: 'full'
      });
  }
};
var timeLongFormatter = function timeLongFormatter(pattern, formatLong) {
  switch (pattern) {
    case 'p':
      return formatLong.time({
        width: 'short'
      });
    case 'pp':
      return formatLong.time({
        width: 'medium'
      });
    case 'ppp':
      return formatLong.time({
        width: 'long'
      });
    case 'pppp':
    default:
      return formatLong.time({
        width: 'full'
      });
  }
};
var dateTimeLongFormatter = function dateTimeLongFormatter(pattern, formatLong) {
  var matchResult = pattern.match(/(P+)(p+)?/) || [];
  var datePattern = matchResult[1];
  var timePattern = matchResult[2];
  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong);
  }
  var dateTimeFormat;
  switch (datePattern) {
    case 'P':
      dateTimeFormat = formatLong.dateTime({
        width: 'short'
      });
      break;
    case 'PP':
      dateTimeFormat = formatLong.dateTime({
        width: 'medium'
      });
      break;
    case 'PPP':
      dateTimeFormat = formatLong.dateTime({
        width: 'long'
      });
      break;
    case 'PPPP':
    default:
      dateTimeFormat = formatLong.dateTime({
        width: 'full'
      });
      break;
  }
  return dateTimeFormat.replace('{{date}}', dateLongFormatter(datePattern, formatLong)).replace('{{time}}', timeLongFormatter(timePattern, formatLong));
};
var longFormatters = {
  p: timeLongFormatter,
  P: dateTimeLongFormatter
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (longFormatters);

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/getTimezoneOffsetInMilliseconds/index.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/getTimezoneOffsetInMilliseconds/index.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getTimezoneOffsetInMilliseconds)
/* harmony export */ });
/**
 * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
 * They usually appear for dates that denote time before the timezones were introduced
 * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
 * and GMT+01:00:00 after that date)
 *
 * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
 * which would lead to incorrect calculations.
 *
 * This function returns the timezone offset in milliseconds that takes seconds in account.
 */
function getTimezoneOffsetInMilliseconds(date) {
  var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
  utcDate.setUTCFullYear(date.getFullYear());
  return date.getTime() - utcDate.getTime();
}

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/getUTCDayOfYear/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/getUTCDayOfYear/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getUTCDayOfYear)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../toDate/index.js */ "./node_modules/date-fns/esm/toDate/index.js");
/* harmony import */ var _requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../requiredArgs/index.js */ "./node_modules/date-fns/esm/_lib/requiredArgs/index.js");


var MILLISECONDS_IN_DAY = 86400000;
function getUTCDayOfYear(dirtyDate) {
  (0,_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var timestamp = date.getTime();
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
  var startOfYearTimestamp = date.getTime();
  var difference = timestamp - startOfYearTimestamp;
  return Math.floor(difference / MILLISECONDS_IN_DAY) + 1;
}

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/getUTCISOWeek/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/getUTCISOWeek/index.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getUTCISOWeek)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../toDate/index.js */ "./node_modules/date-fns/esm/toDate/index.js");
/* harmony import */ var _startOfUTCISOWeek_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../startOfUTCISOWeek/index.js */ "./node_modules/date-fns/esm/_lib/startOfUTCISOWeek/index.js");
/* harmony import */ var _startOfUTCISOWeekYear_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../startOfUTCISOWeekYear/index.js */ "./node_modules/date-fns/esm/_lib/startOfUTCISOWeekYear/index.js");
/* harmony import */ var _requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../requiredArgs/index.js */ "./node_modules/date-fns/esm/_lib/requiredArgs/index.js");




var MILLISECONDS_IN_WEEK = 604800000;
function getUTCISOWeek(dirtyDate) {
  (0,_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var diff = (0,_startOfUTCISOWeek_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(date).getTime() - (0,_startOfUTCISOWeekYear_index_js__WEBPACK_IMPORTED_MODULE_3__["default"])(date).getTime();

  // Round the number of days to the nearest integer
  // because the number of milliseconds in a week is not constant
  // (e.g. it's different in the week of the daylight saving time clock shift)
  return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
}

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/getUTCISOWeekYear/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/getUTCISOWeekYear/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getUTCISOWeekYear)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../toDate/index.js */ "./node_modules/date-fns/esm/toDate/index.js");
/* harmony import */ var _requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../requiredArgs/index.js */ "./node_modules/date-fns/esm/_lib/requiredArgs/index.js");
/* harmony import */ var _startOfUTCISOWeek_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../startOfUTCISOWeek/index.js */ "./node_modules/date-fns/esm/_lib/startOfUTCISOWeek/index.js");



function getUTCISOWeekYear(dirtyDate) {
  (0,_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var year = date.getUTCFullYear();
  var fourthOfJanuaryOfNextYear = new Date(0);
  fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = (0,_startOfUTCISOWeek_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(fourthOfJanuaryOfNextYear);
  var fourthOfJanuaryOfThisYear = new Date(0);
  fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = (0,_startOfUTCISOWeek_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(fourthOfJanuaryOfThisYear);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/getUTCWeek/index.js":
/*!************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/getUTCWeek/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getUTCWeek)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../toDate/index.js */ "./node_modules/date-fns/esm/toDate/index.js");
/* harmony import */ var _startOfUTCWeek_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../startOfUTCWeek/index.js */ "./node_modules/date-fns/esm/_lib/startOfUTCWeek/index.js");
/* harmony import */ var _startOfUTCWeekYear_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../startOfUTCWeekYear/index.js */ "./node_modules/date-fns/esm/_lib/startOfUTCWeekYear/index.js");
/* harmony import */ var _requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../requiredArgs/index.js */ "./node_modules/date-fns/esm/_lib/requiredArgs/index.js");




var MILLISECONDS_IN_WEEK = 604800000;
function getUTCWeek(dirtyDate, options) {
  (0,_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var diff = (0,_startOfUTCWeek_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(date, options).getTime() - (0,_startOfUTCWeekYear_index_js__WEBPACK_IMPORTED_MODULE_3__["default"])(date, options).getTime();

  // Round the number of days to the nearest integer
  // because the number of milliseconds in a week is not constant
  // (e.g. it's different in the week of the daylight saving time clock shift)
  return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
}

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/getUTCWeekYear/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/getUTCWeekYear/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ getUTCWeekYear)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../toDate/index.js */ "./node_modules/date-fns/esm/toDate/index.js");
/* harmony import */ var _requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../requiredArgs/index.js */ "./node_modules/date-fns/esm/_lib/requiredArgs/index.js");
/* harmony import */ var _startOfUTCWeek_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../startOfUTCWeek/index.js */ "./node_modules/date-fns/esm/_lib/startOfUTCWeek/index.js");
/* harmony import */ var _toInteger_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../toInteger/index.js */ "./node_modules/date-fns/esm/_lib/toInteger/index.js");
/* harmony import */ var _defaultOptions_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../defaultOptions/index.js */ "./node_modules/date-fns/esm/_lib/defaultOptions/index.js");





function getUTCWeekYear(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$firstWeekCon, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  (0,_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var year = date.getUTCFullYear();
  var defaultOptions = (0,_defaultOptions_index_js__WEBPACK_IMPORTED_MODULE_2__.getDefaultOptions)();
  var firstWeekContainsDate = (0,_toInteger_index_js__WEBPACK_IMPORTED_MODULE_3__["default"])((_ref = (_ref2 = (_ref3 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref !== void 0 ? _ref : 1);

  // Test if weekStartsOn is between 1 and 7 _and_ is not NaN
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively');
  }
  var firstWeekOfNextYear = new Date(0);
  firstWeekOfNextYear.setUTCFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = (0,_startOfUTCWeek_index_js__WEBPACK_IMPORTED_MODULE_4__["default"])(firstWeekOfNextYear, options);
  var firstWeekOfThisYear = new Date(0);
  firstWeekOfThisYear.setUTCFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = (0,_startOfUTCWeek_index_js__WEBPACK_IMPORTED_MODULE_4__["default"])(firstWeekOfThisYear, options);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/protectedTokens/index.js":
/*!*****************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/protectedTokens/index.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isProtectedDayOfYearToken: () => (/* binding */ isProtectedDayOfYearToken),
/* harmony export */   isProtectedWeekYearToken: () => (/* binding */ isProtectedWeekYearToken),
/* harmony export */   throwProtectedError: () => (/* binding */ throwProtectedError)
/* harmony export */ });
var protectedDayOfYearTokens = ['D', 'DD'];
var protectedWeekYearTokens = ['YY', 'YYYY'];
function isProtectedDayOfYearToken(token) {
  return protectedDayOfYearTokens.indexOf(token) !== -1;
}
function isProtectedWeekYearToken(token) {
  return protectedWeekYearTokens.indexOf(token) !== -1;
}
function throwProtectedError(token, format, input) {
  if (token === 'YYYY') {
    throw new RangeError("Use `yyyy` instead of `YYYY` (in `".concat(format, "`) for formatting years to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  } else if (token === 'YY') {
    throw new RangeError("Use `yy` instead of `YY` (in `".concat(format, "`) for formatting years to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  } else if (token === 'D') {
    throw new RangeError("Use `d` instead of `D` (in `".concat(format, "`) for formatting days of the month to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  } else if (token === 'DD') {
    throw new RangeError("Use `dd` instead of `DD` (in `".concat(format, "`) for formatting days of the month to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  }
}

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/requiredArgs/index.js":
/*!**************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/requiredArgs/index.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ requiredArgs)
/* harmony export */ });
function requiredArgs(required, args) {
  if (args.length < required) {
    throw new TypeError(required + ' argument' + (required > 1 ? 's' : '') + ' required, but only ' + args.length + ' present');
  }
}

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/startOfUTCISOWeek/index.js":
/*!*******************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/startOfUTCISOWeek/index.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ startOfUTCISOWeek)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../toDate/index.js */ "./node_modules/date-fns/esm/toDate/index.js");
/* harmony import */ var _requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../requiredArgs/index.js */ "./node_modules/date-fns/esm/_lib/requiredArgs/index.js");


function startOfUTCISOWeek(dirtyDate) {
  (0,_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var weekStartsOn = 1;
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/startOfUTCISOWeekYear/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/startOfUTCISOWeekYear/index.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ startOfUTCISOWeekYear)
/* harmony export */ });
/* harmony import */ var _getUTCISOWeekYear_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../getUTCISOWeekYear/index.js */ "./node_modules/date-fns/esm/_lib/getUTCISOWeekYear/index.js");
/* harmony import */ var _startOfUTCISOWeek_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../startOfUTCISOWeek/index.js */ "./node_modules/date-fns/esm/_lib/startOfUTCISOWeek/index.js");
/* harmony import */ var _requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../requiredArgs/index.js */ "./node_modules/date-fns/esm/_lib/requiredArgs/index.js");



function startOfUTCISOWeekYear(dirtyDate) {
  (0,_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var year = (0,_getUTCISOWeekYear_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate);
  var fourthOfJanuary = new Date(0);
  fourthOfJanuary.setUTCFullYear(year, 0, 4);
  fourthOfJanuary.setUTCHours(0, 0, 0, 0);
  var date = (0,_startOfUTCISOWeek_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(fourthOfJanuary);
  return date;
}

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/startOfUTCWeek/index.js":
/*!****************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/startOfUTCWeek/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ startOfUTCWeek)
/* harmony export */ });
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../toDate/index.js */ "./node_modules/date-fns/esm/toDate/index.js");
/* harmony import */ var _requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../requiredArgs/index.js */ "./node_modules/date-fns/esm/_lib/requiredArgs/index.js");
/* harmony import */ var _toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../toInteger/index.js */ "./node_modules/date-fns/esm/_lib/toInteger/index.js");
/* harmony import */ var _defaultOptions_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../defaultOptions/index.js */ "./node_modules/date-fns/esm/_lib/defaultOptions/index.js");




function startOfUTCWeek(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$weekStartsOn, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  (0,_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var defaultOptions = (0,_defaultOptions_index_js__WEBPACK_IMPORTED_MODULE_1__.getDefaultOptions)();
  var weekStartsOn = (0,_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])((_ref = (_ref2 = (_ref3 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.weekStartsOn) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions.weekStartsOn) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.weekStartsOn) !== null && _ref !== void 0 ? _ref : 0);

  // Test if weekStartsOn is between 0 and 6 _and_ is not NaN
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
  }
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_3__["default"])(dirtyDate);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/startOfUTCWeekYear/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/startOfUTCWeekYear/index.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ startOfUTCWeekYear)
/* harmony export */ });
/* harmony import */ var _getUTCWeekYear_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../getUTCWeekYear/index.js */ "./node_modules/date-fns/esm/_lib/getUTCWeekYear/index.js");
/* harmony import */ var _requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../requiredArgs/index.js */ "./node_modules/date-fns/esm/_lib/requiredArgs/index.js");
/* harmony import */ var _startOfUTCWeek_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../startOfUTCWeek/index.js */ "./node_modules/date-fns/esm/_lib/startOfUTCWeek/index.js");
/* harmony import */ var _toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../toInteger/index.js */ "./node_modules/date-fns/esm/_lib/toInteger/index.js");
/* harmony import */ var _defaultOptions_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../defaultOptions/index.js */ "./node_modules/date-fns/esm/_lib/defaultOptions/index.js");





function startOfUTCWeekYear(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$firstWeekCon, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  (0,_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  var defaultOptions = (0,_defaultOptions_index_js__WEBPACK_IMPORTED_MODULE_1__.getDefaultOptions)();
  var firstWeekContainsDate = (0,_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])((_ref = (_ref2 = (_ref3 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref !== void 0 ? _ref : 1);
  var year = (0,_getUTCWeekYear_index_js__WEBPACK_IMPORTED_MODULE_3__["default"])(dirtyDate, options);
  var firstWeek = new Date(0);
  firstWeek.setUTCFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setUTCHours(0, 0, 0, 0);
  var date = (0,_startOfUTCWeek_index_js__WEBPACK_IMPORTED_MODULE_4__["default"])(firstWeek, options);
  return date;
}

/***/ }),

/***/ "./node_modules/date-fns/esm/_lib/toInteger/index.js":
/*!***********************************************************!*\
  !*** ./node_modules/date-fns/esm/_lib/toInteger/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toInteger)
/* harmony export */ });
function toInteger(dirtyNumber) {
  if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
    return NaN;
  }
  var number = Number(dirtyNumber);
  if (isNaN(number)) {
    return number;
  }
  return number < 0 ? Math.ceil(number) : Math.floor(number);
}

/***/ }),

/***/ "./node_modules/date-fns/esm/addMilliseconds/index.js":
/*!************************************************************!*\
  !*** ./node_modules/date-fns/esm/addMilliseconds/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ addMilliseconds)
/* harmony export */ });
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ "./node_modules/date-fns/esm/_lib/toInteger/index.js");
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../toDate/index.js */ "./node_modules/date-fns/esm/toDate/index.js");
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ "./node_modules/date-fns/esm/_lib/requiredArgs/index.js");



/**
 * @name addMilliseconds
 * @category Millisecond Helpers
 * @summary Add the specified number of milliseconds to the given date.
 *
 * @description
 * Add the specified number of milliseconds to the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of milliseconds to be added. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the milliseconds added
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Add 750 milliseconds to 10 July 2014 12:45:30.000:
 * const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
 * //=> Thu Jul 10 2014 12:45:30.750
 */
function addMilliseconds(dirtyDate, dirtyAmount) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var timestamp = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate).getTime();
  var amount = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dirtyAmount);
  return new Date(timestamp + amount);
}

/***/ }),

/***/ "./node_modules/date-fns/esm/format/index.js":
/*!***************************************************!*\
  !*** ./node_modules/date-fns/esm/format/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ format)
/* harmony export */ });
/* harmony import */ var _isValid_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../isValid/index.js */ "./node_modules/date-fns/esm/isValid/index.js");
/* harmony import */ var _subMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../subMilliseconds/index.js */ "./node_modules/date-fns/esm/subMilliseconds/index.js");
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../toDate/index.js */ "./node_modules/date-fns/esm/toDate/index.js");
/* harmony import */ var _lib_format_formatters_index_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../_lib/format/formatters/index.js */ "./node_modules/date-fns/esm/_lib/format/formatters/index.js");
/* harmony import */ var _lib_format_longFormatters_index_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../_lib/format/longFormatters/index.js */ "./node_modules/date-fns/esm/_lib/format/longFormatters/index.js");
/* harmony import */ var _lib_getTimezoneOffsetInMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../_lib/getTimezoneOffsetInMilliseconds/index.js */ "./node_modules/date-fns/esm/_lib/getTimezoneOffsetInMilliseconds/index.js");
/* harmony import */ var _lib_protectedTokens_index_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../_lib/protectedTokens/index.js */ "./node_modules/date-fns/esm/_lib/protectedTokens/index.js");
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ "./node_modules/date-fns/esm/_lib/toInteger/index.js");
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ "./node_modules/date-fns/esm/_lib/requiredArgs/index.js");
/* harmony import */ var _lib_defaultOptions_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_lib/defaultOptions/index.js */ "./node_modules/date-fns/esm/_lib/defaultOptions/index.js");
/* harmony import */ var _lib_defaultLocale_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../_lib/defaultLocale/index.js */ "./node_modules/date-fns/esm/_lib/defaultLocale/index.js");










 // This RegExp consists of three parts separated by `|`:
// - [yYQqMLwIdDecihHKkms]o matches any available ordinal number token
//   (one of the certain letters followed by `o`)
// - (\w)\1* matches any sequences of the same letter
// - '' matches two quote characters in a row
// - '(''|[^'])+('|$) matches anything surrounded by two quote characters ('),
//   except a single quote symbol, which ends the sequence.
//   Two quote characters do not end the sequence.
//   If there is no matching single quote
//   then the sequence will continue until the end of the string.
// - . matches any single character unmatched by previous parts of the RegExps
var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;

// This RegExp catches symbols escaped by quotes, and also
// sequences of symbols P, p, and the combinations like `PPPPPPPppppp`
var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp = /^'([^]*?)'?$/;
var doubleQuoteRegExp = /''/g;
var unescapedLatinCharacterRegExp = /[a-zA-Z]/;

/**
 * @name format
 * @category Common Helpers
 * @summary Format the date.
 *
 * @description
 * Return the formatted date string in the given format. The result may vary by locale.
 *
 * > ⚠️ Please note that the `format` tokens differ from Moment.js and other libraries.
 * > See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * The characters wrapped between two single quotes characters (') are escaped.
 * Two single quotes in a row, whether inside or outside a quoted sequence, represent a 'real' single quote.
 * (see the last example)
 *
 * Format of the string is based on Unicode Technical Standard #35:
 * https://www.unicode.org/reports/tr35/tr35-dates.html#Date_Field_Symbol_Table
 * with a few additions (see note 7 below the table).
 *
 * Accepted patterns:
 * | Unit                            | Pattern | Result examples                   | Notes |
 * |---------------------------------|---------|-----------------------------------|-------|
 * | Era                             | G..GGG  | AD, BC                            |       |
 * |                                 | GGGG    | Anno Domini, Before Christ        | 2     |
 * |                                 | GGGGG   | A, B                              |       |
 * | Calendar year                   | y       | 44, 1, 1900, 2017                 | 5     |
 * |                                 | yo      | 44th, 1st, 0th, 17th              | 5,7   |
 * |                                 | yy      | 44, 01, 00, 17                    | 5     |
 * |                                 | yyy     | 044, 001, 1900, 2017              | 5     |
 * |                                 | yyyy    | 0044, 0001, 1900, 2017            | 5     |
 * |                                 | yyyyy   | ...                               | 3,5   |
 * | Local week-numbering year       | Y       | 44, 1, 1900, 2017                 | 5     |
 * |                                 | Yo      | 44th, 1st, 1900th, 2017th         | 5,7   |
 * |                                 | YY      | 44, 01, 00, 17                    | 5,8   |
 * |                                 | YYY     | 044, 001, 1900, 2017              | 5     |
 * |                                 | YYYY    | 0044, 0001, 1900, 2017            | 5,8   |
 * |                                 | YYYYY   | ...                               | 3,5   |
 * | ISO week-numbering year         | R       | -43, 0, 1, 1900, 2017             | 5,7   |
 * |                                 | RR      | -43, 00, 01, 1900, 2017           | 5,7   |
 * |                                 | RRR     | -043, 000, 001, 1900, 2017        | 5,7   |
 * |                                 | RRRR    | -0043, 0000, 0001, 1900, 2017     | 5,7   |
 * |                                 | RRRRR   | ...                               | 3,5,7 |
 * | Extended year                   | u       | -43, 0, 1, 1900, 2017             | 5     |
 * |                                 | uu      | -43, 01, 1900, 2017               | 5     |
 * |                                 | uuu     | -043, 001, 1900, 2017             | 5     |
 * |                                 | uuuu    | -0043, 0001, 1900, 2017           | 5     |
 * |                                 | uuuuu   | ...                               | 3,5   |
 * | Quarter (formatting)            | Q       | 1, 2, 3, 4                        |       |
 * |                                 | Qo      | 1st, 2nd, 3rd, 4th                | 7     |
 * |                                 | QQ      | 01, 02, 03, 04                    |       |
 * |                                 | QQQ     | Q1, Q2, Q3, Q4                    |       |
 * |                                 | QQQQ    | 1st quarter, 2nd quarter, ...     | 2     |
 * |                                 | QQQQQ   | 1, 2, 3, 4                        | 4     |
 * | Quarter (stand-alone)           | q       | 1, 2, 3, 4                        |       |
 * |                                 | qo      | 1st, 2nd, 3rd, 4th                | 7     |
 * |                                 | qq      | 01, 02, 03, 04                    |       |
 * |                                 | qqq     | Q1, Q2, Q3, Q4                    |       |
 * |                                 | qqqq    | 1st quarter, 2nd quarter, ...     | 2     |
 * |                                 | qqqqq   | 1, 2, 3, 4                        | 4     |
 * | Month (formatting)              | M       | 1, 2, ..., 12                     |       |
 * |                                 | Mo      | 1st, 2nd, ..., 12th               | 7     |
 * |                                 | MM      | 01, 02, ..., 12                   |       |
 * |                                 | MMM     | Jan, Feb, ..., Dec                |       |
 * |                                 | MMMM    | January, February, ..., December  | 2     |
 * |                                 | MMMMM   | J, F, ..., D                      |       |
 * | Month (stand-alone)             | L       | 1, 2, ..., 12                     |       |
 * |                                 | Lo      | 1st, 2nd, ..., 12th               | 7     |
 * |                                 | LL      | 01, 02, ..., 12                   |       |
 * |                                 | LLL     | Jan, Feb, ..., Dec                |       |
 * |                                 | LLLL    | January, February, ..., December  | 2     |
 * |                                 | LLLLL   | J, F, ..., D                      |       |
 * | Local week of year              | w       | 1, 2, ..., 53                     |       |
 * |                                 | wo      | 1st, 2nd, ..., 53th               | 7     |
 * |                                 | ww      | 01, 02, ..., 53                   |       |
 * | ISO week of year                | I       | 1, 2, ..., 53                     | 7     |
 * |                                 | Io      | 1st, 2nd, ..., 53th               | 7     |
 * |                                 | II      | 01, 02, ..., 53                   | 7     |
 * | Day of month                    | d       | 1, 2, ..., 31                     |       |
 * |                                 | do      | 1st, 2nd, ..., 31st               | 7     |
 * |                                 | dd      | 01, 02, ..., 31                   |       |
 * | Day of year                     | D       | 1, 2, ..., 365, 366               | 9     |
 * |                                 | Do      | 1st, 2nd, ..., 365th, 366th       | 7     |
 * |                                 | DD      | 01, 02, ..., 365, 366             | 9     |
 * |                                 | DDD     | 001, 002, ..., 365, 366           |       |
 * |                                 | DDDD    | ...                               | 3     |
 * | Day of week (formatting)        | E..EEE  | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 | EEEE    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | EEEEE   | M, T, W, T, F, S, S               |       |
 * |                                 | EEEEEE  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | ISO day of week (formatting)    | i       | 1, 2, 3, ..., 7                   | 7     |
 * |                                 | io      | 1st, 2nd, ..., 7th                | 7     |
 * |                                 | ii      | 01, 02, ..., 07                   | 7     |
 * |                                 | iii     | Mon, Tue, Wed, ..., Sun           | 7     |
 * |                                 | iiii    | Monday, Tuesday, ..., Sunday      | 2,7   |
 * |                                 | iiiii   | M, T, W, T, F, S, S               | 7     |
 * |                                 | iiiiii  | Mo, Tu, We, Th, Fr, Sa, Su        | 7     |
 * | Local day of week (formatting)  | e       | 2, 3, 4, ..., 1                   |       |
 * |                                 | eo      | 2nd, 3rd, ..., 1st                | 7     |
 * |                                 | ee      | 02, 03, ..., 01                   |       |
 * |                                 | eee     | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 | eeee    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | eeeee   | M, T, W, T, F, S, S               |       |
 * |                                 | eeeeee  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | Local day of week (stand-alone) | c       | 2, 3, 4, ..., 1                   |       |
 * |                                 | co      | 2nd, 3rd, ..., 1st                | 7     |
 * |                                 | cc      | 02, 03, ..., 01                   |       |
 * |                                 | ccc     | Mon, Tue, Wed, ..., Sun           |       |
 * |                                 | cccc    | Monday, Tuesday, ..., Sunday      | 2     |
 * |                                 | ccccc   | M, T, W, T, F, S, S               |       |
 * |                                 | cccccc  | Mo, Tu, We, Th, Fr, Sa, Su        |       |
 * | AM, PM                          | a..aa   | AM, PM                            |       |
 * |                                 | aaa     | am, pm                            |       |
 * |                                 | aaaa    | a.m., p.m.                        | 2     |
 * |                                 | aaaaa   | a, p                              |       |
 * | AM, PM, noon, midnight          | b..bb   | AM, PM, noon, midnight            |       |
 * |                                 | bbb     | am, pm, noon, midnight            |       |
 * |                                 | bbbb    | a.m., p.m., noon, midnight        | 2     |
 * |                                 | bbbbb   | a, p, n, mi                       |       |
 * | Flexible day period             | B..BBB  | at night, in the morning, ...     |       |
 * |                                 | BBBB    | at night, in the morning, ...     | 2     |
 * |                                 | BBBBB   | at night, in the morning, ...     |       |
 * | Hour [1-12]                     | h       | 1, 2, ..., 11, 12                 |       |
 * |                                 | ho      | 1st, 2nd, ..., 11th, 12th         | 7     |
 * |                                 | hh      | 01, 02, ..., 11, 12               |       |
 * | Hour [0-23]                     | H       | 0, 1, 2, ..., 23                  |       |
 * |                                 | Ho      | 0th, 1st, 2nd, ..., 23rd          | 7     |
 * |                                 | HH      | 00, 01, 02, ..., 23               |       |
 * | Hour [0-11]                     | K       | 1, 2, ..., 11, 0                  |       |
 * |                                 | Ko      | 1st, 2nd, ..., 11th, 0th          | 7     |
 * |                                 | KK      | 01, 02, ..., 11, 00               |       |
 * | Hour [1-24]                     | k       | 24, 1, 2, ..., 23                 |       |
 * |                                 | ko      | 24th, 1st, 2nd, ..., 23rd         | 7     |
 * |                                 | kk      | 24, 01, 02, ..., 23               |       |
 * | Minute                          | m       | 0, 1, ..., 59                     |       |
 * |                                 | mo      | 0th, 1st, ..., 59th               | 7     |
 * |                                 | mm      | 00, 01, ..., 59                   |       |
 * | Second                          | s       | 0, 1, ..., 59                     |       |
 * |                                 | so      | 0th, 1st, ..., 59th               | 7     |
 * |                                 | ss      | 00, 01, ..., 59                   |       |
 * | Fraction of second              | S       | 0, 1, ..., 9                      |       |
 * |                                 | SS      | 00, 01, ..., 99                   |       |
 * |                                 | SSS     | 000, 001, ..., 999                |       |
 * |                                 | SSSS    | ...                               | 3     |
 * | Timezone (ISO-8601 w/ Z)        | X       | -08, +0530, Z                     |       |
 * |                                 | XX      | -0800, +0530, Z                   |       |
 * |                                 | XXX     | -08:00, +05:30, Z                 |       |
 * |                                 | XXXX    | -0800, +0530, Z, +123456          | 2     |
 * |                                 | XXXXX   | -08:00, +05:30, Z, +12:34:56      |       |
 * | Timezone (ISO-8601 w/o Z)       | x       | -08, +0530, +00                   |       |
 * |                                 | xx      | -0800, +0530, +0000               |       |
 * |                                 | xxx     | -08:00, +05:30, +00:00            | 2     |
 * |                                 | xxxx    | -0800, +0530, +0000, +123456      |       |
 * |                                 | xxxxx   | -08:00, +05:30, +00:00, +12:34:56 |       |
 * | Timezone (GMT)                  | O...OOO | GMT-8, GMT+5:30, GMT+0            |       |
 * |                                 | OOOO    | GMT-08:00, GMT+05:30, GMT+00:00   | 2     |
 * | Timezone (specific non-locat.)  | z...zzz | GMT-8, GMT+5:30, GMT+0            | 6     |
 * |                                 | zzzz    | GMT-08:00, GMT+05:30, GMT+00:00   | 2,6   |
 * | Seconds timestamp               | t       | 512969520                         | 7     |
 * |                                 | tt      | ...                               | 3,7   |
 * | Milliseconds timestamp          | T       | 512969520900                      | 7     |
 * |                                 | TT      | ...                               | 3,7   |
 * | Long localized date             | P       | 04/29/1453                        | 7     |
 * |                                 | PP      | Apr 29, 1453                      | 7     |
 * |                                 | PPP     | April 29th, 1453                  | 7     |
 * |                                 | PPPP    | Friday, April 29th, 1453          | 2,7   |
 * | Long localized time             | p       | 12:00 AM                          | 7     |
 * |                                 | pp      | 12:00:00 AM                       | 7     |
 * |                                 | ppp     | 12:00:00 AM GMT+2                 | 7     |
 * |                                 | pppp    | 12:00:00 AM GMT+02:00             | 2,7   |
 * | Combination of date and time    | Pp      | 04/29/1453, 12:00 AM              | 7     |
 * |                                 | PPpp    | Apr 29, 1453, 12:00:00 AM         | 7     |
 * |                                 | PPPppp  | April 29th, 1453 at ...           | 7     |
 * |                                 | PPPPpppp| Friday, April 29th, 1453 at ...   | 2,7   |
 * Notes:
 * 1. "Formatting" units (e.g. formatting quarter) in the default en-US locale
 *    are the same as "stand-alone" units, but are different in some languages.
 *    "Formatting" units are declined according to the rules of the language
 *    in the context of a date. "Stand-alone" units are always nominative singular:
 *
 *    `format(new Date(2017, 10, 6), 'do LLLL', {locale: cs}) //=> '6. listopad'`
 *
 *    `format(new Date(2017, 10, 6), 'do MMMM', {locale: cs}) //=> '6. listopadu'`
 *
 * 2. Any sequence of the identical letters is a pattern, unless it is escaped by
 *    the single quote characters (see below).
 *    If the sequence is longer than listed in table (e.g. `EEEEEEEEEEE`)
 *    the output will be the same as default pattern for this unit, usually
 *    the longest one (in case of ISO weekdays, `EEEE`). Default patterns for units
 *    are marked with "2" in the last column of the table.
 *
 *    `format(new Date(2017, 10, 6), 'MMM') //=> 'Nov'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMM') //=> 'November'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMM') //=> 'N'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMMM') //=> 'November'`
 *
 *    `format(new Date(2017, 10, 6), 'MMMMMMM') //=> 'November'`
 *
 * 3. Some patterns could be unlimited length (such as `yyyyyyyy`).
 *    The output will be padded with zeros to match the length of the pattern.
 *
 *    `format(new Date(2017, 10, 6), 'yyyyyyyy') //=> '00002017'`
 *
 * 4. `QQQQQ` and `qqqqq` could be not strictly numerical in some locales.
 *    These tokens represent the shortest form of the quarter.
 *
 * 5. The main difference between `y` and `u` patterns are B.C. years:
 *
 *    | Year | `y` | `u` |
 *    |------|-----|-----|
 *    | AC 1 |   1 |   1 |
 *    | BC 1 |   1 |   0 |
 *    | BC 2 |   2 |  -1 |
 *
 *    Also `yy` always returns the last two digits of a year,
 *    while `uu` pads single digit years to 2 characters and returns other years unchanged:
 *
 *    | Year | `yy` | `uu` |
 *    |------|------|------|
 *    | 1    |   01 |   01 |
 *    | 14   |   14 |   14 |
 *    | 376  |   76 |  376 |
 *    | 1453 |   53 | 1453 |
 *
 *    The same difference is true for local and ISO week-numbering years (`Y` and `R`),
 *    except local week-numbering years are dependent on `options.weekStartsOn`
 *    and `options.firstWeekContainsDate` (compare [getISOWeekYear]{@link https://date-fns.org/docs/getISOWeekYear}
 *    and [getWeekYear]{@link https://date-fns.org/docs/getWeekYear}).
 *
 * 6. Specific non-location timezones are currently unavailable in `date-fns`,
 *    so right now these tokens fall back to GMT timezones.
 *
 * 7. These patterns are not in the Unicode Technical Standard #35:
 *    - `i`: ISO day of week
 *    - `I`: ISO week of year
 *    - `R`: ISO week-numbering year
 *    - `t`: seconds timestamp
 *    - `T`: milliseconds timestamp
 *    - `o`: ordinal number modifier
 *    - `P`: long localized date
 *    - `p`: long localized time
 *
 * 8. `YY` and `YYYY` tokens represent week-numbering years but they are often confused with years.
 *    You should enable `options.useAdditionalWeekYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * 9. `D` and `DD` tokens represent days of the year but they are often confused with days of the month.
 *    You should enable `options.useAdditionalDayOfYearTokens` to use them. See: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 *
 * @param {Date|Number} date - the original date
 * @param {String} format - the string of tokens
 * @param {Object} [options] - an object with options.
 * @param {Locale} [options.locale=defaultLocale] - the locale object. See [Locale]{@link https://date-fns.org/docs/Locale}
 * @param {0|1|2|3|4|5|6} [options.weekStartsOn=0] - the index of the first day of the week (0 - Sunday)
 * @param {Number} [options.firstWeekContainsDate=1] - the day of January, which is
 * @param {Boolean} [options.useAdditionalWeekYearTokens=false] - if true, allows usage of the week-numbering year tokens `YY` and `YYYY`;
 *   see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @param {Boolean} [options.useAdditionalDayOfYearTokens=false] - if true, allows usage of the day of year tokens `D` and `DD`;
 *   see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @returns {String} the formatted date string
 * @throws {TypeError} 2 arguments required
 * @throws {RangeError} `date` must not be Invalid Date
 * @throws {RangeError} `options.locale` must contain `localize` property
 * @throws {RangeError} `options.locale` must contain `formatLong` property
 * @throws {RangeError} `options.weekStartsOn` must be between 0 and 6
 * @throws {RangeError} `options.firstWeekContainsDate` must be between 1 and 7
 * @throws {RangeError} use `yyyy` instead of `YYYY` for formatting years using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws {RangeError} use `yy` instead of `YY` for formatting years using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws {RangeError} use `d` instead of `D` for formatting days of the month using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws {RangeError} use `dd` instead of `DD` for formatting days of the month using [format provided] to the input [input provided]; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md
 * @throws {RangeError} format string contains an unescaped latin alphabet character
 *
 * @example
 * // Represent 11 February 2014 in middle-endian format:
 * const result = format(new Date(2014, 1, 11), 'MM/dd/yyyy')
 * //=> '02/11/2014'
 *
 * @example
 * // Represent 2 July 2014 in Esperanto:
 * import { eoLocale } from 'date-fns/locale/eo'
 * const result = format(new Date(2014, 6, 2), "do 'de' MMMM yyyy", {
 *   locale: eoLocale
 * })
 * //=> '2-a de julio 2014'
 *
 * @example
 * // Escape string by single quote characters:
 * const result = format(new Date(2014, 6, 2, 15), "h 'o''clock'")
 * //=> "3 o'clock"
 */

function format(dirtyDate, dirtyFormatStr, options) {
  var _ref, _options$locale, _ref2, _ref3, _ref4, _options$firstWeekCon, _options$locale2, _options$locale2$opti, _defaultOptions$local, _defaultOptions$local2, _ref5, _ref6, _ref7, _options$weekStartsOn, _options$locale3, _options$locale3$opti, _defaultOptions$local3, _defaultOptions$local4;
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var formatStr = String(dirtyFormatStr);
  var defaultOptions = (0,_lib_defaultOptions_index_js__WEBPACK_IMPORTED_MODULE_1__.getDefaultOptions)();
  var locale = (_ref = (_options$locale = options === null || options === void 0 ? void 0 : options.locale) !== null && _options$locale !== void 0 ? _options$locale : defaultOptions.locale) !== null && _ref !== void 0 ? _ref : _lib_defaultLocale_index_js__WEBPACK_IMPORTED_MODULE_2__["default"];
  var firstWeekContainsDate = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_3__["default"])((_ref2 = (_ref3 = (_ref4 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale2 = options.locale) === null || _options$locale2 === void 0 ? void 0 : (_options$locale2$opti = _options$locale2.options) === null || _options$locale2$opti === void 0 ? void 0 : _options$locale2$opti.firstWeekContainsDate) !== null && _ref4 !== void 0 ? _ref4 : defaultOptions.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : (_defaultOptions$local = defaultOptions.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : 1);

  // Test if weekStartsOn is between 1 and 7 _and_ is not NaN
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError('firstWeekContainsDate must be between 1 and 7 inclusively');
  }
  var weekStartsOn = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_3__["default"])((_ref5 = (_ref6 = (_ref7 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale3 = options.locale) === null || _options$locale3 === void 0 ? void 0 : (_options$locale3$opti = _options$locale3.options) === null || _options$locale3$opti === void 0 ? void 0 : _options$locale3$opti.weekStartsOn) !== null && _ref7 !== void 0 ? _ref7 : defaultOptions.weekStartsOn) !== null && _ref6 !== void 0 ? _ref6 : (_defaultOptions$local3 = defaultOptions.locale) === null || _defaultOptions$local3 === void 0 ? void 0 : (_defaultOptions$local4 = _defaultOptions$local3.options) === null || _defaultOptions$local4 === void 0 ? void 0 : _defaultOptions$local4.weekStartsOn) !== null && _ref5 !== void 0 ? _ref5 : 0);

  // Test if weekStartsOn is between 0 and 6 _and_ is not NaN
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError('weekStartsOn must be between 0 and 6 inclusively');
  }
  if (!locale.localize) {
    throw new RangeError('locale must contain localize property');
  }
  if (!locale.formatLong) {
    throw new RangeError('locale must contain formatLong property');
  }
  var originalDate = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_4__["default"])(dirtyDate);
  if (!(0,_isValid_index_js__WEBPACK_IMPORTED_MODULE_5__["default"])(originalDate)) {
    throw new RangeError('Invalid time value');
  }

  // Convert the date in system timezone to the same date in UTC+00:00 timezone.
  // This ensures that when UTC functions will be implemented, locales will be compatible with them.
  // See an issue about UTC functions: https://github.com/date-fns/date-fns/issues/376
  var timezoneOffset = (0,_lib_getTimezoneOffsetInMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_6__["default"])(originalDate);
  var utcDate = (0,_subMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_7__["default"])(originalDate, timezoneOffset);
  var formatterOptions = {
    firstWeekContainsDate: firstWeekContainsDate,
    weekStartsOn: weekStartsOn,
    locale: locale,
    _originalDate: originalDate
  };
  var result = formatStr.match(longFormattingTokensRegExp).map(function (substring) {
    var firstCharacter = substring[0];
    if (firstCharacter === 'p' || firstCharacter === 'P') {
      var longFormatter = _lib_format_longFormatters_index_js__WEBPACK_IMPORTED_MODULE_8__["default"][firstCharacter];
      return longFormatter(substring, locale.formatLong);
    }
    return substring;
  }).join('').match(formattingTokensRegExp).map(function (substring) {
    // Replace two single quote characters with one single quote character
    if (substring === "''") {
      return "'";
    }
    var firstCharacter = substring[0];
    if (firstCharacter === "'") {
      return cleanEscapedString(substring);
    }
    var formatter = _lib_format_formatters_index_js__WEBPACK_IMPORTED_MODULE_9__["default"][firstCharacter];
    if (formatter) {
      if (!(options !== null && options !== void 0 && options.useAdditionalWeekYearTokens) && (0,_lib_protectedTokens_index_js__WEBPACK_IMPORTED_MODULE_10__.isProtectedWeekYearToken)(substring)) {
        (0,_lib_protectedTokens_index_js__WEBPACK_IMPORTED_MODULE_10__.throwProtectedError)(substring, dirtyFormatStr, String(dirtyDate));
      }
      if (!(options !== null && options !== void 0 && options.useAdditionalDayOfYearTokens) && (0,_lib_protectedTokens_index_js__WEBPACK_IMPORTED_MODULE_10__.isProtectedDayOfYearToken)(substring)) {
        (0,_lib_protectedTokens_index_js__WEBPACK_IMPORTED_MODULE_10__.throwProtectedError)(substring, dirtyFormatStr, String(dirtyDate));
      }
      return formatter(utcDate, substring, locale.localize, formatterOptions);
    }
    if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
      throw new RangeError('Format string contains an unescaped latin alphabet character `' + firstCharacter + '`');
    }
    return substring;
  }).join('');
  return result;
}
function cleanEscapedString(input) {
  var matched = input.match(escapedStringRegExp);
  if (!matched) {
    return input;
  }
  return matched[1].replace(doubleQuoteRegExp, "'");
}

/***/ }),

/***/ "./node_modules/date-fns/esm/isDate/index.js":
/*!***************************************************!*\
  !*** ./node_modules/date-fns/esm/isDate/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isDate)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ "./node_modules/date-fns/esm/_lib/requiredArgs/index.js");


/**
 * @name isDate
 * @category Common Helpers
 * @summary Is the given value a date?
 *
 * @description
 * Returns true if the given value is an instance of Date. The function works for dates transferred across iframes.
 *
 * @param {*} value - the value to check
 * @returns {boolean} true if the given value is a date
 * @throws {TypeError} 1 arguments required
 *
 * @example
 * // For a valid date:
 * const result = isDate(new Date())
 * //=> true
 *
 * @example
 * // For an invalid date:
 * const result = isDate(new Date(NaN))
 * //=> true
 *
 * @example
 * // For some value:
 * const result = isDate('2014-02-31')
 * //=> false
 *
 * @example
 * // For an object:
 * const result = isDate({})
 * //=> false
 */
function isDate(value) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(1, arguments);
  return value instanceof Date || (0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(value) === 'object' && Object.prototype.toString.call(value) === '[object Date]';
}

/***/ }),

/***/ "./node_modules/date-fns/esm/isValid/index.js":
/*!****************************************************!*\
  !*** ./node_modules/date-fns/esm/isValid/index.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ isValid)
/* harmony export */ });
/* harmony import */ var _isDate_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../isDate/index.js */ "./node_modules/date-fns/esm/isDate/index.js");
/* harmony import */ var _toDate_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../toDate/index.js */ "./node_modules/date-fns/esm/toDate/index.js");
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ "./node_modules/date-fns/esm/_lib/requiredArgs/index.js");



/**
 * @name isValid
 * @category Common Helpers
 * @summary Is the given date valid?
 *
 * @description
 * Returns false if argument is Invalid Date and true otherwise.
 * Argument is converted to Date using `toDate`. See [toDate]{@link https://date-fns.org/docs/toDate}
 * Invalid Date is a Date, whose time value is NaN.
 *
 * Time value of Date: http://es5.github.io/#x15.9.1.1
 *
 * @param {*} date - the date to check
 * @returns {Boolean} the date is valid
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // For the valid date:
 * const result = isValid(new Date(2014, 1, 31))
 * //=> true
 *
 * @example
 * // For the value, convertable into a date:
 * const result = isValid(1393804800000)
 * //=> true
 *
 * @example
 * // For the invalid date:
 * const result = isValid(new Date(''))
 * //=> false
 */
function isValid(dirtyDate) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(1, arguments);
  if (!(0,_isDate_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyDate) && typeof dirtyDate !== 'number') {
    return false;
  }
  var date = (0,_toDate_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dirtyDate);
  return !isNaN(Number(date));
}

/***/ }),

/***/ "./node_modules/date-fns/esm/locale/_lib/buildFormatLongFn/index.js":
/*!**************************************************************************!*\
  !*** ./node_modules/date-fns/esm/locale/_lib/buildFormatLongFn/index.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ buildFormatLongFn)
/* harmony export */ });
function buildFormatLongFn(args) {
  return function () {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    // TODO: Remove String()
    var width = options.width ? String(options.width) : args.defaultWidth;
    var format = args.formats[width] || args.formats[args.defaultWidth];
    return format;
  };
}

/***/ }),

/***/ "./node_modules/date-fns/esm/locale/_lib/buildLocalizeFn/index.js":
/*!************************************************************************!*\
  !*** ./node_modules/date-fns/esm/locale/_lib/buildLocalizeFn/index.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ buildLocalizeFn)
/* harmony export */ });
function buildLocalizeFn(args) {
  return function (dirtyIndex, options) {
    var context = options !== null && options !== void 0 && options.context ? String(options.context) : 'standalone';
    var valuesArray;
    if (context === 'formatting' && args.formattingValues) {
      var defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      var width = options !== null && options !== void 0 && options.width ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      var _defaultWidth = args.defaultWidth;
      var _width = options !== null && options !== void 0 && options.width ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[_width] || args.values[_defaultWidth];
    }
    var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
    // @ts-ignore: For some reason TypeScript just don't want to match it, no matter how hard we try. I challenge you to try to remove it!
    return valuesArray[index];
  };
}

/***/ }),

/***/ "./node_modules/date-fns/esm/locale/_lib/buildMatchFn/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/date-fns/esm/locale/_lib/buildMatchFn/index.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ buildMatchFn)
/* harmony export */ });
function buildMatchFn(args) {
  return function (string) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var width = options.width;
    var matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    var matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    var matchedString = matchResult[0];
    var parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    var key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, function (pattern) {
      return pattern.test(matchedString);
    }) : findKey(parsePatterns, function (pattern) {
      return pattern.test(matchedString);
    });
    var value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? options.valueCallback(value) : value;
    var rest = string.slice(matchedString.length);
    return {
      value: value,
      rest: rest
    };
  };
}
function findKey(object, predicate) {
  for (var key in object) {
    if (object.hasOwnProperty(key) && predicate(object[key])) {
      return key;
    }
  }
  return undefined;
}
function findIndex(array, predicate) {
  for (var key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return undefined;
}

/***/ }),

/***/ "./node_modules/date-fns/esm/locale/_lib/buildMatchPatternFn/index.js":
/*!****************************************************************************!*\
  !*** ./node_modules/date-fns/esm/locale/_lib/buildMatchPatternFn/index.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ buildMatchPatternFn)
/* harmony export */ });
function buildMatchPatternFn(args) {
  return function (string) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    var matchedString = matchResult[0];
    var parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    var rest = string.slice(matchedString.length);
    return {
      value: value,
      rest: rest
    };
  };
}

/***/ }),

/***/ "./node_modules/date-fns/esm/locale/en-US/_lib/formatDistance/index.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/date-fns/esm/locale/en-US/_lib/formatDistance/index.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var formatDistanceLocale = {
  lessThanXSeconds: {
    one: 'less than a second',
    other: 'less than {{count}} seconds'
  },
  xSeconds: {
    one: '1 second',
    other: '{{count}} seconds'
  },
  halfAMinute: 'half a minute',
  lessThanXMinutes: {
    one: 'less than a minute',
    other: 'less than {{count}} minutes'
  },
  xMinutes: {
    one: '1 minute',
    other: '{{count}} minutes'
  },
  aboutXHours: {
    one: 'about 1 hour',
    other: 'about {{count}} hours'
  },
  xHours: {
    one: '1 hour',
    other: '{{count}} hours'
  },
  xDays: {
    one: '1 day',
    other: '{{count}} days'
  },
  aboutXWeeks: {
    one: 'about 1 week',
    other: 'about {{count}} weeks'
  },
  xWeeks: {
    one: '1 week',
    other: '{{count}} weeks'
  },
  aboutXMonths: {
    one: 'about 1 month',
    other: 'about {{count}} months'
  },
  xMonths: {
    one: '1 month',
    other: '{{count}} months'
  },
  aboutXYears: {
    one: 'about 1 year',
    other: 'about {{count}} years'
  },
  xYears: {
    one: '1 year',
    other: '{{count}} years'
  },
  overXYears: {
    one: 'over 1 year',
    other: 'over {{count}} years'
  },
  almostXYears: {
    one: 'almost 1 year',
    other: 'almost {{count}} years'
  }
};
var formatDistance = function formatDistance(token, count, options) {
  var result;
  var tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === 'string') {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace('{{count}}', count.toString());
  }
  if (options !== null && options !== void 0 && options.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return 'in ' + result;
    } else {
      return result + ' ago';
    }
  }
  return result;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formatDistance);

/***/ }),

/***/ "./node_modules/date-fns/esm/locale/en-US/_lib/formatLong/index.js":
/*!*************************************************************************!*\
  !*** ./node_modules/date-fns/esm/locale/en-US/_lib/formatLong/index.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_buildFormatLongFn_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../_lib/buildFormatLongFn/index.js */ "./node_modules/date-fns/esm/locale/_lib/buildFormatLongFn/index.js");

var dateFormats = {
  full: 'EEEE, MMMM do, y',
  long: 'MMMM do, y',
  medium: 'MMM d, y',
  short: 'MM/dd/yyyy'
};
var timeFormats = {
  full: 'h:mm:ss a zzzz',
  long: 'h:mm:ss a z',
  medium: 'h:mm:ss a',
  short: 'h:mm a'
};
var dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: '{{date}}, {{time}}',
  short: '{{date}}, {{time}}'
};
var formatLong = {
  date: (0,_lib_buildFormatLongFn_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    formats: dateFormats,
    defaultWidth: 'full'
  }),
  time: (0,_lib_buildFormatLongFn_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    formats: timeFormats,
    defaultWidth: 'full'
  }),
  dateTime: (0,_lib_buildFormatLongFn_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    formats: dateTimeFormats,
    defaultWidth: 'full'
  })
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formatLong);

/***/ }),

/***/ "./node_modules/date-fns/esm/locale/en-US/_lib/formatRelative/index.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/date-fns/esm/locale/en-US/_lib/formatRelative/index.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: 'P'
};
var formatRelative = function formatRelative(token, _date, _baseDate, _options) {
  return formatRelativeLocale[token];
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formatRelative);

/***/ }),

/***/ "./node_modules/date-fns/esm/locale/en-US/_lib/localize/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/date-fns/esm/locale/en-US/_lib/localize/index.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_buildLocalizeFn_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../_lib/buildLocalizeFn/index.js */ "./node_modules/date-fns/esm/locale/_lib/buildLocalizeFn/index.js");

var eraValues = {
  narrow: ['B', 'A'],
  abbreviated: ['BC', 'AD'],
  wide: ['Before Christ', 'Anno Domini']
};
var quarterValues = {
  narrow: ['1', '2', '3', '4'],
  abbreviated: ['Q1', 'Q2', 'Q3', 'Q4'],
  wide: ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter']
};

// Note: in English, the names of days of the week and months are capitalized.
// If you are making a new locale based on this one, check if the same is true for the language you're working on.
// Generally, formatted dates should look like they are in the middle of a sentence,
// e.g. in Spanish language the weekdays and months should be in the lowercase.
var monthValues = {
  narrow: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
  abbreviated: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  wide: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
};
var dayValues = {
  narrow: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  short: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  abbreviated: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  wide: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
};
var dayPeriodValues = {
  narrow: {
    am: 'a',
    pm: 'p',
    midnight: 'mi',
    noon: 'n',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  },
  abbreviated: {
    am: 'AM',
    pm: 'PM',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  },
  wide: {
    am: 'a.m.',
    pm: 'p.m.',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'morning',
    afternoon: 'afternoon',
    evening: 'evening',
    night: 'night'
  }
};
var formattingDayPeriodValues = {
  narrow: {
    am: 'a',
    pm: 'p',
    midnight: 'mi',
    noon: 'n',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  },
  abbreviated: {
    am: 'AM',
    pm: 'PM',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  },
  wide: {
    am: 'a.m.',
    pm: 'p.m.',
    midnight: 'midnight',
    noon: 'noon',
    morning: 'in the morning',
    afternoon: 'in the afternoon',
    evening: 'in the evening',
    night: 'at night'
  }
};
var ordinalNumber = function ordinalNumber(dirtyNumber, _options) {
  var number = Number(dirtyNumber);

  // If ordinal numbers depend on context, for example,
  // if they are different for different grammatical genders,
  // use `options.unit`.
  //
  // `unit` can be 'year', 'quarter', 'month', 'week', 'date', 'dayOfYear',
  // 'day', 'hour', 'minute', 'second'.

  var rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + 'st';
      case 2:
        return number + 'nd';
      case 3:
        return number + 'rd';
    }
  }
  return number + 'th';
};
var localize = {
  ordinalNumber: ordinalNumber,
  era: (0,_lib_buildLocalizeFn_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    values: eraValues,
    defaultWidth: 'wide'
  }),
  quarter: (0,_lib_buildLocalizeFn_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    values: quarterValues,
    defaultWidth: 'wide',
    argumentCallback: function argumentCallback(quarter) {
      return quarter - 1;
    }
  }),
  month: (0,_lib_buildLocalizeFn_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    values: monthValues,
    defaultWidth: 'wide'
  }),
  day: (0,_lib_buildLocalizeFn_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    values: dayValues,
    defaultWidth: 'wide'
  }),
  dayPeriod: (0,_lib_buildLocalizeFn_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    values: dayPeriodValues,
    defaultWidth: 'wide',
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: 'wide'
  })
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (localize);

/***/ }),

/***/ "./node_modules/date-fns/esm/locale/en-US/_lib/match/index.js":
/*!********************************************************************!*\
  !*** ./node_modules/date-fns/esm/locale/en-US/_lib/match/index.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_buildMatchFn_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../_lib/buildMatchFn/index.js */ "./node_modules/date-fns/esm/locale/_lib/buildMatchFn/index.js");
/* harmony import */ var _lib_buildMatchPatternFn_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../_lib/buildMatchPatternFn/index.js */ "./node_modules/date-fns/esm/locale/_lib/buildMatchPatternFn/index.js");


var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern = /\d+/i;
var matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
};
var parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i]
};
var matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
};
var parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
var parseMonthPatterns = {
  narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
  any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
};
var matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
var parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
var matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
var parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
var match = {
  ordinalNumber: (0,_lib_buildMatchPatternFn_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: function valueCallback(value) {
      return parseInt(value, 10);
    }
  }),
  era: (0,_lib_buildMatchFn_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseEraPatterns,
    defaultParseWidth: 'any'
  }),
  quarter: (0,_lib_buildMatchFn_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: 'any',
    valueCallback: function valueCallback(index) {
      return index + 1;
    }
  }),
  month: (0,_lib_buildMatchFn_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: 'any'
  }),
  day: (0,_lib_buildMatchFn_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: 'wide',
    parsePatterns: parseDayPatterns,
    defaultParseWidth: 'any'
  }),
  dayPeriod: (0,_lib_buildMatchFn_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: 'any',
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: 'any'
  })
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (match);

/***/ }),

/***/ "./node_modules/date-fns/esm/locale/en-US/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/date-fns/esm/locale/en-US/index.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _lib_formatDistance_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_lib/formatDistance/index.js */ "./node_modules/date-fns/esm/locale/en-US/_lib/formatDistance/index.js");
/* harmony import */ var _lib_formatLong_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_lib/formatLong/index.js */ "./node_modules/date-fns/esm/locale/en-US/_lib/formatLong/index.js");
/* harmony import */ var _lib_formatRelative_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_lib/formatRelative/index.js */ "./node_modules/date-fns/esm/locale/en-US/_lib/formatRelative/index.js");
/* harmony import */ var _lib_localize_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_lib/localize/index.js */ "./node_modules/date-fns/esm/locale/en-US/_lib/localize/index.js");
/* harmony import */ var _lib_match_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./_lib/match/index.js */ "./node_modules/date-fns/esm/locale/en-US/_lib/match/index.js");





/**
 * @type {Locale}
 * @category Locales
 * @summary English locale (United States).
 * @language English
 * @iso-639-2 eng
 * @author Sasha Koss [@kossnocorp]{@link https://github.com/kossnocorp}
 * @author Lesha Koss [@leshakoss]{@link https://github.com/leshakoss}
 */
var locale = {
  code: 'en-US',
  formatDistance: _lib_formatDistance_index_js__WEBPACK_IMPORTED_MODULE_0__["default"],
  formatLong: _lib_formatLong_index_js__WEBPACK_IMPORTED_MODULE_1__["default"],
  formatRelative: _lib_formatRelative_index_js__WEBPACK_IMPORTED_MODULE_2__["default"],
  localize: _lib_localize_index_js__WEBPACK_IMPORTED_MODULE_3__["default"],
  match: _lib_match_index_js__WEBPACK_IMPORTED_MODULE_4__["default"],
  options: {
    weekStartsOn: 0 /* Sunday */,
    firstWeekContainsDate: 1
  }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (locale);

/***/ }),

/***/ "./node_modules/date-fns/esm/subMilliseconds/index.js":
/*!************************************************************!*\
  !*** ./node_modules/date-fns/esm/subMilliseconds/index.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ subMilliseconds)
/* harmony export */ });
/* harmony import */ var _addMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../addMilliseconds/index.js */ "./node_modules/date-fns/esm/addMilliseconds/index.js");
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ "./node_modules/date-fns/esm/_lib/requiredArgs/index.js");
/* harmony import */ var _lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_lib/toInteger/index.js */ "./node_modules/date-fns/esm/_lib/toInteger/index.js");



/**
 * @name subMilliseconds
 * @category Millisecond Helpers
 * @summary Subtract the specified number of milliseconds from the given date.
 *
 * @description
 * Subtract the specified number of milliseconds from the given date.
 *
 * @param {Date|Number} date - the date to be changed
 * @param {Number} amount - the amount of milliseconds to be subtracted. Positive decimals will be rounded using `Math.floor`, decimals less than zero will be rounded using `Math.ceil`.
 * @returns {Date} the new date with the milliseconds subtracted
 * @throws {TypeError} 2 arguments required
 *
 * @example
 * // Subtract 750 milliseconds from 10 July 2014 12:45:30.000:
 * const result = subMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
 * //=> Thu Jul 10 2014 12:45:29.250
 */
function subMilliseconds(dirtyDate, dirtyAmount) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_0__["default"])(2, arguments);
  var amount = (0,_lib_toInteger_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(dirtyAmount);
  return (0,_addMilliseconds_index_js__WEBPACK_IMPORTED_MODULE_2__["default"])(dirtyDate, -amount);
}

/***/ }),

/***/ "./node_modules/date-fns/esm/toDate/index.js":
/*!***************************************************!*\
  !*** ./node_modules/date-fns/esm/toDate/index.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ toDate)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");
/* harmony import */ var _lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_lib/requiredArgs/index.js */ "./node_modules/date-fns/esm/_lib/requiredArgs/index.js");


/**
 * @name toDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If the argument is none of the above, the function returns Invalid Date.
 *
 * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
 *
 * @param {Date|Number} argument - the value to convert
 * @returns {Date} the parsed date in the local time zone
 * @throws {TypeError} 1 argument required
 *
 * @example
 * // Clone the date:
 * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert the timestamp to date:
 * const result = toDate(1392098430000)
 * //=> Tue Feb 11 2014 11:30:30
 */
function toDate(argument) {
  (0,_lib_requiredArgs_index_js__WEBPACK_IMPORTED_MODULE_1__["default"])(1, arguments);
  var argStr = Object.prototype.toString.call(argument);

  // Clone the date
  if (argument instanceof Date || (0,_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_0__["default"])(argument) === 'object' && argStr === '[object Date]') {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new Date(argument.getTime());
  } else if (typeof argument === 'number' || argStr === '[object Number]') {
    return new Date(argument);
  } else {
    if ((typeof argument === 'string' || argStr === '[object String]') && typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments");
      // eslint-disable-next-line no-console
      console.warn(new Error().stack);
    }
    return new Date(NaN);
  }
}

/***/ }),

/***/ "./src/projectModule.scss":
/*!********************************!*\
  !*** ./src/projectModule.scss ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_projectModule_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!../node_modules/sass-loader/dist/cjs.js!./projectModule.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/projectModule.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_projectModule_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_projectModule_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_projectModule_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_projectModule_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/openInbox.css":
/*!***************************!*\
  !*** ./src/openInbox.css ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_openInbox_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./openInbox.css */ "./node_modules/css-loader/dist/cjs.js!./src/openInbox.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_openInbox_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_openInbox_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_openInbox_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_openInbox_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/projectController.css":
/*!***********************************!*\
  !*** ./src/projectController.css ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_projectController_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./projectController.css */ "./node_modules/css-loader/dist/cjs.js!./src/projectController.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_projectController_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_projectController_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_projectController_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_projectController_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/projectForm.css":
/*!*****************************!*\
  !*** ./src/projectForm.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_projectForm_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./projectForm.css */ "./node_modules/css-loader/dist/cjs.js!./src/projectForm.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_projectForm_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_projectForm_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_projectForm_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_projectForm_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/projectModule.css":
/*!*******************************!*\
  !*** ./src/projectModule.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_projectModule_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./projectModule.css */ "./node_modules/css-loader/dist/cjs.js!./src/projectModule.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_projectModule_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_projectModule_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_projectModule_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_projectModule_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./src/style.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/taskForm.css":
/*!**************************!*\
  !*** ./src/taskForm.css ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_taskForm_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./taskForm.css */ "./node_modules/css-loader/dist/cjs.js!./src/taskForm.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_taskForm_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_taskForm_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_taskForm_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_taskForm_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/typeof.js":
/*!***********************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/typeof.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _typeof)
/* harmony export */ });
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _projectForm_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./projectForm.css */ "./src/projectForm.css");
/* harmony import */ var _pubsub__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pubsub */ "./src/pubsub.js");
/* harmony import */ var _todo__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./todo */ "./src/todo.js");
/* harmony import */ var _projectForm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./projectForm */ "./src/projectForm.js");
// TODO: FIX projectsContainer's Height






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
  _pubsub__WEBPACK_IMPORTED_MODULE_2__.events.emit("openInbox");
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
addProjects.addEventListener("click", _projectForm__WEBPACK_IMPORTED_MODULE_4__["default"], false);

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
homeAddProjectBtn.addEventListener("click", _projectForm__WEBPACK_IMPORTED_MODULE_4__["default"], false);
// Append Children
contentHome.appendChild(homeAddProjectBtn);

// Handles projects
const projectsContainer = document.createElement("div");
projectsContainer.id = "projectsContainer";
function collapeProjects(evt) {
  const el = evt.target;
  el.innerText === "\u142F" ? el.innerText = "\u1438" : el.innerText = "\u142F";
  projectsContainer.classList.toggle("projectsOpen");
}
openClose.addEventListener("click", collapeProjects, false);
projectsContainer.classList.add("projectsOpen");

/* Hamburger Switch Toggle Functions */
function handleClickEvent(evt) {
  const el = evt.target;
  /* eslint no-unused-expressions: ["error", { "allowTernary": true }] */
  el.getAttribute("aria-checked") === "true" ? el.setAttribute("aria-checked", "false") : el.setAttribute("aria-checked", "true");
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

__webpack_require__(/*! ./projectController */ "./src/projectController.js");

// The Projects Themselves
const projectHome = (0,_todo__WEBPACK_IMPORTED_MODULE_3__.createProject)("Home", "#DC143C");
const projectWork = (0,_todo__WEBPACK_IMPORTED_MODULE_3__.createProject)("Work", "#00FF00");
const projectEducation = (0,_todo__WEBPACK_IMPORTED_MODULE_3__.createProject)("Education", "#FFD700");
function initializeSetup() {
  let todo = (0,_todo__WEBPACK_IMPORTED_MODULE_3__.createTodo)("Study", "Now", "2023-01-10", "Priority 1", projectHome);
  projectHome.addToDo(todo);
  _pubsub__WEBPACK_IMPORTED_MODULE_2__.events.emit("addTodo", todo);
  todo = (0,_todo__WEBPACK_IMPORTED_MODULE_3__.createTodo)("Walk", "Gotta Exercise", "2023-02-28", "Priority 2", projectHome);
  projectHome.addToDo(todo);
  _pubsub__WEBPACK_IMPORTED_MODULE_2__.events.emit("addTodo", todo);
  todo = (0,_todo__WEBPACK_IMPORTED_MODULE_3__.createTodo)("Dinner", "Make Dinner For Parents", "2023-04-21", "Priority 3", projectHome);
  projectHome.addToDo(todo);
  _pubsub__WEBPACK_IMPORTED_MODULE_2__.events.emit("addTodo", todo);
  todo = (0,_todo__WEBPACK_IMPORTED_MODULE_3__.createTodo)("Job Hunt", "Send Out Applications", "2024-04-19", "Priority 4", projectHome);
  projectHome.addToDo(todo);
  _pubsub__WEBPACK_IMPORTED_MODULE_2__.events.emit("addTodo", todo);
  todo = (0,_todo__WEBPACK_IMPORTED_MODULE_3__.createTodo)("Report", "Report Due On Friday", "2023-02-28", "Priority 2", projectWork);
  projectWork.addToDo(todo);
  _pubsub__WEBPACK_IMPORTED_MODULE_2__.events.emit("addTodo", todo);
  todo = (0,_todo__WEBPACK_IMPORTED_MODULE_3__.createTodo)("Meeting", "Attend Meeting For New Feature", "2023-04-21", "Priority 3", projectWork);
  projectWork.addToDo(todo);
  _pubsub__WEBPACK_IMPORTED_MODULE_2__.events.emit("addTodo", todo);
  todo = (0,_todo__WEBPACK_IMPORTED_MODULE_3__.createTodo)("Staples", "No More Staples In Stapler", "2024-04-19", "Priority 4", projectWork);
  projectWork.addToDo(todo);
  _pubsub__WEBPACK_IMPORTED_MODULE_2__.events.emit("addTodo", todo);
  _pubsub__WEBPACK_IMPORTED_MODULE_2__.events.emit("addProject", projectHome);
  _pubsub__WEBPACK_IMPORTED_MODULE_2__.events.emit("addProject", projectWork);
  _pubsub__WEBPACK_IMPORTED_MODULE_2__.events.emit("addProject", projectEducation);
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
    return e instanceof DOMException && (
    // everything except Firefox
    e.code === 22 ||
    // Firefox
    e.code === 1014 ||
    // test name field too, because code might not be present
    // everything except Firefox
    e.name === "QuotaExceededError" ||
    // Firefox
    e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
    // acknowledge QuotaExceededError only if there's something already stored
    storage && storage.length !== 0;
  }
}
if (storageAvailable("localStorage")) {
  if (!localStorage.getItem("storageProjectList")) {
    initializeSetup();
  } else {
    // Grab Object From Local Storage
    const projectObject = JSON.parse(localStorage.getItem("storageProjectList"));
    // Get The Projects
    const projectList = Object.keys(projectObject);

    // For Each Project In Storage
    projectList.forEach(projectString => {
      // Property Name On The Object Stored Is
      // Split Into Project Name And Color
      // Ex: Home#DC143C
      const hashtagPosition = projectString.lastIndexOf("#"); // Incase Hashtag Is In Projects Name Of User
      const color = projectString.substring(hashtagPosition);
      const projectName = projectString.substring(0, hashtagPosition);
      // Project Reverse Engineered From localStorage
      const projectGenerated = (0,_todo__WEBPACK_IMPORTED_MODULE_3__.createProject)(projectName, color);

      // The Object Of Todos
      const todoObject = projectObject[projectString];
      // Each Todo On The Object
      const todoList = Object.keys(projectObject[projectString]);
      todoList.forEach(todoString => {
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
        const todoGenerated = (0,_todo__WEBPACK_IMPORTED_MODULE_3__.createTodo)(taskName, description, dueDate, priority, connectedProject);
        // On Creation The Completion Of A Todo Is Set To False
        // So If The Todo Was Done Toggle It To Complete
        if (completed === true) {
          todoGenerated.toggleComplete();
        }
        console.log(`${todoGenerated.getTask()} | ${todoGenerated.getDescription()} | ${todoGenerated.getDueDate()} | ${todoGenerated.getPriority()}  | ${todoGenerated.getProject()}`);
        // Add Todo To Correct Project
        projectGenerated.addToDo(todoGenerated);
        _pubsub__WEBPACK_IMPORTED_MODULE_2__.events.emit("addTodo", todoGenerated);
      });
      console.log();
      console.log(projectGenerated.getToDo());
      _pubsub__WEBPACK_IMPORTED_MODULE_2__.events.emit("addProject", projectGenerated);
    });
  }
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sNkZBQTZGLE1BQU0sVUFBVSxVQUFVLFVBQVUsWUFBWSxXQUFXLEtBQUssWUFBWSxNQUFNLFlBQVksV0FBVyxZQUFZLGFBQWEsYUFBYSxXQUFXLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxXQUFXLFlBQVksTUFBTSxZQUFZLE1BQU0sS0FBSyxVQUFVLFlBQVksYUFBYSxNQUFNLEtBQUssVUFBVSxVQUFVLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxNQUFNLEtBQUssS0FBSyxLQUFLLFVBQVUsS0FBSyxLQUFLLFlBQVksTUFBTSxNQUFNLEtBQUssVUFBVSxZQUFZLGFBQWEsTUFBTSxZQUFZLE1BQU0sVUFBVSxZQUFZ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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyx3RkFBd0YsWUFBWSxXQUFXLFlBQVksYUFBYSxNQUFNLFNBQVMsVUFBVSxVQUFVLFlBQVksYUFBYSxNQUFNLFlBQVksU0FBUyxVQUFVLFlBQVksV0FBVyxZQUFZLGFBQWEsYUFBYSxNQUFNLFlBQVksTUFBTSxVQUFVLE1BQU0sS0FBSyxVQUFVLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxVQUFVLE1BQU0sWUFBWSxNQUFNLFlBQVksYUFBYSxhQUFhLGFBQWEsV0FBVyxZQUFZLFdBQVcsS0FBSyxLQUFLLFlBQVksYUFBYSxXQUFXLE1BQU0sVUFBVSxLQUFLLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxZQUFZLGFBQWEsV0FBVyxZQUFZLGFBQWEsTUFBTSxLQUFLLFVBQVUsWUFBWSxXQUFXLEtBQUssWUFBWSxNQUFNLFVBQVUsVUFBVSxZQUFZLE1BQU0sWUFBWSxNQUFNLFVBQVUsVUFBVSxZQUFZLGFBQWEsYUFBYSxXQUFXLEtBQUssS0FBSyxLQUFLLFVBQVUsS0FBSyxLQUFLLFVBQVUsS0FBSyxLQUFLLEtBQUssWUFBWSxhQUFhLE1BQU0sS0FBSyxVQUFVLFlBQVksV0FBVyxVQUFVLFVBQVUsVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxNQUFNLEtBQUssWUFBWSxXQUFXLFlBQVksV0FBVyxZQUFZLGFBQWEsYUFBYSxNQUFNLEtBQUssVUFBVSxVQUFVLFlBQVksYUFBYSxhQUFhLFdBQVcsWUFBWSxhQUFhLGFBQWEsTUFBTSxLQUFLLFlBQVksV0FBVyxVQUFVLFlBQVksTUFBTSxLQUFLLFVBQVUsS0FBSyxLQUFLLFlBQVksV0FBVyxNQUFNLE1BQU0sWUFBWSxhQUFhLGFBQWEsYUFBYSxNQUFNLE1BQU0sWUFBWSxXQUFXLE1BQU0sS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sTUFBTSxVQUFVLE1BQU0sWUFBWSxNQUFNLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLFdBQVcsWUFBWSxNQUFNLEtBQUssWUFBWSxhQUFhLFdBQVcsTUFBTSxLQUFLLFVBQVUsVUFBVSxNQUFNLEtBQUssWUFBWSxN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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTywwRkFBMEYsTUFBTSxVQUFVLFVBQVUsVUFBVSxZQUFZLFdBQVcsVUFBVSxZQUFZLGFBQWEsYUFBYSxNQUFNLFlBQVksTUFBTSxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxXQUFXLFlBQVksTUFBTSxVQUFVLEtBQUssVUFBVSxZQUFZLGFBQWEsV0FBVyxVQUFVLFVBQVUsS0FBSyxZQUFZLE1BQU0sVUFBVSxVQUFVLFlBQVksV0FBVyxZQUFZLGFBQWEsV0FBVyxZQUFZLE1BQU0sS0FBSyxZQUFZLE9BQU8sTUFBTSxVQUFVLEtBQUssWUFBWSxNQUFNLFVBQVUsWUFBWSxhQUFhLGFBQWEsV0FBVyxVQUFVLFVBQVUsVUFBVSxNQUFNLFlBQVksTUFBTSxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsTUFBTSxLQUFLLFVBQVUsVUFBVSxZQUFZLE9BQU8sS0FBSyxZ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R0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLHFFQUFlO0FBQzFCLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLHFFQUFlO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLHFFQUFlO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGlFQUFlO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxRUFBZTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxlQUFlLG9FQUFVO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLFdBQVcscUVBQWU7QUFDMUIsR0FBRztBQUNIO0FBQ0E7QUFDQSxrQkFBa0IsdUVBQWE7QUFDL0I7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsV0FBVyxxRUFBZTtBQUMxQixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLFdBQVcsaUVBQWU7QUFDMUIsR0FBRztBQUNIO0FBQ0E7QUFDQSxvQkFBb0IseUVBQWU7QUFDbkM7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsV0FBVyxxRUFBZTtBQUMxQixHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxRUFBZTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxRUFBZTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxRUFBZTtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7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Q0FBQztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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Q0MsR0FBRyxDQUNSLEdBQUV3QyxhQUFhLENBQUN2SyxPQUFPLENBQUMsQ0FBRSxNQUFLdUssYUFBYSxDQUFDcEwsY0FBYyxDQUFDLENBQUUsTUFBS29MLGFBQWEsQ0FBQ3hMLFVBQVUsQ0FBQyxDQUFFLE1BQUt3TCxhQUFhLENBQUN0TCxXQUFXLENBQUMsQ0FBRSxPQUFNc0wsYUFBYSxDQUFDOVEsVUFBVSxDQUFDLENBQUUsRUFDbkssQ0FBQztRQUNEO1FBQ0EwUSxnQkFBZ0IsQ0FBQzdELE9BQU8sQ0FBQ2lFLGFBQWEsQ0FBQztRQUN2QzVRLDJDQUFNLENBQUNTLElBQUksQ0FBQyxTQUFTLEVBQUVtUSxhQUFhLENBQUM7TUFDdkMsQ0FBQyxDQUFDO01BRUZ6QyxPQUFPLENBQUNDLEdBQUcsQ0FBQyxDQUFDO01BQ2JELE9BQU8sQ0FBQ0MsR0FBRyxDQUFDb0MsZ0JBQWdCLENBQUN0TyxPQUFPLENBQUMsQ0FBQyxDQUFDO01BQ3ZDbEMsMkNBQU0sQ0FBQ1MsSUFBSSxDQUFDLFlBQVksRUFBRStQLGdCQUFnQixDQUFDO0lBQzdDLENBQUMsQ0FBQztFQUNKO0FBQ0YsQyIsInNvdXJjZXMiOlsid2VicGFjazovL3dlYnBhY2stZGVtby8uL3NyYy9vcGVuSW5ib3guanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vc3JjL3Byb2plY3RDb250cm9sbGVyLmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL3NyYy9wcm9qZWN0Rm9ybS5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9zcmMvcHJvamVjdE1vZHVsZS5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9zcmMvcHVic3ViLmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL3NyYy90YXNrRm9ybS5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9zcmMvdG9kby5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9zcmMvdG9kb0NvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vc3JjL3Byb2plY3RNb2R1bGUuc2NzcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9zcmMvb3BlbkluYm94LmNzcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9zcmMvcHJvamVjdENvbnRyb2xsZXIuY3NzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL3NyYy9wcm9qZWN0Rm9ybS5jc3MiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vc3JjL3Byb2plY3RNb2R1bGUuY3NzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL3NyYy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vc3JjL3Rhc2tGb3JtLmNzcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vX2xpYi9hZGRMZWFkaW5nWmVyb3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL2RlZmF1bHRMb2NhbGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL2RlZmF1bHRPcHRpb25zL2luZGV4LmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vX2xpYi9mb3JtYXQvZm9ybWF0dGVycy9pbmRleC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL19saWIvZm9ybWF0L2xpZ2h0Rm9ybWF0dGVycy9pbmRleC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL19saWIvZm9ybWF0L2xvbmdGb3JtYXR0ZXJzL2luZGV4LmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vX2xpYi9nZXRUaW1lem9uZU9mZnNldEluTWlsbGlzZWNvbmRzL2luZGV4LmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vX2xpYi9nZXRVVENEYXlPZlllYXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL2dldFVUQ0lTT1dlZWsvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL2dldFVUQ0lTT1dlZWtZZWFyL2luZGV4LmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vX2xpYi9nZXRVVENXZWVrL2luZGV4LmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vX2xpYi9nZXRVVENXZWVrWWVhci9pbmRleC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL19saWIvcHJvdGVjdGVkVG9rZW5zL2luZGV4LmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vX2xpYi9yZXF1aXJlZEFyZ3MvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL3N0YXJ0T2ZVVENJU09XZWVrL2luZGV4LmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vX2xpYi9zdGFydE9mVVRDSVNPV2Vla1llYXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL3N0YXJ0T2ZVVENXZWVrL2luZGV4LmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vX2xpYi9zdGFydE9mVVRDV2Vla1llYXIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9fbGliL3RvSW50ZWdlci9pbmRleC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2FkZE1pbGxpc2Vjb25kcy9pbmRleC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2Zvcm1hdC9pbmRleC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2lzRGF0ZS9pbmRleC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2lzVmFsaWQvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9sb2NhbGUvX2xpYi9idWlsZEZvcm1hdExvbmdGbi9pbmRleC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2xvY2FsZS9fbGliL2J1aWxkTG9jYWxpemVGbi9pbmRleC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2xvY2FsZS9fbGliL2J1aWxkTWF0Y2hGbi9pbmRleC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2xvY2FsZS9fbGliL2J1aWxkTWF0Y2hQYXR0ZXJuRm4vaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9sb2NhbGUvZW4tVVMvX2xpYi9mb3JtYXREaXN0YW5jZS9pbmRleC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2xvY2FsZS9lbi1VUy9fbGliL2Zvcm1hdExvbmcvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9sb2NhbGUvZW4tVVMvX2xpYi9mb3JtYXRSZWxhdGl2ZS9pbmRleC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvZGF0ZS1mbnMvZXNtL2xvY2FsZS9lbi1VUy9fbGliL2xvY2FsaXplL2luZGV4LmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9kYXRlLWZucy9lc20vbG9jYWxlL2VuLVVTL19saWIvbWF0Y2gvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9sb2NhbGUvZW4tVVMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS9zdWJNaWxsaXNlY29uZHMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL2RhdGUtZm5zL2VzbS90b0RhdGUvaW5kZXguanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vc3JjL3Byb2plY3RNb2R1bGUuc2Nzcz9iMmExIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL3NyYy9vcGVuSW5ib3guY3NzPzFjYWMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vc3JjL3Byb2plY3RDb250cm9sbGVyLmNzcz83Y2Q4Iiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL3NyYy9wcm9qZWN0Rm9ybS5jc3M/MmQzMiIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9zcmMvcHJvamVjdE1vZHVsZS5jc3M/YzBmNyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9zcmMvc3R5bGUuY3NzPzcxNjMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vc3JjL3Rhc2tGb3JtLmNzcz8yZWUyIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL3dlYnBhY2stZGVtby8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL3R5cGVvZi5qcyIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL3dlYnBhY2stZGVtby93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vd2VicGFjay1kZW1vL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly93ZWJwYWNrLWRlbW8vLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwiLi9vcGVuSW5ib3guY3NzXCI7XG5pbXBvcnQgeyBtYWtlVG9kbyB9IGZyb20gXCIuL3Byb2plY3RNb2R1bGVcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gb3BlbkluYm94KHRvZG9MaXN0KSB7XG4gIC8vIE1ha2UgU3BhY2UgRm9yIFRvZG9zXG4gIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIik7XG4gIGNvbnRlbnQucmVwbGFjZUNoaWxkcmVuKCk7XG4gIC8vIFRoZSBMYWJlbCBGb3IgVGhlIFBhZ2VcbiAgY29uc3QgaW5ib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBjb25zdCBpbmJveExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG5cbiAgLy8gSW5uZXIgVGV4dCBBbmQgSUQnc1xuICBpbmJveC5pZCA9IFwiaW5ib3hcIjtcbiAgaW5ib3hMYWJlbC5pZCA9IFwiaW5ib3hMYWJlbFwiO1xuICBpbmJveExhYmVsLmlubmVyVGV4dCA9IFwiSW5ib3hcIjtcblxuICBpbmJveC5hcHBlbmRDaGlsZChpbmJveExhYmVsKTtcblxuICAvLyBBZGQgVG9kb3MgVG8gVGhlIFBhZ2VcbiAgdG9kb0xpc3QuZm9yRWFjaCgodG9EbykgPT4ge1xuICAgIC8vIEdldCBUaGUgUHJvamVjdCBBbmQgQ3JlYXRlIEVsZW1lbnRcbiAgICAvLyBVc2UgRnVuY3Rpb24gQWxyZWFkeSBNYWRlIEJlZm9yZVxuICAgIGNvbnN0IHByb2plY3QgPSB0b0RvLmdldFByb2plY3QoKTtcbiAgICBjb25zdCB0b2RvID0gbWFrZVRvZG8ocHJvamVjdCwgdG9Ebyk7XG4gICAgaW5ib3guYXBwZW5kQ2hpbGQodG9kbyk7XG4gIH0pO1xuICAvLyBBcHBlbmQgVG8gU2hvdyBPbiBQYWdlXG4gIGNvbnRlbnQuYXBwZW5kQ2hpbGQoaW5ib3gpO1xufVxuIiwiaW1wb3J0IHsgZXZlbnRzIH0gZnJvbSBcIi4vcHVic3ViXCI7XG5pbXBvcnQgZGlzcGxheVByb2plY3RJbnB1dEZpZWxkIGZyb20gXCIuL3Byb2plY3RGb3JtXCI7XG5pbXBvcnQgcHJvamVjdE1vZHVsZSBmcm9tIFwiLi9wcm9qZWN0TW9kdWxlXCI7XG5pbXBvcnQgXCIuL3Byb2plY3RDb250cm9sbGVyLmNzc1wiO1xuaW1wb3J0IFwiLi9wcm9qZWN0Rm9ybS5jc3NcIjtcblxuY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xuY29uc3QgY29udGVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGVudFwiKTtcbmNvbnN0IGNvbnRlbnRIb21lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb250ZW50SG9tZVwiKTtcbmNvbnN0IHByb2plY3RMYWJlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicHJvamVjdExhYmVsXCIpO1xuY29uc3QgcHJvamVjdHNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInByb2plY3RzQ29udGFpbmVyXCIpO1xuXG4vLyBHbyBUbyBUaGUgSG9tZSBGb3IgQWxsIFByb2plY3RzXG5wcm9qZWN0TGFiZWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgZXZlbnRzLmVtaXQoXCJjbGVhck9wZXJhdGlvbnNcIik7XG4gIGV2ZW50cy5lbWl0KFwicmVuZGVyXCIpO1xufSk7XG4vLyBBZGQgUHJvamVjdCBUbyBUaGUgU2lkZWJhciBhbmQgUGFnZSBVc2luZyBUaGUgRmFjdG9yeSBGdW5jdGlvblxuY29uc3QgcHJvamVjdENvbnRyb2xsZXIgPSAoKCkgPT4ge1xuICBjb25zdCBwcm9qZWN0TGlzdCA9IFtdO1xuICBsZXQgYWRkT3BlcmF0aW9uID0gXCJcIjtcbiAgbGV0IGFkZExvY2F0aW9uID0gLTE7XG5cbiAgY29uc3QgcmVPcmRlclByb2plY3RzID0gKCkgPT4ge1xuICAgIC8vIFBlcmZvcm0gQ29ycmVjdCBPcGVyYXRpb25cbiAgICAvLyBCYXNlZCBPbiBQcm9qZWN0IE9wdGlvbiBQcmVzc2VkXG4gICAgc3dpdGNoIChhZGRPcGVyYXRpb24pIHtcbiAgICAgIGNhc2UgXCJhZGRBYm92ZVwiOlxuICAgICAgICBwcm9qZWN0TGlzdC5zcGxpY2UoYWRkTG9jYXRpb24gLSAxLCAwLCBwcm9qZWN0TGlzdC5wb3AoKSk7XG4gICAgICAgIC8vIFJlc2V0IExhc3QgQWN0aW9uIFRvIE5vdGhpbmdcbiAgICAgICAgYWRkT3BlcmF0aW9uID0gXCJcIjtcbiAgICAgICAgYWRkTG9jYXRpb24gPSAtMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiYWRkQmVsb3dcIjpcbiAgICAgICAgcHJvamVjdExpc3Quc3BsaWNlKGFkZExvY2F0aW9uLCAwLCBwcm9qZWN0TGlzdC5wb3AoKSk7XG4gICAgICAgIC8vIFJlc2V0IExhc3QgQWN0aW9uIFRvIE5vdGhpbmdcbiAgICAgICAgYWRkT3BlcmF0aW9uID0gXCJcIjtcbiAgICAgICAgYWRkTG9jYXRpb24gPSAtMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZWRpdFwiOiB7XG4gICAgICAgIGNvbnN0IG5ld1Byb2plY3QgPSBwcm9qZWN0TGlzdC5wb3AoKTtcbiAgICAgICAgbmV3UHJvamVjdC5jbG9uZShuZXdQcm9qZWN0LCBwcm9qZWN0TGlzdFthZGRMb2NhdGlvbiAtIDFdKTtcbiAgICAgICAgcHJvamVjdExpc3Quc3BsaWNlKGFkZExvY2F0aW9uIC0gMSwgMSwgbmV3UHJvamVjdCk7XG4gICAgICAgIC8vIFJlc2V0IExhc3QgQWN0aW9uIFRvIE5vdGhpbmdcbiAgICAgICAgYWRkT3BlcmF0aW9uID0gXCJcIjtcbiAgICAgICAgYWRkTG9jYXRpb24gPSAtMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIFwicmVtb3ZlXCI6XG4gICAgICAgIHByb2plY3RMaXN0LnNwbGljZShhZGRMb2NhdGlvbiAtIDEsIDEpO1xuICAgICAgICAvLyBSZXNldCBMYXN0IEFjdGlvbiBUbyBOb3RoaW5nXG4gICAgICAgIGFkZE9wZXJhdGlvbiA9IFwiXCI7XG4gICAgICAgIGFkZExvY2F0aW9uID0gLTE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9O1xuICAvLyBSZXJlbmRlciBBbGwgUHJvamVjdHMgUGVyZm9ybWluZyBUaGUgQ29ycmVjdCBPcGVyYXRpb24sXG4gIC8vIE9ubHkgVXNlZCBGb3IgUHJvamVjdCBPcHRpb25zLCBPdGhlcndpc2UgRG9lcyBOb3RoaW5nXG4gIGNvbnN0IHJlbmRlclNpZGVCYXIgPSAoKSA9PiB7XG4gICAgLy8gUmVtb3ZlIEFsbCBQcm9qZWN0cyBGcm9tIFNpZGViYXJcbiAgICBwcm9qZWN0c0NvbnRhaW5lci5yZXBsYWNlQ2hpbGRyZW4oKTtcbiAgICAvLyBSZW9yZGVyIEFsbCBUaGUgUHJvamVjdHNcbiAgICByZU9yZGVyUHJvamVjdHMoKTtcbiAgICAvLyBUaGVuIEFkZCBUaGVtIEJhY2sgU28gVGhlIE9yZGVyaW5nIElzIENvcnJlY3RcbiAgICBwcm9qZWN0TGlzdC5mb3JFYWNoKChwcmpjdCkgPT4ge1xuICAgICAgZXZlbnRzLmVtaXQoXCJhZGRQcm9qZWN0U2lkZWJhck9ubHlcIiwgcHJqY3QpO1xuICAgICAgcHJvamVjdExpc3QucG9wKCk7IC8vIHVwZGF0ZVByb2plY3RMaXN0IFdpbGwgQWRkIER1cGxpY2F0ZXMsIFNvIFJlbW92ZSBUaGVtXG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IHJlbmRlciA9ICgpID0+IHtcbiAgICAvLyBSZW1vdmUgQWxsIFByb2plY3RzIEZyb20gQ29udGVudCBIb21lXG4gICAgY29udGVudC5yZXBsYWNlQ2hpbGRyZW4oY29udGVudEhvbWUpO1xuICAgIC8vIFJlbW92ZSBBbGwgUHJvamVjdHMgRnJvbSBTaWRlYmFyXG4gICAgcHJvamVjdHNDb250YWluZXIucmVwbGFjZUNoaWxkcmVuKCk7XG4gICAgLy8gUmVvcmRlciBBbGwgVGhlIFByb2plY3RzXG4gICAgcmVPcmRlclByb2plY3RzKCk7XG4gICAgLy8gVGhlbiBBZGQgVGhlbSBCYWNrIFNvIFRoZSBPcmRlcmluZyBJcyBDb3JyZWN0XG4gICAgLy8gQ3VycmVudGx5IFJlcmVuZGVycyBXaGVuIE5vdCBOZWVkZWQ6IFByb2plY3QgQWRkZWQgdG8gRW5kXG4gICAgcHJvamVjdExpc3QuZm9yRWFjaCgocHJqY3QpID0+IHtcbiAgICAgIGV2ZW50cy5lbWl0KFwiYWRkUHJvamVjdFwiLCBwcmpjdCk7XG4gICAgICBwcm9qZWN0TGlzdC5wb3AoKTsgLy8gdXBkYXRlUHJvamVjdExpc3QgV2lsbCBBZGQgRHVwbGljYXRlcywgU28gUmVtb3ZlIFRoZW1cbiAgICB9KTtcbiAgfTtcbiAgY29uc3QgYWRkUHJvamVjdFRvU2lkZUJhciA9IChwcm9qZWN0KSA9PiB7XG4gICAgLy8gQ3JlYXRlIE5lZWRlZCBFbGVtZW50c1xuICAgIGNvbnN0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICBjb25zdCBjb2xvckNpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIGNvbnN0IHRvZG9Db3VudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAvLyBGdW5jdGlvbmFsaXR5XG4gICAgY29sb3JDaXJjbGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gcHJvamVjdC5nZXRDb2xvcigpO1xuICAgIG5hbWUuaW5uZXJUZXh0ICs9IHByb2plY3QuZ2V0TmFtZSgpO1xuICAgIGVsZW0udGl0bGUgPSBwcm9qZWN0LmdldE5hbWUoKTtcbiAgICBjb2xvckNpcmNsZS5jbGFzc0xpc3QuYWRkKFwiY29sb3JDaXJjbGUtUFwiKTtcblxuICAgIC8vIFNldCBUb2RvIENvdW50IE9mIFRoZSBQcm9qZWN0XG4gICAgLy8gQmFzZWQgT24gV2hhdCBDb21wbGV0ZWRcbiAgICBjb25zdCB0b2RvTGlzdCA9IHByb2plY3QuZ2V0VG9EbygpO1xuICAgIGxldCBjb21wbGV0ZUN0ciA9IDA7XG4gICAgdG9kb0xpc3QuZm9yRWFjaCgodG9EbykgPT4ge1xuICAgICAgaWYgKHRvRG8uZ2V0U3RhdHVzKCkgIT09IHRydWUpIHtcbiAgICAgICAgY29tcGxldGVDdHIgKz0gMTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0b2RvQ291bnQuaW5uZXJUZXh0ID0gY29tcGxldGVDdHI7XG5cbiAgICAvLyBHbyBUbyBUaGUgUHJvamVjdCdzIFRvRG9zXG4gICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgcHJvamVjdE1vZHVsZShwcm9qZWN0KTtcbiAgICB9KTtcblxuICAgIC8vIEFwcGVuZCBUb2dldGhlclxuICAgIGNvbG9yQ2lyY2xlLmFwcGVuZENoaWxkKHRvZG9Db3VudCk7XG4gICAgZWxlbS5hcHBlbmRDaGlsZChjb2xvckNpcmNsZSk7XG4gICAgZWxlbS5hcHBlbmRDaGlsZChuYW1lKTtcbiAgICBwcm9qZWN0c0NvbnRhaW5lci5hcHBlbmRDaGlsZChlbGVtKTtcbiAgfTtcbiAgLy8gRGVsZXRlIHBvcCB1cCBNYWRlIEJ5IGFkZFByb2plY3RUb1BhZ2UoKSBXaGVuIE5lZWRlZFxuICBjb25zdCByZW1vdmVQcm9qZWN0T3B0aW9ucyA9IChwcm9qZWN0T3B0aW9ucywgdG9vbHMpID0+IHtcbiAgICAvLyBDbG9uZSBOb2RlIFRvIFJlbW92ZSBFdmVudCBMaXN0ZW5lcnMgVGhlbiBSZW1vdmUgRnJvbSBQYWdlXG4gICAgY29uc3QgbmV3RWxlbWVudCA9IHByb2plY3RPcHRpb25zLmNsb25lTm9kZSh0cnVlKTtcbiAgICBib2R5LnJlcGxhY2VDaGlsZChuZXdFbGVtZW50LCBwcm9qZWN0T3B0aW9ucyk7XG4gICAgYm9keS5yZW1vdmVDaGlsZChuZXdFbGVtZW50KTtcbiAgICB0b29scy5yZW1vdmUoKTtcbiAgfTtcbiAgY29uc3Qgb3B0aW9uRXZlbnRMaXN0ZW5lcnMgPSAob3BlcmF0aW9uLCB0b29scywgZWxlbWVudCkgPT4ge1xuICAgIC8vIEdldCBwcm9qZWN0IE9mIE9wdGlvbiBDbGlja2VkXG4gICAgY29uc3QgcHJvamVjdCA9IGVsZW1lbnQucGFyZW50RWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgLy8gR2V0IFBvc2l0aW9uXG4gICAgY29uc3QgaW5kZXggPSBBcnJheS5mcm9tKGNvbnRlbnQuY2hpbGRyZW4pLmluZGV4T2YocHJvamVjdCk7XG4gICAgLy8gR2V0IFJpZCBPZiBCRyBEaXNhYmxpbmcgUGFnZSBBcyBXZWxsIEFzIFRoZSBPcHRpb25zXG4gICAgY29uc3QgcHJvamVjdE9wdGlvbnNCRyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucHJvamVjdE9wdGlvbnNCR1wiKTtcbiAgICByZW1vdmVQcm9qZWN0T3B0aW9ucyhwcm9qZWN0T3B0aW9uc0JHLCB0b29scyk7XG4gICAgLy8gQ2hhbmdlIFRoZXNlIFNvIFRoYXQgV2hlbiBSZW5kZXIgSXMgQ2FsbGVkIFRoZSBDb3JyZWN0IE9wZXJhdGlvbiBJcyBQZXJmb3JtZWRcbiAgICBhZGRPcGVyYXRpb24gPSBvcGVyYXRpb247XG4gICAgYWRkTG9jYXRpb24gPSBpbmRleDtcblxuICAgIC8vIFBlcmZvcm0gTmVlZGVkIEFjdGlvbiBCYXNlZCBPbiBCdXR0b24gQ2xpY2tlZFxuICAgIGlmIChvcGVyYXRpb24gPT09IFwicmVtb3ZlXCIpXG4gICAgICBldmVudHMuZW1pdChcInJlbmRlclwiKTsgLy8gV2lsbCBIYXZlIFRvIFJlcmVuZGVyIElmIFJlbW92aW5nXG4gICAgZWxzZSBpZiAob3BlcmF0aW9uID09PSBcImVkaXRcIikge1xuICAgICAgLy8gUGFzcyBUaGUgUHJvamVjdCBDbGlja2VkIFRvIERpc3BsYXkgSXRzIEluZm9ybWF0aW9uXG4gICAgICBjb25zdCBwcmpjdCA9IHByb2plY3RMaXN0W2FkZExvY2F0aW9uIC0gMV07XG4gICAgICBkaXNwbGF5UHJvamVjdElucHV0RmllbGQocHJqY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBHZXQgUHJvamVjdCBJbmZvcm1hdGlvbiBGcm9tIFVzZXJcbiAgICAgIGRpc3BsYXlQcm9qZWN0SW5wdXRGaWVsZCgpO1xuICAgIH1cbiAgfTtcbiAgLy8gQWRkIHRoZSBvcHRpb25zIHRoZW1zZWx2ZXNcbiAgY29uc3QgYWRkUHJvamVjdE9wdGlvbnMgPSAodG9vbHMpID0+IHtcbiAgICAvLyBDcmVhdGUgTmVlZGVkIEVsZW1lbnRzXG4gICAgY29uc3Qgb3B0aW9uc0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgY29uc3QgYWRkQWJvdmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICBjb25zdCBhZGRCZWxvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgIGNvbnN0IGVkaXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICBjb25zdCByZW1vdmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcblxuICAgIC8vIEZ1bmN0aW9uYWxpdHlcbiAgICBhZGRBYm92ZS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT5cbiAgICAgIG9wdGlvbkV2ZW50TGlzdGVuZXJzKFwiYWRkQWJvdmVcIiwgdG9vbHMsIGFkZEFib3ZlKVxuICAgICk7XG4gICAgYWRkQmVsb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+XG4gICAgICBvcHRpb25FdmVudExpc3RlbmVycyhcImFkZEJlbG93XCIsIHRvb2xzLCBhZGRCZWxvdylcbiAgICApO1xuICAgIGVkaXQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+XG4gICAgICBvcHRpb25FdmVudExpc3RlbmVycyhcImVkaXRcIiwgdG9vbHMsIGVkaXQpXG4gICAgKTtcbiAgICByZW1vdmUuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+XG4gICAgICBvcHRpb25FdmVudExpc3RlbmVycyhcInJlbW92ZVwiLCB0b29scywgcmVtb3ZlKVxuICAgICk7XG4gICAgLy8gSW5uZXJUZXh0IGFuZCBJRFxuICAgIG9wdGlvbnNDb250YWluZXIuaWQgPSBcIm9wdGlvbnNDb250YWluZXJcIjtcbiAgICBhZGRBYm92ZS5pbm5lclRleHQgPSBcIkFkZCBBYm92ZVwiO1xuICAgIGFkZEJlbG93LmlubmVyVGV4dCA9IFwiQWRkIEJlbG93XCI7XG4gICAgZWRpdC5pbm5lclRleHQgPSBcIkVkaXQgUHJvamVjdFwiO1xuICAgIHJlbW92ZS5pbm5lclRleHQgPSBcIlJlbW92ZSBQcm9qZWN0XCI7XG4gICAgb3B0aW9uc0NvbnRhaW5lci5hcHBlbmQoYWRkQWJvdmUsIGFkZEJlbG93LCBlZGl0LCByZW1vdmUpO1xuICAgIHRvb2xzLmFwcGVuZENoaWxkKG9wdGlvbnNDb250YWluZXIpO1xuICB9O1xuICBjb25zdCBjcmVhdGVPcHRpb25zQm94ID0gKHBhZ2VQcm9qZWN0Q29udGFpbmVyKSA9PiB7XG4gICAgY29uc3QgcHJvamVjdE9wdGlvbnNCRyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7IC8vIFRvIE1ha2UgUmVzdCBPZiBXZWJpc3RlIFVuY2xpY2thYmxlXG4gICAgY29uc3QgdG9vbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIC8vIEZ1bmN0aW9uYWxpdHlcbiAgICBwcm9qZWN0T3B0aW9uc0JHLmNsYXNzTGlzdC5hZGQoXCJwcm9qZWN0T3B0aW9uc0JHXCIpO1xuICAgIHRvb2xzLmNsYXNzTGlzdC5hZGQoXCJ0b29sc1wiKTtcbiAgICBib2R5LmFwcGVuZENoaWxkKHByb2plY3RPcHRpb25zQkcpO1xuICAgIHBhZ2VQcm9qZWN0Q29udGFpbmVyLmFwcGVuZENoaWxkKHRvb2xzKTtcbiAgICAvLyBBZGQgdGhlIG9wdGlvbnMgdG8gY3JlYXRlZCBib3hcbiAgICBhZGRQcm9qZWN0T3B0aW9ucyh0b29scyk7XG4gICAgLy8gQ2hlY2tzIElmIFVzZXIgQ2xpY2tzIEFueXdoZXJlIGVsc2Ugb24gcGFnZSB0byByZW1vdmUgb3B0aW9uc1xuICAgIHByb2plY3RPcHRpb25zQkcuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCkgPT4ge1xuICAgICAgY29uc3Qgd2l0aGluQm91bmRhcmllcyA9IGV2ZW50LmNvbXBvc2VkUGF0aCgpLmluY2x1ZGVzKHRvb2xzKTtcbiAgICAgIGlmICghd2l0aGluQm91bmRhcmllcykgcmVtb3ZlUHJvamVjdE9wdGlvbnMocHJvamVjdE9wdGlvbnNCRywgdG9vbHMpO1xuICAgIH0pO1xuICB9O1xuICBjb25zdCBhZGRQcm9qZWN0VG9QYWdlID0gKHByb2plY3QpID0+IHtcbiAgICAvLyBDcmVhdGUgTmVlZGVkIEVsZW1lbnRzXG4gICAgY29uc3QgcGFnZVByb2plY3RDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGNvbnN0IGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICBjb25zdCBjb2xvckNpcmNsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgIGNvbnN0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICBjb25zdCBlbGxpcHNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG5cbiAgICAvLyBDbGFzc2VzXG4gICAgcGFnZVByb2plY3RDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInBhZ2VQcm9qZWN0Q29udGFpbmVyXCIpO1xuICAgIGVsZW0uY2xhc3NMaXN0LmFkZChcInBhZ2VQcm9qZWN0XCIpO1xuICAgIGNvbG9yQ2lyY2xlLmNsYXNzTGlzdC5hZGQoXCJjb2xvckNpcmNsZS1QXCIpO1xuICAgIGVsbGlwc2UuY2xhc3NMaXN0LmFkZChcImVsbGlwc2VcIik7XG5cbiAgICAvLyBHZXQgUHJvamVjdCBJbmZvXG4gICAgbmFtZS5pbm5lclRleHQgKz0gcHJvamVjdC5nZXROYW1lKCk7XG4gICAgY29sb3JDaXJjbGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gcHJvamVjdC5nZXRDb2xvcigpO1xuXG4gICAgLy8gRnVuY3Rpb25hbGl0eVxuICAgIC8vIEdvIFRvIFRoZSBQcm9qZWN0J3MgVG9Eb3NcbiAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBwcm9qZWN0TW9kdWxlKHByb2plY3QpO1xuICAgIH0pO1xuICAgIC8vIE9wZW4gUHJvamVjdCBPcHRpb25zXG4gICAgZWxsaXBzZS5pbm5lclRleHQgPSBcIlxcdTIwMjZcIjsgLy8gQW4gZWxsaXBzZVxuICAgIGVsbGlwc2UudGl0bGUgPSBcIlBST0pFQ1QgT1BUSU9OU1wiO1xuICAgIGVsbGlwc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+XG4gICAgICBjcmVhdGVPcHRpb25zQm94KHBhZ2VQcm9qZWN0Q29udGFpbmVyKVxuICAgICk7XG5cbiAgICAvLyBBcHBlbmQgVG9nZXRoZXJcbiAgICBlbGVtLmFwcGVuZChjb2xvckNpcmNsZSwgbmFtZSk7XG4gICAgcGFnZVByb2plY3RDb250YWluZXIuYXBwZW5kKGVsZW0sIGVsbGlwc2UpO1xuICAgIGNvbnRlbnQuYXBwZW5kQ2hpbGQocGFnZVByb2plY3RDb250YWluZXIpO1xuICB9O1xuICBjb25zdCB1cGRhdGVQcm9qZWN0TGlzdCA9IChwcm9qZWN0KSA9PiB7XG4gICAgcHJvamVjdExpc3QucHVzaChwcm9qZWN0KTtcbiAgfTtcbiAgY29uc3QgdXBkYXRlUHJvamVjdFRvZG9Db3VudCA9IChwcm9qZWN0KSA9PiB7XG4gICAgLy8gVXBkYXRlIFRvZG8gQ291bnQgT24gQSBQcm9qZWN0XG4gICAgLy8gUGVyZm9ybSBPcGVyYXRpb25zIFRvIEdldCBDb2xvciBDaXJjbGVcbiAgICAvLyBPZiBTZWxlY3RlZCBQcm9qZWN0XG4gICAgY29uc3QgbGlzdFBvc2l0aW9uID0gcHJvamVjdExpc3QuaW5kZXhPZihwcm9qZWN0KTtcbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Byb2plY3RzQ29udGFpbmVyXCIpO1xuICAgIGNvbnN0IHByb2plY3RFbGVtZW50ID0gQXJyYXkuZnJvbShjb250YWluZXIuY2hpbGRyZW4pW2xpc3RQb3NpdGlvbl07XG4gICAgY29uc3QgY29sb3JDaXJjbGUgPSBwcm9qZWN0RWxlbWVudC5maXJzdENoaWxkO1xuXG4gICAgY29uc3QgdG9kb0xpc3QgPSBwcm9qZWN0LmdldFRvRG8oKTtcbiAgICBsZXQgY29tcGxldGVDdHIgPSAwO1xuICAgIHRvZG9MaXN0LmZvckVhY2goKHRvRG8pID0+IHtcbiAgICAgIGlmICh0b0RvLmdldFN0YXR1cygpICE9PSB0cnVlKSB7XG4gICAgICAgIGNvbXBsZXRlQ3RyICs9IDE7XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29sb3JDaXJjbGUuaW5uZXJUZXh0ID0gY29tcGxldGVDdHI7XG4gIH07XG4gIGNvbnN0IHVwZGF0ZUxvY2FsU3RvcmFnZSA9ICgpID0+IHtcbiAgICAvLyBSZXByZXNlbnQgVGhlIENvbmZpZ3VyYXRpb24gT2YgQ3VycmVudCBQcm9qZWN0IEFuZCBUb2RvIFNldHVwXG4gICAgLy8gVGhpcyBJcyBHb25uYSBCZSBBbiBPYmVqZWN0IE9mIE9iamVjdHNcbiAgICAvLyBFYWNoIFByb2plY3QgSXMgQSBQcm9wZXJ0eSBXaXRoIEFuIE9iamVjdCBBcyBJdHMgVmFsdWVcbiAgICAvLyBUaGVuIEluc2lkZSBUaGF0IE9iamVjdCBWYWx1ZSBJcyBBbm90aGVyIE9iamVjdCBXaXRoIEEgU2luZ2xlIFByb3BlcnR5XG4gICAgLy8gVGhhdCBQcm9wZXJ0eSBJcyBUaGUgVG9kb3MgTmFtZVxuICAgIC8vIFRoYXQgVG9kbyBXaWxsIEhhdmUgQW4gT2JqZWN0IEFzIEl0cyBWYWx1ZVxuICAgIC8vIEFuZCBGaW5hbGx5IFRob3NlIFByb3BlcnRpZXMgQXJlIFRoZSBUb2RvcyBJbmZvcm1hdGlvblxuICAgIGNvbnN0IHN0b3JhZ2VQcm9qZWN0TGlzdCA9IHt9O1xuICAgIHByb2plY3RMaXN0LmZvckVhY2goKHByb2plY3QpID0+IHtcbiAgICAgIGNvbnN0IHByb2plY3ROYW1lID0gcHJvamVjdC5nZXROYW1lKCk7XG4gICAgICBjb25zdCBwcm9qZWN0TmFtZUFuZENvbG9yID0gcHJvamVjdC5nZXROYW1lKCkgKyBwcm9qZWN0LmdldENvbG9yKCk7XG4gICAgICBjb25zdCB0b2RvTGlzdCA9IHByb2plY3QuZ2V0VG9EbygpO1xuICAgICAgY29uc3QgdG9kb09iamVjdCA9IHt9O1xuXG4gICAgICAvLyBTZXQgQSBQcm9wZXJ0eSBPbiB0b2RvT2JqZWN0IEZvciBFYWNoIFRvZG9cbiAgICAgIHRvZG9MaXN0LmZvckVhY2goKHRvZG8pID0+IHtcbiAgICAgICAgLy8gSW5mcm9tYXRpb24gQWJvdXQgVGhlIFRvZG9cbiAgICAgICAgY29uc3QgaW5mbyA9IHt9O1xuICAgICAgICBjb25zdCBjb25uZWN0ZWRQcm9qZWN0ID0gcHJvamVjdE5hbWU7XG4gICAgICAgIGNvbnN0IGR1ZURhdGUgPSB0b2RvLmdldER1ZURhdGUoKTtcbiAgICAgICAgY29uc3QgcHJpb3JpdHkgPSB0b2RvLmdldFByaW9yaXR5KCk7XG4gICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdG9kby5nZXREZXNjcmlwdGlvbigpO1xuICAgICAgICBjb25zdCBzdGF0dXMgPSB0b2RvLmdldFN0YXR1cygpO1xuICAgICAgICAvLyBTdG9yZSBJbiBBbiBPYmplY3RcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoaW5mbywge1xuICAgICAgICAgIFByb2plY3Q6IHtcbiAgICAgICAgICAgIHZhbHVlOiBjb25uZWN0ZWRQcm9qZWN0LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRHVlRGF0ZToge1xuICAgICAgICAgICAgdmFsdWU6IGR1ZURhdGUsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBQcmlvcml0eToge1xuICAgICAgICAgICAgdmFsdWU6IHByaW9yaXR5LFxuICAgICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRGVzY3JpcHRpb246IHtcbiAgICAgICAgICAgIHZhbHVlOiBkZXNjcmlwdGlvbixcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFN0YXR1czoge1xuICAgICAgICAgICAgdmFsdWU6IHN0YXR1cyxcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyAgY29uc29sZS5sb2coYEtleXM6ICR7T2JqZWN0LmtleXMoaW5mbyl9YCk7XG4gICAgICAgIC8vIFVzZSBUb2RvcyBOYW1lIFRvIFNldCBQcm9wZXJ0eVxuICAgICAgICAvLyBQYXNzIEluZm9ybWF0aW9uIFJlbGF0ZWQgVG8gVGhlIFRhc2tcbiAgICAgICAgY29uc3QgdGFza05hbWUgPSB0b2RvLmdldFRhc2soKTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRvZG9PYmplY3QsIHRhc2tOYW1lLCB7XG4gICAgICAgICAgdmFsdWU6IGluZm8sXG4gICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShzdG9yYWdlUHJvamVjdExpc3QsIHByb2plY3ROYW1lQW5kQ29sb3IsIHtcbiAgICAgICAgdmFsdWU6IHRvZG9PYmplY3QsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIFB1dCBJbnRvIExvY2FsIFN0b3JhZ2VcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcbiAgICAgIFwic3RvcmFnZVByb2plY3RMaXN0XCIsXG4gICAgICBKU09OLnN0cmluZ2lmeShzdG9yYWdlUHJvamVjdExpc3QpXG4gICAgKTtcbiAgICAvLyBDaGVjayBXaGF0IElzIFN0b3JlZFxuICAgIC8vIGNvbnN0IHByb2plY3RzID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInN0b3JhZ2VQcm9qZWN0TGlzdFwiKSk7XG4gICAgLy8gY29uc29sZS5sb2cocHJvamVjdHMpO1xuICB9O1xuICBjb25zdCBjbGVhck9wZXJhdGlvbnMgPSAoKSA9PiB7XG4gICAgYWRkT3BlcmF0aW9uID0gXCJcIjtcbiAgfTtcbiAgLy8gTGlzdGVuIEZvciBQcm9qZWN0IENyZWF0aW9uIEFuZCBEZWxldGlvblxuICBldmVudHMub24oXCJhZGRQcm9qZWN0XCIsIGFkZFByb2plY3RUb1NpZGVCYXIpO1xuICBldmVudHMub24oXCJhZGRQcm9qZWN0XCIsIGFkZFByb2plY3RUb1BhZ2UpO1xuICBldmVudHMub24oXCJhZGRQcm9qZWN0XCIsIHVwZGF0ZVByb2plY3RMaXN0KTtcblxuICAvLyBXaWxsIFByb2JhYmx5IENyZWF0ZSBOZXcgZXZlbnRzIEZvciBUaGVzZVxuICBldmVudHMub24oXCJhZGRQcm9qZWN0XCIsIHVwZGF0ZUxvY2FsU3RvcmFnZSk7XG4gIGV2ZW50cy5vbihcImFkZFByb2plY3RTaWRlYmFyT25seVwiLCB1cGRhdGVMb2NhbFN0b3JhZ2UpO1xuICBldmVudHMub24oXCJyZW1vdmVUb0RvXCIsIHVwZGF0ZUxvY2FsU3RvcmFnZSk7XG4gIGV2ZW50cy5vbihcImFkZFRvZG9cIiwgdXBkYXRlTG9jYWxTdG9yYWdlKTtcbiAgZXZlbnRzLm9uKFwidXBkYXRlVG9kb0NvdW50XCIsIHVwZGF0ZUxvY2FsU3RvcmFnZSk7XG5cbiAgZXZlbnRzLm9uKFwiYWRkUHJvamVjdFNpZGViYXJPbmx5XCIsIGFkZFByb2plY3RUb1NpZGVCYXIpO1xuICBldmVudHMub24oXCJhZGRQcm9qZWN0U2lkZWJhck9ubHlcIiwgdXBkYXRlUHJvamVjdExpc3QpO1xuICBldmVudHMub24oXCJyZW5kZXJTaWRlYmFyXCIsIHJlbmRlclNpZGVCYXIpO1xuICBldmVudHMub24oXCJyZW5kZXJcIiwgcmVuZGVyKTtcbiAgZXZlbnRzLm9uKFwidXBkYXRlUHJvamVjdFRvZG9Db3VudFwiLCB1cGRhdGVQcm9qZWN0VG9kb0NvdW50KTtcbiAgZXZlbnRzLm9uKFwiY2xlYXJPcGVyYXRpb25zXCIsIGNsZWFyT3BlcmF0aW9ucyk7XG59KSgpO1xuIiwiaW1wb3J0IHsgY3JlYXRlUHJvamVjdCB9IGZyb20gXCIuL3RvZG9cIjtcbmltcG9ydCB7IGV2ZW50cyB9IGZyb20gXCIuL3B1YnN1YlwiO1xuaW1wb3J0IHByb2plY3RNb2R1bGUgZnJvbSBcIi4vcHJvamVjdE1vZHVsZVwiO1xuXG5jb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIik7XG5cbi8vIERlbGV0ZSBGb3JtIE1hZGUgQnkgZGlzcGxheVByb2plY3RJbnB1dEZpZWxkKCkgV2hlbiBOZWVkZWRcbmZ1bmN0aW9uIHJlbW92ZVByb2plY3RJbnB1dEZpZWxkKHByb2plY3RVc2VySW5wdXQpIHtcbiAgLy8gQ2xvbmUgTm9kZSBUbyBSZW1vdmUgRXZlbnQgTGlzdGVuZXJzIFRoZW4gUmVtb3ZlXG4gIGNvbnN0IG5ld0VsZW1lbnQgPSBwcm9qZWN0VXNlcklucHV0LmNsb25lTm9kZSh0cnVlKTtcbiAgYm9keS5yZXBsYWNlQ2hpbGQobmV3RWxlbWVudCwgcHJvamVjdFVzZXJJbnB1dCk7XG4gIGJvZHkucmVtb3ZlQ2hpbGQobmV3RWxlbWVudCk7XG59XG5cbi8vIEhhbmRsZXMgV2hlbiB0aGUgVXNlciBTdWJtaXRzIHRoZSBQcm9qZWN0IEZvcm1cbmZ1bmN0aW9uIHByb2plY3RGb3JtU3VibWlzc2lvbihmb3JtKSB7XG4gIGNvbnN0IG5hbWUgPSBmb3JtLmVsZW1lbnRzLm5hbWVJbnB1dC52YWx1ZTtcbiAgY29uc3QgY29sb3IgPSBmb3JtLmVsZW1lbnRzLmNvbG9yc1NlbGVjdC52YWx1ZTtcbiAgY29uc3QgbmV3UHJvamVjdCA9IGNyZWF0ZVByb2plY3QobmFtZSwgY29sb3IpO1xuICBldmVudHMuZW1pdChcImFkZFByb2plY3RTaWRlYmFyT25seVwiLCBuZXdQcm9qZWN0KTtcbiAgZXZlbnRzLmVtaXQoXCJyZW5kZXJTaWRlYmFyXCIsIG5ld1Byb2plY3QpO1xuICBwcm9qZWN0TW9kdWxlKG5ld1Byb2plY3QpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkaXNwbGF5UHJvamVjdElucHV0RmllbGQocHJvamVjdCkge1xuICAvLyBDcmVhdGUgTmVjZXNzYXJ5IEVsZW1lbnRzXG4gIGNvbnN0IHByb2plY3RVc2VySW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBjb25zdCBpbnB1dENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGNvbnN0IGFkZFByb2plY3RMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICBjb25zdCBuYW1lSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gIGNvbnN0IG5hbWVJbnB1dExhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxhYmVsXCIpO1xuICBjb25zdCBuYW1lSW5wdXRTcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gIGNvbnN0IHByb2plY3RGb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIik7XG4gIGNvbnN0IGNvbG9yc1NlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIik7XG4gIGNvbnN0IGJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGNvbnN0IGNhbmNlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gIGNvbnN0IHNhdmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXG4gIC8vIEdpdmUgVGhlbSBJRHNcbiAgcHJvamVjdFVzZXJJbnB1dC5pZCA9IFwicHJvamVjdFVzZXJJbnB1dFwiO1xuICBpbnB1dENvbnRhaW5lci5pZCA9IFwiaW5wdXRDb250YWluZXJcIjtcbiAgYWRkUHJvamVjdExhYmVsLmlkID0gXCJhZGRQcm9qZWN0TGFiZWxcIjtcbiAgYnV0dG9uQ29udGFpbmVyLmlkID0gXCJidXR0b25Db250YWluZXJcIjtcbiAgbmFtZUlucHV0TGFiZWwuaWQgPSBcIm5hbWVJbnB1dExhYmVsXCI7XG4gIG5hbWVJbnB1dC5pZCA9IFwibmFtZUlucHV0XCI7XG4gIG5hbWVJbnB1dFNwYW4uaWQgPSBcIm5hbWVJbnB1dFNwYW5cIjtcbiAgcHJvamVjdEZvcm0uaWQgPSBcInByb2plY3RGb3JtXCI7XG4gIGNvbG9yc1NlbGVjdC5pZCA9IFwiY29sb3JzU2VsZWN0XCI7XG5cbiAgLy8gSW5uZXJUZXh0IEFuZCBDbGFzc2VzXG4gIGFkZFByb2plY3RMYWJlbC5pbm5lclRleHQgPSBcIkFkZCBQcm9qZWN0XCI7XG4gIG5hbWVJbnB1dFNwYW4uaW5uZXJUZXh0ID0gXCJOQU1FOlwiO1xuICBjYW5jZWwuaW5uZXJUZXh0ID0gXCJDQU5DRUxcIjtcbiAgc2F2ZS5pbm5lclRleHQgPSBcIlNBVkVcIjtcbiAgY2FuY2VsLmNsYXNzTGlzdC5hZGQoXCJjYW5jZWxcIik7XG4gIHNhdmUuY2xhc3NMaXN0LmFkZChcInNhdmVcIik7XG4gIHNhdmUuZGlzYWJsZWQgPSB0cnVlO1xuXG4gIC8vIEZ1bnRpb25hbGl0eVxuICBuYW1lSW5wdXRMYWJlbC5zZXRBdHRyaWJ1dGUoXCJmb3JcIiwgXCJuYW1lSW5wdXRcIik7XG4gIG5hbWVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJtaW5sZW5ndGhcIiwgMSk7XG4gIG5hbWVJbnB1dC5zZXRBdHRyaWJ1dGUoXCJtYXhsZW5ndGhcIiwgMjApO1xuICBuYW1lSW5wdXQudG9nZ2xlQXR0cmlidXRlKFwicmVxdWlyZWRcIik7XG4gIGNvbG9yc1NlbGVjdC5zZXRBdHRyaWJ1dGUoXCJzaXplXCIsIDUpO1xuICBzYXZlLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJzdWJtaXRcIik7XG4gIHNhdmUuc2V0QXR0cmlidXRlKFwiZm9ybVwiLCBcInByb2plY3RGb3JtXCIpO1xuICAvLyBXaGVuIEZvcm0gU3VibWl0dGVkXG4gIHByb2plY3RGb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTsgLy8gVW5zdXJlIElmIE5lZWRlZCwgQnV0IHByZXZlbnRzIFdlYnBhY2sgUmVsb2FkaW5nIFRoZSBQYWdlXG4gICAgcHJvamVjdEZvcm1TdWJtaXNzaW9uKHByb2plY3RGb3JtKTtcbiAgICByZW1vdmVQcm9qZWN0SW5wdXRGaWVsZChwcm9qZWN0VXNlcklucHV0KTtcbiAgfSk7XG4gIG5hbWVJbnB1dC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgKCkgPT4ge1xuICAgIC8vIENoZWNrIGlmIHRoZSBmb3JtIGZpZWxkcyBhcmUgdmFsaWQuXG4gICAgaWYgKG5hbWVJbnB1dC52YWxpZGl0eS52YWxpZCkge1xuICAgICAgLy8gSWYgdmFsaWQsIGVuYWJsZSBzdWJtaXQgYnV0dG9uXG4gICAgICBzYXZlLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIElmIG5vdCB2YWxpZCwgZGlzYWJsZSBzdWJtaXQgYnV0dG9uXG4gICAgICBzYXZlLmRpc2FibGVkID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuICAvLyBDaGVja3MgSWYgVXNlciBDbGlja3MgT3V0IE9mIFByb2plY3QgRm9ybVxuICBwcm9qZWN0VXNlcklucHV0LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCB3aXRoaW5Cb3VuZGFyaWVzID0gZXZlbnQuY29tcG9zZWRQYXRoKCkuaW5jbHVkZXMoaW5wdXRDb250YWluZXIpO1xuICAgIGlmICghd2l0aGluQm91bmRhcmllcykgcmVtb3ZlUHJvamVjdElucHV0RmllbGQocHJvamVjdFVzZXJJbnB1dCk7XG4gIH0pO1xuICAvLyBDYW4gTm90IENhbGwgcmVtb3ZlUHJvamVjdElucHV0RmllbGQoKSBGb3IgU29tZSBSZWFzb25cbiAgY2FuY2VsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgYm9keS5yZW1vdmVDaGlsZChwcm9qZWN0VXNlcklucHV0KTtcbiAgfSk7XG5cbiAgLy8gQ29sb3JzIEZvciBUaGUgU2VsZWN0b3JcbiAgY29uc3QgY29sb3JzID0gW1xuICAgIHsgQ3JpbXNvbjogXCIjREMxNDNDXCIgfSxcbiAgICB7IENvcmFsOiBcIiNGRjdGNTBcIiB9LFxuICAgIHsgR29sZDogXCIjRkZENzAwXCIgfSxcbiAgICB7IExpbWU6IFwiIzAwRkYwMFwiIH0sXG4gICAgeyBBcXVhOiBcIiMwMEZGRkZcIiB9LFxuICAgIHsgUm95YWxCbHVlOiBcIiM0MTY5RTFcIiB9LFxuICAgIHsgVmlvbGV0OiBcIiNFRTgyRUVcIiB9LFxuICAgIHsgU2llbmE6IFwiI0EwNTIyRFwiIH0sXG4gICAgeyBMYXZlbmRlcjogXCIjRTZFNkZBXCIgfSxcbiAgICB7IEhvbmV5RGV3OiBcIiNGMEZGRjBcIiB9LFxuICAgIHsgU2lsdmVyOiBcIiNDMEMwQzBcIiB9LFxuICBdO1xuICBjb2xvcnMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG4gICAgY29uc3QgY29sb3JDaXJjbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICBjb25zdCBbdmFsXSA9IE9iamVjdC52YWx1ZXMoZWxlbWVudCk7XG4gICAgY29uc3QgW2tleV0gPSBPYmplY3Qua2V5cyhlbGVtZW50KTtcbiAgICBvcHRpb24uY2xhc3NMaXN0LmFkZChcIm9wdGlvblwiKTtcbiAgICBvcHRpb24udmFsdWUgPSB2YWw7XG4gICAgb3B0aW9uLmlubmVyVGV4dCA9IGtleTtcbiAgICBjb2xvckNpcmNsZS5jbGFzc0xpc3QuYWRkKFwiY29sb3JDaXJjbGVcIik7XG4gICAgY29sb3JDaXJjbGUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdmFsO1xuXG4gICAgb3B0aW9uLmFwcGVuZENoaWxkKGNvbG9yQ2lyY2xlKTtcbiAgICBjb2xvcnNTZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgfSk7XG4gIGNvbG9yc1NlbGVjdC5maXJzdENoaWxkLnNlbGVjdGVkID0gdHJ1ZTsgLy8gRGVmYXVsdCBWYWx1ZVxuXG4gIC8vIFRoaXMgUGFydCBPZiBUaGUgRnVuY3Rpb24gSXMgRm9yIEVkaXRpbmcgUHJvamVjdHNcbiAgLy8gcHJvamVjdCB3aWxsIHVuZGVmaW5lZCB3aGVuIGNhbGxlZCBieSBhbnl0aGluZyBlbHNlXG4gIC8vIEJ1dCBub3Qgd2hlbiBjYWxsZWQgYnkgdGhlIGVkaXQgcHJvamVjdCBidXR0b25cbiAgY29uc3QgaXNQcm9qZWN0ID0gT2JqZWN0Lmhhc093bihwcm9qZWN0LCBcImdldE5hbWVcIik7IC8vIE1ha2UgU3VyZSBJdHMgYSBQcm9qZWN0XG4gIGlmIChpc1Byb2plY3QpIHtcbiAgICBhZGRQcm9qZWN0TGFiZWwuaW5uZXJUZXh0ID0gXCJFZGl0IFByb2plY3RcIjtcbiAgICBuYW1lSW5wdXQudmFsdWUgPSBwcm9qZWN0LmdldE5hbWUoKTtcbiAgICBjb25zdCBjb2xvciA9IHByb2plY3QuZ2V0Q29sb3IoKTtcbiAgICBjb25zdCBvcHRpb25zID0gQXJyYXkuZnJvbShjb2xvcnNTZWxlY3QuY2hpbGROb2Rlcyk7XG4gICAgb3B0aW9ucy5mb3JFYWNoKChvcHRpb24pID0+IHtcbiAgICAgIGNvbnN0IGVsID0gb3B0aW9uO1xuICAgICAgaWYgKG9wdGlvbi52YWx1ZSA9PT0gY29sb3IpIGVsLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vIEFwcGVuZCBFdmVyeXRoaW5nIFRvZ2V0aGVyXG4gIG5hbWVJbnB1dExhYmVsLmFwcGVuZChuYW1lSW5wdXRTcGFuLCBuYW1lSW5wdXQpO1xuICBwcm9qZWN0Rm9ybS5hcHBlbmQobmFtZUlucHV0TGFiZWwsIGNvbG9yc1NlbGVjdCk7XG4gIGlucHV0Q29udGFpbmVyLmFwcGVuZChhZGRQcm9qZWN0TGFiZWwsIHByb2plY3RGb3JtLCBidXR0b25Db250YWluZXIpO1xuICBwcm9qZWN0VXNlcklucHV0LmFwcGVuZChpbnB1dENvbnRhaW5lcik7XG4gIGJ1dHRvbkNvbnRhaW5lci5hcHBlbmQoY2FuY2VsLCBzYXZlKTtcbiAgYm9keS5hcHBlbmRDaGlsZChwcm9qZWN0VXNlcklucHV0KTtcbn1cbiIsImltcG9ydCB7IGZvcm1hdCB9IGZyb20gXCJkYXRlLWZuc1wiO1xuaW1wb3J0IFwiLi9wcm9qZWN0TW9kdWxlLnNjc3NcIjtcbmltcG9ydCBcIi4vcHJvamVjdE1vZHVsZS5jc3NcIjtcbmltcG9ydCBkaXNwbGF5VGFza0lucHV0RmllbGQgZnJvbSBcIi4vdGFza0Zvcm1cIjtcbmltcG9ydCB7IGV2ZW50cyB9IGZyb20gXCIuL3B1YnN1YlwiO1xuXG5jb25zdCBib2R5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHlcIik7XG5cbi8vIERlbGV0ZSBGb3JtIE1hZGUgQnkgZGlzcGxheURldGFpbHMoKSBXaGVuIE5lZWRlZFxuZnVuY3Rpb24gcmVtb3ZlRGV0YWlscyh0YXNrQmFja2dyb3VuZCkge1xuICAvLyBDbG9uZSBOb2RlIFRvIFJlbW92ZSBFdmVudCBMaXN0ZW5lcnMgVGhlbiBSZW1vdmVcbiAgY29uc3QgbmV3RWxlbWVudCA9IHRhc2tCYWNrZ3JvdW5kLmNsb25lTm9kZSh0cnVlKTtcbiAgYm9keS5yZXBsYWNlQ2hpbGQobmV3RWxlbWVudCwgdGFza0JhY2tncm91bmQpO1xuICBib2R5LnJlbW92ZUNoaWxkKG5ld0VsZW1lbnQpO1xufVxuXG5mdW5jdGlvbiBkaXNwbGF5RGV0YWlscyh0b0RvKSB7XG4gIC8vIENyZWF0ZSBOZWNlc3NhcnkgRWxlbWVudHNcbiAgY29uc3QgdGFza0JhY2tncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBjb25zdCB0YXNrSW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKTtcbiAgY29uc3QgY2xvc2VJY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICBjb25zdCB0YXNrTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgY29uc3QgZm9yUHJvamVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgY29uc3QgZHVlRGF0ZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuICBjb25zdCBwcmlvcml0eSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgY29uc3QgdGFza0Rlc2NyaXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpXCIpO1xuXG4gIC8vIEdpdmUgVGhlbSBJRHNcbiAgdGFza0JhY2tncm91bmQuaWQgPSBcInRhc2tCYWNrZ3JvdW5kXCI7XG4gIHRhc2tJbmZvLmlkID0gXCJ0YXNrSW5mb1wiO1xuICBjbG9zZUljb24uaWQgPSBcImNsb3NlSWNvblwiO1xuICB0YXNrTmFtZS5pZCA9IFwidGFza0RldGFpbHNOYW1lXCI7XG5cbiAgLy8gR2V0IFRoZSBEdWUgRGF0ZSBPZiBUaGUgVG9kb1xuICAvLyBUaGVuIFNldCBJdCBVcCBUbyBCZSBGb3JtYXRlZCBCeSBkYXRlcy1mbnNcbiAgbGV0IGR1ZURhdGUgPSB0b0RvLmdldER1ZURhdGUoKTtcbiAgY29uc3QgeWVhciA9IGR1ZURhdGUuc3Vic3RyaW5nKDAsIGR1ZURhdGUuaW5kZXhPZihcIi1cIikpO1xuICBjb25zdCBkYXkgPSBkdWVEYXRlLnN1YnN0cmluZyhkdWVEYXRlLmxhc3RJbmRleE9mKFwiLVwiKSArIDEpO1xuICBjb25zdCBtb250aCA9XG4gICAgcGFyc2VJbnQoXG4gICAgICBkdWVEYXRlLnN1YnN0cmluZyhkdWVEYXRlLmluZGV4T2YoXCItXCIpICsgMSwgZHVlRGF0ZS5sYXN0SW5kZXhPZihcIi1cIikpLFxuICAgICAgMTBcbiAgICApIC0gMTsgLy8gU3VidHJhY3QgMSBmb3IgZGF0ZXMtZm5zIGZvcm1hdFxuICBkdWVEYXRlID0gZm9ybWF0KG5ldyBEYXRlKHllYXIsIG1vbnRoLCBkYXkpLCBcIk1NTSBkIHl5eXlcIik7XG5cbiAgLy8gQXNzaWduIFRhc2sgSW5mb3JtYXRpb25cbiAgdGFza05hbWUuaW5uZXJUZXh0ID0gdG9Eby5nZXRUYXNrKCk7XG4gIGZvclByb2plY3QuaW5uZXJUZXh0ID0gYFByb2plY3Q6ICR7dG9Eby5nZXRQcm9qZWN0KCkuZ2V0TmFtZSgpfWA7XG4gIGR1ZURhdGVFbC5pbm5lclRleHQgPSBgRHVlIERhdGU6ICR7ZHVlRGF0ZX1gO1xuICBwcmlvcml0eS5pbm5lclRleHQgPSBgUHJpb3JpdHk6ICR7dG9Eby5nZXRQcmlvcml0eSgpfWA7XG4gIHRhc2tEZXNjcmlwdGlvbi5pbm5lclRleHQgPSBgRGVzY3JpcHRpb246ICR7dG9Eby5nZXREZXNjcmlwdGlvbigpfWA7XG5cbiAgLy8gSWNvbiBUbyBDbG9zZSBEZXRhaWxzXG4gIGNsb3NlSWNvbi5pbm5lclRleHQgPSBcIlxcdTI3MTZcIjtcblxuICAvLyBGdW5jdGlvbmFsaXR5XG4gIC8vIENoZWNrcyBJZiBVc2VyIENsaWNrcyBPdXQgT2YgUHJvamVjdCBGb3JtXG4gIHRhc2tCYWNrZ3JvdW5kLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZXZlbnQpID0+IHtcbiAgICBjb25zdCB3aXRoaW5Cb3VuZGFyaWVzID0gZXZlbnQuY29tcG9zZWRQYXRoKCkuaW5jbHVkZXModGFza0luZm8pO1xuICAgIGlmICghd2l0aGluQm91bmRhcmllcykgcmVtb3ZlRGV0YWlscyh0YXNrQmFja2dyb3VuZCk7XG4gIH0pO1xuXG4gIC8vIENsb3NlIERldGFpbHMgSWYgSWNvbiBDbGlja2VkXG4gIGNsb3NlSWNvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGJvZHkucmVtb3ZlQ2hpbGQodGFza0JhY2tncm91bmQpO1xuICB9KTtcblxuICB0YXNrSW5mby5hcHBlbmQoXG4gICAgY2xvc2VJY29uLFxuICAgIHRhc2tOYW1lLFxuICAgIGZvclByb2plY3QsXG4gICAgZHVlRGF0ZUVsLFxuICAgIHByaW9yaXR5LFxuICAgIHRhc2tEZXNjcmlwdGlvblxuICApO1xuICB0YXNrQmFja2dyb3VuZC5hcHBlbmRDaGlsZCh0YXNrSW5mbyk7XG4gIGJvZHkuYXBwZW5kQ2hpbGQodGFza0JhY2tncm91bmQpO1xufVxuLy8gRXhwb3J0IFNvIG9wZW5JbmJveCBDYW4gVXNlIEFzIFdlbGxcbmV4cG9ydCBmdW5jdGlvbiBtYWtlVG9kbyhwcm9qZWN0LCB0b0RvKSB7XG4gIC8vIFRoZSBUb0RvcyBGb3IgVGhlIFByb2plY3RcbiAgY29uc3QgdG9kbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWN0aW9uXCIpO1xuICBjb25zdCBwcmlvcml0eUNvbG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG4gIGNvbnN0IHRvZG9DaGVja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgY29uc3QgdGFza05hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gIGNvbnN0IGRldGFpbHNCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICBjb25zdCBkdWVEYXRlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgY29uc3QgdHJhc2hDYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgY29uc3QgZWRpdEljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcblxuICAvLyBDbGFzc2VzIGFuZCBJbm5lcnRleHRcbiAgdG9kby5jbGFzc0xpc3QuYWRkKFwidG9kb1wiKTtcbiAgcHJpb3JpdHlDb2xvci5jbGFzc0xpc3QuYWRkKFwicHJpb3JpdHlDb2xvclwiKTtcbiAgdG9kb0NoZWNrYm94LmNsYXNzTGlzdC5hZGQoXCJ0b2RvQ2hlY2tib3hcIik7XG4gIHRhc2tOYW1lLmNsYXNzTGlzdC5hZGQoXCJ0YXNrTmFtZVwiKTtcbiAgZGV0YWlsc0J0bi5jbGFzc0xpc3QuYWRkKFwiZGV0YWlsc0J0blwiKTtcbiAgZHVlRGF0ZUVsLmNsYXNzTGlzdC5hZGQoXCJkdWVEYXRlRWxcIik7XG4gIHRyYXNoQ2FuLmNsYXNzTGlzdC5hZGQoXCJ0cmFzaENhblwiKTtcbiAgZWRpdEljb24uY2xhc3NMaXN0LmFkZChcImVkaXRJY29uXCIpO1xuICB0YXNrTmFtZS5pbm5lclRleHQgPSB0b0RvLmdldFRhc2soKTtcbiAgZGV0YWlsc0J0bi5pbm5lclRleHQgPSBcIkRFVEFJTFNcIjtcblxuICAvLyBHZXQgVGhlIER1ZSBEYXRlIE9mIFRoZSBUb2RvXG4gIC8vIFRoZW4gU2V0IEl0IFVwIFRvIEJlIEZvcm1hdGVkIEJ5IGRhdGVzLWZuc1xuICBjb25zdCBkdWVEYXRlID0gdG9Eby5nZXREdWVEYXRlKCk7XG4gIGNvbnN0IHllYXIgPSBkdWVEYXRlLnN1YnN0cmluZygwLCBkdWVEYXRlLmluZGV4T2YoXCItXCIpKTtcbiAgY29uc3QgZGF5ID0gZHVlRGF0ZS5zdWJzdHJpbmcoZHVlRGF0ZS5sYXN0SW5kZXhPZihcIi1cIikgKyAxKTtcbiAgY29uc3QgbW9udGggPVxuICAgIHBhcnNlSW50KFxuICAgICAgZHVlRGF0ZS5zdWJzdHJpbmcoZHVlRGF0ZS5pbmRleE9mKFwiLVwiKSArIDEsIGR1ZURhdGUubGFzdEluZGV4T2YoXCItXCIpKSxcbiAgICAgIDEwXG4gICAgKSAtIDE7IC8vIFN1YnRyYWN0IDEgZm9yIGRhdGVzLWZucyBmb3JtYXRcbiAgZHVlRGF0ZUVsLmlubmVyVGV4dCA9IGZvcm1hdChuZXcgRGF0ZSh5ZWFyLCBtb250aCwgZGF5KSwgXCJNTU0gZFwiKTtcblxuICAvLyBGdW50aW9uYWxpdHlcbiAgdG9kb0NoZWNrYm94LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJjaGVja2JveFwiKTtcbiAgdG9kb0NoZWNrYm94LnNldEF0dHJpYnV0ZShcIm5hbWVcIiwgXCJjaGVja2JveFwiKTtcbiAgdGFza05hbWUuc2V0QXR0cmlidXRlKFwiZm9yXCIsIFwiY2hlY2tib3hcIik7XG5cbiAgLy8gTWFya2luZyBBIFRvZG8gQXMgRG9uZVxuICB0b2RvQ2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICB0b0RvLnRvZ2dsZUNvbXBsZXRlKCk7XG4gICAgdG9kb0NoZWNrYm94LnRvZ2dsZUF0dHJpYnV0ZShcImNoZWNrZWRcIik7XG4gICAgdGFza05hbWUuY2xhc3NMaXN0LnRvZ2dsZShcInN0cmlrZVRocm91Z2hcIik7XG4gICAgZGV0YWlsc0J0bi5jbGFzc0xpc3QudG9nZ2xlKFwiZGV0YWlsc0J0bkNoZWNrZWRcIik7XG4gICAgdHJhc2hDYW4uY2xhc3NMaXN0LnRvZ2dsZShcInRyYXNoQ2FuQ2hlY2tlZFwiKTtcbiAgICBlZGl0SWNvbi5jbGFzc0xpc3QudG9nZ2xlKFwiZWRpdEljb25DaGVja2VkXCIpO1xuICAgIGV2ZW50cy5lbWl0KFwidXBkYXRlVG9kb0NvdW50XCIpO1xuICAgIGV2ZW50cy5lbWl0KFwidXBkYXRlUHJvamVjdFRvZG9Db3VudFwiLCBwcm9qZWN0KTtcbiAgfSk7XG5cbiAgLy8gRXF1YWwgVG8gVHJ1ZSBNZWFucyBUaGUgVG9kbyBJcyBDb21wbGV0ZVxuICAvLyBUaGlzIElzIFNvIFRoYXQgSWYgQSBUb2RvIElzIENoZWNrZWQgU29td2hlcmUsXG4gIC8vIEl0IFdpbGwgQXBwZWFyIENoZWNrZWQgRWxzZXdoZXJlXG4gIGlmICh0b0RvLmdldFN0YXR1cygpID09PSB0cnVlKSB7XG4gICAgdG9kb0NoZWNrYm94LnRvZ2dsZUF0dHJpYnV0ZShcImNoZWNrZWRcIik7XG4gICAgdGFza05hbWUuY2xhc3NMaXN0LnRvZ2dsZShcInN0cmlrZVRocm91Z2hcIik7XG4gICAgZGV0YWlsc0J0bi5jbGFzc0xpc3QudG9nZ2xlKFwiZGV0YWlsc0J0bkNoZWNrZWRcIik7XG4gICAgdHJhc2hDYW4uY2xhc3NMaXN0LnRvZ2dsZShcInRyYXNoQ2FuQ2hlY2tlZFwiKTtcbiAgICBlZGl0SWNvbi5jbGFzc0xpc3QudG9nZ2xlKFwiZWRpdEljb25DaGVja2VkXCIpO1xuICB9XG5cbiAgLy8gRGlzcGxheSBEZXRhaWxzIE9mIFRoZSBUb2RvXG4gIGRldGFpbHNCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBkaXNwbGF5RGV0YWlscyh0b0RvKTtcbiAgfSk7XG5cbiAgLy8gRWRpdCBUaGUgVG9kbyBJbmZvcm1hdGlvblxuICAvLyBkaXNwbGF5VGFza0lucHV0RmllbGQoKSBoYXMgdHdvIHBhcmFtZXRlcnNcbiAgLy8gSWYgaXQgaXMgcGFzc2VkIGEgdG9kbyBpdCB3aWxsIGRpc3BsYXkgaXRzIGluZm9ybWF0aW9uXG4gIGVkaXRJY29uLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgZGlzcGxheVRhc2tJbnB1dEZpZWxkKHByb2plY3QsIHRvRG8pO1xuICB9KTtcblxuICAvLyBEZWxldGUgVGhlIFRvZG8gRnJvbSBUaGUgUHJvamVjdFxuICAvLyBUaGVuIFVwZGF0ZSBQYWdlXG4gIHRyYXNoQ2FuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgcHJvamVjdC5yZW1vdmVUb0RvKHRvRG8pO1xuICAgIGV2ZW50cy5lbWl0KFwicmVtb3ZlVG9Eb1wiLCB0b0RvKTtcbiAgICBldmVudHMuZW1pdChcInVwZGF0ZVRvZG9cIiwgcHJvamVjdCk7XG4gICAgZXZlbnRzLmVtaXQoXCJ1cGRhdGVUb2RvQ291bnRcIik7XG4gICAgZXZlbnRzLmVtaXQoXCJ1cGRhdGVQcm9qZWN0VG9kb0NvdW50XCIsIHByb2plY3QpO1xuICB9KTtcblxuICAvLyBBcHBlbmRcbiAgdG9kby5hcHBlbmQoXG4gICAgcHJpb3JpdHlDb2xvcixcbiAgICB0b2RvQ2hlY2tib3gsXG4gICAgdGFza05hbWUsXG4gICAgZGV0YWlsc0J0bixcbiAgICBkdWVEYXRlRWwsXG4gICAgZWRpdEljb24sXG4gICAgdHJhc2hDYW5cbiAgKTtcblxuICByZXR1cm4gdG9kbztcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcHJvamVjdE1vZHVsZShwcm9qZWN0KSB7XG4gIC8vIE1ha2UgU3BhY2UgRm9yIE5ldyBQcm9qZWN0IFRvZG9zXG4gIGNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2NvbnRlbnRcIik7XG4gIGNvbnRlbnQucmVwbGFjZUNoaWxkcmVuKCk7XG4gIC8vIERpc3BsYXkgVGhlIFByb2plY3QgVGhhdCBXYXMgQ2xpY2tlZC9DcmVhdGVkXG4gIGNvbnN0IHNlbGVjdGVkUHJvamVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoMVwiKTtcbiAgY29uc3QgYWRkVG9kb0J0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG5cbiAgc2VsZWN0ZWRQcm9qZWN0LmlkID0gXCJzZWxlY3RlZFByb2plY3RcIjtcbiAgc2VsZWN0ZWRQcm9qZWN0LmlubmVyVGV4dCA9IHByb2plY3QuZ2V0TmFtZSgpO1xuICBhZGRUb2RvQnRuLmlubmVyVGV4dCA9IFwiXFx1Mjc5NSBBZGQgVGFza1wiO1xuICBhZGRUb2RvQnRuLmlkID0gXCJhZGRUb2RvQnRuXCI7XG4gIC8vIEZ1bmN0aW9uYWxpdHlcbiAgYWRkVG9kb0J0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgIGRpc3BsYXlUYXNrSW5wdXRGaWVsZChwcm9qZWN0KTtcbiAgfSk7XG5cbiAgLy8gQ3JlYXRlIFRoZSBEaWZmZXJlbnQgUHJpb3JpdHkgTGV2ZWxzXG4gIGNvbnN0IHByaW9yaXR5T25lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgY29uc3QgcHJpb3JpdHlUd28gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBjb25zdCBwcmlvcml0eVRocmVlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgY29uc3QgcHJpb3JpdHlGb3VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgLy8gQ2xhc3NsaXN0IEZvciBFYWNoOiBGb3IgQ29sb3JcbiAgcHJpb3JpdHlPbmUuY2xhc3NMaXN0LmFkZChcInByaW9yaXR5T25lXCIpO1xuICBwcmlvcml0eVR3by5jbGFzc0xpc3QuYWRkKFwicHJpb3JpdHlUd29cIik7XG4gIHByaW9yaXR5VGhyZWUuY2xhc3NMaXN0LmFkZChcInByaW9yaXR5VGhyZWVcIik7XG4gIHByaW9yaXR5Rm91ci5jbGFzc0xpc3QuYWRkKFwicHJpb3JpdHlGb3VyXCIpO1xuICAvLyBDb3JyZWN0IElubmVyVGV4dCBGb3IgRWFjaFxuICBwcmlvcml0eU9uZS5pbm5lclRleHQgPSBcIlByaW9yaXR5IDFcIjtcbiAgcHJpb3JpdHlUd28uaW5uZXJUZXh0ID0gXCJQcmlvcml0eSAyXCI7XG4gIHByaW9yaXR5VGhyZWUuaW5uZXJUZXh0ID0gXCJQcmlvcml0eSAzXCI7XG4gIHByaW9yaXR5Rm91ci5pbm5lclRleHQgPSBcIlByaW9yaXR5IDRcIjtcblxuICAvLyBBcHBlbmQgVG8gU2hvdyBPbiBQYWdlXG4gIHNlbGVjdGVkUHJvamVjdC5hcHBlbmRDaGlsZChhZGRUb2RvQnRuKTtcbiAgY29udGVudC5hcHBlbmQoXG4gICAgc2VsZWN0ZWRQcm9qZWN0LFxuICAgIHByaW9yaXR5T25lLFxuICAgIHByaW9yaXR5VHdvLFxuICAgIHByaW9yaXR5VGhyZWUsXG4gICAgcHJpb3JpdHlGb3VyXG4gICk7XG5cbiAgY29uc3QgdG9kb0xpc3QgPSBwcm9qZWN0LmdldFRvRG8oKTtcblxuICB0b2RvTGlzdC5mb3JFYWNoKCh0b2RvKSA9PiB7XG4gICAgY29uc3QgcHJpb3JpdHkgPSB0b2RvLmdldFByaW9yaXR5KCk7XG4gICAgc3dpdGNoIChwcmlvcml0eSkge1xuICAgICAgY2FzZSBcIjFcIjpcbiAgICAgIGNhc2UgXCJQcmlvcml0eSAxXCI6XG4gICAgICAgIHByaW9yaXR5T25lLmFwcGVuZChtYWtlVG9kbyhwcm9qZWN0LCB0b2RvKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjJcIjpcbiAgICAgIGNhc2UgXCJQcmlvcml0eSAyXCI6XG4gICAgICAgIHByaW9yaXR5VHdvLmFwcGVuZChtYWtlVG9kbyhwcm9qZWN0LCB0b2RvKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIjNcIjpcbiAgICAgIGNhc2UgXCJQcmlvcml0eSAzXCI6XG4gICAgICAgIHByaW9yaXR5VGhyZWUuYXBwZW5kKG1ha2VUb2RvKHByb2plY3QsIHRvZG8pKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiNFwiOlxuICAgICAgY2FzZSBcIlByaW9yaXR5IDRcIjpcbiAgICAgICAgcHJpb3JpdHlGb3VyLmFwcGVuZChtYWtlVG9kbyhwcm9qZWN0LCB0b2RvKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9KTtcbn1cbiIsIi8vIGV2ZW50cyAtIGEgc3VwZXItYmFzaWMgSmF2YXNjcmlwdCAocHVibGlzaCBzdWJzY3JpYmUpIHBhdHRlcm5cblxuY29uc3QgZXZlbnRzID0ge1xuICBldmVudHM6IHt9LFxuICBvbihldmVudE5hbWUsIGZuKSB7XG4gICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXSA9IHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0gfHwgW107XG4gICAgdGhpcy5ldmVudHNbZXZlbnROYW1lXS5wdXNoKGZuKTtcbiAgfSxcbiAgb2ZmKGV2ZW50TmFtZSwgZm4pIHtcbiAgICBpZiAodGhpcy5ldmVudHNbZXZlbnROYW1lXSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdW2ldID09PSBmbikge1xuICAgICAgICAgIHRoaXMuZXZlbnRzW2V2ZW50TmFtZV0uc3BsaWNlKGksIDEpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBlbWl0KGV2ZW50TmFtZSwgZGF0YSkge1xuICAgIGlmICh0aGlzLmV2ZW50c1tldmVudE5hbWVdKSB7XG4gICAgICB0aGlzLmV2ZW50c1tldmVudE5hbWVdLmZvckVhY2goKGZuKSA9PiB7XG4gICAgICAgIGZuKGRhdGEpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LFxufTtcblxubW9kdWxlLmV4cG9ydHMuZXZlbnRzID0gZXZlbnRzO1xuIiwiaW1wb3J0IHsgZXZlbnRzIH0gZnJvbSBcIi4vcHVic3ViXCI7XG5pbXBvcnQgXCIuL3Rhc2tGb3JtLmNzc1wiO1xuaW1wb3J0IHsgY3JlYXRlVG9kbyB9IGZyb20gXCIuL3RvZG9cIjtcblxucmVxdWlyZShcIi4vdG9kb0NvbnRyb2xsZXJcIik7XG5cbmNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKTtcblxuLy8gRGVsZXRlIEZvcm0gTWFkZSBCeSBkaXNwbGF5VGFza0lucHV0RmllbGQoKSBXaGVuIE5lZWRlZFxuZnVuY3Rpb24gcmVtb3ZlVGFza0lucHV0RmllbGQodGFza0JhY2tncm91bmQpIHtcbiAgLy8gQ2xvbmUgTm9kZSBUbyBSZW1vdmUgRXZlbnQgTGlzdGVuZXJzIFRoZW4gUmVtb3ZlXG4gIGNvbnN0IG5ld0VsZW1lbnQgPSB0YXNrQmFja2dyb3VuZC5jbG9uZU5vZGUodHJ1ZSk7XG4gIGJvZHkucmVwbGFjZUNoaWxkKG5ld0VsZW1lbnQsIHRhc2tCYWNrZ3JvdW5kKTtcbiAgYm9keS5yZW1vdmVDaGlsZChuZXdFbGVtZW50KTtcbn1cblxuLy8gSGFuZGxlcyBXaGVuIHRoZSBVc2VyIFN1Ym1pdHMgdGhlIFByb2plY3QgRm9ybVxuZnVuY3Rpb24gdGFza0Zvcm1TdWJtaXNzaW9uKHRhc2tGb3JtLCBwcm9qZWN0LCB0b0RvKSB7XG4gIGNvbnN0IHRhc2tOYW1lID0gdGFza0Zvcm0uZWxlbWVudHMudGFza05hbWUudmFsdWU7XG4gIGNvbnN0IHRhc2tEZXNjcmlwdGlvbiA9IHRhc2tGb3JtLmVsZW1lbnRzLnRhc2tEZXNjcmlwdGlvbi52YWx1ZTtcbiAgY29uc3QgZHVlRGF0ZSA9IHRhc2tGb3JtLmVsZW1lbnRzLmR1ZURhdGUudmFsdWU7XG4gIGNvbnN0IHNlbGVjdFByaW9yaXR5ID0gdGFza0Zvcm0uZWxlbWVudHMuc2VsZWN0UHJpb3JpdHkudmFsdWU7XG4gIGNvbnN0IG5ld1RvZG8gPSBjcmVhdGVUb2RvKFxuICAgIHRhc2tOYW1lLFxuICAgIHRhc2tEZXNjcmlwdGlvbixcbiAgICBkdWVEYXRlLFxuICAgIHNlbGVjdFByaW9yaXR5LFxuICAgIHByb2plY3RcbiAgKTtcbiAgLy8gVGhpcyBQYXJ0IE9mIFRoZSBGdW5jdGlvbiBJcyBGb3IgRWRpdGluZyBUb2Rvc1xuICAvLyB0b0RvIHdpbGwgdW5kZWZpbmVkIHdoZW4gY2FsbGVkIGJ5IGFkZFRvZG9CdG5cbiAgLy8gQnV0IG5vdCB3aGVuIGNhbGxlZCBieSBlZGl0SWNvblxuICBpZiAodG9EbyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcHJvamVjdC5yZW1vdmVUb0RvKHRvRG8pO1xuICAgIGV2ZW50cy5lbWl0KFwicmVtb3ZlVG9Eb1wiLCB0b0RvKTtcbiAgfVxuICAvLyBMaW5rIEFuZCBVcGRhdGVcbiAgcHJvamVjdC5hZGRUb0RvKG5ld1RvZG8pO1xuICBldmVudHMuZW1pdChcImFkZFRvZG9cIiwgbmV3VG9kbyk7XG4gIGV2ZW50cy5lbWl0KFwidXBkYXRlVG9kb1wiLCBwcm9qZWN0KTtcbiAgZXZlbnRzLmVtaXQoXCJ1cGRhdGVQcm9qZWN0VG9kb0NvdW50XCIsIHByb2plY3QpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkaXNwbGF5VGFza0lucHV0RmllbGQocHJvamVjdCwgdG9Ebykge1xuICAvLyBDcmVhdGUgTmVjZXNzYXJ5IEVsZW1lbnRzXG4gIGNvbnN0IHRhc2tCYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgY29uc3QgdGFza1VzZXJJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGNvbnN0IHRhc2tGb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZvcm1cIik7XG4gIGNvbnN0IHRhc2tOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICBjb25zdCB0YXNrRGVzY3JpcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGV4dGFyZWFcIik7XG4gIGNvbnN0IGR1ZURhdGVCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gIGNvbnN0IHNlbGVjdFByaW9yaXR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiKTtcbiAgY29uc3QgdGFza09wdGlvbnNDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBjb25zdCBjYW5jZWxCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuICBjb25zdCBzYXZlQnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcblxuICAvLyBHaXZlIFRoZW0gSURzXG4gIHRhc2tCYWNrZ3JvdW5kLmlkID0gXCJ0YXNrQmFja2dyb3VuZFwiO1xuICB0YXNrVXNlcklucHV0LmlkID0gXCJ0YXNrVXNlcklucHV0XCI7XG4gIHRhc2tGb3JtLmlkID0gXCJ0YXNrRm9ybVwiO1xuICB0YXNrTmFtZS5pZCA9IFwidGFza05hbWVcIjtcbiAgdGFza0Rlc2NyaXB0aW9uLmlkID0gXCJ0YXNrRGVzY3JpcHRpb25cIjtcbiAgZHVlRGF0ZUJ0bi5pZCA9IFwiZHVlRGF0ZVwiO1xuICBzZWxlY3RQcmlvcml0eS5pZCA9IFwic2VsZWN0UHJpb3JpdHlcIjtcbiAgdGFza09wdGlvbnNDb250YWluZXIuaWQgPSBcInRhc2tPcHRpb25zQ29udGFpbmVyXCI7XG5cbiAgLy8gSW5uZXJUZXh0IEFuZCBDbGFzc2VzXG4gIGNhbmNlbEJ0bi5pbm5lclRleHQgPSBcIkNBTkNFTFwiO1xuICBzYXZlQnRuLmlubmVyVGV4dCA9IFwiU0FWRVwiO1xuICBjYW5jZWxCdG4uY2xhc3NMaXN0LmFkZChcImNhbmNlbEJ0blwiKTtcbiAgc2F2ZUJ0bi5jbGFzc0xpc3QuYWRkKFwic2F2ZUJ0blwiKTtcbiAgc2F2ZUJ0bi5kaXNhYmxlZCA9IHRydWU7XG4gIGR1ZURhdGVCdG4uaW5uZXJUZXh0ID0gXCJtbS9kZC95eXl5XCI7XG4gIC8vIEZ1bnRpb25hbGl0eVxuICB0YXNrTmFtZS5zZXRBdHRyaWJ1dGUoXCJtaW5sZW5ndGhcIiwgMSk7XG4gIHRhc2tOYW1lLnNldEF0dHJpYnV0ZShcIm1heGxlbmd0aFwiLCAyMCk7XG4gIHRhc2tOYW1lLnNldEF0dHJpYnV0ZShcInBsYWNlaG9sZGVyXCIsIFwiVGFzayBOYW1lXCIpO1xuICB0YXNrRGVzY3JpcHRpb24uc2V0QXR0cmlidXRlKFwibWlubGVuZ3RoXCIsIDEpO1xuICB0YXNrRGVzY3JpcHRpb24uc2V0QXR0cmlidXRlKFwicGxhY2Vob2xkZXJcIiwgXCJEZXNjcmlwdGlvblwiKTtcbiAgZHVlRGF0ZUJ0bi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiZGF0ZVwiKTtcbiAgc2F2ZUJ0bi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwic3VibWl0XCIpO1xuICBzYXZlQnRuLnNldEF0dHJpYnV0ZShcImZvcm1cIiwgXCJ0YXNrRm9ybVwiKTtcbiAgc2F2ZUJ0bi5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBcIkZpbGwgT3V0IEFsbCBGaWVsZHNcIik7XG5cbiAgLy8gUmVxdWlyZSBFdmVyeXRoaW5nXG4gIHRhc2tOYW1lLnRvZ2dsZUF0dHJpYnV0ZShcInJlcXVpcmVkXCIpO1xuICB0YXNrRGVzY3JpcHRpb24udG9nZ2xlQXR0cmlidXRlKFwicmVxdWlyZWRcIik7XG4gIGR1ZURhdGVCdG4udG9nZ2xlQXR0cmlidXRlKFwicmVxdWlyZWRcIik7XG4gIHNlbGVjdFByaW9yaXR5LnRvZ2dsZUF0dHJpYnV0ZShcInJlcXVpcmVkXCIpO1xuXG4gIC8vIEZ1bmN0aW9uIFRvIENoZWNrIElmIEV2ZXJ5dGhpbmcgSXMgVmFsaWRcbiAgZnVuY3Rpb24gY2hlY2tWYWxpZGF0aW9uKCkge1xuICAgIGlmIChcbiAgICAgIHRhc2tOYW1lLnZhbGlkaXR5LnZhbGlkICYmXG4gICAgICB0YXNrRGVzY3JpcHRpb24udmFsaWRpdHkudmFsaWQgJiZcbiAgICAgIGR1ZURhdGVCdG4udmFsaWRpdHkudmFsaWQgJiZcbiAgICAgIHNlbGVjdFByaW9yaXR5LnZhbHVlICE9PSBcIlByaW9yaXR5P1wiIC8vIFRoZSBEZWZhdWx0IFZhbHVlXG4gICAgKSB7XG4gICAgICBzYXZlQnRuLmRpc2FibGVkID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNhdmVCdG4uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8vIFZhbGlkYXRpb25cbiAgdGFza05hbWUuYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsICgpID0+IHtcbiAgICAvLyBDaGVjayBpZiB0aGUgZm9ybSBmaWVsZHMgYXJlIHZhbGlkLlxuICAgIGlmICh0YXNrTmFtZS52YWxpZGl0eS52YWxpZCkge1xuICAgICAgdGFza05hbWUuY2xhc3NMaXN0LnJlbW92ZShcIkludmFsaWRcIik7XG4gICAgICBjaGVja1ZhbGlkYXRpb24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgbm90IHZhbGlkIGFkZCBpbnZhbGlkIGNsYXNzIHRvIGhpZ2hsaWdodCByZWRcbiAgICAgIHRhc2tOYW1lLmNsYXNzTGlzdC5hZGQoXCJJbnZhbGlkXCIpO1xuICAgICAgLy8gV2lsbCBEaXNhYmxlIFN1bWJpdCBCdXR0b25cbiAgICAgIGNoZWNrVmFsaWRhdGlvbigpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gQXQgbGVhc3QgT25lIENoYXJhY3RlciBJbiBEZXNjcmlwdGlvblxuICB0YXNrRGVzY3JpcHRpb24uYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsICgpID0+IHtcbiAgICAvLyBDaGVjayBpZiB0aGUgZm9ybSBmaWVsZHMgYXJlIHZhbGlkLlxuICAgIGlmICh0YXNrRGVzY3JpcHRpb24udmFsaWRpdHkudmFsaWQpIHtcbiAgICAgIHRhc2tEZXNjcmlwdGlvbi5jbGFzc0xpc3QucmVtb3ZlKFwiSW52YWxpZFwiKTtcbiAgICAgIGNoZWNrVmFsaWRhdGlvbigpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiBub3QgdmFsaWQgYWRkIGludmFsaWQgY2xhc3MgdG8gaGlnaGxpZ2h0IHJlZFxuICAgICAgdGFza0Rlc2NyaXB0aW9uLmNsYXNzTGlzdC5hZGQoXCJJbnZhbGlkXCIpO1xuICAgICAgLy8gV2lsbCBEaXNhYmxlIFN1bWJpdCBCdXR0b25cbiAgICAgIGNoZWNrVmFsaWRhdGlvbigpO1xuICAgIH1cbiAgfSk7XG4gIC8vIEEgRGF0ZSBTZWxlY3RlZFxuICBkdWVEYXRlQnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwgKCkgPT4ge1xuICAgIC8vIENoZWNrIGlmIHRoZSBmb3JtIGZpZWxkcyBhcmUgdmFsaWQuXG4gICAgaWYgKGR1ZURhdGVCdG4udmFsaWRpdHkudmFsaWQpIHtcbiAgICAgIGR1ZURhdGVCdG4uY2xhc3NMaXN0LnJlbW92ZShcIkludmFsaWRcIik7XG4gICAgICBjaGVja1ZhbGlkYXRpb24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgbm90IHZhbGlkIGFkZCBpbnZhbGlkIGNsYXNzIHRvIGhpZ2hsaWdodCByZWRcbiAgICAgIGR1ZURhdGVCdG4uY2xhc3NMaXN0LmFkZChcIkludmFsaWRcIik7XG4gICAgICAvLyBXaWxsIERpc2FibGUgU3VtYml0IEJ1dHRvblxuICAgICAgY2hlY2tWYWxpZGF0aW9uKCk7XG4gICAgfVxuICB9KTtcbiAgLy8gQSBQcmlvcml0eSBTZWxlY3RlZFxuICAvLyBPbmNlIEEgUHJpb3JpdHkgSXMgU2VsZWN0ZWQgSXQgQ2FuIE5vIExvbmdlciBHbyBUbyBEZWZhdWx0XG4gIC8vIFNvIE5vIE5lZWQgVG8gVmVyaWZ5IEluIFRoZSBTYW1lIEZhc2hpb25cbiAgc2VsZWN0UHJpb3JpdHkuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG4gICAgLy8gQ2hlY2sgaWYgdGhlIG90aGVyIGZvcm0gZmllbGRzIGFyZSB2YWxpZC5cbiAgICBjaGVja1ZhbGlkYXRpb24oKTtcbiAgfSk7XG5cbiAgLy8gV2hlbiBGb3JtIFN1Ym1pdHRlZFxuICB0YXNrRm9ybS5hZGRFdmVudExpc3RlbmVyKFwic3VibWl0XCIsIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIFVuc3VyZSBJZiBOZWVkZWQsIEJ1dCBwcmV2ZW50cyBXZWJwYWNrIFJlbG9hZGluZyBUaGUgUGFnZVxuICAgIHRhc2tGb3JtU3VibWlzc2lvbih0YXNrRm9ybSwgcHJvamVjdCwgdG9Ebyk7XG4gICAgcmVtb3ZlVGFza0lucHV0RmllbGQodGFza0JhY2tncm91bmQpO1xuICB9KTtcbiAgLy8gQ2hlY2tzIElmIFVzZXIgQ2xpY2tzIE91dCBPZiBQcm9qZWN0IEZvcm1cbiAgdGFza0JhY2tncm91bmQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChldmVudCkgPT4ge1xuICAgIGNvbnN0IHdpdGhpbkJvdW5kYXJpZXMgPSBldmVudC5jb21wb3NlZFBhdGgoKS5pbmNsdWRlcyh0YXNrVXNlcklucHV0KTtcbiAgICBpZiAoIXdpdGhpbkJvdW5kYXJpZXMpIHJlbW92ZVRhc2tJbnB1dEZpZWxkKHRhc2tCYWNrZ3JvdW5kKTtcbiAgfSk7XG4gIC8vIENhbiBOb3QgQ2FsbCByZW1vdmVUYXNrSW5wdXRGaWVsZCgpIEZvciBTb21lIFJlYXNvblxuICBjYW5jZWxCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBib2R5LnJlbW92ZUNoaWxkKHRhc2tCYWNrZ3JvdW5kKTtcbiAgfSk7XG5cbiAgLy8gQ3JlYXRlIFByaW9yaXR5IE9wdGlvbnNcbiAgY29uc3QgcHJpb3JpdGllcyA9IFtcbiAgICBcIlByaW9yaXR5P1wiLFxuICAgIFwiUHJpb3JpdHkgMVwiLFxuICAgIFwiUHJpb3JpdHkgMlwiLFxuICAgIFwiUHJpb3JpdHkgM1wiLFxuICAgIFwiUHJpb3JpdHkgNFwiLFxuICBdO1xuICBwcmlvcml0aWVzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpO1xuICAgIG9wdGlvbi5pbm5lclRleHQgPSBlbGVtZW50O1xuICAgIG9wdGlvbi52YWx1ZSA9IGVsZW1lbnQ7XG4gICAgc2VsZWN0UHJpb3JpdHkuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgfSk7XG4gIC8vIEZpcnN0IENoaWxkIElzIE9ubHkgQSBMYWJlbCBGb3IgVGhlIFNlbGVjdFxuICBjb25zdCBQcmlvcml0eUxhYmVsID0gQXJyYXkuZnJvbShzZWxlY3RQcmlvcml0eS5jaGlsZHJlbilbMF07XG4gIFByaW9yaXR5TGFiZWwudG9nZ2xlQXR0cmlidXRlKFwiZGlzYWJsZWRcIik7XG5cbiAgLy8gVGhpcyBQYXJ0IE9mIFRoZSBGdW5jdGlvbiBJcyBGb3IgRWRpdGluZyBUb2Rvc1xuICAvLyB0b0RvIHdpbGwgdW5kZWZpbmVkIHdoZW4gY2FsbGVkIGJ5IGFkZFRvZG9CdG5cbiAgLy8gQnV0IG5vdCB3aGVuIGNhbGxlZCBieSBlZGl0SWNvblxuICBpZiAodG9EbyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGFza05hbWUudmFsdWUgPSB0b0RvLmdldFRhc2soKTtcbiAgICB0YXNrRGVzY3JpcHRpb24udmFsdWUgPSB0b0RvLmdldERlc2NyaXB0aW9uKCk7XG4gICAgZHVlRGF0ZUJ0bi52YWx1ZSA9IHRvRG8uZ2V0RHVlRGF0ZSgpO1xuICAgIHNlbGVjdFByaW9yaXR5LnZhbHVlID0gdG9Eby5nZXRQcmlvcml0eSgpO1xuICB9XG5cbiAgLy8gQXBwZW5kIEV2ZXJ5dGhpbmcgVG9nZXRoZXJcbiAgdGFza0Zvcm0uYXBwZW5kKHRhc2tOYW1lLCB0YXNrRGVzY3JpcHRpb24sIHRhc2tPcHRpb25zQ29udGFpbmVyKTtcbiAgdGFza09wdGlvbnNDb250YWluZXIuYXBwZW5kKGR1ZURhdGVCdG4sIHNlbGVjdFByaW9yaXR5LCBjYW5jZWxCdG4sIHNhdmVCdG4pO1xuICB0YXNrVXNlcklucHV0LmFwcGVuZENoaWxkKHRhc2tGb3JtKTtcbiAgdGFza0JhY2tncm91bmQuYXBwZW5kQ2hpbGQodGFza1VzZXJJbnB1dCk7XG4gIGJvZHkuYXBwZW5kQ2hpbGQodGFza0JhY2tncm91bmQpO1xufVxuIiwiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVByb2plY3QobmFtZSwgY29sb3IpIHtcbiAgbGV0IHRvRE8gPSBbXTtcbiAgY29uc3QgZ2V0TmFtZSA9ICgpID0+IG5hbWU7XG4gIGNvbnN0IGdldENvbG9yID0gKCkgPT4gY29sb3I7XG4gIGNvbnN0IGFkZFRvRG8gPSAodG9kbykgPT4ge1xuICAgIHRvRE8ucHVzaCh0b2RvKTtcbiAgICB0b0RPLnNvcnQoKGxhc3QsIG5leHQpID0+IHtcbiAgICAgIGlmIChsYXN0LmdldER1ZURhdGUoKSA+PSBuZXh0LmdldER1ZURhdGUoKSkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9KTtcbiAgfTtcbiAgY29uc3QgZ2V0VG9EbyA9ICgpID0+IHRvRE87XG4gIGNvbnN0IHJlbW92ZVRvRG8gPSAodG9kbykgPT4ge1xuICAgIGNvbnN0IGxvY2F0aW9uID0gdG9ETy5pbmRleE9mKHRvZG8pO1xuICAgIHRvRE8uc3BsaWNlKGxvY2F0aW9uLCAxKTtcbiAgfTtcbiAgY29uc3QgY2xvbmUgPSAocHJvamVjdE9uZSwgcHJvamVjdFR3bykgPT4ge1xuICAgIGNvbnN0IHRvZG9MaXN0ID0gcHJvamVjdFR3by5nZXRUb0RvKCk7XG4gICAgdG9ETyA9IFsuLi50b2RvTGlzdF07XG4gICAgdG9ETy5mb3JFYWNoKCh0b2RvKSA9PiB7XG4gICAgICB0b2RvLnNldFByb2plY3QocHJvamVjdE9uZSk7XG4gICAgfSk7XG4gIH07XG4gIHJldHVybiB7IGdldE5hbWUsIGdldENvbG9yLCBhZGRUb0RvLCBnZXRUb0RvLCByZW1vdmVUb0RvLCBjbG9uZSB9O1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVRvZG8odGFzaywgZGVzY3JpcHRpb24sIGR1ZURhdGUsIHByaW9yaXR5LCBwcm9qZWN0KSB7XG4gIGNvbnN0IHR5cGUgPSBcIlRvZG9cIjtcbiAgbGV0IGNvbXBsZXRlID0gZmFsc2U7XG4gIGNvbnN0IGdldFRhc2sgPSAoKSA9PiB0YXNrO1xuICBjb25zdCBnZXREZXNjcmlwdGlvbiA9ICgpID0+IGRlc2NyaXB0aW9uO1xuICBjb25zdCBnZXREdWVEYXRlID0gKCkgPT4gZHVlRGF0ZTtcbiAgY29uc3QgZ2V0UHJpb3JpdHkgPSAoKSA9PiBwcmlvcml0eTtcbiAgY29uc3QgZ2V0UHJvamVjdCA9ICgpID0+IHByb2plY3Q7XG4gIGNvbnN0IHNldFByb2plY3QgPSAobmV3UHJvamVjdCkgPT4ge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXJhbS1yZWFzc2lnblxuICAgIHByb2plY3QgPSBuZXdQcm9qZWN0O1xuICB9O1xuICBjb25zdCB0b2dnbGVDb21wbGV0ZSA9ICgpID0+IHtcbiAgICBpZiAoY29tcGxldGUgPT09IHRydWUpIHtcbiAgICAgIGNvbXBsZXRlID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbXBsZXRlID0gdHJ1ZTtcbiAgICB9XG4gIH07XG4gIGNvbnN0IGdldFN0YXR1cyA9ICgpID0+IGNvbXBsZXRlO1xuICByZXR1cm4ge1xuICAgIGdldFRhc2ssXG4gICAgZ2V0RGVzY3JpcHRpb24sXG4gICAgZ2V0RHVlRGF0ZSxcbiAgICBnZXRQcmlvcml0eSxcbiAgICBnZXRQcm9qZWN0LFxuICAgIHR5cGUsXG4gICAgc2V0UHJvamVjdCxcbiAgICB0b2dnbGVDb21wbGV0ZSxcbiAgICBnZXRTdGF0dXMsXG4gIH07XG59XG4iLCJpbXBvcnQgcHJvamVjdE1vZHVsZSBmcm9tIFwiLi9wcm9qZWN0TW9kdWxlXCI7XG5pbXBvcnQgeyBldmVudHMgfSBmcm9tIFwiLi9wdWJzdWJcIjtcbmltcG9ydCBvcGVuSW5ib3ggZnJvbSBcIi4vb3BlbkluYm94XCI7XG5cbmNvbnN0IHRvZG9Db250cm9sbGVyID0gKCgpID0+IHtcbiAgY29uc3QgdG9kb0xpc3QgPSBbXTtcbiAgLy8gVXNlZCBUbyBSZW5kZXIgVG9kbyBBZnRlciBEZWxldGlvbiBPciBDaGVja2VkXG4gIGNvbnN0IHVwZGF0ZVRvZG8gPSAocHJvamVjdCkgPT4ge1xuICAgIGNvbnN0IHNlbGVjdGVkUHJvamVjdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2VsZWN0ZWRQcm9qZWN0XCIpO1xuICAgIC8vIHNlbGVjdGVkUHJvamVjdCB3aWxsIGJlIG51bGwgd2hlbiBhIHByb2plY3QgaXNcbiAgICAvLyBEZWxldGVkIGZyb20gdGhlIHRvZG8gaW5ib3ggYnV0LFxuICAgIC8vIE5vdCBXaGVuIGEgUHJvamVjdCBJcyBTZWxlY3RlZFxuICAgIGlmIChzZWxlY3RlZFByb2plY3QgIT09IG51bGwpIHtcbiAgICAgIHByb2plY3RNb2R1bGUocHJvamVjdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9wZW5JbmJveCh0b2RvTGlzdCk7XG4gICAgfVxuICB9O1xuICBjb25zdCB1cGRhdGVUb2RvTGlzdCA9ICh0b2RvKSA9PiB7XG4gICAgLy8gT25seSBBZGQgSWYgaGFzIHRweWUgc2V0IHRvIFRvZG9cbiAgICBjb25zdCB7IHR5cGUgfSA9IHRvZG87XG4gICAgaWYgKHR5cGUgPT09IFwiVG9kb1wiKSB0b2RvTGlzdC5wdXNoKHRvZG8pO1xuICAgIC8vIFNvcnQgVGhlIFRvZG9zIEJ5IER1ZURhdGVcbiAgICB0b2RvTGlzdC5zb3J0KChsYXN0LCBuZXh0KSA9PiB7XG4gICAgICBpZiAobGFzdC5nZXREdWVEYXRlKCkgPj0gbmV4dC5nZXREdWVEYXRlKCkpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gLTE7XG4gICAgfSk7XG4gIH07XG4gIGNvbnN0IGdldFRvZG9MaXN0ID0gKCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKHRvZG9MaXN0KTtcbiAgfTtcblxuICBjb25zdCB0b2RvSW5ib3ggPSAoKSA9PiB7XG4gICAgb3BlbkluYm94KHRvZG9MaXN0KTtcbiAgfTtcbiAgY29uc3QgcmVtb3ZlVG9EbyA9ICh0b2RvKSA9PiB7XG4gICAgY29uc3QgbG9jYXRpb24gPSB0b2RvTGlzdC5pbmRleE9mKHRvZG8pO1xuICAgIHRvZG9MaXN0LnNwbGljZShsb2NhdGlvbiwgMSk7XG4gIH07XG4gIGNvbnN0IHVwZGF0ZVRvZG9Db3VudCA9ICgpID0+IHtcbiAgICAvLyBVcGRhdGUgVG9kbyBDb3VudFxuICAgIGNvbnN0IHNpZGVCYXJJbmJveCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc2lkZUJhckluYm94XCIpO1xuICAgIGNvbnN0IGNvbG9yQ2lyY2xlID0gc2lkZUJhckluYm94Lmxhc3RDaGlsZDtcbiAgICBsZXQgY29tcGxldGVDdHIgPSAwO1xuICAgIHRvZG9MaXN0LmZvckVhY2goKHRvRG8pID0+IHtcbiAgICAgIGlmICh0b0RvLmdldFN0YXR1cygpICE9PSB0cnVlKSB7XG4gICAgICAgIGNvbXBsZXRlQ3RyICs9IDE7XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29sb3JDaXJjbGUuaW5uZXJUZXh0ID0gY29tcGxldGVDdHI7XG4gIH07XG4gIGV2ZW50cy5vbihcInVwZGF0ZVRvZG9cIiwgdXBkYXRlVG9kbyk7XG4gIGV2ZW50cy5vbihcImFkZFRvZG9cIiwgdXBkYXRlVG9kb0xpc3QpO1xuICBldmVudHMub24oXCJvcGVuSW5ib3hcIiwgdG9kb0luYm94KTtcbiAgZXZlbnRzLm9uKFwicmVtb3ZlVG9Eb1wiLCByZW1vdmVUb0RvKTtcbiAgZXZlbnRzLm9uKFwidXBkYXRlVG9kb0NvdW50XCIsIHVwZGF0ZVRvZG9Db3VudCk7XG4gIGV2ZW50cy5vbihcImFkZFRvZG9cIiwgdXBkYXRlVG9kb0NvdW50KTtcblxuICByZXR1cm4geyBnZXRUb2RvTGlzdCB9O1xufSkoKTtcblxudG9kb0NvbnRyb2xsZXIuZ2V0VG9kb0xpc3QoKTtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAvKlRoaXMgRmlsZSBJcyBUbyBDb2xvciBUaGUgVG9kb3MgQnkgUHJpb3JpdHkqL1xuLypPbiBQcm9qZWN0cyBQYWdlKi9cbi8qSW5zdGVhZCBPZiBUaGUgRGVmYXVsdCBCbGFjayovXG4vKlNob3cgUHJpb3JpdHkgY29sb3IqL1xuLyogUHJpb3JpdHkgMSAqL1xuLnByaW9yaXR5T25lIC50b2RvOmhvdmVyIHtcbiAgYm94LXNoYWRvdzogM3B4IDVweCA1cHggI2ZmMDA2NjsgfVxuXG4ucHJpb3JpdHlPbmUgLnRvZG8gLnByaW9yaXR5Q29sb3Ige1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmYwMDY2OyB9XG5cbi5wcmlvcml0eU9uZSAudG9kbyAudG9kb0NoZWNrYm94IHtcbiAgYWNjZW50LWNvbG9yOiAjZmYwMDY2OyB9XG5cbi5wcmlvcml0eU9uZSAudG9kbyAuZGV0YWlsc0J0biB7XG4gIGJvcmRlcjogMnB4IHNvbGlkICNmZjAwNjY7XG4gIGNvbG9yOiAjZmYwMDY2OyB9XG5cbi5wcmlvcml0eU9uZSAudG9kbyAuZGV0YWlsc0J0bjpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZjAwNjY7XG4gIGNvbG9yOiAjZmZmZmZmOyB9XG5cbi5wcmlvcml0eU9uZSAudG9kbyAuZHVlRGF0ZUVsIHtcbiAgY29sb3I6ICNmZjAwNjY7IH1cblxuLnByaW9yaXR5T25lIC50b2RvIC50cmFzaENhbixcbi5wcmlvcml0eU9uZSAudG9kbyAuZWRpdEljb24ge1xuICBjb2xvcjogI2ZmMDA2NjsgfVxuXG4ucHJpb3JpdHlPbmUgLnRvZG8gLnRyYXNoQ2FuOmhvdmVyLFxuLnByaW9yaXR5T25lIC50b2RvIC5lZGl0SWNvbjpob3ZlciB7XG4gIGNvbG9yOiB2aW9sZXQ7IH1cblxuLyogUHJpb3JpdHkgMiAqL1xuLnByaW9yaXR5VHdvIC50b2RvOmhvdmVyIHtcbiAgYm94LXNoYWRvdzogM3B4IDVweCA1cHggI2ZmZDcwMDsgfVxuXG4ucHJpb3JpdHlUd28gLnRvZG8gLnByaW9yaXR5Q29sb3Ige1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZkNzAwOyB9XG5cbi5wcmlvcml0eVR3byAudG9kbyAudG9kb0NoZWNrYm94IHtcbiAgYWNjZW50LWNvbG9yOiAjZmZkNzAwOyB9XG5cbi5wcmlvcml0eVR3byAudG9kbyAuZGV0YWlsc0J0biB7XG4gIGJvcmRlcjogMnB4IHNvbGlkICNmZmQ3MDA7XG4gIGNvbG9yOiAjZmZkNzAwOyB9XG5cbi5wcmlvcml0eVR3byAudG9kbyAuZGV0YWlsc0J0bjpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmQ3MDA7XG4gIGNvbG9yOiAjZmZmZmZmOyB9XG5cbi5wcmlvcml0eVR3byAudG9kbyAuZHVlRGF0ZUVsIHtcbiAgY29sb3I6ICNmZmQ3MDA7IH1cblxuLnByaW9yaXR5VHdvIC50b2RvIC50cmFzaENhbixcbi5wcmlvcml0eVR3byAudG9kbyAuZWRpdEljb24ge1xuICBjb2xvcjogI2ZmZDcwMDsgfVxuXG4ucHJpb3JpdHlUd28gLnRvZG8gLnRyYXNoQ2FuOmhvdmVyLFxuLnByaW9yaXR5VHdvIC50b2RvIC5lZGl0SWNvbjpob3ZlciB7XG4gIGNvbG9yOiAjZmY1ZTAwOyB9XG5cbi8qIFByaW9yaXR5IDMgKi9cbi5wcmlvcml0eVRocmVlIC50b2RvOmhvdmVyIHtcbiAgYm94LXNoYWRvdzogM3B4IDVweCA1cHggIzA5ZmYzMjsgfVxuXG4ucHJpb3JpdHlUaHJlZSAudG9kbyAucHJpb3JpdHlDb2xvciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICMwOWZmMzI7IH1cblxuLnByaW9yaXR5VGhyZWUgLnRvZG8gLnRvZG9DaGVja2JveCB7XG4gIGFjY2VudC1jb2xvcjogIzA5ZmYzMjsgfVxuXG4ucHJpb3JpdHlUaHJlZSAudG9kbyAuZGV0YWlsc0J0biB7XG4gIGJvcmRlcjogMnB4IHNvbGlkICMwOWZmMzI7XG4gIGNvbG9yOiAjMDlmZjMyOyB9XG5cbi5wcmlvcml0eVRocmVlIC50b2RvIC5kZXRhaWxzQnRuOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzA5ZmYzMjtcbiAgY29sb3I6ICNmZmZmZmY7IH1cblxuLnByaW9yaXR5VGhyZWUgLnRvZG8gLmR1ZURhdGVFbCB7XG4gIGNvbG9yOiAjMDlmZjMyOyB9XG5cbi5wcmlvcml0eVRocmVlIC50b2RvIC50cmFzaENhbixcbi5wcmlvcml0eVRocmVlIC50b2RvIC5lZGl0SWNvbiB7XG4gIGNvbG9yOiAjMDlmZjMyOyB9XG5cbi5wcmlvcml0eVRocmVlIC50b2RvIC50cmFzaENhbjpob3Zlcixcbi5wcmlvcml0eVRocmVlIC50b2RvIC5lZGl0SWNvbjpob3ZlciB7XG4gIGNvbG9yOiAjMDA3NDBlOyB9XG5cbi8qIFByaW9yaXR5IDQgKi9cbi5wcmlvcml0eUZvdXIgLnRvZG86aG92ZXIge1xuICBib3gtc2hhZG93OiAzcHggNXB4IDVweCAjMjg1MGZmOyB9XG5cbi5wcmlvcml0eUZvdXIgLnRvZG8gLnByaW9yaXR5Q29sb3Ige1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMjg1MGZmOyB9XG5cbi5wcmlvcml0eUZvdXIgLnRvZG8gLnRvZG9DaGVja2JveCB7XG4gIGFjY2VudC1jb2xvcjogIzI4NTBmZjsgfVxuXG4ucHJpb3JpdHlGb3VyIC50b2RvIC5kZXRhaWxzQnRuIHtcbiAgYm9yZGVyOiAycHggc29saWQgIzI4NTBmZjtcbiAgY29sb3I6ICMyODUwZmY7IH1cblxuLnByaW9yaXR5Rm91ciAudG9kbyAuZGV0YWlsc0J0bjpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICMyODUwZmY7XG4gIGNvbG9yOiAjZmZmZmZmOyB9XG5cbi5wcmlvcml0eUZvdXIgLnRvZG8gLmR1ZURhdGVFbCB7XG4gIGNvbG9yOiAjMjg1MGZmOyB9XG5cbi5wcmlvcml0eUZvdXIgLnRvZG8gLnRyYXNoQ2FuLFxuLnByaW9yaXR5Rm91ciAudG9kbyAuZWRpdEljb24ge1xuICBjb2xvcjogIzI4NTBmZjsgfVxuXG4ucHJpb3JpdHlGb3VyIC50b2RvIC50cmFzaENhbjpob3Zlcixcbi5wcmlvcml0eUZvdXIgLnRvZG8gLmVkaXRJY29uOmhvdmVyIHtcbiAgY29sb3I6ICM4YzI4ZmY7IH1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3Byb2plY3RNb2R1bGUuc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSw4Q0FBQTtBQUNBLG1CQUFBO0FBQ0EsK0JBQUE7QUFLQSxzQkFBQTtBQUNBLGVBQUE7QUFDQTtFQUVJLCtCQVJ1QixFQUFBOztBQU0zQjtFQU1NLHlCQVpxQixFQUFBOztBQU0zQjtFQVNNLHFCQWZxQixFQUFBOztBQU0zQjtFQVlNLHlCQWxCcUI7RUFtQnJCLGNBbkJxQixFQUFBOztBQU0zQjtFQWdCTSx5QkF0QnFCO0VBdUJyQixjQUFjLEVBQUE7O0FBakJwQjtFQW9CTSxjQTFCcUIsRUFBQTs7QUFNM0I7O0VBd0JNLGNBOUJxQixFQUFBOztBQU0zQjs7RUE0Qk0sYUFBYSxFQUFBOztBQUluQixlQUFBO0FBQ0E7RUFFSSwrQkF4Q3VCLEVBQUE7O0FBc0MzQjtFQU1NLHlCQTVDcUIsRUFBQTs7QUFzQzNCO0VBU00scUJBL0NxQixFQUFBOztBQXNDM0I7RUFZTSx5QkFsRHFCO0VBbURyQixjQW5EcUIsRUFBQTs7QUFzQzNCO0VBZ0JNLHlCQXREcUI7RUF1RHJCLGNBQWMsRUFBQTs7QUFqQnBCO0VBb0JNLGNBMURxQixFQUFBOztBQXNDM0I7O0VBd0JNLGNBOURxQixFQUFBOztBQXNDM0I7O0VBNEJNLGNBQWMsRUFBQTs7QUFJcEIsZUFBQTtBQUNBO0VBRUksK0JBeEVpQyxFQUFBOztBQXNFckM7RUFNTSx5QkE1RStCLEVBQUE7O0FBc0VyQztFQVNNLHFCQS9FK0IsRUFBQTs7QUFzRXJDO0VBWU0seUJBbEYrQjtFQW1GL0IsY0FuRitCLEVBQUE7O0FBc0VyQztFQWdCTSx5QkF0RitCO0VBdUYvQixjQUFjLEVBQUE7O0FBakJwQjtFQW9CTSxjQTFGK0IsRUFBQTs7QUFzRXJDOztFQXdCTSxjQTlGK0IsRUFBQTs7QUFzRXJDOztFQTRCTSxjQUFzQixFQUFBOztBQUk1QixlQUFBO0FBQ0E7RUFFSSwrQkF4R3dCLEVBQUE7O0FBc0c1QjtFQU1NLHlCQTVHc0IsRUFBQTs7QUFzRzVCO0VBU00scUJBL0dzQixFQUFBOztBQXNHNUI7RUFZTSx5QkFsSHNCO0VBbUh0QixjQW5Ic0IsRUFBQTs7QUFzRzVCO0VBZ0JNLHlCQXRIc0I7RUF1SHRCLGNBQWMsRUFBQTs7QUFqQnBCO0VBb0JNLGNBMUhzQixFQUFBOztBQXNHNUI7O0VBd0JNLGNBOUhzQixFQUFBOztBQXNHNUI7O0VBNEJNLGNBQWMsRUFBQVwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKlRoaXMgRmlsZSBJcyBUbyBDb2xvciBUaGUgVG9kb3MgQnkgUHJpb3JpdHkqL1xcbi8qT24gUHJvamVjdHMgUGFnZSovXFxuLypJbnN0ZWFkIE9mIFRoZSBEZWZhdWx0IEJsYWNrKi9cXG4kcHJpb3JpdHlPbmUtY29sb3I6ICNmZjAwNjY7XFxuJHByaW9yaXR5VHdvLWNvbG9yOiAjZmZkNzAwO1xcbiRwcmlvcml0eVRocmVlLWNvbG9yOiByZ2IoOSwgMjU1LCA1MCk7XFxuJHByaW9yaXR5Rm91ci1jb2xvcjogIzI4NTBmZjtcXG4vKlNob3cgUHJpb3JpdHkgY29sb3IqL1xcbi8qIFByaW9yaXR5IDEgKi9cXG4ucHJpb3JpdHlPbmUge1xcbiAgLnRvZG86aG92ZXIge1xcbiAgICBib3gtc2hhZG93OiAzcHggNXB4IDVweCAkcHJpb3JpdHlPbmUtY29sb3I7XFxuICB9XFxuICAudG9kbyB7XFxuICAgIC5wcmlvcml0eUNvbG9yIHtcXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkcHJpb3JpdHlPbmUtY29sb3I7XFxuICAgIH1cXG4gICAgLnRvZG9DaGVja2JveCB7XFxuICAgICAgYWNjZW50LWNvbG9yOiAkcHJpb3JpdHlPbmUtY29sb3I7XFxuICAgIH1cXG4gICAgLmRldGFpbHNCdG4ge1xcbiAgICAgIGJvcmRlcjogMnB4IHNvbGlkICRwcmlvcml0eU9uZS1jb2xvcjtcXG4gICAgICBjb2xvcjogJHByaW9yaXR5T25lLWNvbG9yO1xcbiAgICB9XFxuICAgIC5kZXRhaWxzQnRuOmhvdmVyIHtcXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkcHJpb3JpdHlPbmUtY29sb3I7XFxuICAgICAgY29sb3I6ICNmZmZmZmY7XFxuICAgIH1cXG4gICAgLmR1ZURhdGVFbCB7XFxuICAgICAgY29sb3I6ICRwcmlvcml0eU9uZS1jb2xvcjtcXG4gICAgfVxcbiAgICAudHJhc2hDYW4sXFxuICAgIC5lZGl0SWNvbiB7XFxuICAgICAgY29sb3I6ICRwcmlvcml0eU9uZS1jb2xvcjtcXG4gICAgfVxcbiAgICAudHJhc2hDYW46aG92ZXIsXFxuICAgIC5lZGl0SWNvbjpob3ZlciB7XFxuICAgICAgY29sb3I6IHZpb2xldDtcXG4gICAgfVxcbiAgfVxcbn1cXG4vKiBQcmlvcml0eSAyICovXFxuLnByaW9yaXR5VHdvIHtcXG4gIC50b2RvOmhvdmVyIHtcXG4gICAgYm94LXNoYWRvdzogM3B4IDVweCA1cHggJHByaW9yaXR5VHdvLWNvbG9yO1xcbiAgfVxcbiAgLnRvZG8ge1xcbiAgICAucHJpb3JpdHlDb2xvciB7XFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHByaW9yaXR5VHdvLWNvbG9yO1xcbiAgICB9XFxuICAgIC50b2RvQ2hlY2tib3gge1xcbiAgICAgIGFjY2VudC1jb2xvcjogJHByaW9yaXR5VHdvLWNvbG9yO1xcbiAgICB9XFxuICAgIC5kZXRhaWxzQnRuIHtcXG4gICAgICBib3JkZXI6IDJweCBzb2xpZCAkcHJpb3JpdHlUd28tY29sb3I7XFxuICAgICAgY29sb3I6ICRwcmlvcml0eVR3by1jb2xvcjtcXG4gICAgfVxcbiAgICAuZGV0YWlsc0J0bjpob3ZlciB7XFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHByaW9yaXR5VHdvLWNvbG9yO1xcbiAgICAgIGNvbG9yOiAjZmZmZmZmO1xcbiAgICB9XFxuICAgIC5kdWVEYXRlRWwge1xcbiAgICAgIGNvbG9yOiAkcHJpb3JpdHlUd28tY29sb3I7XFxuICAgIH1cXG4gICAgLnRyYXNoQ2FuLFxcbiAgICAuZWRpdEljb24ge1xcbiAgICAgIGNvbG9yOiAkcHJpb3JpdHlUd28tY29sb3I7XFxuICAgIH1cXG4gICAgLnRyYXNoQ2FuOmhvdmVyLFxcbiAgICAuZWRpdEljb246aG92ZXIge1xcbiAgICAgIGNvbG9yOiAjZmY1ZTAwO1xcbiAgICB9XFxuICB9XFxufVxcbi8qIFByaW9yaXR5IDMgKi9cXG4ucHJpb3JpdHlUaHJlZSB7XFxuICAudG9kbzpob3ZlciB7XFxuICAgIGJveC1zaGFkb3c6IDNweCA1cHggNXB4ICRwcmlvcml0eVRocmVlLWNvbG9yO1xcbiAgfVxcbiAgLnRvZG8ge1xcbiAgICAucHJpb3JpdHlDb2xvciB7XFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHByaW9yaXR5VGhyZWUtY29sb3I7XFxuICAgIH1cXG4gICAgLnRvZG9DaGVja2JveCB7XFxuICAgICAgYWNjZW50LWNvbG9yOiAkcHJpb3JpdHlUaHJlZS1jb2xvcjtcXG4gICAgfVxcbiAgICAuZGV0YWlsc0J0biB7XFxuICAgICAgYm9yZGVyOiAycHggc29saWQgJHByaW9yaXR5VGhyZWUtY29sb3I7XFxuICAgICAgY29sb3I6ICRwcmlvcml0eVRocmVlLWNvbG9yO1xcbiAgICB9XFxuICAgIC5kZXRhaWxzQnRuOmhvdmVyIHtcXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkcHJpb3JpdHlUaHJlZS1jb2xvcjtcXG4gICAgICBjb2xvcjogI2ZmZmZmZjtcXG4gICAgfVxcbiAgICAuZHVlRGF0ZUVsIHtcXG4gICAgICBjb2xvcjogJHByaW9yaXR5VGhyZWUtY29sb3I7XFxuICAgIH1cXG4gICAgLnRyYXNoQ2FuLFxcbiAgICAuZWRpdEljb24ge1xcbiAgICAgIGNvbG9yOiAkcHJpb3JpdHlUaHJlZS1jb2xvcjtcXG4gICAgfVxcbiAgICAudHJhc2hDYW46aG92ZXIsXFxuICAgIC5lZGl0SWNvbjpob3ZlciB7XFxuICAgICAgY29sb3I6IHJnYigwLCAxMTYsIDE0KTtcXG4gICAgfVxcbiAgfVxcbn1cXG4vKiBQcmlvcml0eSA0ICovXFxuLnByaW9yaXR5Rm91ciB7XFxuICAudG9kbzpob3ZlciB7XFxuICAgIGJveC1zaGFkb3c6IDNweCA1cHggNXB4ICRwcmlvcml0eUZvdXItY29sb3I7XFxuICB9XFxuICAudG9kbyB7XFxuICAgIC5wcmlvcml0eUNvbG9yIHtcXG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkcHJpb3JpdHlGb3VyLWNvbG9yO1xcbiAgICB9XFxuICAgIC50b2RvQ2hlY2tib3gge1xcbiAgICAgIGFjY2VudC1jb2xvcjogJHByaW9yaXR5Rm91ci1jb2xvcjtcXG4gICAgfVxcbiAgICAuZGV0YWlsc0J0biB7XFxuICAgICAgYm9yZGVyOiAycHggc29saWQgJHByaW9yaXR5Rm91ci1jb2xvcjtcXG4gICAgICBjb2xvcjogJHByaW9yaXR5Rm91ci1jb2xvcjtcXG4gICAgfVxcbiAgICAuZGV0YWlsc0J0bjpob3ZlciB7XFxuICAgICAgYmFja2dyb3VuZC1jb2xvcjogJHByaW9yaXR5Rm91ci1jb2xvcjtcXG4gICAgICBjb2xvcjogI2ZmZmZmZjtcXG4gICAgfVxcbiAgICAuZHVlRGF0ZUVsIHtcXG4gICAgICBjb2xvcjogJHByaW9yaXR5Rm91ci1jb2xvcjtcXG4gICAgfVxcbiAgICAudHJhc2hDYW4sXFxuICAgIC5lZGl0SWNvbiB7XFxuICAgICAgY29sb3I6ICRwcmlvcml0eUZvdXItY29sb3I7XFxuICAgIH1cXG4gICAgLnRyYXNoQ2FuOmhvdmVyLFxcbiAgICAuZWRpdEljb246aG92ZXIge1xcbiAgICAgIGNvbG9yOiAjOGMyOGZmO1xcbiAgICB9XFxuICB9XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgI2luYm94IHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTIxcHg7XG4gIG1hcmdpbi10b3A6IDMwcHg7XG4gIG1hcmdpbi1ib3R0b206IDMwcHg7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xuICByb3ctZ2FwOiAxMHB4O1xuICBoZWlnaHQ6IGZpdC1jb250ZW50O1xuICBmb250LXNpemU6IG1pbig2NHB4LCAxMHZ3KTtcbn1cbiNpbmJveExhYmVsIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNkNGQ0ZDg7XG59XG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9vcGVuSW5ib3guY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0UsV0FBVztFQUNYLGFBQWE7RUFDYixnQkFBZ0I7RUFDaEIsbUJBQW1CO0VBQ25CLGFBQWE7RUFDYiwwQkFBMEI7RUFDMUIsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQiwwQkFBMEI7QUFDNUI7QUFDQTtFQUNFLGFBQWE7RUFDYixtQkFBbUI7RUFDbkIsZ0NBQWdDO0FBQ2xDXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIiNpbmJveCB7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMTIxcHg7XFxuICBtYXJnaW4tdG9wOiAzMHB4O1xcbiAgbWFyZ2luLWJvdHRvbTogMzBweDtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcXG4gIHJvdy1nYXA6IDEwcHg7XFxuICBoZWlnaHQ6IGZpdC1jb250ZW50O1xcbiAgZm9udC1zaXplOiBtaW4oNjRweCwgMTB2dyk7XFxufVxcbiNpbmJveExhYmVsIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNkNGQ0ZDg7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgLyogUHJvamVjdHMgb24gSG9tZSBTY3JlZW4gKi9cbi5wYWdlUHJvamVjdENvbnRhaW5lciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgd2lkdGg6IDEwMCU7XG59XG4ucGFnZVByb2plY3Qge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBoZWlnaHQ6IDUwcHg7XG4gIHdpZHRoOiA4OCU7XG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gIHBhZGRpbmctbGVmdDogMjBweDtcbn1cbi5wYWdlUHJvamVjdENvbnRhaW5lcjpob3ZlciA+IC5wYWdlUHJvamVjdCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNkNGQ0ZDg7XG4gIHRyYW5zaXRpb246IDAuMnM7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cbi5wYWdlUHJvamVjdENvbnRhaW5lcjpob3ZlciA+IC5lbGxpcHNlIHtcbiAgZGlzcGxheTogYmxvY2sgIWltcG9ydGFudDtcbn1cbi8qIGVsbGlwc2UgbmV4dCB0byBwcm9qZWN0cyAqL1xuLmVsbGlwc2Uge1xuICBtYXJnaW4tbGVmdDogYXV0bztcbiAgbWFyZ2luLXJpZ2h0OiAyMHB4O1xuICBoZWlnaHQ6IDkwJTtcbiAgd2lkdGg6IDUlO1xuICBmb250LXNpemU6IDEuNWVtO1xuICBjb2xvcjogIzExMTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XG59XG4uZWxsaXBzZTpob3ZlciB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgdHJhbnNpdGlvbjogMC4ycztcbiAgYmFja2dyb3VuZC1jb2xvcjogI2U0ZTRlNztcbn1cbi8qIE9wdGlvbnMgdGhhdCBjb21lIHVwIHdoZW4gZWxsaXBzZSBpcyBwcmVzc2VkICovXG5cbi5wcm9qZWN0T3B0aW9uc0JHIHtcbiAgcG9zaXRpb246IGZpeGVkO1xuICBoZWlnaHQ6IDEwMHZoO1xuICB3aWR0aDogMTAwdnc7XG4gIHotaW5kZXg6IDQ7XG59XG4udG9vbHMge1xuICBoZWlnaHQ6IDIwMHB4O1xuICB3aWR0aDogMjAwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICMwZjE3MmE7XG4gIGJvcmRlci1yYWRpdXM6IDVweDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBsZWZ0OiAxMDAlO1xuICB0b3A6IDEwMCU7XG4gIG1hcmdpbi1sZWZ0OiAtMjAwcHg7XG4gIHotaW5kZXg6IDY7XG59XG4jb3B0aW9uc0NvbnRhaW5lciB7XG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IGNhbGMoMTAwJSAtIDIwcHgpO1xuICBwYWRkaW5nLWxlZnQ6IDEwcHg7XG4gIHBhZGRpbmctcmlnaHQ6IDEwcHg7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IGF1dG87XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxODBkZWcsICNmZjAwNjYsICMyODUwZmYpO1xuICBiYWNrZ3JvdW5kLWNsaXA6IHRleHQ7XG4gIC13ZWJraXQtYmFja2dyb3VuZC1jbGlwOiB0ZXh0O1xuICAtd2Via2l0LXRleHQtZmlsbC1jb2xvcjogdHJhbnNwYXJlbnQ7XG59XG4jb3B0aW9uc0NvbnRhaW5lciBhIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAxMDAlO1xuICBib3JkZXItYm90dG9tOiBzb2xpZCAxcHg7XG59XG4jb3B0aW9uc0NvbnRhaW5lciA+IDpob3ZlciB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgb3BhY2l0eTogMC41O1xufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvcHJvamVjdENvbnRyb2xsZXIuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBLDRCQUE0QjtBQUM1QjtFQUNFLGtCQUFrQjtFQUNsQixhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLFdBQVc7QUFDYjtBQUNBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQixZQUFZO0VBQ1osVUFBVTtFQUNWLG1CQUFtQjtFQUNuQixrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLHlCQUF5QjtFQUN6QixnQkFBZ0I7RUFDaEIsZUFBZTtBQUNqQjtBQUNBO0VBQ0UseUJBQXlCO0FBQzNCO0FBQ0EsNkJBQTZCO0FBQzdCO0VBQ0UsaUJBQWlCO0VBQ2pCLGtCQUFrQjtFQUNsQixXQUFXO0VBQ1gsU0FBUztFQUNULGdCQUFnQjtFQUNoQixXQUFXO0VBQ1gsa0JBQWtCO0VBQ2xCLG1CQUFtQjtFQUNuQixhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLHFCQUFxQjtBQUN2QjtBQUNBO0VBQ0UsZUFBZTtFQUNmLGdCQUFnQjtFQUNoQix5QkFBeUI7QUFDM0I7QUFDQSxpREFBaUQ7O0FBRWpEO0VBQ0UsZUFBZTtFQUNmLGFBQWE7RUFDYixZQUFZO0VBQ1osVUFBVTtBQUNaO0FBQ0E7RUFDRSxhQUFhO0VBQ2IsWUFBWTtFQUNaLHlCQUF5QjtFQUN6QixrQkFBa0I7RUFDbEIsa0JBQWtCO0VBQ2xCLFVBQVU7RUFDVixTQUFTO0VBQ1QsbUJBQW1CO0VBQ25CLFVBQVU7QUFDWjtBQUNBO0VBQ0UsWUFBWTtFQUNaLHdCQUF3QjtFQUN4QixrQkFBa0I7RUFDbEIsbUJBQW1CO0VBQ25CLGFBQWE7RUFDYiwwQkFBMEI7RUFDMUIsd0JBQXdCO0VBQ3hCLG1CQUFtQjtFQUNuQixxREFBcUQ7RUFDckQscUJBQXFCO0VBQ3JCLDZCQUE2QjtFQUM3QixvQ0FBb0M7QUFDdEM7QUFDQTtFQUNFLGNBQWM7RUFDZCxXQUFXO0VBQ1gsd0JBQXdCO0FBQzFCO0FBQ0E7RUFDRSxlQUFlO0VBQ2YsWUFBWTtBQUNkXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qIFByb2plY3RzIG9uIEhvbWUgU2NyZWVuICovXFxuLnBhZ2VQcm9qZWN0Q29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcbi5wYWdlUHJvamVjdCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGhlaWdodDogNTBweDtcXG4gIHdpZHRoOiA4OCU7XFxuICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgcGFkZGluZy1sZWZ0OiAyMHB4O1xcbn1cXG4ucGFnZVByb2plY3RDb250YWluZXI6aG92ZXIgPiAucGFnZVByb2plY3Qge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Q0ZDRkODtcXG4gIHRyYW5zaXRpb246IDAuMnM7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbi5wYWdlUHJvamVjdENvbnRhaW5lcjpob3ZlciA+IC5lbGxpcHNlIHtcXG4gIGRpc3BsYXk6IGJsb2NrICFpbXBvcnRhbnQ7XFxufVxcbi8qIGVsbGlwc2UgbmV4dCB0byBwcm9qZWN0cyAqL1xcbi5lbGxpcHNlIHtcXG4gIG1hcmdpbi1sZWZ0OiBhdXRvO1xcbiAgbWFyZ2luLXJpZ2h0OiAyMHB4O1xcbiAgaGVpZ2h0OiA5MCU7XFxuICB3aWR0aDogNSU7XFxuICBmb250LXNpemU6IDEuNWVtO1xcbiAgY29sb3I6ICMxMTE7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XFxufVxcbi5lbGxpcHNlOmhvdmVyIHtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIHRyYW5zaXRpb246IDAuMnM7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTRlNGU3O1xcbn1cXG4vKiBPcHRpb25zIHRoYXQgY29tZSB1cCB3aGVuIGVsbGlwc2UgaXMgcHJlc3NlZCAqL1xcblxcbi5wcm9qZWN0T3B0aW9uc0JHIHtcXG4gIHBvc2l0aW9uOiBmaXhlZDtcXG4gIGhlaWdodDogMTAwdmg7XFxuICB3aWR0aDogMTAwdnc7XFxuICB6LWluZGV4OiA0O1xcbn1cXG4udG9vbHMge1xcbiAgaGVpZ2h0OiAyMDBweDtcXG4gIHdpZHRoOiAyMDBweDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwZjE3MmE7XFxuICBib3JkZXItcmFkaXVzOiA1cHg7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBsZWZ0OiAxMDAlO1xcbiAgdG9wOiAxMDAlO1xcbiAgbWFyZ2luLWxlZnQ6IC0yMDBweDtcXG4gIHotaW5kZXg6IDY7XFxufVxcbiNvcHRpb25zQ29udGFpbmVyIHtcXG4gIGhlaWdodDogMTAwJTtcXG4gIHdpZHRoOiBjYWxjKDEwMCUgLSAyMHB4KTtcXG4gIHBhZGRpbmctbGVmdDogMTBweDtcXG4gIHBhZGRpbmctcmlnaHQ6IDEwcHg7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IGF1dG87XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDE4MGRlZywgI2ZmMDA2NiwgIzI4NTBmZik7XFxuICBiYWNrZ3JvdW5kLWNsaXA6IHRleHQ7XFxuICAtd2Via2l0LWJhY2tncm91bmQtY2xpcDogdGV4dDtcXG4gIC13ZWJraXQtdGV4dC1maWxsLWNvbG9yOiB0cmFuc3BhcmVudDtcXG59XFxuI29wdGlvbnNDb250YWluZXIgYSB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIHdpZHRoOiAxMDAlO1xcbiAgYm9yZGVyLWJvdHRvbTogc29saWQgMXB4O1xcbn1cXG4jb3B0aW9uc0NvbnRhaW5lciA+IDpob3ZlciB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBvcGFjaXR5OiAwLjU7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCJAaW1wb3J0IHVybChodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PUJlYmFzK05ldWUmZmFtaWx5PUluZGllK0Zsb3dlciZmYW1pbHk9U2lnbmlrYSZkaXNwbGF5PXN3YXApO1wiXSk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC8qIFRoZSBpbnB1dCBmaWVsZCBmb3IgbmV3IHByb2plY3RzICovXG4jcHJvamVjdFVzZXJJbnB1dCB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgaGVpZ2h0OiAxMDB2aDtcbiAgd2lkdGg6IDEwMHZ3O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMCwgMCwgMCwgMC41KTtcbiAgei1pbmRleDogNTtcbn1cbi8qIFdoZXJlIFRoaW5ncyBhcmUgSW5wdXRlZCAqL1xuI2lucHV0Q29udGFpbmVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBtYXgtaGVpZ2h0OiBtaW4oODAlLCA2MDBweCk7XG4gIG1heC13aWR0aDogbWluKDgwJSwgNDAwcHgpO1xuICB0b3A6IDUwJTtcbiAgbGVmdDogNTAlO1xuICBtYXJnaW4tdG9wOiAtMzAwcHg7XG4gIG1hcmdpbi1sZWZ0OiAtMjAwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmYWZhZmE7XG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XG4gIHBhZGRpbmctdG9wOiA1MHB4O1xuICBwYWRkaW5nLWxlZnQ6IDQwcHg7XG4gIHBhZGRpbmctcmlnaHQ6IDQwcHg7XG4gIHJvdy1nYXA6IDIwcHg7XG4gIHRyYW5zaXRpb246IHBhZGRpbmcgMC4zcyBlYXNlO1xufVxuLyogT25seSBQdXNoIENvbnRlbnQgSWYgU2NyZWVuIElzIENlcnRhaW4gU2l6ZSAqL1xuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNjAwcHgpLCAobWF4LWhlaWdodDogNjUwcHgpIHtcbiAgI3Byb2plY3RVc2VySW5wdXQge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgfVxuICAjaW5wdXRDb250YWluZXIge1xuICAgIHRvcDogMDtcbiAgICBsZWZ0OiAwO1xuICAgIG1hcmdpbi10b3A6IDBweDtcbiAgICBtYXJnaW4tbGVmdDogMHB4O1xuICAgIHBhZGRpbmctdG9wOiAyNXB4O1xuICAgIHBhZGRpbmctbGVmdDogMjBweDtcbiAgICBwYWRkaW5nLXJpZ2h0OiAyMHB4O1xuICB9XG59XG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LWhlaWdodDogNjUwcHgpIHtcbiAgI2NvbG9yc1NlbGVjdCB7XG4gICAgaGVpZ2h0OiAxMDBweDtcbiAgfVxuICAjYWRkUHJvamVjdExhYmVsIHtcbiAgICBmb250LXNpemU6IDIwcHggIWltcG9ydGFudDtcbiAgfVxufVxuXG4jYWRkUHJvamVjdExhYmVsIHtcbiAgZm9udC1zaXplOiA0OHB4O1xuICBwYWRkaW5nLWJvdHRvbTogNXB4O1xuICBib3JkZXItYm90dG9tOiBzb2xpZCByZ2IoMCwgMCwgMCwgMC4zKTtcbn1cbi8qIFByb2plY3QgRm9ybSAqL1xuI3Byb2plY3RGb3JtIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgbWF4LWhlaWdodDogbWluKDgwJSwgNjAwcHgpO1xuICB3aWR0aDogMTAwJTtcbiAgcm93LWdhcDogMjBweDtcbn1cbi8qIE5hbWUgRmllbGQgKi9cbiNuYW1lSW5wdXQge1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAzMHB4O1xuICBtYXJnaW4tdG9wOiAxMHB4O1xuICBtYXJnaW4tbGVmdDogLTEzcHg7XG4gIGJvcmRlci1yYWRpdXM6IDMwcHg7XG4gIGJvcmRlci1zdHlsZTogc29saWQ7XG4gIHBhZGRpbmctbGVmdDogMjBweDtcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xuICBib3JkZXItY29sb3I6IGJsYWNrO1xufVxuI25hbWVJbnB1dDpmb2N1cy12aXNpYmxlIHtcbiAgYm9yZGVyLWNvbG9yOiB3aGl0ZTtcbn1cbiNuYW1lSW5wdXRMYWJlbCB7XG4gIHdpZHRoOiAxMDAlO1xufVxuI25hbWVJbnB1dFNwYW4ge1xuICBtYXJnaW4tbGVmdDogMTBweDtcbn1cbi8qIENvbG9yIEZpZWxkICovXG4jY29sb3JzU2VsZWN0IHtcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xuICB3aWR0aDogMTAwJTtcbiAgbWF4LWhlaWdodDogbWluKDUwJSwgNjAwcHgpO1xuICBkaXNwbGF5OiBncmlkO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxMGZyO1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMSwgMWZyKTtcbiAgb3ZlcmZsb3cteTogc2Nyb2xsO1xufVxuLm9wdGlvbiB7XG4gIGZvbnQtc2l6ZTogMzZweDtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cbm9wdGlvbjpjaGVja2VkIHtcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KCM2NDc0OGIsICM5NGEzYjgpO1xufVxuLm9wdGlvbjpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNkNGQ0ZDg7XG59XG4uY29sb3JDaXJjbGUge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGhlaWdodDogMjBweDtcbiAgd2lkdGg6IDIwcHg7XG4gIGJvcmRlci1yYWRpdXM6IDM2MHB4O1xuICBtYXJnaW4tbGVmdDogYXV0bztcbiAgbWFyZ2luLXJpZ2h0OiAyMHB4O1xufVxuLyogQnV0dG9ucyBDb250YWluZXIqL1xuI2J1dHRvbkNvbnRhaW5lciB7XG4gIG1hcmdpbi1sZWZ0OiBhdXRvO1xuICBkaXNwbGF5OiBmbGV4O1xuICBjb2x1bW4tZ2FwOiAyMHB4O1xuICBtYXJnaW4tdG9wOiBhdXRvO1xuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xufVxuI2J1dHRvbkNvbnRhaW5lciA+IGJ1dHRvbiB7XG4gIHdpZHRoOiAxMDBweDtcbiAgaGVpZ2h0OiAzNXB4O1xuICBib3JkZXItcmFkaXVzOiAxMHB4O1xufVxuLyogQnV0dG9ucyAqL1xuLmNhbmNlbCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmNGY0ZjU7XG4gIGJvcmRlci1zdHlsZTogc29saWQ7XG4gIGJvcmRlci1jb2xvcjogI2Q0ZDRkODtcbn1cbi5zYXZlIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZjYTVhNTtcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgYm9yZGVyLWNvbG9yOiAjZWY0NDQ0O1xuICBjb2xvcjogIzExMTtcbn1cbi5zYXZlOmRpc2FibGVkIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZiZDBkMDtcbiAgYm9yZGVyLWNvbG9yOiAjZmJkMGQwO1xuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xufVxuLmNhbmNlbDpob3Zlcixcbi5zYXZlOmVuYWJsZWQ6aG92ZXIge1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG4uY2FuY2VsOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Q0ZDRkODtcbiAgdHJhbnNpdGlvbjogMC4ycztcbn1cbi5zYXZlOmVuYWJsZWQ6aG92ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWY0NDQ0O1xuICB0cmFuc2l0aW9uOiAwLjJzO1xufVxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9wcm9qZWN0Rm9ybS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQ0EscUNBQXFDO0FBQ3JDO0VBQ0UsZUFBZTtFQUNmLGFBQWE7RUFDYixZQUFZO0VBQ1osbUNBQW1DO0VBQ25DLFVBQVU7QUFDWjtBQUNBLDZCQUE2QjtBQUM3QjtFQUNFLGtCQUFrQjtFQUNsQixhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLDJCQUEyQjtFQUMzQiwwQkFBMEI7RUFDMUIsUUFBUTtFQUNSLFNBQVM7RUFDVCxrQkFBa0I7RUFDbEIsbUJBQW1CO0VBQ25CLHlCQUF5QjtFQUN6QixtQkFBbUI7RUFDbkIsaUJBQWlCO0VBQ2pCLGtCQUFrQjtFQUNsQixtQkFBbUI7RUFDbkIsYUFBYTtFQUNiLDZCQUE2QjtBQUMvQjtBQUNBLGdEQUFnRDtBQUNoRDtFQUNFO0lBQ0UsYUFBYTtJQUNiLG1CQUFtQjtJQUNuQix1QkFBdUI7RUFDekI7RUFDQTtJQUNFLE1BQU07SUFDTixPQUFPO0lBQ1AsZUFBZTtJQUNmLGdCQUFnQjtJQUNoQixpQkFBaUI7SUFDakIsa0JBQWtCO0lBQ2xCLG1CQUFtQjtFQUNyQjtBQUNGO0FBQ0E7RUFDRTtJQUNFLGFBQWE7RUFDZjtFQUNBO0lBQ0UsMEJBQTBCO0VBQzVCO0FBQ0Y7O0FBRUE7RUFDRSxlQUFlO0VBQ2YsbUJBQW1CO0VBQ25CLHNDQUFzQztBQUN4QztBQUNBLGlCQUFpQjtBQUNqQjtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsbUJBQW1CO0VBQ25CLDJCQUEyQjtFQUMzQixXQUFXO0VBQ1gsYUFBYTtBQUNmO0FBQ0EsZUFBZTtBQUNmO0VBQ0UsV0FBVztFQUNYLFlBQVk7RUFDWixnQkFBZ0I7RUFDaEIsa0JBQWtCO0VBQ2xCLG1CQUFtQjtFQUNuQixtQkFBbUI7RUFDbkIsa0JBQWtCO0VBQ2xCLGtCQUFrQjtFQUNsQixtQkFBbUI7QUFDckI7QUFDQTtFQUNFLG1CQUFtQjtBQUNyQjtBQUNBO0VBQ0UsV0FBVztBQUNiO0FBQ0E7RUFDRSxpQkFBaUI7QUFDbkI7QUFDQSxnQkFBZ0I7QUFDaEI7RUFDRSxrQkFBa0I7RUFDbEIsV0FBVztFQUNYLDJCQUEyQjtFQUMzQixhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLCtCQUErQjtFQUMvQixtQ0FBbUM7RUFDbkMsa0JBQWtCO0FBQ3BCO0FBQ0E7RUFDRSxlQUFlO0VBQ2YsYUFBYTtFQUNiLG1CQUFtQjtBQUNyQjtBQUNBO0VBQ0UsNkNBQTZDO0FBQy9DO0FBQ0E7RUFDRSx5QkFBeUI7QUFDM0I7QUFDQTtFQUNFLHFCQUFxQjtFQUNyQixZQUFZO0VBQ1osV0FBVztFQUNYLG9CQUFvQjtFQUNwQixpQkFBaUI7RUFDakIsa0JBQWtCO0FBQ3BCO0FBQ0EscUJBQXFCO0FBQ3JCO0VBQ0UsaUJBQWlCO0VBQ2pCLGFBQWE7RUFDYixnQkFBZ0I7RUFDaEIsZ0JBQWdCO0VBQ2hCLG1CQUFtQjtBQUNyQjtBQUNBO0VBQ0UsWUFBWTtFQUNaLFlBQVk7RUFDWixtQkFBbUI7QUFDckI7QUFDQSxZQUFZO0FBQ1o7RUFDRSx5QkFBeUI7RUFDekIsbUJBQW1CO0VBQ25CLHFCQUFxQjtBQUN2QjtBQUNBO0VBQ0UseUJBQXlCO0VBQ3pCLG1CQUFtQjtFQUNuQixxQkFBcUI7RUFDckIsV0FBVztBQUNiO0FBQ0E7RUFDRSx5QkFBeUI7RUFDekIscUJBQXFCO0VBQ3JCLG1CQUFtQjtBQUNyQjtBQUNBOztFQUVFLGVBQWU7QUFDakI7QUFDQTtFQUNFLHlCQUF5QjtFQUN6QixnQkFBZ0I7QUFDbEI7QUFDQTtFQUNFLHlCQUF5QjtFQUN6QixnQkFBZ0I7QUFDbEI7QUFDQSwrQ0FBK0NcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQGltcG9ydCB1cmwoXFxcImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9QmViYXMrTmV1ZSZmYW1pbHk9SW5kaWUrRmxvd2VyJmZhbWlseT1TaWduaWthJmRpc3BsYXk9c3dhcFxcXCIpO1xcbi8qIFRoZSBpbnB1dCBmaWVsZCBmb3IgbmV3IHByb2plY3RzICovXFxuI3Byb2plY3RVc2VySW5wdXQge1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgaGVpZ2h0OiAxMDB2aDtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigwLCAwLCAwLCAwLjUpO1xcbiAgei1pbmRleDogNTtcXG59XFxuLyogV2hlcmUgVGhpbmdzIGFyZSBJbnB1dGVkICovXFxuI2lucHV0Q29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgbWF4LWhlaWdodDogbWluKDgwJSwgNjAwcHgpO1xcbiAgbWF4LXdpZHRoOiBtaW4oODAlLCA0MDBweCk7XFxuICB0b3A6IDUwJTtcXG4gIGxlZnQ6IDUwJTtcXG4gIG1hcmdpbi10b3A6IC0zMDBweDtcXG4gIG1hcmdpbi1sZWZ0OiAtMjAwcHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmFmYWZhO1xcbiAgYm9yZGVyLXJhZGl1czogMjBweDtcXG4gIHBhZGRpbmctdG9wOiA1MHB4O1xcbiAgcGFkZGluZy1sZWZ0OiA0MHB4O1xcbiAgcGFkZGluZy1yaWdodDogNDBweDtcXG4gIHJvdy1nYXA6IDIwcHg7XFxuICB0cmFuc2l0aW9uOiBwYWRkaW5nIDAuM3MgZWFzZTtcXG59XFxuLyogT25seSBQdXNoIENvbnRlbnQgSWYgU2NyZWVuIElzIENlcnRhaW4gU2l6ZSAqL1xcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDYwMHB4KSwgKG1heC1oZWlnaHQ6IDY1MHB4KSB7XFxuICAjcHJvamVjdFVzZXJJbnB1dCB7XFxuICAgIGRpc3BsYXk6IGZsZXg7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgfVxcbiAgI2lucHV0Q29udGFpbmVyIHtcXG4gICAgdG9wOiAwO1xcbiAgICBsZWZ0OiAwO1xcbiAgICBtYXJnaW4tdG9wOiAwcHg7XFxuICAgIG1hcmdpbi1sZWZ0OiAwcHg7XFxuICAgIHBhZGRpbmctdG9wOiAyNXB4O1xcbiAgICBwYWRkaW5nLWxlZnQ6IDIwcHg7XFxuICAgIHBhZGRpbmctcmlnaHQ6IDIwcHg7XFxuICB9XFxufVxcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtaGVpZ2h0OiA2NTBweCkge1xcbiAgI2NvbG9yc1NlbGVjdCB7XFxuICAgIGhlaWdodDogMTAwcHg7XFxuICB9XFxuICAjYWRkUHJvamVjdExhYmVsIHtcXG4gICAgZm9udC1zaXplOiAyMHB4ICFpbXBvcnRhbnQ7XFxuICB9XFxufVxcblxcbiNhZGRQcm9qZWN0TGFiZWwge1xcbiAgZm9udC1zaXplOiA0OHB4O1xcbiAgcGFkZGluZy1ib3R0b206IDVweDtcXG4gIGJvcmRlci1ib3R0b206IHNvbGlkIHJnYigwLCAwLCAwLCAwLjMpO1xcbn1cXG4vKiBQcm9qZWN0IEZvcm0gKi9cXG4jcHJvamVjdEZvcm0ge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgbWF4LWhlaWdodDogbWluKDgwJSwgNjAwcHgpO1xcbiAgd2lkdGg6IDEwMCU7XFxuICByb3ctZ2FwOiAyMHB4O1xcbn1cXG4vKiBOYW1lIEZpZWxkICovXFxuI25hbWVJbnB1dCB7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMzBweDtcXG4gIG1hcmdpbi10b3A6IDEwcHg7XFxuICBtYXJnaW4tbGVmdDogLTEzcHg7XFxuICBib3JkZXItcmFkaXVzOiAzMHB4O1xcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcXG4gIHBhZGRpbmctbGVmdDogMjBweDtcXG4gIGFsaWduLXNlbGY6IGNlbnRlcjtcXG4gIGJvcmRlci1jb2xvcjogYmxhY2s7XFxufVxcbiNuYW1lSW5wdXQ6Zm9jdXMtdmlzaWJsZSB7XFxuICBib3JkZXItY29sb3I6IHdoaXRlO1xcbn1cXG4jbmFtZUlucHV0TGFiZWwge1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcbiNuYW1lSW5wdXRTcGFuIHtcXG4gIG1hcmdpbi1sZWZ0OiAxMHB4O1xcbn1cXG4vKiBDb2xvciBGaWVsZCAqL1xcbiNjb2xvcnNTZWxlY3Qge1xcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBtYXgtaGVpZ2h0OiBtaW4oNTAlLCA2MDBweCk7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDEwZnI7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IHJlcGVhdCgxMSwgMWZyKTtcXG4gIG92ZXJmbG93LXk6IHNjcm9sbDtcXG59XFxuLm9wdGlvbiB7XFxuICBmb250LXNpemU6IDM2cHg7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxub3B0aW9uOmNoZWNrZWQge1xcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KCM2NDc0OGIsICM5NGEzYjgpO1xcbn1cXG4ub3B0aW9uOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNkNGQ0ZDg7XFxufVxcbi5jb2xvckNpcmNsZSB7XFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxuICBoZWlnaHQ6IDIwcHg7XFxuICB3aWR0aDogMjBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDM2MHB4O1xcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XFxuICBtYXJnaW4tcmlnaHQ6IDIwcHg7XFxufVxcbi8qIEJ1dHRvbnMgQ29udGFpbmVyKi9cXG4jYnV0dG9uQ29udGFpbmVyIHtcXG4gIG1hcmdpbi1sZWZ0OiBhdXRvO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGNvbHVtbi1nYXA6IDIwcHg7XFxuICBtYXJnaW4tdG9wOiBhdXRvO1xcbiAgbWFyZ2luLWJvdHRvbTogMjBweDtcXG59XFxuI2J1dHRvbkNvbnRhaW5lciA+IGJ1dHRvbiB7XFxuICB3aWR0aDogMTAwcHg7XFxuICBoZWlnaHQ6IDM1cHg7XFxuICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbn1cXG4vKiBCdXR0b25zICovXFxuLmNhbmNlbCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjRmNGY1O1xcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcXG4gIGJvcmRlci1jb2xvcjogI2Q0ZDRkODtcXG59XFxuLnNhdmUge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZjYTVhNTtcXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XFxuICBib3JkZXItY29sb3I6ICNlZjQ0NDQ7XFxuICBjb2xvcjogIzExMTtcXG59XFxuLnNhdmU6ZGlzYWJsZWQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZiZDBkMDtcXG4gIGJvcmRlci1jb2xvcjogI2ZiZDBkMDtcXG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XFxufVxcbi5jYW5jZWw6aG92ZXIsXFxuLnNhdmU6ZW5hYmxlZDpob3ZlciB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbi5jYW5jZWw6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Q0ZDRkODtcXG4gIHRyYW5zaXRpb246IDAuMnM7XFxufVxcbi5zYXZlOmVuYWJsZWQ6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2VmNDQ0NDtcXG4gIHRyYW5zaXRpb246IDAuMnM7XFxufVxcbi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0qL1xcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgI3NlbGVjdGVkUHJvamVjdCB7XG4gIGZvbnQtc2l6ZTogbWluKDk2cHgsIDEwdncpO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBib3JkZXItdG9wOiBub25lO1xufVxuI3NlbGVjdGVkUHJvamVjdCxcbi5wcmlvcml0eU9uZSxcbi5wcmlvcml0eVR3byxcbi5wcmlvcml0eVRocmVlLFxuLnByaW9yaXR5Rm91ciB7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEyMXB4O1xuICBtYXJnaW4tdG9wOiAzMHB4O1xuICBtYXJnaW4tYm90dG9tOiAzMHB4O1xufVxuLyogU3R5bGluZyBGb3IgV2hlcmUgVGhlIFRvZG9zIFdpbGwgR28gKi9cbi5wcmlvcml0eU9uZSxcbi5wcmlvcml0eVR3byxcbi5wcmlvcml0eVRocmVlLFxuLnByaW9yaXR5Rm91ciB7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xuICByb3ctZ2FwOiAxMHB4O1xuICBoZWlnaHQ6IGZpdC1jb250ZW50O1xuICBmb250LXNpemU6IG1pbig2NHB4LCAxMHZ3KTtcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkICNkNGQ0ZDg7XG59XG4vKiBDb2xvciBUaGUgUHJpb3JpdGllcywgTW9yZSBSZWQsIE1vcmUgVXJnZW50ICovXG4ucHJpb3JpdHlPbmUge1xuICBjb2xvcjogI2ZmMDA2Njtcbn1cbi5wcmlvcml0eVR3byB7XG4gIGNvbG9yOiAjZmZkNzAwO1xufVxuLnByaW9yaXR5VGhyZWUge1xuICBjb2xvcjogcmdiKDksIDI1NSwgNTApO1xufVxuLnByaW9yaXR5Rm91ciB7XG4gIGNvbG9yOiAjMjg1MGZmO1xufVxuLyogQnV0dG9uIFRvIEFkZCBUb2RvcyAqL1xuI2FkZFRvZG9CdG4ge1xuICBtYXJnaW4tbGVmdDogYXV0bztcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgYm9yZGVyLWNvbG9yOiAjZmZmZmZmO1xuICBjb2xvcjogIzExMTtcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgaGVpZ2h0OiA0MHB4O1xufVxuI2FkZFRvZG9CdG46aG92ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZDRkNGQ4O1xuICB0cmFuc2l0aW9uOiAwLjJzO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG4vKkFsbCBUb2RvcyovXG4udG9kbyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGNvbHVtbi1nYXA6IDEwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmNGY0ZjU7XG4gIGhlaWdodDogNjBweDtcbiAgcGFkZGluZy1yaWdodDogMjBweDtcbiAganVzdGlmeS1zZWxmOiBjZW50ZXI7XG4gIHdpZHRoOiA5NSU7XG4gIHRyYW5zaXRpb246IHdpZHRoIDAuMnM7XG4gIHRyYW5zaXRpb246IGJveC1zaGFkb3cgMC4ycztcbn1cbi50b2RvOmhvdmVyIHtcbiAgaGVpZ2h0OiA2NXB4O1xuICBib3gtc2hhZG93OiAzcHggNXB4IDVweCAjMDAwMDAwO1xuICB3aWR0aDogOTYlO1xufVxuLypTaG93IFByaW9yaXR5IGNvbG9yKi9cbi5wcmlvcml0eUNvbG9yIHtcbiAgd2lkdGg6IDVweDtcbiAgaGVpZ2h0OiAxMDAlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwO1xufVxuLypDaGVja2JveCBGb3IgVG9kb3MqL1xuLnRvZG9DaGVja2JveCB7XG4gIGhlaWdodDogMThweDtcbiAgd2lkdGg6IDE4cHg7XG4gIG1hcmdpbi1sZWZ0OiAxMHB4O1xuICBtYXJnaW4tcmlnaHQ6IDEwcHg7XG4gIGFjY2VudC1jb2xvcjogIzAwMDAwMDtcbiAgYm9yZGVyOiAjMTExO1xufVxuQGtleWZyYW1lcyBzdHJpa2VUaHJvdWdoIHtcbiAgMCUge1xuICAgIHdpZHRoOiAwO1xuICB9XG4gIDEwMCUge1xuICAgIHdpZHRoOiAxMDAlO1xuICB9XG59XG4uc3RyaWtlVGhyb3VnaCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgY29sb3I6ICNkNGQ0ZDggIWltcG9ydGFudDtcbn1cbi5zdHJpa2VUaHJvdWdoOjphZnRlciB7XG4gIGNvbnRlbnQ6IFwiIFwiO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogNTAlO1xuICBsZWZ0OiAwO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxcHg7XG4gIGJhY2tncm91bmQ6IGJsYWNrO1xuICBhbmltYXRpb24tbmFtZTogc3RyaWtlVGhyb3VnaDtcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjJzO1xuICBhbmltYXRpb24tdGltaW5nLWZ1bmN0aW9uOiBsaW5lYXI7XG4gIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IDE7XG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGZvcndhcmRzO1xufVxuLnRhc2tOYW1lIHtcbiAgZm9udC1zaXplOiBtaW4oMjRweCwgMTB2dyk7XG4gIGNvbG9yOiAjMTExO1xuICB0cmFuc2l0aW9uOiBjb2xvciAwLjJzO1xuICB3aWR0aDogYXV0bztcbiAgbWF4LXdpZHRoOiA1MDBweDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG59XG4uZGV0YWlsc0J0biB7XG4gIGhlaWdodDogMzVweDtcbiAgd2lkdGg6IDEwMHB4O1xuICBtYXJnaW4tbGVmdDogYXV0bztcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJvcmRlcjogMnB4IHNvbGlkICMwMDAwMDA7XG4gIGNvbG9yOiAjMDAwMDAwO1xuICBmb250LWZhbWlseTogXCJTaWduaWthXCI7XG4gIGZvbnQtc2l6ZTogbWluKDE2cHgsIDEwdncpO1xuICBmb250LXdlaWdodDogYm9sZDtcbn1cbi5kZXRhaWxzQnRuOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDtcbiAgY29sb3I6ICNmZmZmZmY7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgdHJhbnNpdGlvbjogMC4ycztcbn1cbi5kZXRhaWxzQnRuQ2hlY2tlZCB7XG4gIG9wYWNpdHk6IDAuNTtcbn1cbi5kdWVEYXRlRWwge1xuICBmb250LXNpemU6IG1pbigxOHB4LCAxMHZ3KTtcbiAgY29sb3I6ICMwMDAwMDA7XG59XG4udHJhc2hDYW4sXG4uZWRpdEljb24ge1xuICBoZWlnaHQ6IGZpdC1jb250ZW50O1xuICBmb250LXNpemU6IG1pbig0MHB4LCAxMHZ3KTtcbiAgdHJhbnNpdGlvbjogMC4ycztcbiAgY29sb3I6IHJnYigwLCAwLCAwKTtcbn1cbi50cmFzaENhbjpob3Zlcixcbi5lZGl0SWNvbjpob3ZlciB7XG4gIGNvbG9yOiByZ2IoMTI5LCAxMjksIDEyOSk7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cbi50cmFzaENhbjo6YmVmb3JlIHtcbiAgY29udGVudDogXCJcXFxcMDFGNUQxXCI7XG59XG4uZWRpdEljb246OmJlZm9yZSB7XG4gIGNvbnRlbnQ6IFwiXFxcXDAxRjU4OVwiO1xufVxuLnRyYXNoQ2FuQ2hlY2tlZCxcbi5lZGl0SWNvbkNoZWNrZWQge1xuICBvcGFjaXR5OiAwLjU7XG59XG5cbi8qIEZvciBUaGUgRGlzcGxheSBPZiBBIFRvZG9zIERldGFpbHMgKi9cbiN0YXNrSW5mbyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGhlaWdodDogbWluKDgwJSwgNDAwcHgpO1xuICB3aWR0aDogbWluKDgwJSwgNjAwcHgpO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmFmYWZhO1xuICBib3JkZXItcmFkaXVzOiAyMHB4O1xuICBwYWRkaW5nLXRvcDogMTBweDtcbiAgcGFkZGluZy1sZWZ0OiA0MHB4O1xuICBwYWRkaW5nLXJpZ2h0OiA0MHB4O1xuICByb3ctZ2FwOiAyMHB4O1xuICB0cmFuc2l0aW9uOiBwYWRkaW5nIDAuM3MgZWFzZTtcbn1cbiNjbG9zZUljb24ge1xuICBtYXJnaW4tbGVmdDogYXV0bztcbiAgd2lkdGg6IGZpdC1jb250ZW50O1xuICBmb250LXNpemU6IDJlbTtcbn1cbiNjbG9zZUljb246aG92ZXIge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGNvbG9yOiByZWQ7XG59XG5cbiN0YXNrSW5mbyBsaSB7XG4gIGxpc3Qtc3R5bGU6IG5vbmU7XG59XG4jdGFza0RldGFpbHNOYW1lIHtcbiAgZm9udC1zaXplOiAyZW07XG59XG5cbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDgwMHB4KSB7XG4gIC50YXNrTmFtZSB7XG4gICAgbWF4LXdpZHRoOiAzMDBweDtcbiAgfVxufVxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNjAwcHgpIHtcbiAgLnRhc2tOYW1lIHtcbiAgICBtYXgtd2lkdGg6IDE1MHB4O1xuICB9XG5cbiAgI3Rhc2tJbmZvIHtcbiAgICBwYWRkaW5nLXRvcDogMTBweDtcbiAgICBwYWRkaW5nLWxlZnQ6IDIwcHg7XG4gICAgcGFkZGluZy1yaWdodDogMjBweDtcbiAgfVxufVxuYCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvcHJvamVjdE1vZHVsZS5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSwwQkFBMEI7RUFDMUIsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQixnQkFBZ0I7QUFDbEI7QUFDQTs7Ozs7RUFLRSxXQUFXO0VBQ1gsYUFBYTtFQUNiLGdCQUFnQjtFQUNoQixtQkFBbUI7QUFDckI7QUFDQSx3Q0FBd0M7QUFDeEM7Ozs7RUFJRSxhQUFhO0VBQ2IsMEJBQTBCO0VBQzFCLGFBQWE7RUFDYixtQkFBbUI7RUFDbkIsMEJBQTBCO0VBQzFCLDZCQUE2QjtBQUMvQjtBQUNBLGdEQUFnRDtBQUNoRDtFQUNFLGNBQWM7QUFDaEI7QUFDQTtFQUNFLGNBQWM7QUFDaEI7QUFDQTtFQUNFLHNCQUFzQjtBQUN4QjtBQUNBO0VBQ0UsY0FBYztBQUNoQjtBQUNBLHdCQUF3QjtBQUN4QjtFQUNFLGlCQUFpQjtFQUNqQix5QkFBeUI7RUFDekIsbUJBQW1CO0VBQ25CLHFCQUFxQjtFQUNyQixXQUFXO0VBQ1gsbUJBQW1CO0VBQ25CLFlBQVk7QUFDZDtBQUNBO0VBQ0UseUJBQXlCO0VBQ3pCLGdCQUFnQjtFQUNoQixlQUFlO0FBQ2pCO0FBQ0EsWUFBWTtBQUNaO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtFQUNuQixnQkFBZ0I7RUFDaEIseUJBQXlCO0VBQ3pCLFlBQVk7RUFDWixtQkFBbUI7RUFDbkIsb0JBQW9CO0VBQ3BCLFVBQVU7RUFDVixzQkFBc0I7RUFDdEIsMkJBQTJCO0FBQzdCO0FBQ0E7RUFDRSxZQUFZO0VBQ1osK0JBQStCO0VBQy9CLFVBQVU7QUFDWjtBQUNBLHNCQUFzQjtBQUN0QjtFQUNFLFVBQVU7RUFDVixZQUFZO0VBQ1oseUJBQXlCO0FBQzNCO0FBQ0EscUJBQXFCO0FBQ3JCO0VBQ0UsWUFBWTtFQUNaLFdBQVc7RUFDWCxpQkFBaUI7RUFDakIsa0JBQWtCO0VBQ2xCLHFCQUFxQjtFQUNyQixZQUFZO0FBQ2Q7QUFDQTtFQUNFO0lBQ0UsUUFBUTtFQUNWO0VBQ0E7SUFDRSxXQUFXO0VBQ2I7QUFDRjtBQUNBO0VBQ0Usa0JBQWtCO0VBQ2xCLHlCQUF5QjtBQUMzQjtBQUNBO0VBQ0UsWUFBWTtFQUNaLGtCQUFrQjtFQUNsQixRQUFRO0VBQ1IsT0FBTztFQUNQLFdBQVc7RUFDWCxXQUFXO0VBQ1gsaUJBQWlCO0VBQ2pCLDZCQUE2QjtFQUM3Qix3QkFBd0I7RUFDeEIsaUNBQWlDO0VBQ2pDLDRCQUE0QjtFQUM1Qiw2QkFBNkI7QUFDL0I7QUFDQTtFQUNFLDBCQUEwQjtFQUMxQixXQUFXO0VBQ1gsc0JBQXNCO0VBQ3RCLFdBQVc7RUFDWCxnQkFBZ0I7RUFDaEIsZ0JBQWdCO0VBQ2hCLHVCQUF1QjtBQUN6QjtBQUNBO0VBQ0UsWUFBWTtFQUNaLFlBQVk7RUFDWixpQkFBaUI7RUFDakIsNkJBQTZCO0VBQzdCLHlCQUF5QjtFQUN6QixjQUFjO0VBQ2Qsc0JBQXNCO0VBQ3RCLDBCQUEwQjtFQUMxQixpQkFBaUI7QUFDbkI7QUFDQTtFQUNFLHlCQUF5QjtFQUN6QixjQUFjO0VBQ2QsZUFBZTtFQUNmLGdCQUFnQjtBQUNsQjtBQUNBO0VBQ0UsWUFBWTtBQUNkO0FBQ0E7RUFDRSwwQkFBMEI7RUFDMUIsY0FBYztBQUNoQjtBQUNBOztFQUVFLG1CQUFtQjtFQUNuQiwwQkFBMEI7RUFDMUIsZ0JBQWdCO0VBQ2hCLG1CQUFtQjtBQUNyQjtBQUNBOztFQUVFLHlCQUF5QjtFQUN6QixlQUFlO0FBQ2pCO0FBQ0E7RUFDRSxrQkFBa0I7QUFDcEI7QUFDQTtFQUNFLGtCQUFrQjtBQUNwQjtBQUNBOztFQUVFLFlBQVk7QUFDZDs7QUFFQSx1Q0FBdUM7QUFDdkM7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLHVCQUF1QjtFQUN2QixzQkFBc0I7RUFDdEIseUJBQXlCO0VBQ3pCLG1CQUFtQjtFQUNuQixpQkFBaUI7RUFDakIsa0JBQWtCO0VBQ2xCLG1CQUFtQjtFQUNuQixhQUFhO0VBQ2IsNkJBQTZCO0FBQy9CO0FBQ0E7RUFDRSxpQkFBaUI7RUFDakIsa0JBQWtCO0VBQ2xCLGNBQWM7QUFDaEI7QUFDQTtFQUNFLGVBQWU7RUFDZixVQUFVO0FBQ1o7O0FBRUE7RUFDRSxnQkFBZ0I7QUFDbEI7QUFDQTtFQUNFLGNBQWM7QUFDaEI7O0FBRUE7RUFDRTtJQUNFLGdCQUFnQjtFQUNsQjtBQUNGO0FBQ0E7RUFDRTtJQUNFLGdCQUFnQjtFQUNsQjs7RUFFQTtJQUNFLGlCQUFpQjtJQUNqQixrQkFBa0I7SUFDbEIsbUJBQW1CO0VBQ3JCO0FBQ0ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiI3NlbGVjdGVkUHJvamVjdCB7XFxuICBmb250LXNpemU6IG1pbig5NnB4LCAxMHZ3KTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgYm9yZGVyLXRvcDogbm9uZTtcXG59XFxuI3NlbGVjdGVkUHJvamVjdCxcXG4ucHJpb3JpdHlPbmUsXFxuLnByaW9yaXR5VHdvLFxcbi5wcmlvcml0eVRocmVlLFxcbi5wcmlvcml0eUZvdXIge1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEyMXB4O1xcbiAgbWFyZ2luLXRvcDogMzBweDtcXG4gIG1hcmdpbi1ib3R0b206IDMwcHg7XFxufVxcbi8qIFN0eWxpbmcgRm9yIFdoZXJlIFRoZSBUb2RvcyBXaWxsIEdvICovXFxuLnByaW9yaXR5T25lLFxcbi5wcmlvcml0eVR3byxcXG4ucHJpb3JpdHlUaHJlZSxcXG4ucHJpb3JpdHlGb3VyIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcXG4gIHJvdy1nYXA6IDEwcHg7XFxuICBoZWlnaHQ6IGZpdC1jb250ZW50O1xcbiAgZm9udC1zaXplOiBtaW4oNjRweCwgMTB2dyk7XFxuICBib3JkZXItdG9wOiAxcHggc29saWQgI2Q0ZDRkODtcXG59XFxuLyogQ29sb3IgVGhlIFByaW9yaXRpZXMsIE1vcmUgUmVkLCBNb3JlIFVyZ2VudCAqL1xcbi5wcmlvcml0eU9uZSB7XFxuICBjb2xvcjogI2ZmMDA2NjtcXG59XFxuLnByaW9yaXR5VHdvIHtcXG4gIGNvbG9yOiAjZmZkNzAwO1xcbn1cXG4ucHJpb3JpdHlUaHJlZSB7XFxuICBjb2xvcjogcmdiKDksIDI1NSwgNTApO1xcbn1cXG4ucHJpb3JpdHlGb3VyIHtcXG4gIGNvbG9yOiAjMjg1MGZmO1xcbn1cXG4vKiBCdXR0b24gVG8gQWRkIFRvZG9zICovXFxuI2FkZFRvZG9CdG4ge1xcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZmZmO1xcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcXG4gIGJvcmRlci1jb2xvcjogI2ZmZmZmZjtcXG4gIGNvbG9yOiAjMTExO1xcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcXG4gIGhlaWdodDogNDBweDtcXG59XFxuI2FkZFRvZG9CdG46aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Q0ZDRkODtcXG4gIHRyYW5zaXRpb246IDAuMnM7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbi8qQWxsIFRvZG9zKi9cXG4udG9kbyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGNvbHVtbi1nYXA6IDEwcHg7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjRmNGY1O1xcbiAgaGVpZ2h0OiA2MHB4O1xcbiAgcGFkZGluZy1yaWdodDogMjBweDtcXG4gIGp1c3RpZnktc2VsZjogY2VudGVyO1xcbiAgd2lkdGg6IDk1JTtcXG4gIHRyYW5zaXRpb246IHdpZHRoIDAuMnM7XFxuICB0cmFuc2l0aW9uOiBib3gtc2hhZG93IDAuMnM7XFxufVxcbi50b2RvOmhvdmVyIHtcXG4gIGhlaWdodDogNjVweDtcXG4gIGJveC1zaGFkb3c6IDNweCA1cHggNXB4ICMwMDAwMDA7XFxuICB3aWR0aDogOTYlO1xcbn1cXG4vKlNob3cgUHJpb3JpdHkgY29sb3IqL1xcbi5wcmlvcml0eUNvbG9yIHtcXG4gIHdpZHRoOiA1cHg7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwO1xcbn1cXG4vKkNoZWNrYm94IEZvciBUb2RvcyovXFxuLnRvZG9DaGVja2JveCB7XFxuICBoZWlnaHQ6IDE4cHg7XFxuICB3aWR0aDogMThweDtcXG4gIG1hcmdpbi1sZWZ0OiAxMHB4O1xcbiAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xcbiAgYWNjZW50LWNvbG9yOiAjMDAwMDAwO1xcbiAgYm9yZGVyOiAjMTExO1xcbn1cXG5Aa2V5ZnJhbWVzIHN0cmlrZVRocm91Z2gge1xcbiAgMCUge1xcbiAgICB3aWR0aDogMDtcXG4gIH1cXG4gIDEwMCUge1xcbiAgICB3aWR0aDogMTAwJTtcXG4gIH1cXG59XFxuLnN0cmlrZVRocm91Z2gge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgY29sb3I6ICNkNGQ0ZDggIWltcG9ydGFudDtcXG59XFxuLnN0cmlrZVRocm91Z2g6OmFmdGVyIHtcXG4gIGNvbnRlbnQ6IFxcXCIgXFxcIjtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogNTAlO1xcbiAgbGVmdDogMDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAxcHg7XFxuICBiYWNrZ3JvdW5kOiBibGFjaztcXG4gIGFuaW1hdGlvbi1uYW1lOiBzdHJpa2VUaHJvdWdoO1xcbiAgYW5pbWF0aW9uLWR1cmF0aW9uOiAwLjJzO1xcbiAgYW5pbWF0aW9uLXRpbWluZy1mdW5jdGlvbjogbGluZWFyO1xcbiAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogMTtcXG4gIGFuaW1hdGlvbi1maWxsLW1vZGU6IGZvcndhcmRzO1xcbn1cXG4udGFza05hbWUge1xcbiAgZm9udC1zaXplOiBtaW4oMjRweCwgMTB2dyk7XFxuICBjb2xvcjogIzExMTtcXG4gIHRyYW5zaXRpb246IGNvbG9yIDAuMnM7XFxuICB3aWR0aDogYXV0bztcXG4gIG1heC13aWR0aDogNTAwcHg7XFxuICBvdmVyZmxvdzogaGlkZGVuO1xcbiAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XFxufVxcbi5kZXRhaWxzQnRuIHtcXG4gIGhlaWdodDogMzVweDtcXG4gIHdpZHRoOiAxMDBweDtcXG4gIG1hcmdpbi1sZWZ0OiBhdXRvO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XFxuICBib3JkZXI6IDJweCBzb2xpZCAjMDAwMDAwO1xcbiAgY29sb3I6ICMwMDAwMDA7XFxuICBmb250LWZhbWlseTogXFxcIlNpZ25pa2FcXFwiO1xcbiAgZm9udC1zaXplOiBtaW4oMTZweCwgMTB2dyk7XFxuICBmb250LXdlaWdodDogYm9sZDtcXG59XFxuLmRldGFpbHNCdG46aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDtcXG4gIGNvbG9yOiAjZmZmZmZmO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgdHJhbnNpdGlvbjogMC4ycztcXG59XFxuLmRldGFpbHNCdG5DaGVja2VkIHtcXG4gIG9wYWNpdHk6IDAuNTtcXG59XFxuLmR1ZURhdGVFbCB7XFxuICBmb250LXNpemU6IG1pbigxOHB4LCAxMHZ3KTtcXG4gIGNvbG9yOiAjMDAwMDAwO1xcbn1cXG4udHJhc2hDYW4sXFxuLmVkaXRJY29uIHtcXG4gIGhlaWdodDogZml0LWNvbnRlbnQ7XFxuICBmb250LXNpemU6IG1pbig0MHB4LCAxMHZ3KTtcXG4gIHRyYW5zaXRpb246IDAuMnM7XFxuICBjb2xvcjogcmdiKDAsIDAsIDApO1xcbn1cXG4udHJhc2hDYW46aG92ZXIsXFxuLmVkaXRJY29uOmhvdmVyIHtcXG4gIGNvbG9yOiByZ2IoMTI5LCAxMjksIDEyOSk7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbi50cmFzaENhbjo6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFxcMDFGNUQxXFxcIjtcXG59XFxuLmVkaXRJY29uOjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXFwwMUY1ODlcXFwiO1xcbn1cXG4udHJhc2hDYW5DaGVja2VkLFxcbi5lZGl0SWNvbkNoZWNrZWQge1xcbiAgb3BhY2l0eTogMC41O1xcbn1cXG5cXG4vKiBGb3IgVGhlIERpc3BsYXkgT2YgQSBUb2RvcyBEZXRhaWxzICovXFxuI3Rhc2tJbmZvIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgaGVpZ2h0OiBtaW4oODAlLCA0MDBweCk7XFxuICB3aWR0aDogbWluKDgwJSwgNjAwcHgpO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZhZmFmYTtcXG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XFxuICBwYWRkaW5nLXRvcDogMTBweDtcXG4gIHBhZGRpbmctbGVmdDogNDBweDtcXG4gIHBhZGRpbmctcmlnaHQ6IDQwcHg7XFxuICByb3ctZ2FwOiAyMHB4O1xcbiAgdHJhbnNpdGlvbjogcGFkZGluZyAwLjNzIGVhc2U7XFxufVxcbiNjbG9zZUljb24ge1xcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XFxuICB3aWR0aDogZml0LWNvbnRlbnQ7XFxuICBmb250LXNpemU6IDJlbTtcXG59XFxuI2Nsb3NlSWNvbjpob3ZlciB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBjb2xvcjogcmVkO1xcbn1cXG5cXG4jdGFza0luZm8gbGkge1xcbiAgbGlzdC1zdHlsZTogbm9uZTtcXG59XFxuI3Rhc2tEZXRhaWxzTmFtZSB7XFxuICBmb250LXNpemU6IDJlbTtcXG59XFxuXFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogODAwcHgpIHtcXG4gIC50YXNrTmFtZSB7XFxuICAgIG1heC13aWR0aDogMzAwcHg7XFxuICB9XFxufVxcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDYwMHB4KSB7XFxuICAudGFza05hbWUge1xcbiAgICBtYXgtd2lkdGg6IDE1MHB4O1xcbiAgfVxcblxcbiAgI3Rhc2tJbmZvIHtcXG4gICAgcGFkZGluZy10b3A6IDEwcHg7XFxuICAgIHBhZGRpbmctbGVmdDogMjBweDtcXG4gICAgcGFkZGluZy1yaWdodDogMjBweDtcXG4gIH1cXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIkBpbXBvcnQgdXJsKGh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9QmViYXMrTmV1ZSZmYW1pbHk9SW5kaWUrRmxvd2VyJmZhbWlseT1TaWduaWthJmRpc3BsYXk9c3dhcCk7XCJdKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgYm9keSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGZsZXgtd3JhcDogd3JhcDtcbiAgcGFkZGluZzogMDtcbiAgbWFyZ2luOiAwO1xufVxuLypIYW1idXJnZXIgU3dpdGNoKi9cbltyb2xlPVwic3dpdGNoXCJdW2FyaWEtY2hlY2tlZD1cImZhbHNlXCJdIHtcbiAgYmFja2dyb3VuZDogcmdiKDAsIDI1NSwgMCk7XG4gIGNvbG9yOiAjZWVmO1xufVxuW3JvbGU9XCJzd2l0Y2hcIl1bYXJpYS1jaGVja2VkPVwidHJ1ZVwiXSB7XG4gIGJhY2tncm91bmQ6IHJnYigyNTUsIDAsIDApO1xuICBjb2xvcjogI2VlZjtcbn1cbi8qLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vKiBUaGUgbmF2QmFyIG1lbnUgKi9cbiNuYXZCYXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoXG4gICAgdG8gbGVmdCxcbiAgICB2aW9sZXQsXG4gICAgaW5kaWdvLFxuICAgICMyODUwZmYsXG4gICAgZ3JlZW4sXG4gICAgeWVsbG93LFxuICAgIG9yYW5nZSxcbiAgICByZWRcbiAgKTtcbiAgcG9zaXRpb246IGZpeGVkO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiA1dmg7XG4gIG1pbi1oZWlnaHQ6IG1pbi1jb250ZW50O1xufVxuLyotLS0tLS0tLS0tLS0tLS0tLS0qL1xuXG4vKiBUaGUgU2lkZWJhciBJbmJveCAqL1xuI3NpZGVCYXJJbmJveCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgZm9udC1mYW1pbHk6IFwiU2lnbmlrYVwiO1xuICAvKiBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoXG4gICAgdG8gbGVmdCxcbiAgICB2aW9sZXQsXG4gICAgaW5kaWdvLFxuICAgICMyODUwZmYsXG4gICAgZ3JlZW4sXG4gICAgeWVsbG93LFxuICAgIG9yYW5nZSxcbiAgICByZWRcbiAgKTtcbiAgYmFja2dyb3VuZC1jbGlwOiB0ZXh0O1xuICAtd2Via2l0LWJhY2tncm91bmQtY2xpcDogdGV4dDtcbiAgLXdlYmtpdC10ZXh0LWZpbGwtY29sb3I6IHRyYW5zcGFyZW50OyovXG4gIGNvbG9yOiB3aGl0ZTtcbiAgZm9udC1zaXplOiAyZW07XG4gIHBhZGRpbmctbGVmdDogNSU7XG4gIG1hcmdpbi1ib3R0b206IDMwcHg7IC8qIFBsYWNlIGNvbnRlbnQgNjBweCBmcm9tIHRoZSB0b3AgKi9cbiAgbWFyZ2luLXRvcDogMzBweDtcbn1cbi8qIFRoZSBzaWRlYmFyIG1lbnUgKi9cbi5zaWRlYmFyIHtcbiAgZm9udC1mYW1pbHk6IFwiU2lnbmlrYVwiO1xuICBoZWlnaHQ6IDEwMCU7IC8qIDkwJSBGdWxsLWhlaWdodCAqL1xuICB3aWR0aDogMDsgLyogMCB3aWR0aCAtIGNoYW5nZSB0aGlzIHdpdGggSmF2YVNjcmlwdCAqL1xuICBwb3NpdGlvbjogZml4ZWQ7IC8qIFN0YXkgaW4gcGxhY2UgKi9cbiAgei1pbmRleDogMTsgLyogU3RheSBvbiB0b3AgKi9cbiAgdG9wOiA1dmg7XG4gIGxlZnQ6IDA7XG4gIGJhY2tncm91bmQtY29sb3I6ICMwZjE3MmE7IC8qIEJsdWUqL1xuICBvdmVyZmxvdy14OiBoaWRkZW47IC8qIERpc2FibGUgaG9yaXpvbnRhbCBzY3JvbGwgKi9cbiAgdHJhbnNpdGlvbjogMC41czsgLyogMC41IHNlY29uZCB0cmFuc2l0aW9uIGVmZmVjdCB0byBzbGlkZSBpbiB0aGUgc2lkZWJhciAqL1xufVxuLyogQ29sbGFwc2UgQ2xhc3NlcyBmb3IgU2lkZWJhciBhbmQgQ29udGVudCAqL1xuLnNpZGViYXJPcGVuIHtcbiAgd2lkdGg6IDI1MHB4O1xufVxuLyogT25seSBQdXNoIENvbnRlbnQgSWYgU2NyZWVuIElzIENlcnRhaW4gU2l6ZSAqL1xuQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDogNDUwcHgpIHtcbiAgLmNvbnRlbnRQdXNoZWQge1xuICAgIG1hcmdpbi1sZWZ0OiAyNTBweDtcbiAgfVxufVxuLnByb2plY3RzT3BlbiB7XG4gIG1heC1oZWlnaHQ6IDE0NDBweCAhaW1wb3J0YW50O1xufVxuLyogVGhlIFNpZGViYXIgUHJvamVjdCBDb250YWluZXIqL1xuI3Byb2plY3RzQ29udGFpbmVyIHtcbiAgLyogIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxODBkZWcsICNmZjAwNjYsICMyODUwZmYpO1xuICBiYWNrZ3JvdW5kLWNsaXA6IHRleHQ7XG4gIC13ZWJraXQtYmFja2dyb3VuZC1jbGlwOiB0ZXh0O1xuICAtd2Via2l0LXRleHQtZmlsbC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gICovXG4gIG1heC1oZWlnaHQ6IDBweDtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgdHJhbnNpdGlvbjogbWF4LWhlaWdodCAwLjNzIGVhc2U7XG59XG4vKiBUaGUgU2lkZWJhciBQcm9qZWN0IExhYmVsKi9cbiNwcm9qZWN0TGFiZWxDb250YWluZXIge1xuICBoZWlnaHQ6IGF1dG87XG4gIGNvbG9yOiB3aGl0ZTtcbiAgZGlzcGxheTogZmxleDtcbiAgZm9udC1zaXplOiAyZW07XG4gIHBhZGRpbmctbGVmdDogNSU7XG4gIGJhY2tncm91bmQ6IC13ZWJraXQtbGluZWFyLWdyYWRpZW50KDE4MGRlZywgI2ZmMDAwMCwgIzg0MDBmZik7XG4gIC13ZWJraXQtYmFja2dyb3VuZC1jbGlwOiB0ZXh0O1xuICBiYWNrZ3JvdW5kLWNsaXA6IHRleHQ7XG4gIC13ZWJraXQtdGV4dC1maWxsLWNvbG9yOiB0cmFuc3BhcmVudDtcbn1cbiNwcm9qZWN0TGFiZWxDb250YWluZXIgPiA6Zmlyc3QtY2hpbGQ6aG92ZXIsXG4jc2lkYmFyQnV0dG9uQ29udGFpbmVyID4gOmhvdmVyLFxuI3Byb2plY3RzQ29udGFpbmVyID4gOmhvdmVyLFxuI3NpZGVCYXJJbmJveDpob3ZlciB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgb3BhY2l0eTogMC41O1xufVxuLyogVGhlIFNpZGViYXIgUHJvamVjdCBCdXR0b25zKi9cbiNzaWRiYXJCdXR0b25Db250YWluZXIge1xuICBtYXJnaW4tbGVmdDogYXV0bztcbiAgbWFyZ2luLXJpZ2h0OiAxMCU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGdhcDogMjAlO1xufVxuLyogVGhlIHNpZGViYXIgbGlua3MgKi9cbi5zaWRlYmFyIGEge1xuICBwYWRkaW5nOiA4cHggOHB4IDhweCAzMnB4O1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG4gIGZvbnQtc2l6ZTogMjVweDtcbiAgY29sb3I6ICNmZmZmZmY7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB0cmFuc2l0aW9uOiAwLjNzO1xuICB3aWR0aDogODAlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuLyogU2FtZSBhcyBjb2xvciBjaXJjbGUgaW4gcHJvamVjdEZvcm0uY3NzIGp1c3Qgd2l0aG91dCBtYXJnaW4tbGVmdCAqL1xuLmNvbG9yQ2lyY2xlLVAge1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGhlaWdodDogMzBweDtcbiAgd2lkdGg6IDMwcHg7XG4gIGJvcmRlci1yYWRpdXM6IDM2MHB4O1xuICBtYXJnaW4tcmlnaHQ6IDIwcHg7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgY29sb3I6ICMxMTE7XG59XG4uY29sb3JDaXJjbGUtSW5ib3gge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgaGVpZ2h0OiA0MHB4O1xuICB3aWR0aDogNDBweDtcbiAgYm9yZGVyLXJhZGl1czogMzYwcHg7XG4gIG1hcmdpbi1yaWdodDogMjBweDtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBjb2xvcjogIzExMTtcbn1cbi8qIFdoZW4geW91IG1vdXNlIG92ZXIgdGhlIG5hdmlnYXRpb24gbGlua3MsIGNoYW5nZSB0aGVpciBjb2xvciAqL1xuLnNpZGViYXIgYTpob3ZlciB7XG4gIGNvbG9yOiAjZjFmMWYxO1xufVxuXG4vKiBQb3NpdGlvbiBhbmQgc3R5bGUgdGhlIGNsb3NlIGJ1dHRvbiAodG9wIHJpZ2h0IGNvcm5lcikgKi9cbi5zaWRlYmFyIC5jbG9zZWJ0biB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAwO1xuICByaWdodDogMjVweDtcbiAgZm9udC1zaXplOiAzNnB4O1xuICBtYXJnaW4tbGVmdDogNTBweDtcbn1cblxuLyogVGhlIGJ1dHRvbiB1c2VkIHRvIG9wZW4gdGhlIHNpZGViYXIgKi9cbi5vcGVuQnRuIHtcbiAgZm9udC1zaXplOiAyMHB4O1xuICBoZWlnaHQ6IDEwMCU7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzExMTtcbiAgY29sb3I6IHdoaXRlO1xuICBwYWRkaW5nLWxlZnQ6IDIwcHg7XG4gIHBhZGRpbmctcmlnaHQ6IDIwcHg7XG4gIGZvbnQtc2l6ZTogM3ZoO1xuICBib3JkZXI6IG5vbmU7XG59XG5cbi5vcGVuQnRuOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzQ0NDtcbn1cblxuLyogT24gc21hbGxlciBzY3JlZW5zLCB3aGVyZSBoZWlnaHQgaXMgbGVzcyB0aGFuIDQ1MHB4LCBjaGFuZ2UgdGhlIHN0eWxlIG9mIHRoZSBzaWRlbmF2IChsZXNzIHBhZGRpbmcgYW5kIGEgc21hbGxlciBmb250IHNpemUpICovXG5AbWVkaWEgc2NyZWVuIGFuZCAobWF4LWhlaWdodDogNDUwcHgpIHtcbiAgLnNpZGViYXIge1xuICAgIHBhZGRpbmctdG9wOiAxNXB4O1xuICB9XG4gIC5zaWRlYmFyIGEge1xuICAgIGZvbnQtc2l6ZTogMThweDtcbiAgfVxufVxuXG4vKiBTdHlsZSBwYWdlIGNvbnRlbnQgLSB1c2UgdGhpcyBpZiB5b3Ugd2FudCB0byBwdXNoIHRoZSBwYWdlIGNvbnRlbnQgdG8gdGhlIHJpZ2h0IHdoZW4geW91IG9wZW4gdGhlIHNpZGUgbmF2aWdhdGlvbiAqL1xuI2NvbnRlbnQge1xuICBmb250LWZhbWlseTogXCJTaWduaWthXCI7XG4gIHRyYW5zaXRpb246IG1hcmdpbi1sZWZ0IDAuNXM7IC8qIElmIHlvdSB3YW50IGEgdHJhbnNpdGlvbiBlZmZlY3QgKi9cbiAgcGFkZGluZzogNXZoIDBweCAwcHggMHB4O1xuICAvKiBoZWlnaHQ6IDIwMHZoOyovXG4gIGRpc3BsYXk6IGdyaWQ7XG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xuICBncmlkLXRlbXBsYXRlLXJvd3M6IGF1dG87XG4gIG1heC13aWR0aDogbWluKDEwMCUsIDgwMHB4KTtcbiAgcGFkZGluZy1sZWZ0OiBjYWxjKDUwJSAtIG1pbig1MCUsIDQwMHB4KSk7IC8qIGNlbnRlciBlbGVtZW50ICovXG59XG4vKiBQcm9qZWN0cyBIb21lIFNjcmVlbiBJdHNlbGYgKi9cbiNjb250ZW50SG9tZSB7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEyMXB4O1xuICBmb250LXNpemU6IG1pbig5MnB4LCAxMHZ3KTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgbWFyZ2luLXRvcDogMzBweDtcbiAgbWFyZ2luLWJvdHRvbTogMzBweDtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNkNGQ0ZDg7XG4gIGdyaWQtcm93OiAxO1xufVxuLyogQnV0dG9uIHRvIGFkZCBQcm9qZWN0cyBvbiBIb21lIFNjcmVlbiAqL1xuI2hvbWVBZGRQcm9qZWN0QnRuIHtcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XG4gIGJvcmRlci1zdHlsZTogc29saWQ7XG4gIGJvcmRlci1jb2xvcjogI2ZmZmZmZjtcbiAgY29sb3I6ICMxMTE7XG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gIGhlaWdodDogNDBweDtcbn1cbiNob21lQWRkUHJvamVjdEJ0bjpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNkNGQ0ZDg7XG4gIHRyYW5zaXRpb246IDAuMnM7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFFQTtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsZUFBZTtFQUNmLFVBQVU7RUFDVixTQUFTO0FBQ1g7QUFDQSxt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QUEyQjtFQUMzQix5Q0FBeUMsRUFBRSxtQkFBbUI7QUFDaEU7QUFDQSxnQ0FBZ0M7QUFDaEM7RUFDRSxXQUFXO0VBQ1gsYUFBYTtFQUNiLDBCQUEwQjtFQUMxQixhQUFhO0VBQ2IsbUJBQW1CO0VBQ25CLGdCQUFnQjtFQUNoQixtQkFBbUI7RUFDbkIsZ0NBQWdDO0VBQ2hDLFdBQVc7QUFDYjtBQUNBLDBDQUEwQztBQUMxQztFQUNFLGlCQUFpQjtFQUNqQix5QkFBeUI7RUFDekIsbUJBQW1CO0VBQ25CLHFCQUFxQjtFQUNyQixXQUFXO0VBQ1gsbUJBQW1CO0VBQ25CLFlBQVk7QUFDZDtBQUNBO0VBQ0UseUJBQXlCO0VBQ3pCLGdCQUFnQjtFQUNoQixlQUFlO0FBQ2pCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBpbXBvcnQgdXJsKFxcXCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PUJlYmFzK05ldWUmZmFtaWx5PUluZGllK0Zsb3dlciZmYW1pbHk9U2lnbmlrYSZkaXNwbGF5PXN3YXBcXFwiKTtcXG5cXG5ib2R5IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgZmxleC13cmFwOiB3cmFwO1xcbiAgcGFkZGluZzogMDtcXG4gIG1hcmdpbjogMDtcXG59XFxuLypIYW1idXJnZXIgU3dpdGNoKi9cXG5bcm9sZT1cXFwic3dpdGNoXFxcIl1bYXJpYS1jaGVja2VkPVxcXCJmYWxzZVxcXCJdIHtcXG4gIGJhY2tncm91bmQ6IHJnYigwLCAyNTUsIDApO1xcbiAgY29sb3I6ICNlZWY7XFxufVxcbltyb2xlPVxcXCJzd2l0Y2hcXFwiXVthcmlhLWNoZWNrZWQ9XFxcInRydWVcXFwiXSB7XFxuICBiYWNrZ3JvdW5kOiByZ2IoMjU1LCAwLCAwKTtcXG4gIGNvbG9yOiAjZWVmO1xcbn1cXG4vKi0tLS0tLS0tLS0tLS0tLS0tKi9cXG5cXG4vKiBUaGUgbmF2QmFyIG1lbnUgKi9cXG4jbmF2QmFyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KFxcbiAgICB0byBsZWZ0LFxcbiAgICB2aW9sZXQsXFxuICAgIGluZGlnbyxcXG4gICAgIzI4NTBmZixcXG4gICAgZ3JlZW4sXFxuICAgIHllbGxvdyxcXG4gICAgb3JhbmdlLFxcbiAgICByZWRcXG4gICk7XFxuICBwb3NpdGlvbjogZml4ZWQ7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogNXZoO1xcbiAgbWluLWhlaWdodDogbWluLWNvbnRlbnQ7XFxufVxcbi8qLS0tLS0tLS0tLS0tLS0tLS0tKi9cXG5cXG4vKiBUaGUgU2lkZWJhciBJbmJveCAqL1xcbiNzaWRlQmFySW5ib3gge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XFxuICBmb250LWZhbWlseTogXFxcIlNpZ25pa2FcXFwiO1xcbiAgLyogYmFja2dyb3VuZC1pbWFnZTogbGluZWFyLWdyYWRpZW50KFxcbiAgICB0byBsZWZ0LFxcbiAgICB2aW9sZXQsXFxuICAgIGluZGlnbyxcXG4gICAgIzI4NTBmZixcXG4gICAgZ3JlZW4sXFxuICAgIHllbGxvdyxcXG4gICAgb3JhbmdlLFxcbiAgICByZWRcXG4gICk7XFxuICBiYWNrZ3JvdW5kLWNsaXA6IHRleHQ7XFxuICAtd2Via2l0LWJhY2tncm91bmQtY2xpcDogdGV4dDtcXG4gIC13ZWJraXQtdGV4dC1maWxsLWNvbG9yOiB0cmFuc3BhcmVudDsqL1xcbiAgY29sb3I6IHdoaXRlO1xcbiAgZm9udC1zaXplOiAyZW07XFxuICBwYWRkaW5nLWxlZnQ6IDUlO1xcbiAgbWFyZ2luLWJvdHRvbTogMzBweDsgLyogUGxhY2UgY29udGVudCA2MHB4IGZyb20gdGhlIHRvcCAqL1xcbiAgbWFyZ2luLXRvcDogMzBweDtcXG59XFxuLyogVGhlIHNpZGViYXIgbWVudSAqL1xcbi5zaWRlYmFyIHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiU2lnbmlrYVxcXCI7XFxuICBoZWlnaHQ6IDEwMCU7IC8qIDkwJSBGdWxsLWhlaWdodCAqL1xcbiAgd2lkdGg6IDA7IC8qIDAgd2lkdGggLSBjaGFuZ2UgdGhpcyB3aXRoIEphdmFTY3JpcHQgKi9cXG4gIHBvc2l0aW9uOiBmaXhlZDsgLyogU3RheSBpbiBwbGFjZSAqL1xcbiAgei1pbmRleDogMTsgLyogU3RheSBvbiB0b3AgKi9cXG4gIHRvcDogNXZoO1xcbiAgbGVmdDogMDtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwZjE3MmE7IC8qIEJsdWUqL1xcbiAgb3ZlcmZsb3cteDogaGlkZGVuOyAvKiBEaXNhYmxlIGhvcml6b250YWwgc2Nyb2xsICovXFxuICB0cmFuc2l0aW9uOiAwLjVzOyAvKiAwLjUgc2Vjb25kIHRyYW5zaXRpb24gZWZmZWN0IHRvIHNsaWRlIGluIHRoZSBzaWRlYmFyICovXFxufVxcbi8qIENvbGxhcHNlIENsYXNzZXMgZm9yIFNpZGViYXIgYW5kIENvbnRlbnQgKi9cXG4uc2lkZWJhck9wZW4ge1xcbiAgd2lkdGg6IDI1MHB4O1xcbn1cXG4vKiBPbmx5IFB1c2ggQ29udGVudCBJZiBTY3JlZW4gSXMgQ2VydGFpbiBTaXplICovXFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1pbi13aWR0aDogNDUwcHgpIHtcXG4gIC5jb250ZW50UHVzaGVkIHtcXG4gICAgbWFyZ2luLWxlZnQ6IDI1MHB4O1xcbiAgfVxcbn1cXG4ucHJvamVjdHNPcGVuIHtcXG4gIG1heC1oZWlnaHQ6IDE0NDBweCAhaW1wb3J0YW50O1xcbn1cXG4vKiBUaGUgU2lkZWJhciBQcm9qZWN0IENvbnRhaW5lciovXFxuI3Byb2plY3RzQ29udGFpbmVyIHtcXG4gIC8qICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTgwZGVnLCAjZmYwMDY2LCAjMjg1MGZmKTtcXG4gIGJhY2tncm91bmQtY2xpcDogdGV4dDtcXG4gIC13ZWJraXQtYmFja2dyb3VuZC1jbGlwOiB0ZXh0O1xcbiAgLXdlYmtpdC10ZXh0LWZpbGwtY29sb3I6IHRyYW5zcGFyZW50O1xcbiAgKi9cXG4gIG1heC1oZWlnaHQ6IDBweDtcXG4gIG92ZXJmbG93OiBoaWRkZW47XFxuICB0cmFuc2l0aW9uOiBtYXgtaGVpZ2h0IDAuM3MgZWFzZTtcXG59XFxuLyogVGhlIFNpZGViYXIgUHJvamVjdCBMYWJlbCovXFxuI3Byb2plY3RMYWJlbENvbnRhaW5lciB7XFxuICBoZWlnaHQ6IGF1dG87XFxuICBjb2xvcjogd2hpdGU7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZm9udC1zaXplOiAyZW07XFxuICBwYWRkaW5nLWxlZnQ6IDUlO1xcbiAgYmFja2dyb3VuZDogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQoMTgwZGVnLCAjZmYwMDAwLCAjODQwMGZmKTtcXG4gIC13ZWJraXQtYmFja2dyb3VuZC1jbGlwOiB0ZXh0O1xcbiAgYmFja2dyb3VuZC1jbGlwOiB0ZXh0O1xcbiAgLXdlYmtpdC10ZXh0LWZpbGwtY29sb3I6IHRyYW5zcGFyZW50O1xcbn1cXG4jcHJvamVjdExhYmVsQ29udGFpbmVyID4gOmZpcnN0LWNoaWxkOmhvdmVyLFxcbiNzaWRiYXJCdXR0b25Db250YWluZXIgPiA6aG92ZXIsXFxuI3Byb2plY3RzQ29udGFpbmVyID4gOmhvdmVyLFxcbiNzaWRlQmFySW5ib3g6aG92ZXIge1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgb3BhY2l0eTogMC41O1xcbn1cXG4vKiBUaGUgU2lkZWJhciBQcm9qZWN0IEJ1dHRvbnMqL1xcbiNzaWRiYXJCdXR0b25Db250YWluZXIge1xcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XFxuICBtYXJnaW4tcmlnaHQ6IDEwJTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBnYXA6IDIwJTtcXG59XFxuLyogVGhlIHNpZGViYXIgbGlua3MgKi9cXG4uc2lkZWJhciBhIHtcXG4gIHBhZGRpbmc6IDhweCA4cHggOHB4IDMycHg7XFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICBmb250LXNpemU6IDI1cHg7XFxuICBjb2xvcjogI2ZmZmZmZjtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgdHJhbnNpdGlvbjogMC4zcztcXG4gIHdpZHRoOiA4MCU7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuLyogU2FtZSBhcyBjb2xvciBjaXJjbGUgaW4gcHJvamVjdEZvcm0uY3NzIGp1c3Qgd2l0aG91dCBtYXJnaW4tbGVmdCAqL1xcbi5jb2xvckNpcmNsZS1QIHtcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIGhlaWdodDogMzBweDtcXG4gIHdpZHRoOiAzMHB4O1xcbiAgYm9yZGVyLXJhZGl1czogMzYwcHg7XFxuICBtYXJnaW4tcmlnaHQ6IDIwcHg7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBjb2xvcjogIzExMTtcXG59XFxuLmNvbG9yQ2lyY2xlLUluYm94IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBoZWlnaHQ6IDQwcHg7XFxuICB3aWR0aDogNDBweDtcXG4gIGJvcmRlci1yYWRpdXM6IDM2MHB4O1xcbiAgbWFyZ2luLXJpZ2h0OiAyMHB4O1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgY29sb3I6ICMxMTE7XFxufVxcbi8qIFdoZW4geW91IG1vdXNlIG92ZXIgdGhlIG5hdmlnYXRpb24gbGlua3MsIGNoYW5nZSB0aGVpciBjb2xvciAqL1xcbi5zaWRlYmFyIGE6aG92ZXIge1xcbiAgY29sb3I6ICNmMWYxZjE7XFxufVxcblxcbi8qIFBvc2l0aW9uIGFuZCBzdHlsZSB0aGUgY2xvc2UgYnV0dG9uICh0b3AgcmlnaHQgY29ybmVyKSAqL1xcbi5zaWRlYmFyIC5jbG9zZWJ0biB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IDA7XFxuICByaWdodDogMjVweDtcXG4gIGZvbnQtc2l6ZTogMzZweDtcXG4gIG1hcmdpbi1sZWZ0OiA1MHB4O1xcbn1cXG5cXG4vKiBUaGUgYnV0dG9uIHVzZWQgdG8gb3BlbiB0aGUgc2lkZWJhciAqL1xcbi5vcGVuQnRuIHtcXG4gIGZvbnQtc2l6ZTogMjBweDtcXG4gIGhlaWdodDogMTAwJTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMxMTE7XFxuICBjb2xvcjogd2hpdGU7XFxuICBwYWRkaW5nLWxlZnQ6IDIwcHg7XFxuICBwYWRkaW5nLXJpZ2h0OiAyMHB4O1xcbiAgZm9udC1zaXplOiAzdmg7XFxuICBib3JkZXI6IG5vbmU7XFxufVxcblxcbi5vcGVuQnRuOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICM0NDQ7XFxufVxcblxcbi8qIE9uIHNtYWxsZXIgc2NyZWVucywgd2hlcmUgaGVpZ2h0IGlzIGxlc3MgdGhhbiA0NTBweCwgY2hhbmdlIHRoZSBzdHlsZSBvZiB0aGUgc2lkZW5hdiAobGVzcyBwYWRkaW5nIGFuZCBhIHNtYWxsZXIgZm9udCBzaXplKSAqL1xcbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtaGVpZ2h0OiA0NTBweCkge1xcbiAgLnNpZGViYXIge1xcbiAgICBwYWRkaW5nLXRvcDogMTVweDtcXG4gIH1cXG4gIC5zaWRlYmFyIGEge1xcbiAgICBmb250LXNpemU6IDE4cHg7XFxuICB9XFxufVxcblxcbi8qIFN0eWxlIHBhZ2UgY29udGVudCAtIHVzZSB0aGlzIGlmIHlvdSB3YW50IHRvIHB1c2ggdGhlIHBhZ2UgY29udGVudCB0byB0aGUgcmlnaHQgd2hlbiB5b3Ugb3BlbiB0aGUgc2lkZSBuYXZpZ2F0aW9uICovXFxuI2NvbnRlbnQge1xcbiAgZm9udC1mYW1pbHk6IFxcXCJTaWduaWthXFxcIjtcXG4gIHRyYW5zaXRpb246IG1hcmdpbi1sZWZ0IDAuNXM7IC8qIElmIHlvdSB3YW50IGEgdHJhbnNpdGlvbiBlZmZlY3QgKi9cXG4gIHBhZGRpbmc6IDV2aCAwcHggMHB4IDBweDtcXG4gIC8qIGhlaWdodDogMjAwdmg7Ki9cXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogYXV0bztcXG4gIG1heC13aWR0aDogbWluKDEwMCUsIDgwMHB4KTtcXG4gIHBhZGRpbmctbGVmdDogY2FsYyg1MCUgLSBtaW4oNTAlLCA0MDBweCkpOyAvKiBjZW50ZXIgZWxlbWVudCAqL1xcbn1cXG4vKiBQcm9qZWN0cyBIb21lIFNjcmVlbiBJdHNlbGYgKi9cXG4jY29udGVudEhvbWUge1xcbiAgd2lkdGg6IDEwMCU7XFxuICBoZWlnaHQ6IDEyMXB4O1xcbiAgZm9udC1zaXplOiBtaW4oOTJweCwgMTB2dyk7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIG1hcmdpbi10b3A6IDMwcHg7XFxuICBtYXJnaW4tYm90dG9tOiAzMHB4O1xcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNkNGQ0ZDg7XFxuICBncmlkLXJvdzogMTtcXG59XFxuLyogQnV0dG9uIHRvIGFkZCBQcm9qZWN0cyBvbiBIb21lIFNjcmVlbiAqL1xcbiNob21lQWRkUHJvamVjdEJ0biB7XFxuICBtYXJnaW4tbGVmdDogYXV0bztcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XFxuICBib3JkZXItc3R5bGU6IHNvbGlkO1xcbiAgYm9yZGVyLWNvbG9yOiAjZmZmZmZmO1xcbiAgY29sb3I6ICMxMTE7XFxuICBib3JkZXItcmFkaXVzOiAxMHB4O1xcbiAgaGVpZ2h0OiA0MHB4O1xcbn1cXG4jaG9tZUFkZFByb2plY3RCdG46aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Q0ZDRkODtcXG4gIHRyYW5zaXRpb246IDAuMnM7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCJAaW1wb3J0IHVybChodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PUJlYmFzK05ldWUmZmFtaWx5PUluZGllK0Zsb3dlciZmYW1pbHk9U2lnbmlrYSZkaXNwbGF5PXN3YXApO1wiXSk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYC8qIFRoZSBCYWNrZ3JvdW5kIEZvciBUaGUgSW5wdXQgRmllbGQgKi9cbiN0YXNrQmFja2dyb3VuZCB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgaGVpZ2h0OiAxMDB2aDtcbiAgd2lkdGg6IDEwMHZ3O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMCwgMCwgMCwgMC41KTtcbiAgei1pbmRleDogNTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGZvbnQtZmFtaWx5OiBcIlNpZ25pa2FcIjtcbn1cbi8qIFdoZXJlIFRoaW5ncyBhcmUgSW5wdXRlZCAqL1xuI3Rhc2tVc2VySW5wdXQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBoZWlnaHQ6IG1pbig4MCUsIDQwMHB4KTtcbiAgbWF4LXdpZHRoOiBtaW4oODAlLCA2MDBweCk7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmYWZhZmE7XG4gIGJvcmRlci1yYWRpdXM6IDIwcHg7XG4gIHBhZGRpbmctdG9wOiAxMHB4O1xuICBwYWRkaW5nLWxlZnQ6IDQwcHg7XG4gIHBhZGRpbmctcmlnaHQ6IDQwcHg7XG4gIHJvdy1nYXA6IDIwcHg7XG4gIHRyYW5zaXRpb246IHBhZGRpbmcgMC4zcyBlYXNlO1xufVxuLyogVGFzayBGb3JtICovXG4jdGFza0Zvcm0ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiAxMDAlO1xuICByb3ctZ2FwOiAyMHB4O1xufVxuLyogVGFzayBOYW1lIEZpZWxkICovXG4jdGFza05hbWUge1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiA2MHB4O1xuICBhbGlnbi1zZWxmOiBjZW50ZXI7XG4gIGJvcmRlcjogbm9uZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZhZmFmYTtcbiAgZm9udC1zaXplOiBtaW4oMzZweCwgMTB2dyk7XG4gIHBhZGRpbmc6IDA7XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xufVxuLkludmFsaWQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmNhNWE1ICFpbXBvcnRhbnQ7XG59XG5cbiN0YXNrTmFtZTpmb2N1cy12aXNpYmxlLFxuI3Rhc2tEZXNjcmlwdGlvbjpmb2N1cy12aXNpYmxlIHtcbiAgb3V0bGluZTogbm9uZTtcbn1cbi8qIFRhc2sgTmFtZSBGaWVsZCAqL1xuI3Rhc2tEZXNjcmlwdGlvbiB7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IG1pbig1MCUsIDYwMHB4KTtcbiAgZm9udC1zaXplOiBtaW4oMjRweCwgMTB2dyk7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmYWZhZmE7XG4gIGJvcmRlcjogbm9uZTtcbiAgcGFkZGluZzogMDtcbiAgcmVzaXplOiBub25lO1xuICBjb2xvcjogIzUyNTI1Yjtcbn1cbi8qIEJ1dHRvbnMgQ29udGFpbmVyKi9cbiN0YXNrT3B0aW9uc0NvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBjb2x1bW4tZ2FwOiAyMHB4O1xuICBtYXJnaW4tdG9wOiBhdXRvO1xuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xufVxuI3Rhc2tPcHRpb25zQ29udGFpbmVyID4gYnV0dG9uIHtcbiAgd2lkdGg6IDEwMHB4O1xuICBoZWlnaHQ6IDM1cHg7XG4gIGJvcmRlci1yYWRpdXM6IDEwcHg7XG59XG5cbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDYwMHB4KSB7XG4gIC8qIFdoZXJlIFRoaW5ncyBhcmUgSW5wdXRlZCAqL1xuICAjdGFza1VzZXJJbnB1dCB7XG4gICAgYm9yZGVyLXJhZGl1czogMjBweDtcbiAgICBwYWRkaW5nLXRvcDogNXB4O1xuICAgIHBhZGRpbmctbGVmdDogMjBweDtcbiAgICBwYWRkaW5nLXJpZ2h0OiAyMHB4O1xuICB9XG4gICN0YXNrT3B0aW9uc0NvbnRhaW5lciB7XG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XG4gICAgcm93LWdhcDogMTBweDtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XG4gICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnIgMWZyO1xuICB9XG59XG5cbiNzZWxlY3RQcmlvcml0eSB7XG4gIC8qIFJlc2V0IFNlbGVjdCAqL1xuICBvdXRsaW5lOiAwO1xuICBib3JkZXI6IDA7XG4gIGJveC1zaGFkb3c6IG5vbmU7XG4gIC8qIFBlcnNvbmFsaXplICovXG4gIHBhZGRpbmc6IDAgMWVtO1xuICBjb2xvcjogI2ZmZmZmZjtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzBmMTcyYTtcbiAgYmFja2dyb3VuZC1pbWFnZTogbm9uZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuLyogQnV0dG9ucyAqL1xuLmNhbmNlbEJ0bixcbiNkdWVEYXRlIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y0ZjRmNTtcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgYm9yZGVyLWNvbG9yOiAjZDRkNGQ4O1xufVxuLnNhdmVCdG4ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmNhNWE1O1xuICBib3JkZXItc3R5bGU6IHNvbGlkO1xuICBib3JkZXItY29sb3I6ICNlZjQ0NDQ7XG4gIGNvbG9yOiAjMTExO1xufVxuLnNhdmVCdG46ZGlzYWJsZWQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmJkMGQwO1xuICBib3JkZXItY29sb3I6ICNmYmQwZDA7XG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XG59XG4uY2FuY2VsQnRuOmhvdmVyLFxuLnNhdmVCdG46ZW5hYmxlZDpob3ZlciB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cbi5jYW5jZWxCdG46aG92ZXIsXG4jZHVlRGF0ZTpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNkNGQ0ZDg7XG4gIHRyYW5zaXRpb246IDAuMnM7XG59XG4uc2F2ZUJ0bjplbmFibGVkOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2VmNDQ0NDtcbiAgdHJhbnNpdGlvbjogMC4ycztcbn1cbmAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3Rhc2tGb3JtLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFDQSx1Q0FBdUM7QUFDdkM7RUFDRSxlQUFlO0VBQ2YsYUFBYTtFQUNiLFlBQVk7RUFDWixtQ0FBbUM7RUFDbkMsVUFBVTtFQUNWLGFBQWE7RUFDYixtQkFBbUI7RUFDbkIsdUJBQXVCO0VBQ3ZCLHNCQUFzQjtBQUN4QjtBQUNBLDZCQUE2QjtBQUM3QjtFQUNFLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsdUJBQXVCO0VBQ3ZCLDBCQUEwQjtFQUMxQix5QkFBeUI7RUFDekIsbUJBQW1CO0VBQ25CLGlCQUFpQjtFQUNqQixrQkFBa0I7RUFDbEIsbUJBQW1CO0VBQ25CLGFBQWE7RUFDYiw2QkFBNkI7QUFDL0I7QUFDQSxjQUFjO0FBQ2Q7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLG1CQUFtQjtFQUNuQixZQUFZO0VBQ1osV0FBVztFQUNYLGFBQWE7QUFDZjtBQUNBLG9CQUFvQjtBQUNwQjtFQUNFLFdBQVc7RUFDWCxZQUFZO0VBQ1osa0JBQWtCO0VBQ2xCLFlBQVk7RUFDWix5QkFBeUI7RUFDekIsMEJBQTBCO0VBQzFCLFVBQVU7RUFDVixpQkFBaUI7QUFDbkI7QUFDQTtFQUNFLG9DQUFvQztBQUN0Qzs7QUFFQTs7RUFFRSxhQUFhO0FBQ2Y7QUFDQSxvQkFBb0I7QUFDcEI7RUFDRSxXQUFXO0VBQ1gsdUJBQXVCO0VBQ3ZCLDBCQUEwQjtFQUMxQix5QkFBeUI7RUFDekIsWUFBWTtFQUNaLFVBQVU7RUFDVixZQUFZO0VBQ1osY0FBYztBQUNoQjtBQUNBLHFCQUFxQjtBQUNyQjtFQUNFLGFBQWE7RUFDYix1QkFBdUI7RUFDdkIsZ0JBQWdCO0VBQ2hCLGdCQUFnQjtFQUNoQixtQkFBbUI7QUFDckI7QUFDQTtFQUNFLFlBQVk7RUFDWixZQUFZO0VBQ1osbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsNkJBQTZCO0VBQzdCO0lBQ0UsbUJBQW1CO0lBQ25CLGdCQUFnQjtJQUNoQixrQkFBa0I7SUFDbEIsbUJBQW1CO0VBQ3JCO0VBQ0E7SUFDRSxhQUFhO0lBQ2IscUJBQXFCO0lBQ3JCLGFBQWE7SUFDYiw4QkFBOEI7SUFDOUIsMkJBQTJCO0VBQzdCO0FBQ0Y7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIsVUFBVTtFQUNWLFNBQVM7RUFDVCxnQkFBZ0I7RUFDaEIsZ0JBQWdCO0VBQ2hCLGNBQWM7RUFDZCxjQUFjO0VBQ2QseUJBQXlCO0VBQ3pCLHNCQUFzQjtFQUN0QixlQUFlO0FBQ2pCO0FBQ0EsWUFBWTtBQUNaOztFQUVFLHlCQUF5QjtFQUN6QixtQkFBbUI7RUFDbkIscUJBQXFCO0FBQ3ZCO0FBQ0E7RUFDRSx5QkFBeUI7RUFDekIsbUJBQW1CO0VBQ25CLHFCQUFxQjtFQUNyQixXQUFXO0FBQ2I7QUFDQTtFQUNFLHlCQUF5QjtFQUN6QixxQkFBcUI7RUFDckIsbUJBQW1CO0FBQ3JCO0FBQ0E7O0VBRUUsZUFBZTtBQUNqQjtBQUNBOztFQUVFLHlCQUF5QjtFQUN6QixnQkFBZ0I7QUFDbEI7QUFDQTtFQUNFLHlCQUF5QjtFQUN6QixnQkFBZ0I7QUFDbEJcIixcInNvdXJjZXNDb250ZW50XCI6W1wiQGltcG9ydCB1cmwoXFxcImh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9QmViYXMrTmV1ZSZmYW1pbHk9SW5kaWUrRmxvd2VyJmZhbWlseT1TaWduaWthJmRpc3BsYXk9c3dhcFxcXCIpO1xcbi8qIFRoZSBCYWNrZ3JvdW5kIEZvciBUaGUgSW5wdXQgRmllbGQgKi9cXG4jdGFza0JhY2tncm91bmQge1xcbiAgcG9zaXRpb246IGZpeGVkO1xcbiAgaGVpZ2h0OiAxMDB2aDtcXG4gIHdpZHRoOiAxMDB2dztcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigwLCAwLCAwLCAwLjUpO1xcbiAgei1pbmRleDogNTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBmb250LWZhbWlseTogXFxcIlNpZ25pa2FcXFwiO1xcbn1cXG4vKiBXaGVyZSBUaGluZ3MgYXJlIElucHV0ZWQgKi9cXG4jdGFza1VzZXJJbnB1dCB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIGhlaWdodDogbWluKDgwJSwgNDAwcHgpO1xcbiAgbWF4LXdpZHRoOiBtaW4oODAlLCA2MDBweCk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmFmYWZhO1xcbiAgYm9yZGVyLXJhZGl1czogMjBweDtcXG4gIHBhZGRpbmctdG9wOiAxMHB4O1xcbiAgcGFkZGluZy1sZWZ0OiA0MHB4O1xcbiAgcGFkZGluZy1yaWdodDogNDBweDtcXG4gIHJvdy1nYXA6IDIwcHg7XFxuICB0cmFuc2l0aW9uOiBwYWRkaW5nIDAuM3MgZWFzZTtcXG59XFxuLyogVGFzayBGb3JtICovXFxuI3Rhc2tGb3JtIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGhlaWdodDogMTAwJTtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgcm93LWdhcDogMjBweDtcXG59XFxuLyogVGFzayBOYW1lIEZpZWxkICovXFxuI3Rhc2tOYW1lIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiA2MHB4O1xcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xcbiAgYm9yZGVyOiBub25lO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZhZmFmYTtcXG4gIGZvbnQtc2l6ZTogbWluKDM2cHgsIDEwdncpO1xcbiAgcGFkZGluZzogMDtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbn1cXG4uSW52YWxpZCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmNhNWE1ICFpbXBvcnRhbnQ7XFxufVxcblxcbiN0YXNrTmFtZTpmb2N1cy12aXNpYmxlLFxcbiN0YXNrRGVzY3JpcHRpb246Zm9jdXMtdmlzaWJsZSB7XFxuICBvdXRsaW5lOiBub25lO1xcbn1cXG4vKiBUYXNrIE5hbWUgRmllbGQgKi9cXG4jdGFza0Rlc2NyaXB0aW9uIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiBtaW4oNTAlLCA2MDBweCk7XFxuICBmb250LXNpemU6IG1pbigyNHB4LCAxMHZ3KTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmYWZhZmE7XFxuICBib3JkZXI6IG5vbmU7XFxuICBwYWRkaW5nOiAwO1xcbiAgcmVzaXplOiBub25lO1xcbiAgY29sb3I6ICM1MjUyNWI7XFxufVxcbi8qIEJ1dHRvbnMgQ29udGFpbmVyKi9cXG4jdGFza09wdGlvbnNDb250YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xcbiAgY29sdW1uLWdhcDogMjBweDtcXG4gIG1hcmdpbi10b3A6IGF1dG87XFxuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xcbn1cXG4jdGFza09wdGlvbnNDb250YWluZXIgPiBidXR0b24ge1xcbiAgd2lkdGg6IDEwMHB4O1xcbiAgaGVpZ2h0OiAzNXB4O1xcbiAgYm9yZGVyLXJhZGl1czogMTBweDtcXG59XFxuXFxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNjAwcHgpIHtcXG4gIC8qIFdoZXJlIFRoaW5ncyBhcmUgSW5wdXRlZCAqL1xcbiAgI3Rhc2tVc2VySW5wdXQge1xcbiAgICBib3JkZXItcmFkaXVzOiAyMHB4O1xcbiAgICBwYWRkaW5nLXRvcDogNXB4O1xcbiAgICBwYWRkaW5nLWxlZnQ6IDIwcHg7XFxuICAgIHBhZGRpbmctcmlnaHQ6IDIwcHg7XFxuICB9XFxuICAjdGFza09wdGlvbnNDb250YWluZXIge1xcbiAgICBkaXNwbGF5OiBncmlkO1xcbiAgICBqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XFxuICAgIHJvdy1nYXA6IDEwcHg7XFxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcXG4gICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnIgMWZyO1xcbiAgfVxcbn1cXG5cXG4jc2VsZWN0UHJpb3JpdHkge1xcbiAgLyogUmVzZXQgU2VsZWN0ICovXFxuICBvdXRsaW5lOiAwO1xcbiAgYm9yZGVyOiAwO1xcbiAgYm94LXNoYWRvdzogbm9uZTtcXG4gIC8qIFBlcnNvbmFsaXplICovXFxuICBwYWRkaW5nOiAwIDFlbTtcXG4gIGNvbG9yOiAjZmZmZmZmO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzBmMTcyYTtcXG4gIGJhY2tncm91bmQtaW1hZ2U6IG5vbmU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbi8qIEJ1dHRvbnMgKi9cXG4uY2FuY2VsQnRuLFxcbiNkdWVEYXRlIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmNGY0ZjU7XFxuICBib3JkZXItc3R5bGU6IHNvbGlkO1xcbiAgYm9yZGVyLWNvbG9yOiAjZDRkNGQ4O1xcbn1cXG4uc2F2ZUJ0biB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmNhNWE1O1xcbiAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcXG4gIGJvcmRlci1jb2xvcjogI2VmNDQ0NDtcXG4gIGNvbG9yOiAjMTExO1xcbn1cXG4uc2F2ZUJ0bjpkaXNhYmxlZCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmJkMGQwO1xcbiAgYm9yZGVyLWNvbG9yOiAjZmJkMGQwO1xcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcXG59XFxuLmNhbmNlbEJ0bjpob3ZlcixcXG4uc2F2ZUJ0bjplbmFibGVkOmhvdmVyIHtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuLmNhbmNlbEJ0bjpob3ZlcixcXG4jZHVlRGF0ZTpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZDRkNGQ4O1xcbiAgdHJhbnNpdGlvbjogMC4ycztcXG59XFxuLnNhdmVCdG46ZW5hYmxlZDpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWY0NDQ0O1xcbiAgdHJhbnNpdGlvbjogMC4ycztcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBhZGRMZWFkaW5nWmVyb3MobnVtYmVyLCB0YXJnZXRMZW5ndGgpIHtcbiAgdmFyIHNpZ24gPSBudW1iZXIgPCAwID8gJy0nIDogJyc7XG4gIHZhciBvdXRwdXQgPSBNYXRoLmFicyhudW1iZXIpLnRvU3RyaW5nKCk7XG4gIHdoaWxlIChvdXRwdXQubGVuZ3RoIDwgdGFyZ2V0TGVuZ3RoKSB7XG4gICAgb3V0cHV0ID0gJzAnICsgb3V0cHV0O1xuICB9XG4gIHJldHVybiBzaWduICsgb3V0cHV0O1xufSIsImltcG9ydCBkZWZhdWx0TG9jYWxlIGZyb20gXCIuLi8uLi9sb2NhbGUvZW4tVVMvaW5kZXguanNcIjtcbmV4cG9ydCBkZWZhdWx0IGRlZmF1bHRMb2NhbGU7IiwidmFyIGRlZmF1bHRPcHRpb25zID0ge307XG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdE9wdGlvbnMoKSB7XG4gIHJldHVybiBkZWZhdWx0T3B0aW9ucztcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZXREZWZhdWx0T3B0aW9ucyhuZXdPcHRpb25zKSB7XG4gIGRlZmF1bHRPcHRpb25zID0gbmV3T3B0aW9ucztcbn0iLCJpbXBvcnQgZ2V0VVRDRGF5T2ZZZWFyIGZyb20gXCIuLi8uLi8uLi9fbGliL2dldFVUQ0RheU9mWWVhci9pbmRleC5qc1wiO1xuaW1wb3J0IGdldFVUQ0lTT1dlZWsgZnJvbSBcIi4uLy4uLy4uL19saWIvZ2V0VVRDSVNPV2Vlay9pbmRleC5qc1wiO1xuaW1wb3J0IGdldFVUQ0lTT1dlZWtZZWFyIGZyb20gXCIuLi8uLi8uLi9fbGliL2dldFVUQ0lTT1dlZWtZZWFyL2luZGV4LmpzXCI7XG5pbXBvcnQgZ2V0VVRDV2VlayBmcm9tIFwiLi4vLi4vLi4vX2xpYi9nZXRVVENXZWVrL2luZGV4LmpzXCI7XG5pbXBvcnQgZ2V0VVRDV2Vla1llYXIgZnJvbSBcIi4uLy4uLy4uL19saWIvZ2V0VVRDV2Vla1llYXIvaW5kZXguanNcIjtcbmltcG9ydCBhZGRMZWFkaW5nWmVyb3MgZnJvbSBcIi4uLy4uL2FkZExlYWRpbmdaZXJvcy9pbmRleC5qc1wiO1xuaW1wb3J0IGxpZ2h0Rm9ybWF0dGVycyBmcm9tIFwiLi4vbGlnaHRGb3JtYXR0ZXJzL2luZGV4LmpzXCI7XG52YXIgZGF5UGVyaW9kRW51bSA9IHtcbiAgYW06ICdhbScsXG4gIHBtOiAncG0nLFxuICBtaWRuaWdodDogJ21pZG5pZ2h0JyxcbiAgbm9vbjogJ25vb24nLFxuICBtb3JuaW5nOiAnbW9ybmluZycsXG4gIGFmdGVybm9vbjogJ2FmdGVybm9vbicsXG4gIGV2ZW5pbmc6ICdldmVuaW5nJyxcbiAgbmlnaHQ6ICduaWdodCdcbn07XG4vKlxuICogfCAgICAgfCBVbml0ICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgfCBVbml0ICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfC0tLS0tfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tfC0tLS0tfC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tfFxuICogfCAgYSAgfCBBTSwgUE0gICAgICAgICAgICAgICAgICAgICAgICAgfCAgQSogfCBNaWxsaXNlY29uZHMgaW4gZGF5ICAgICAgICAgICAgfFxuICogfCAgYiAgfCBBTSwgUE0sIG5vb24sIG1pZG5pZ2h0ICAgICAgICAgfCAgQiAgfCBGbGV4aWJsZSBkYXkgcGVyaW9kICAgICAgICAgICAgfFxuICogfCAgYyAgfCBTdGFuZC1hbG9uZSBsb2NhbCBkYXkgb2Ygd2VlayAgfCAgQyogfCBMb2NhbGl6ZWQgaG91ciB3LyBkYXkgcGVyaW9kICAgfFxuICogfCAgZCAgfCBEYXkgb2YgbW9udGggICAgICAgICAgICAgICAgICAgfCAgRCAgfCBEYXkgb2YgeWVhciAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgZSAgfCBMb2NhbCBkYXkgb2Ygd2VlayAgICAgICAgICAgICAgfCAgRSAgfCBEYXkgb2Ygd2VlayAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgZiAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgRiogfCBEYXkgb2Ygd2VlayBpbiBtb250aCAgICAgICAgICAgfFxuICogfCAgZyogfCBNb2RpZmllZCBKdWxpYW4gZGF5ICAgICAgICAgICAgfCAgRyAgfCBFcmEgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgaCAgfCBIb3VyIFsxLTEyXSAgICAgICAgICAgICAgICAgICAgfCAgSCAgfCBIb3VyIFswLTIzXSAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgaSEgfCBJU08gZGF5IG9mIHdlZWsgICAgICAgICAgICAgICAgfCAgSSEgfCBJU08gd2VlayBvZiB5ZWFyICAgICAgICAgICAgICAgfFxuICogfCAgaiogfCBMb2NhbGl6ZWQgaG91ciB3LyBkYXkgcGVyaW9kICAgfCAgSiogfCBMb2NhbGl6ZWQgaG91ciB3L28gZGF5IHBlcmlvZCAgfFxuICogfCAgayAgfCBIb3VyIFsxLTI0XSAgICAgICAgICAgICAgICAgICAgfCAgSyAgfCBIb3VyIFswLTExXSAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgbCogfCAoZGVwcmVjYXRlZCkgICAgICAgICAgICAgICAgICAgfCAgTCAgfCBTdGFuZC1hbG9uZSBtb250aCAgICAgICAgICAgICAgfFxuICogfCAgbSAgfCBNaW51dGUgICAgICAgICAgICAgICAgICAgICAgICAgfCAgTSAgfCBNb250aCAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgbiAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgTiAgfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgbyEgfCBPcmRpbmFsIG51bWJlciBtb2RpZmllciAgICAgICAgfCAgTyAgfCBUaW1lem9uZSAoR01UKSAgICAgICAgICAgICAgICAgfFxuICogfCAgcCEgfCBMb25nIGxvY2FsaXplZCB0aW1lICAgICAgICAgICAgfCAgUCEgfCBMb25nIGxvY2FsaXplZCBkYXRlICAgICAgICAgICAgfFxuICogfCAgcSAgfCBTdGFuZC1hbG9uZSBxdWFydGVyICAgICAgICAgICAgfCAgUSAgfCBRdWFydGVyICAgICAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgciogfCBSZWxhdGVkIEdyZWdvcmlhbiB5ZWFyICAgICAgICAgfCAgUiEgfCBJU08gd2Vlay1udW1iZXJpbmcgeWVhciAgICAgICAgfFxuICogfCAgcyAgfCBTZWNvbmQgICAgICAgICAgICAgICAgICAgICAgICAgfCAgUyAgfCBGcmFjdGlvbiBvZiBzZWNvbmQgICAgICAgICAgICAgfFxuICogfCAgdCEgfCBTZWNvbmRzIHRpbWVzdGFtcCAgICAgICAgICAgICAgfCAgVCEgfCBNaWxsaXNlY29uZHMgdGltZXN0YW1wICAgICAgICAgfFxuICogfCAgdSAgfCBFeHRlbmRlZCB5ZWFyICAgICAgICAgICAgICAgICAgfCAgVSogfCBDeWNsaWMgeWVhciAgICAgICAgICAgICAgICAgICAgfFxuICogfCAgdiogfCBUaW1lem9uZSAoZ2VuZXJpYyBub24tbG9jYXQuKSAgfCAgViogfCBUaW1lem9uZSAobG9jYXRpb24pICAgICAgICAgICAgfFxuICogfCAgdyAgfCBMb2NhbCB3ZWVrIG9mIHllYXIgICAgICAgICAgICAgfCAgVyogfCBXZWVrIG9mIG1vbnRoICAgICAgICAgICAgICAgICAgfFxuICogfCAgeCAgfCBUaW1lem9uZSAoSVNPLTg2MDEgdy9vIFopICAgICAgfCAgWCAgfCBUaW1lem9uZSAoSVNPLTg2MDEpICAgICAgICAgICAgfFxuICogfCAgeSAgfCBZZWFyIChhYnMpICAgICAgICAgICAgICAgICAgICAgfCAgWSAgfCBMb2NhbCB3ZWVrLW51bWJlcmluZyB5ZWFyICAgICAgfFxuICogfCAgeiAgfCBUaW1lem9uZSAoc3BlY2lmaWMgbm9uLWxvY2F0LikgfCAgWiogfCBUaW1lem9uZSAoYWxpYXNlcykgICAgICAgICAgICAgfFxuICpcbiAqIExldHRlcnMgbWFya2VkIGJ5ICogYXJlIG5vdCBpbXBsZW1lbnRlZCBidXQgcmVzZXJ2ZWQgYnkgVW5pY29kZSBzdGFuZGFyZC5cbiAqXG4gKiBMZXR0ZXJzIG1hcmtlZCBieSAhIGFyZSBub24tc3RhbmRhcmQsIGJ1dCBpbXBsZW1lbnRlZCBieSBkYXRlLWZuczpcbiAqIC0gYG9gIG1vZGlmaWVzIHRoZSBwcmV2aW91cyB0b2tlbiB0byB0dXJuIGl0IGludG8gYW4gb3JkaW5hbCAoc2VlIGBmb3JtYXRgIGRvY3MpXG4gKiAtIGBpYCBpcyBJU08gZGF5IG9mIHdlZWsuIEZvciBgaWAgYW5kIGBpaWAgaXMgcmV0dXJucyBudW1lcmljIElTTyB3ZWVrIGRheXMsXG4gKiAgIGkuZS4gNyBmb3IgU3VuZGF5LCAxIGZvciBNb25kYXksIGV0Yy5cbiAqIC0gYElgIGlzIElTTyB3ZWVrIG9mIHllYXIsIGFzIG9wcG9zZWQgdG8gYHdgIHdoaWNoIGlzIGxvY2FsIHdlZWsgb2YgeWVhci5cbiAqIC0gYFJgIGlzIElTTyB3ZWVrLW51bWJlcmluZyB5ZWFyLCBhcyBvcHBvc2VkIHRvIGBZYCB3aGljaCBpcyBsb2NhbCB3ZWVrLW51bWJlcmluZyB5ZWFyLlxuICogICBgUmAgaXMgc3VwcG9zZWQgdG8gYmUgdXNlZCBpbiBjb25qdW5jdGlvbiB3aXRoIGBJYCBhbmQgYGlgXG4gKiAgIGZvciB1bml2ZXJzYWwgSVNPIHdlZWstbnVtYmVyaW5nIGRhdGUsIHdoZXJlYXNcbiAqICAgYFlgIGlzIHN1cHBvc2VkIHRvIGJlIHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBgd2AgYW5kIGBlYFxuICogICBmb3Igd2Vlay1udW1iZXJpbmcgZGF0ZSBzcGVjaWZpYyB0byB0aGUgbG9jYWxlLlxuICogLSBgUGAgaXMgbG9uZyBsb2NhbGl6ZWQgZGF0ZSBmb3JtYXRcbiAqIC0gYHBgIGlzIGxvbmcgbG9jYWxpemVkIHRpbWUgZm9ybWF0XG4gKi9cblxudmFyIGZvcm1hdHRlcnMgPSB7XG4gIC8vIEVyYVxuICBHOiBmdW5jdGlvbiBHKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIHZhciBlcmEgPSBkYXRlLmdldFVUQ0Z1bGxZZWFyKCkgPiAwID8gMSA6IDA7XG4gICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgLy8gQUQsIEJDXG4gICAgICBjYXNlICdHJzpcbiAgICAgIGNhc2UgJ0dHJzpcbiAgICAgIGNhc2UgJ0dHRyc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5lcmEoZXJhLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCdcbiAgICAgICAgfSk7XG4gICAgICAvLyBBLCBCXG4gICAgICBjYXNlICdHR0dHRyc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5lcmEoZXJhLCB7XG4gICAgICAgICAgd2lkdGg6ICduYXJyb3cnXG4gICAgICAgIH0pO1xuICAgICAgLy8gQW5ubyBEb21pbmksIEJlZm9yZSBDaHJpc3RcbiAgICAgIGNhc2UgJ0dHR0cnOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmVyYShlcmEsIHtcbiAgICAgICAgICB3aWR0aDogJ3dpZGUnXG4gICAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgLy8gWWVhclxuICB5OiBmdW5jdGlvbiB5KGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIC8vIE9yZGluYWwgbnVtYmVyXG4gICAgaWYgKHRva2VuID09PSAneW8nKSB7XG4gICAgICB2YXIgc2lnbmVkWWVhciA9IGRhdGUuZ2V0VVRDRnVsbFllYXIoKTtcbiAgICAgIC8vIFJldHVybnMgMSBmb3IgMSBCQyAod2hpY2ggaXMgeWVhciAwIGluIEphdmFTY3JpcHQpXG4gICAgICB2YXIgeWVhciA9IHNpZ25lZFllYXIgPiAwID8gc2lnbmVkWWVhciA6IDEgLSBzaWduZWRZZWFyO1xuICAgICAgcmV0dXJuIGxvY2FsaXplLm9yZGluYWxOdW1iZXIoeWVhciwge1xuICAgICAgICB1bml0OiAneWVhcidcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbGlnaHRGb3JtYXR0ZXJzLnkoZGF0ZSwgdG9rZW4pO1xuICB9LFxuICAvLyBMb2NhbCB3ZWVrLW51bWJlcmluZyB5ZWFyXG4gIFk6IGZ1bmN0aW9uIFkoZGF0ZSwgdG9rZW4sIGxvY2FsaXplLCBvcHRpb25zKSB7XG4gICAgdmFyIHNpZ25lZFdlZWtZZWFyID0gZ2V0VVRDV2Vla1llYXIoZGF0ZSwgb3B0aW9ucyk7XG4gICAgLy8gUmV0dXJucyAxIGZvciAxIEJDICh3aGljaCBpcyB5ZWFyIDAgaW4gSmF2YVNjcmlwdClcbiAgICB2YXIgd2Vla1llYXIgPSBzaWduZWRXZWVrWWVhciA+IDAgPyBzaWduZWRXZWVrWWVhciA6IDEgLSBzaWduZWRXZWVrWWVhcjtcblxuICAgIC8vIFR3byBkaWdpdCB5ZWFyXG4gICAgaWYgKHRva2VuID09PSAnWVknKSB7XG4gICAgICB2YXIgdHdvRGlnaXRZZWFyID0gd2Vla1llYXIgJSAxMDA7XG4gICAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKHR3b0RpZ2l0WWVhciwgMik7XG4gICAgfVxuXG4gICAgLy8gT3JkaW5hbCBudW1iZXJcbiAgICBpZiAodG9rZW4gPT09ICdZbycpIHtcbiAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKHdlZWtZZWFyLCB7XG4gICAgICAgIHVuaXQ6ICd5ZWFyJ1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gUGFkZGluZ1xuICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3Mod2Vla1llYXIsIHRva2VuLmxlbmd0aCk7XG4gIH0sXG4gIC8vIElTTyB3ZWVrLW51bWJlcmluZyB5ZWFyXG4gIFI6IGZ1bmN0aW9uIFIoZGF0ZSwgdG9rZW4pIHtcbiAgICB2YXIgaXNvV2Vla1llYXIgPSBnZXRVVENJU09XZWVrWWVhcihkYXRlKTtcblxuICAgIC8vIFBhZGRpbmdcbiAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKGlzb1dlZWtZZWFyLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBFeHRlbmRlZCB5ZWFyLiBUaGlzIGlzIGEgc2luZ2xlIG51bWJlciBkZXNpZ25hdGluZyB0aGUgeWVhciBvZiB0aGlzIGNhbGVuZGFyIHN5c3RlbS5cbiAgLy8gVGhlIG1haW4gZGlmZmVyZW5jZSBiZXR3ZWVuIGB5YCBhbmQgYHVgIGxvY2FsaXplcnMgYXJlIEIuQy4geWVhcnM6XG4gIC8vIHwgWWVhciB8IGB5YCB8IGB1YCB8XG4gIC8vIHwtLS0tLS18LS0tLS18LS0tLS18XG4gIC8vIHwgQUMgMSB8ICAgMSB8ICAgMSB8XG4gIC8vIHwgQkMgMSB8ICAgMSB8ICAgMCB8XG4gIC8vIHwgQkMgMiB8ICAgMiB8ICAtMSB8XG4gIC8vIEFsc28gYHl5YCBhbHdheXMgcmV0dXJucyB0aGUgbGFzdCB0d28gZGlnaXRzIG9mIGEgeWVhcixcbiAgLy8gd2hpbGUgYHV1YCBwYWRzIHNpbmdsZSBkaWdpdCB5ZWFycyB0byAyIGNoYXJhY3RlcnMgYW5kIHJldHVybnMgb3RoZXIgeWVhcnMgdW5jaGFuZ2VkLlxuICB1OiBmdW5jdGlvbiB1KGRhdGUsIHRva2VuKSB7XG4gICAgdmFyIHllYXIgPSBkYXRlLmdldFVUQ0Z1bGxZZWFyKCk7XG4gICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyh5ZWFyLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBRdWFydGVyXG4gIFE6IGZ1bmN0aW9uIFEoZGF0ZSwgdG9rZW4sIGxvY2FsaXplKSB7XG4gICAgdmFyIHF1YXJ0ZXIgPSBNYXRoLmNlaWwoKGRhdGUuZ2V0VVRDTW9udGgoKSArIDEpIC8gMyk7XG4gICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgLy8gMSwgMiwgMywgNFxuICAgICAgY2FzZSAnUSc6XG4gICAgICAgIHJldHVybiBTdHJpbmcocXVhcnRlcik7XG4gICAgICAvLyAwMSwgMDIsIDAzLCAwNFxuICAgICAgY2FzZSAnUVEnOlxuICAgICAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKHF1YXJ0ZXIsIDIpO1xuICAgICAgLy8gMXN0LCAybmQsIDNyZCwgNHRoXG4gICAgICBjYXNlICdRbyc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKHF1YXJ0ZXIsIHtcbiAgICAgICAgICB1bml0OiAncXVhcnRlcidcbiAgICAgICAgfSk7XG4gICAgICAvLyBRMSwgUTIsIFEzLCBRNFxuICAgICAgY2FzZSAnUVFRJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLnF1YXJ0ZXIocXVhcnRlciwge1xuICAgICAgICAgIHdpZHRoOiAnYWJicmV2aWF0ZWQnLFxuICAgICAgICAgIGNvbnRleHQ6ICdmb3JtYXR0aW5nJ1xuICAgICAgICB9KTtcbiAgICAgIC8vIDEsIDIsIDMsIDQgKG5hcnJvdyBxdWFydGVyOyBjb3VsZCBiZSBub3QgbnVtZXJpY2FsKVxuICAgICAgY2FzZSAnUVFRUVEnOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUucXVhcnRlcihxdWFydGVyLCB7XG4gICAgICAgICAgd2lkdGg6ICduYXJyb3cnLFxuICAgICAgICAgIGNvbnRleHQ6ICdmb3JtYXR0aW5nJ1xuICAgICAgICB9KTtcbiAgICAgIC8vIDFzdCBxdWFydGVyLCAybmQgcXVhcnRlciwgLi4uXG4gICAgICBjYXNlICdRUVFRJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5xdWFydGVyKHF1YXJ0ZXIsIHtcbiAgICAgICAgICB3aWR0aDogJ3dpZGUnLFxuICAgICAgICAgIGNvbnRleHQ6ICdmb3JtYXR0aW5nJ1xuICAgICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIC8vIFN0YW5kLWFsb25lIHF1YXJ0ZXJcbiAgcTogZnVuY3Rpb24gcShkYXRlLCB0b2tlbiwgbG9jYWxpemUpIHtcbiAgICB2YXIgcXVhcnRlciA9IE1hdGguY2VpbCgoZGF0ZS5nZXRVVENNb250aCgpICsgMSkgLyAzKTtcbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAvLyAxLCAyLCAzLCA0XG4gICAgICBjYXNlICdxJzpcbiAgICAgICAgcmV0dXJuIFN0cmluZyhxdWFydGVyKTtcbiAgICAgIC8vIDAxLCAwMiwgMDMsIDA0XG4gICAgICBjYXNlICdxcSc6XG4gICAgICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MocXVhcnRlciwgMik7XG4gICAgICAvLyAxc3QsIDJuZCwgM3JkLCA0dGhcbiAgICAgIGNhc2UgJ3FvJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLm9yZGluYWxOdW1iZXIocXVhcnRlciwge1xuICAgICAgICAgIHVuaXQ6ICdxdWFydGVyJ1xuICAgICAgICB9KTtcbiAgICAgIC8vIFExLCBRMiwgUTMsIFE0XG4gICAgICBjYXNlICdxcXEnOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUucXVhcnRlcihxdWFydGVyLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCcsXG4gICAgICAgICAgY29udGV4dDogJ3N0YW5kYWxvbmUnXG4gICAgICAgIH0pO1xuICAgICAgLy8gMSwgMiwgMywgNCAobmFycm93IHF1YXJ0ZXI7IGNvdWxkIGJlIG5vdCBudW1lcmljYWwpXG4gICAgICBjYXNlICdxcXFxcSc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5xdWFydGVyKHF1YXJ0ZXIsIHtcbiAgICAgICAgICB3aWR0aDogJ25hcnJvdycsXG4gICAgICAgICAgY29udGV4dDogJ3N0YW5kYWxvbmUnXG4gICAgICAgIH0pO1xuICAgICAgLy8gMXN0IHF1YXJ0ZXIsIDJuZCBxdWFydGVyLCAuLi5cbiAgICAgIGNhc2UgJ3FxcXEnOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLnF1YXJ0ZXIocXVhcnRlciwge1xuICAgICAgICAgIHdpZHRoOiAnd2lkZScsXG4gICAgICAgICAgY29udGV4dDogJ3N0YW5kYWxvbmUnXG4gICAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgLy8gTW9udGhcbiAgTTogZnVuY3Rpb24gTShkYXRlLCB0b2tlbiwgbG9jYWxpemUpIHtcbiAgICB2YXIgbW9udGggPSBkYXRlLmdldFVUQ01vbnRoKCk7XG4gICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgY2FzZSAnTSc6XG4gICAgICBjYXNlICdNTSc6XG4gICAgICAgIHJldHVybiBsaWdodEZvcm1hdHRlcnMuTShkYXRlLCB0b2tlbik7XG4gICAgICAvLyAxc3QsIDJuZCwgLi4uLCAxMnRoXG4gICAgICBjYXNlICdNbyc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKG1vbnRoICsgMSwge1xuICAgICAgICAgIHVuaXQ6ICdtb250aCdcbiAgICAgICAgfSk7XG4gICAgICAvLyBKYW4sIEZlYiwgLi4uLCBEZWNcbiAgICAgIGNhc2UgJ01NTSc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5tb250aChtb250aCwge1xuICAgICAgICAgIHdpZHRoOiAnYWJicmV2aWF0ZWQnLFxuICAgICAgICAgIGNvbnRleHQ6ICdmb3JtYXR0aW5nJ1xuICAgICAgICB9KTtcbiAgICAgIC8vIEosIEYsIC4uLiwgRFxuICAgICAgY2FzZSAnTU1NTU0nOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUubW9udGgobW9udGgsIHtcbiAgICAgICAgICB3aWR0aDogJ25hcnJvdycsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgLy8gSmFudWFyeSwgRmVicnVhcnksIC4uLiwgRGVjZW1iZXJcbiAgICAgIGNhc2UgJ01NTU0nOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLm1vbnRoKG1vbnRoLCB7XG4gICAgICAgICAgd2lkdGg6ICd3aWRlJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgfVxuICB9LFxuICAvLyBTdGFuZC1hbG9uZSBtb250aFxuICBMOiBmdW5jdGlvbiBMKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIHZhciBtb250aCA9IGRhdGUuZ2V0VVRDTW9udGgoKTtcbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAvLyAxLCAyLCAuLi4sIDEyXG4gICAgICBjYXNlICdMJzpcbiAgICAgICAgcmV0dXJuIFN0cmluZyhtb250aCArIDEpO1xuICAgICAgLy8gMDEsIDAyLCAuLi4sIDEyXG4gICAgICBjYXNlICdMTCc6XG4gICAgICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MobW9udGggKyAxLCAyKTtcbiAgICAgIC8vIDFzdCwgMm5kLCAuLi4sIDEydGhcbiAgICAgIGNhc2UgJ0xvJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLm9yZGluYWxOdW1iZXIobW9udGggKyAxLCB7XG4gICAgICAgICAgdW5pdDogJ21vbnRoJ1xuICAgICAgICB9KTtcbiAgICAgIC8vIEphbiwgRmViLCAuLi4sIERlY1xuICAgICAgY2FzZSAnTExMJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLm1vbnRoKG1vbnRoLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCcsXG4gICAgICAgICAgY29udGV4dDogJ3N0YW5kYWxvbmUnXG4gICAgICAgIH0pO1xuICAgICAgLy8gSiwgRiwgLi4uLCBEXG4gICAgICBjYXNlICdMTExMTCc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5tb250aChtb250aCwge1xuICAgICAgICAgIHdpZHRoOiAnbmFycm93JyxcbiAgICAgICAgICBjb250ZXh0OiAnc3RhbmRhbG9uZSdcbiAgICAgICAgfSk7XG4gICAgICAvLyBKYW51YXJ5LCBGZWJydWFyeSwgLi4uLCBEZWNlbWJlclxuICAgICAgY2FzZSAnTExMTCc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbG9jYWxpemUubW9udGgobW9udGgsIHtcbiAgICAgICAgICB3aWR0aDogJ3dpZGUnLFxuICAgICAgICAgIGNvbnRleHQ6ICdzdGFuZGFsb25lJ1xuICAgICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIC8vIExvY2FsIHdlZWsgb2YgeWVhclxuICB3OiBmdW5jdGlvbiB3KGRhdGUsIHRva2VuLCBsb2NhbGl6ZSwgb3B0aW9ucykge1xuICAgIHZhciB3ZWVrID0gZ2V0VVRDV2VlayhkYXRlLCBvcHRpb25zKTtcbiAgICBpZiAodG9rZW4gPT09ICd3bycpIHtcbiAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKHdlZWssIHtcbiAgICAgICAgdW5pdDogJ3dlZWsnXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyh3ZWVrLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBJU08gd2VlayBvZiB5ZWFyXG4gIEk6IGZ1bmN0aW9uIEkoZGF0ZSwgdG9rZW4sIGxvY2FsaXplKSB7XG4gICAgdmFyIGlzb1dlZWsgPSBnZXRVVENJU09XZWVrKGRhdGUpO1xuICAgIGlmICh0b2tlbiA9PT0gJ0lvJykge1xuICAgICAgcmV0dXJuIGxvY2FsaXplLm9yZGluYWxOdW1iZXIoaXNvV2Vlaywge1xuICAgICAgICB1bml0OiAnd2VlaydcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKGlzb1dlZWssIHRva2VuLmxlbmd0aCk7XG4gIH0sXG4gIC8vIERheSBvZiB0aGUgbW9udGhcbiAgZDogZnVuY3Rpb24gZChkYXRlLCB0b2tlbiwgbG9jYWxpemUpIHtcbiAgICBpZiAodG9rZW4gPT09ICdkbycpIHtcbiAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKGRhdGUuZ2V0VVRDRGF0ZSgpLCB7XG4gICAgICAgIHVuaXQ6ICdkYXRlJ1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBsaWdodEZvcm1hdHRlcnMuZChkYXRlLCB0b2tlbik7XG4gIH0sXG4gIC8vIERheSBvZiB5ZWFyXG4gIEQ6IGZ1bmN0aW9uIEQoZGF0ZSwgdG9rZW4sIGxvY2FsaXplKSB7XG4gICAgdmFyIGRheU9mWWVhciA9IGdldFVUQ0RheU9mWWVhcihkYXRlKTtcbiAgICBpZiAodG9rZW4gPT09ICdEbycpIHtcbiAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKGRheU9mWWVhciwge1xuICAgICAgICB1bml0OiAnZGF5T2ZZZWFyJ1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MoZGF5T2ZZZWFyLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBEYXkgb2Ygd2Vla1xuICBFOiBmdW5jdGlvbiBFKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIHZhciBkYXlPZldlZWsgPSBkYXRlLmdldFVUQ0RheSgpO1xuICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgIC8vIFR1ZVxuICAgICAgY2FzZSAnRSc6XG4gICAgICBjYXNlICdFRSc6XG4gICAgICBjYXNlICdFRUUnOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUuZGF5KGRheU9mV2Vlaywge1xuICAgICAgICAgIHdpZHRoOiAnYWJicmV2aWF0ZWQnLFxuICAgICAgICAgIGNvbnRleHQ6ICdmb3JtYXR0aW5nJ1xuICAgICAgICB9KTtcbiAgICAgIC8vIFRcbiAgICAgIGNhc2UgJ0VFRUVFJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheShkYXlPZldlZWssIHtcbiAgICAgICAgICB3aWR0aDogJ25hcnJvdycsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgLy8gVHVcbiAgICAgIGNhc2UgJ0VFRUVFRSc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXkoZGF5T2ZXZWVrLCB7XG4gICAgICAgICAgd2lkdGg6ICdzaG9ydCcsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgLy8gVHVlc2RheVxuICAgICAgY2FzZSAnRUVFRSc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbG9jYWxpemUuZGF5KGRheU9mV2Vlaywge1xuICAgICAgICAgIHdpZHRoOiAnd2lkZScsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgLy8gTG9jYWwgZGF5IG9mIHdlZWtcbiAgZTogZnVuY3Rpb24gZShkYXRlLCB0b2tlbiwgbG9jYWxpemUsIG9wdGlvbnMpIHtcbiAgICB2YXIgZGF5T2ZXZWVrID0gZGF0ZS5nZXRVVENEYXkoKTtcbiAgICB2YXIgbG9jYWxEYXlPZldlZWsgPSAoZGF5T2ZXZWVrIC0gb3B0aW9ucy53ZWVrU3RhcnRzT24gKyA4KSAlIDcgfHwgNztcbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAvLyBOdW1lcmljYWwgdmFsdWUgKE50aCBkYXkgb2Ygd2VlayB3aXRoIGN1cnJlbnQgbG9jYWxlIG9yIHdlZWtTdGFydHNPbilcbiAgICAgIGNhc2UgJ2UnOlxuICAgICAgICByZXR1cm4gU3RyaW5nKGxvY2FsRGF5T2ZXZWVrKTtcbiAgICAgIC8vIFBhZGRlZCBudW1lcmljYWwgdmFsdWVcbiAgICAgIGNhc2UgJ2VlJzpcbiAgICAgICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyhsb2NhbERheU9mV2VlaywgMik7XG4gICAgICAvLyAxc3QsIDJuZCwgLi4uLCA3dGhcbiAgICAgIGNhc2UgJ2VvJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLm9yZGluYWxOdW1iZXIobG9jYWxEYXlPZldlZWssIHtcbiAgICAgICAgICB1bml0OiAnZGF5J1xuICAgICAgICB9KTtcbiAgICAgIGNhc2UgJ2VlZSc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXkoZGF5T2ZXZWVrLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCcsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgLy8gVFxuICAgICAgY2FzZSAnZWVlZWUnOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUuZGF5KGRheU9mV2Vlaywge1xuICAgICAgICAgIHdpZHRoOiAnbmFycm93JyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgICAvLyBUdVxuICAgICAgY2FzZSAnZWVlZWVlJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheShkYXlPZldlZWssIHtcbiAgICAgICAgICB3aWR0aDogJ3Nob3J0JyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgICAvLyBUdWVzZGF5XG4gICAgICBjYXNlICdlZWVlJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXkoZGF5T2ZXZWVrLCB7XG4gICAgICAgICAgd2lkdGg6ICd3aWRlJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgfVxuICB9LFxuICAvLyBTdGFuZC1hbG9uZSBsb2NhbCBkYXkgb2Ygd2Vla1xuICBjOiBmdW5jdGlvbiBjKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSwgb3B0aW9ucykge1xuICAgIHZhciBkYXlPZldlZWsgPSBkYXRlLmdldFVUQ0RheSgpO1xuICAgIHZhciBsb2NhbERheU9mV2VlayA9IChkYXlPZldlZWsgLSBvcHRpb25zLndlZWtTdGFydHNPbiArIDgpICUgNyB8fCA3O1xuICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgIC8vIE51bWVyaWNhbCB2YWx1ZSAoc2FtZSBhcyBpbiBgZWApXG4gICAgICBjYXNlICdjJzpcbiAgICAgICAgcmV0dXJuIFN0cmluZyhsb2NhbERheU9mV2Vlayk7XG4gICAgICAvLyBQYWRkZWQgbnVtZXJpY2FsIHZhbHVlXG4gICAgICBjYXNlICdjYyc6XG4gICAgICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MobG9jYWxEYXlPZldlZWssIHRva2VuLmxlbmd0aCk7XG4gICAgICAvLyAxc3QsIDJuZCwgLi4uLCA3dGhcbiAgICAgIGNhc2UgJ2NvJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLm9yZGluYWxOdW1iZXIobG9jYWxEYXlPZldlZWssIHtcbiAgICAgICAgICB1bml0OiAnZGF5J1xuICAgICAgICB9KTtcbiAgICAgIGNhc2UgJ2NjYyc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXkoZGF5T2ZXZWVrLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCcsXG4gICAgICAgICAgY29udGV4dDogJ3N0YW5kYWxvbmUnXG4gICAgICAgIH0pO1xuICAgICAgLy8gVFxuICAgICAgY2FzZSAnY2NjY2MnOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUuZGF5KGRheU9mV2Vlaywge1xuICAgICAgICAgIHdpZHRoOiAnbmFycm93JyxcbiAgICAgICAgICBjb250ZXh0OiAnc3RhbmRhbG9uZSdcbiAgICAgICAgfSk7XG4gICAgICAvLyBUdVxuICAgICAgY2FzZSAnY2NjY2NjJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheShkYXlPZldlZWssIHtcbiAgICAgICAgICB3aWR0aDogJ3Nob3J0JyxcbiAgICAgICAgICBjb250ZXh0OiAnc3RhbmRhbG9uZSdcbiAgICAgICAgfSk7XG4gICAgICAvLyBUdWVzZGF5XG4gICAgICBjYXNlICdjY2NjJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXkoZGF5T2ZXZWVrLCB7XG4gICAgICAgICAgd2lkdGg6ICd3aWRlJyxcbiAgICAgICAgICBjb250ZXh0OiAnc3RhbmRhbG9uZSdcbiAgICAgICAgfSk7XG4gICAgfVxuICB9LFxuICAvLyBJU08gZGF5IG9mIHdlZWtcbiAgaTogZnVuY3Rpb24gaShkYXRlLCB0b2tlbiwgbG9jYWxpemUpIHtcbiAgICB2YXIgZGF5T2ZXZWVrID0gZGF0ZS5nZXRVVENEYXkoKTtcbiAgICB2YXIgaXNvRGF5T2ZXZWVrID0gZGF5T2ZXZWVrID09PSAwID8gNyA6IGRheU9mV2VlaztcbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAvLyAyXG4gICAgICBjYXNlICdpJzpcbiAgICAgICAgcmV0dXJuIFN0cmluZyhpc29EYXlPZldlZWspO1xuICAgICAgLy8gMDJcbiAgICAgIGNhc2UgJ2lpJzpcbiAgICAgICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyhpc29EYXlPZldlZWssIHRva2VuLmxlbmd0aCk7XG4gICAgICAvLyAybmRcbiAgICAgIGNhc2UgJ2lvJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLm9yZGluYWxOdW1iZXIoaXNvRGF5T2ZXZWVrLCB7XG4gICAgICAgICAgdW5pdDogJ2RheSdcbiAgICAgICAgfSk7XG4gICAgICAvLyBUdWVcbiAgICAgIGNhc2UgJ2lpaSc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXkoZGF5T2ZXZWVrLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCcsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgLy8gVFxuICAgICAgY2FzZSAnaWlpaWknOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUuZGF5KGRheU9mV2Vlaywge1xuICAgICAgICAgIHdpZHRoOiAnbmFycm93JyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgICAvLyBUdVxuICAgICAgY2FzZSAnaWlpaWlpJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheShkYXlPZldlZWssIHtcbiAgICAgICAgICB3aWR0aDogJ3Nob3J0JyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgICAvLyBUdWVzZGF5XG4gICAgICBjYXNlICdpaWlpJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXkoZGF5T2ZXZWVrLCB7XG4gICAgICAgICAgd2lkdGg6ICd3aWRlJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgfVxuICB9LFxuICAvLyBBTSBvciBQTVxuICBhOiBmdW5jdGlvbiBhKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIHZhciBob3VycyA9IGRhdGUuZ2V0VVRDSG91cnMoKTtcbiAgICB2YXIgZGF5UGVyaW9kRW51bVZhbHVlID0gaG91cnMgLyAxMiA+PSAxID8gJ3BtJyA6ICdhbSc7XG4gICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgY2FzZSAnYSc6XG4gICAgICBjYXNlICdhYSc6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXlQZXJpb2QoZGF5UGVyaW9kRW51bVZhbHVlLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCcsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgY2FzZSAnYWFhJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheVBlcmlvZChkYXlQZXJpb2RFbnVtVmFsdWUsIHtcbiAgICAgICAgICB3aWR0aDogJ2FiYnJldmlhdGVkJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSkudG9Mb3dlckNhc2UoKTtcbiAgICAgIGNhc2UgJ2FhYWFhJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheVBlcmlvZChkYXlQZXJpb2RFbnVtVmFsdWUsIHtcbiAgICAgICAgICB3aWR0aDogJ25hcnJvdycsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgY2FzZSAnYWFhYSc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbG9jYWxpemUuZGF5UGVyaW9kKGRheVBlcmlvZEVudW1WYWx1ZSwge1xuICAgICAgICAgIHdpZHRoOiAnd2lkZScsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgLy8gQU0sIFBNLCBtaWRuaWdodCwgbm9vblxuICBiOiBmdW5jdGlvbiBiKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIHZhciBob3VycyA9IGRhdGUuZ2V0VVRDSG91cnMoKTtcbiAgICB2YXIgZGF5UGVyaW9kRW51bVZhbHVlO1xuICAgIGlmIChob3VycyA9PT0gMTIpIHtcbiAgICAgIGRheVBlcmlvZEVudW1WYWx1ZSA9IGRheVBlcmlvZEVudW0ubm9vbjtcbiAgICB9IGVsc2UgaWYgKGhvdXJzID09PSAwKSB7XG4gICAgICBkYXlQZXJpb2RFbnVtVmFsdWUgPSBkYXlQZXJpb2RFbnVtLm1pZG5pZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXlQZXJpb2RFbnVtVmFsdWUgPSBob3VycyAvIDEyID49IDEgPyAncG0nIDogJ2FtJztcbiAgICB9XG4gICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgY2FzZSAnYic6XG4gICAgICBjYXNlICdiYic6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXlQZXJpb2QoZGF5UGVyaW9kRW51bVZhbHVlLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCcsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgY2FzZSAnYmJiJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheVBlcmlvZChkYXlQZXJpb2RFbnVtVmFsdWUsIHtcbiAgICAgICAgICB3aWR0aDogJ2FiYnJldmlhdGVkJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSkudG9Mb3dlckNhc2UoKTtcbiAgICAgIGNhc2UgJ2JiYmJiJzpcbiAgICAgICAgcmV0dXJuIGxvY2FsaXplLmRheVBlcmlvZChkYXlQZXJpb2RFbnVtVmFsdWUsIHtcbiAgICAgICAgICB3aWR0aDogJ25hcnJvdycsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgY2FzZSAnYmJiYic6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gbG9jYWxpemUuZGF5UGVyaW9kKGRheVBlcmlvZEVudW1WYWx1ZSwge1xuICAgICAgICAgIHdpZHRoOiAnd2lkZScsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgLy8gaW4gdGhlIG1vcm5pbmcsIGluIHRoZSBhZnRlcm5vb24sIGluIHRoZSBldmVuaW5nLCBhdCBuaWdodFxuICBCOiBmdW5jdGlvbiBCKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIHZhciBob3VycyA9IGRhdGUuZ2V0VVRDSG91cnMoKTtcbiAgICB2YXIgZGF5UGVyaW9kRW51bVZhbHVlO1xuICAgIGlmIChob3VycyA+PSAxNykge1xuICAgICAgZGF5UGVyaW9kRW51bVZhbHVlID0gZGF5UGVyaW9kRW51bS5ldmVuaW5nO1xuICAgIH0gZWxzZSBpZiAoaG91cnMgPj0gMTIpIHtcbiAgICAgIGRheVBlcmlvZEVudW1WYWx1ZSA9IGRheVBlcmlvZEVudW0uYWZ0ZXJub29uO1xuICAgIH0gZWxzZSBpZiAoaG91cnMgPj0gNCkge1xuICAgICAgZGF5UGVyaW9kRW51bVZhbHVlID0gZGF5UGVyaW9kRW51bS5tb3JuaW5nO1xuICAgIH0gZWxzZSB7XG4gICAgICBkYXlQZXJpb2RFbnVtVmFsdWUgPSBkYXlQZXJpb2RFbnVtLm5pZ2h0O1xuICAgIH1cbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICBjYXNlICdCJzpcbiAgICAgIGNhc2UgJ0JCJzpcbiAgICAgIGNhc2UgJ0JCQic6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXlQZXJpb2QoZGF5UGVyaW9kRW51bVZhbHVlLCB7XG4gICAgICAgICAgd2lkdGg6ICdhYmJyZXZpYXRlZCcsXG4gICAgICAgICAgY29udGV4dDogJ2Zvcm1hdHRpbmcnXG4gICAgICAgIH0pO1xuICAgICAgY2FzZSAnQkJCQkInOlxuICAgICAgICByZXR1cm4gbG9jYWxpemUuZGF5UGVyaW9kKGRheVBlcmlvZEVudW1WYWx1ZSwge1xuICAgICAgICAgIHdpZHRoOiAnbmFycm93JyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgICBjYXNlICdCQkJCJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBsb2NhbGl6ZS5kYXlQZXJpb2QoZGF5UGVyaW9kRW51bVZhbHVlLCB7XG4gICAgICAgICAgd2lkdGg6ICd3aWRlJyxcbiAgICAgICAgICBjb250ZXh0OiAnZm9ybWF0dGluZydcbiAgICAgICAgfSk7XG4gICAgfVxuICB9LFxuICAvLyBIb3VyIFsxLTEyXVxuICBoOiBmdW5jdGlvbiBoKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIGlmICh0b2tlbiA9PT0gJ2hvJykge1xuICAgICAgdmFyIGhvdXJzID0gZGF0ZS5nZXRVVENIb3VycygpICUgMTI7XG4gICAgICBpZiAoaG91cnMgPT09IDApIGhvdXJzID0gMTI7XG4gICAgICByZXR1cm4gbG9jYWxpemUub3JkaW5hbE51bWJlcihob3Vycywge1xuICAgICAgICB1bml0OiAnaG91cidcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gbGlnaHRGb3JtYXR0ZXJzLmgoZGF0ZSwgdG9rZW4pO1xuICB9LFxuICAvLyBIb3VyIFswLTIzXVxuICBIOiBmdW5jdGlvbiBIKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIGlmICh0b2tlbiA9PT0gJ0hvJykge1xuICAgICAgcmV0dXJuIGxvY2FsaXplLm9yZGluYWxOdW1iZXIoZGF0ZS5nZXRVVENIb3VycygpLCB7XG4gICAgICAgIHVuaXQ6ICdob3VyJ1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBsaWdodEZvcm1hdHRlcnMuSChkYXRlLCB0b2tlbik7XG4gIH0sXG4gIC8vIEhvdXIgWzAtMTFdXG4gIEs6IGZ1bmN0aW9uIEsoZGF0ZSwgdG9rZW4sIGxvY2FsaXplKSB7XG4gICAgdmFyIGhvdXJzID0gZGF0ZS5nZXRVVENIb3VycygpICUgMTI7XG4gICAgaWYgKHRva2VuID09PSAnS28nKSB7XG4gICAgICByZXR1cm4gbG9jYWxpemUub3JkaW5hbE51bWJlcihob3Vycywge1xuICAgICAgICB1bml0OiAnaG91cidcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKGhvdXJzLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBIb3VyIFsxLTI0XVxuICBrOiBmdW5jdGlvbiBrKGRhdGUsIHRva2VuLCBsb2NhbGl6ZSkge1xuICAgIHZhciBob3VycyA9IGRhdGUuZ2V0VVRDSG91cnMoKTtcbiAgICBpZiAoaG91cnMgPT09IDApIGhvdXJzID0gMjQ7XG4gICAgaWYgKHRva2VuID09PSAna28nKSB7XG4gICAgICByZXR1cm4gbG9jYWxpemUub3JkaW5hbE51bWJlcihob3Vycywge1xuICAgICAgICB1bml0OiAnaG91cidcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYWRkTGVhZGluZ1plcm9zKGhvdXJzLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBNaW51dGVcbiAgbTogZnVuY3Rpb24gbShkYXRlLCB0b2tlbiwgbG9jYWxpemUpIHtcbiAgICBpZiAodG9rZW4gPT09ICdtbycpIHtcbiAgICAgIHJldHVybiBsb2NhbGl6ZS5vcmRpbmFsTnVtYmVyKGRhdGUuZ2V0VVRDTWludXRlcygpLCB7XG4gICAgICAgIHVuaXQ6ICdtaW51dGUnXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGxpZ2h0Rm9ybWF0dGVycy5tKGRhdGUsIHRva2VuKTtcbiAgfSxcbiAgLy8gU2Vjb25kXG4gIHM6IGZ1bmN0aW9uIHMoZGF0ZSwgdG9rZW4sIGxvY2FsaXplKSB7XG4gICAgaWYgKHRva2VuID09PSAnc28nKSB7XG4gICAgICByZXR1cm4gbG9jYWxpemUub3JkaW5hbE51bWJlcihkYXRlLmdldFVUQ1NlY29uZHMoKSwge1xuICAgICAgICB1bml0OiAnc2Vjb25kJ1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBsaWdodEZvcm1hdHRlcnMucyhkYXRlLCB0b2tlbik7XG4gIH0sXG4gIC8vIEZyYWN0aW9uIG9mIHNlY29uZFxuICBTOiBmdW5jdGlvbiBTKGRhdGUsIHRva2VuKSB7XG4gICAgcmV0dXJuIGxpZ2h0Rm9ybWF0dGVycy5TKGRhdGUsIHRva2VuKTtcbiAgfSxcbiAgLy8gVGltZXpvbmUgKElTTy04NjAxLiBJZiBvZmZzZXQgaXMgMCwgb3V0cHV0IGlzIGFsd2F5cyBgJ1onYClcbiAgWDogZnVuY3Rpb24gWChkYXRlLCB0b2tlbiwgX2xvY2FsaXplLCBvcHRpb25zKSB7XG4gICAgdmFyIG9yaWdpbmFsRGF0ZSA9IG9wdGlvbnMuX29yaWdpbmFsRGF0ZSB8fCBkYXRlO1xuICAgIHZhciB0aW1lem9uZU9mZnNldCA9IG9yaWdpbmFsRGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpO1xuICAgIGlmICh0aW1lem9uZU9mZnNldCA9PT0gMCkge1xuICAgICAgcmV0dXJuICdaJztcbiAgICB9XG4gICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgLy8gSG91cnMgYW5kIG9wdGlvbmFsIG1pbnV0ZXNcbiAgICAgIGNhc2UgJ1gnOlxuICAgICAgICByZXR1cm4gZm9ybWF0VGltZXpvbmVXaXRoT3B0aW9uYWxNaW51dGVzKHRpbWV6b25lT2Zmc2V0KTtcblxuICAgICAgLy8gSG91cnMsIG1pbnV0ZXMgYW5kIG9wdGlvbmFsIHNlY29uZHMgd2l0aG91dCBgOmAgZGVsaW1pdGVyXG4gICAgICAvLyBOb3RlOiBuZWl0aGVyIElTTy04NjAxIG5vciBKYXZhU2NyaXB0IHN1cHBvcnRzIHNlY29uZHMgaW4gdGltZXpvbmUgb2Zmc2V0c1xuICAgICAgLy8gc28gdGhpcyB0b2tlbiBhbHdheXMgaGFzIHRoZSBzYW1lIG91dHB1dCBhcyBgWFhgXG4gICAgICBjYXNlICdYWFhYJzpcbiAgICAgIGNhc2UgJ1hYJzpcbiAgICAgICAgLy8gSG91cnMgYW5kIG1pbnV0ZXMgd2l0aG91dCBgOmAgZGVsaW1pdGVyXG4gICAgICAgIHJldHVybiBmb3JtYXRUaW1lem9uZSh0aW1lem9uZU9mZnNldCk7XG5cbiAgICAgIC8vIEhvdXJzLCBtaW51dGVzIGFuZCBvcHRpb25hbCBzZWNvbmRzIHdpdGggYDpgIGRlbGltaXRlclxuICAgICAgLy8gTm90ZTogbmVpdGhlciBJU08tODYwMSBub3IgSmF2YVNjcmlwdCBzdXBwb3J0cyBzZWNvbmRzIGluIHRpbWV6b25lIG9mZnNldHNcbiAgICAgIC8vIHNvIHRoaXMgdG9rZW4gYWx3YXlzIGhhcyB0aGUgc2FtZSBvdXRwdXQgYXMgYFhYWGBcbiAgICAgIGNhc2UgJ1hYWFhYJzpcbiAgICAgIGNhc2UgJ1hYWCc6IC8vIEhvdXJzIGFuZCBtaW51dGVzIHdpdGggYDpgIGRlbGltaXRlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIGZvcm1hdFRpbWV6b25lKHRpbWV6b25lT2Zmc2V0LCAnOicpO1xuICAgIH1cbiAgfSxcbiAgLy8gVGltZXpvbmUgKElTTy04NjAxLiBJZiBvZmZzZXQgaXMgMCwgb3V0cHV0IGlzIGAnKzAwOjAwJ2Agb3IgZXF1aXZhbGVudClcbiAgeDogZnVuY3Rpb24geChkYXRlLCB0b2tlbiwgX2xvY2FsaXplLCBvcHRpb25zKSB7XG4gICAgdmFyIG9yaWdpbmFsRGF0ZSA9IG9wdGlvbnMuX29yaWdpbmFsRGF0ZSB8fCBkYXRlO1xuICAgIHZhciB0aW1lem9uZU9mZnNldCA9IG9yaWdpbmFsRGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpO1xuICAgIHN3aXRjaCAodG9rZW4pIHtcbiAgICAgIC8vIEhvdXJzIGFuZCBvcHRpb25hbCBtaW51dGVzXG4gICAgICBjYXNlICd4JzpcbiAgICAgICAgcmV0dXJuIGZvcm1hdFRpbWV6b25lV2l0aE9wdGlvbmFsTWludXRlcyh0aW1lem9uZU9mZnNldCk7XG5cbiAgICAgIC8vIEhvdXJzLCBtaW51dGVzIGFuZCBvcHRpb25hbCBzZWNvbmRzIHdpdGhvdXQgYDpgIGRlbGltaXRlclxuICAgICAgLy8gTm90ZTogbmVpdGhlciBJU08tODYwMSBub3IgSmF2YVNjcmlwdCBzdXBwb3J0cyBzZWNvbmRzIGluIHRpbWV6b25lIG9mZnNldHNcbiAgICAgIC8vIHNvIHRoaXMgdG9rZW4gYWx3YXlzIGhhcyB0aGUgc2FtZSBvdXRwdXQgYXMgYHh4YFxuICAgICAgY2FzZSAneHh4eCc6XG4gICAgICBjYXNlICd4eCc6XG4gICAgICAgIC8vIEhvdXJzIGFuZCBtaW51dGVzIHdpdGhvdXQgYDpgIGRlbGltaXRlclxuICAgICAgICByZXR1cm4gZm9ybWF0VGltZXpvbmUodGltZXpvbmVPZmZzZXQpO1xuXG4gICAgICAvLyBIb3VycywgbWludXRlcyBhbmQgb3B0aW9uYWwgc2Vjb25kcyB3aXRoIGA6YCBkZWxpbWl0ZXJcbiAgICAgIC8vIE5vdGU6IG5laXRoZXIgSVNPLTg2MDEgbm9yIEphdmFTY3JpcHQgc3VwcG9ydHMgc2Vjb25kcyBpbiB0aW1lem9uZSBvZmZzZXRzXG4gICAgICAvLyBzbyB0aGlzIHRva2VuIGFsd2F5cyBoYXMgdGhlIHNhbWUgb3V0cHV0IGFzIGB4eHhgXG4gICAgICBjYXNlICd4eHh4eCc6XG4gICAgICBjYXNlICd4eHgnOiAvLyBIb3VycyBhbmQgbWludXRlcyB3aXRoIGA6YCBkZWxpbWl0ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBmb3JtYXRUaW1lem9uZSh0aW1lem9uZU9mZnNldCwgJzonKTtcbiAgICB9XG4gIH0sXG4gIC8vIFRpbWV6b25lIChHTVQpXG4gIE86IGZ1bmN0aW9uIE8oZGF0ZSwgdG9rZW4sIF9sb2NhbGl6ZSwgb3B0aW9ucykge1xuICAgIHZhciBvcmlnaW5hbERhdGUgPSBvcHRpb25zLl9vcmlnaW5hbERhdGUgfHwgZGF0ZTtcbiAgICB2YXIgdGltZXpvbmVPZmZzZXQgPSBvcmlnaW5hbERhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAvLyBTaG9ydFxuICAgICAgY2FzZSAnTyc6XG4gICAgICBjYXNlICdPTyc6XG4gICAgICBjYXNlICdPT08nOlxuICAgICAgICByZXR1cm4gJ0dNVCcgKyBmb3JtYXRUaW1lem9uZVNob3J0KHRpbWV6b25lT2Zmc2V0LCAnOicpO1xuICAgICAgLy8gTG9uZ1xuICAgICAgY2FzZSAnT09PTyc6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gJ0dNVCcgKyBmb3JtYXRUaW1lem9uZSh0aW1lem9uZU9mZnNldCwgJzonKTtcbiAgICB9XG4gIH0sXG4gIC8vIFRpbWV6b25lIChzcGVjaWZpYyBub24tbG9jYXRpb24pXG4gIHo6IGZ1bmN0aW9uIHooZGF0ZSwgdG9rZW4sIF9sb2NhbGl6ZSwgb3B0aW9ucykge1xuICAgIHZhciBvcmlnaW5hbERhdGUgPSBvcHRpb25zLl9vcmlnaW5hbERhdGUgfHwgZGF0ZTtcbiAgICB2YXIgdGltZXpvbmVPZmZzZXQgPSBvcmlnaW5hbERhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgICBzd2l0Y2ggKHRva2VuKSB7XG4gICAgICAvLyBTaG9ydFxuICAgICAgY2FzZSAneic6XG4gICAgICBjYXNlICd6eic6XG4gICAgICBjYXNlICd6enonOlxuICAgICAgICByZXR1cm4gJ0dNVCcgKyBmb3JtYXRUaW1lem9uZVNob3J0KHRpbWV6b25lT2Zmc2V0LCAnOicpO1xuICAgICAgLy8gTG9uZ1xuICAgICAgY2FzZSAnenp6eic6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gJ0dNVCcgKyBmb3JtYXRUaW1lem9uZSh0aW1lem9uZU9mZnNldCwgJzonKTtcbiAgICB9XG4gIH0sXG4gIC8vIFNlY29uZHMgdGltZXN0YW1wXG4gIHQ6IGZ1bmN0aW9uIHQoZGF0ZSwgdG9rZW4sIF9sb2NhbGl6ZSwgb3B0aW9ucykge1xuICAgIHZhciBvcmlnaW5hbERhdGUgPSBvcHRpb25zLl9vcmlnaW5hbERhdGUgfHwgZGF0ZTtcbiAgICB2YXIgdGltZXN0YW1wID0gTWF0aC5mbG9vcihvcmlnaW5hbERhdGUuZ2V0VGltZSgpIC8gMTAwMCk7XG4gICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyh0aW1lc3RhbXAsIHRva2VuLmxlbmd0aCk7XG4gIH0sXG4gIC8vIE1pbGxpc2Vjb25kcyB0aW1lc3RhbXBcbiAgVDogZnVuY3Rpb24gVChkYXRlLCB0b2tlbiwgX2xvY2FsaXplLCBvcHRpb25zKSB7XG4gICAgdmFyIG9yaWdpbmFsRGF0ZSA9IG9wdGlvbnMuX29yaWdpbmFsRGF0ZSB8fCBkYXRlO1xuICAgIHZhciB0aW1lc3RhbXAgPSBvcmlnaW5hbERhdGUuZ2V0VGltZSgpO1xuICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3ModGltZXN0YW1wLCB0b2tlbi5sZW5ndGgpO1xuICB9XG59O1xuZnVuY3Rpb24gZm9ybWF0VGltZXpvbmVTaG9ydChvZmZzZXQsIGRpcnR5RGVsaW1pdGVyKSB7XG4gIHZhciBzaWduID0gb2Zmc2V0ID4gMCA/ICctJyA6ICcrJztcbiAgdmFyIGFic09mZnNldCA9IE1hdGguYWJzKG9mZnNldCk7XG4gIHZhciBob3VycyA9IE1hdGguZmxvb3IoYWJzT2Zmc2V0IC8gNjApO1xuICB2YXIgbWludXRlcyA9IGFic09mZnNldCAlIDYwO1xuICBpZiAobWludXRlcyA9PT0gMCkge1xuICAgIHJldHVybiBzaWduICsgU3RyaW5nKGhvdXJzKTtcbiAgfVxuICB2YXIgZGVsaW1pdGVyID0gZGlydHlEZWxpbWl0ZXIgfHwgJyc7XG4gIHJldHVybiBzaWduICsgU3RyaW5nKGhvdXJzKSArIGRlbGltaXRlciArIGFkZExlYWRpbmdaZXJvcyhtaW51dGVzLCAyKTtcbn1cbmZ1bmN0aW9uIGZvcm1hdFRpbWV6b25lV2l0aE9wdGlvbmFsTWludXRlcyhvZmZzZXQsIGRpcnR5RGVsaW1pdGVyKSB7XG4gIGlmIChvZmZzZXQgJSA2MCA9PT0gMCkge1xuICAgIHZhciBzaWduID0gb2Zmc2V0ID4gMCA/ICctJyA6ICcrJztcbiAgICByZXR1cm4gc2lnbiArIGFkZExlYWRpbmdaZXJvcyhNYXRoLmFicyhvZmZzZXQpIC8gNjAsIDIpO1xuICB9XG4gIHJldHVybiBmb3JtYXRUaW1lem9uZShvZmZzZXQsIGRpcnR5RGVsaW1pdGVyKTtcbn1cbmZ1bmN0aW9uIGZvcm1hdFRpbWV6b25lKG9mZnNldCwgZGlydHlEZWxpbWl0ZXIpIHtcbiAgdmFyIGRlbGltaXRlciA9IGRpcnR5RGVsaW1pdGVyIHx8ICcnO1xuICB2YXIgc2lnbiA9IG9mZnNldCA+IDAgPyAnLScgOiAnKyc7XG4gIHZhciBhYnNPZmZzZXQgPSBNYXRoLmFicyhvZmZzZXQpO1xuICB2YXIgaG91cnMgPSBhZGRMZWFkaW5nWmVyb3MoTWF0aC5mbG9vcihhYnNPZmZzZXQgLyA2MCksIDIpO1xuICB2YXIgbWludXRlcyA9IGFkZExlYWRpbmdaZXJvcyhhYnNPZmZzZXQgJSA2MCwgMik7XG4gIHJldHVybiBzaWduICsgaG91cnMgKyBkZWxpbWl0ZXIgKyBtaW51dGVzO1xufVxuZXhwb3J0IGRlZmF1bHQgZm9ybWF0dGVyczsiLCJpbXBvcnQgYWRkTGVhZGluZ1plcm9zIGZyb20gXCIuLi8uLi9hZGRMZWFkaW5nWmVyb3MvaW5kZXguanNcIjtcbi8qXG4gKiB8ICAgICB8IFVuaXQgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICB8IFVuaXQgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gKiB8LS0tLS18LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS18LS0tLS18LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS18XG4gKiB8ICBhICB8IEFNLCBQTSAgICAgICAgICAgICAgICAgICAgICAgICB8ICBBKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gKiB8ICBkICB8IERheSBvZiBtb250aCAgICAgICAgICAgICAgICAgICB8ICBEICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gKiB8ICBoICB8IEhvdXIgWzEtMTJdICAgICAgICAgICAgICAgICAgICB8ICBIICB8IEhvdXIgWzAtMjNdICAgICAgICAgICAgICAgICAgICB8XG4gKiB8ICBtICB8IE1pbnV0ZSAgICAgICAgICAgICAgICAgICAgICAgICB8ICBNICB8IE1vbnRoICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gKiB8ICBzICB8IFNlY29uZCAgICAgICAgICAgICAgICAgICAgICAgICB8ICBTICB8IEZyYWN0aW9uIG9mIHNlY29uZCAgICAgICAgICAgICB8XG4gKiB8ICB5ICB8IFllYXIgKGFicykgICAgICAgICAgICAgICAgICAgICB8ICBZICB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8XG4gKlxuICogTGV0dGVycyBtYXJrZWQgYnkgKiBhcmUgbm90IGltcGxlbWVudGVkIGJ1dCByZXNlcnZlZCBieSBVbmljb2RlIHN0YW5kYXJkLlxuICovXG52YXIgZm9ybWF0dGVycyA9IHtcbiAgLy8gWWVhclxuICB5OiBmdW5jdGlvbiB5KGRhdGUsIHRva2VuKSB7XG4gICAgLy8gRnJvbSBodHRwOi8vd3d3LnVuaWNvZGUub3JnL3JlcG9ydHMvdHIzNS90cjM1LTMxL3RyMzUtZGF0ZXMuaHRtbCNEYXRlX0Zvcm1hdF90b2tlbnNcbiAgICAvLyB8IFllYXIgICAgIHwgICAgIHkgfCB5eSB8ICAgeXl5IHwgIHl5eXkgfCB5eXl5eSB8XG4gICAgLy8gfC0tLS0tLS0tLS18LS0tLS0tLXwtLS0tfC0tLS0tLS18LS0tLS0tLXwtLS0tLS0tfFxuICAgIC8vIHwgQUQgMSAgICAgfCAgICAgMSB8IDAxIHwgICAwMDEgfCAgMDAwMSB8IDAwMDAxIHxcbiAgICAvLyB8IEFEIDEyICAgIHwgICAgMTIgfCAxMiB8ICAgMDEyIHwgIDAwMTIgfCAwMDAxMiB8XG4gICAgLy8gfCBBRCAxMjMgICB8ICAgMTIzIHwgMjMgfCAgIDEyMyB8ICAwMTIzIHwgMDAxMjMgfFxuICAgIC8vIHwgQUQgMTIzNCAgfCAgMTIzNCB8IDM0IHwgIDEyMzQgfCAgMTIzNCB8IDAxMjM0IHxcbiAgICAvLyB8IEFEIDEyMzQ1IHwgMTIzNDUgfCA0NSB8IDEyMzQ1IHwgMTIzNDUgfCAxMjM0NSB8XG5cbiAgICB2YXIgc2lnbmVkWWVhciA9IGRhdGUuZ2V0VVRDRnVsbFllYXIoKTtcbiAgICAvLyBSZXR1cm5zIDEgZm9yIDEgQkMgKHdoaWNoIGlzIHllYXIgMCBpbiBKYXZhU2NyaXB0KVxuICAgIHZhciB5ZWFyID0gc2lnbmVkWWVhciA+IDAgPyBzaWduZWRZZWFyIDogMSAtIHNpZ25lZFllYXI7XG4gICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyh0b2tlbiA9PT0gJ3l5JyA/IHllYXIgJSAxMDAgOiB5ZWFyLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBNb250aFxuICBNOiBmdW5jdGlvbiBNKGRhdGUsIHRva2VuKSB7XG4gICAgdmFyIG1vbnRoID0gZGF0ZS5nZXRVVENNb250aCgpO1xuICAgIHJldHVybiB0b2tlbiA9PT0gJ00nID8gU3RyaW5nKG1vbnRoICsgMSkgOiBhZGRMZWFkaW5nWmVyb3MobW9udGggKyAxLCAyKTtcbiAgfSxcbiAgLy8gRGF5IG9mIHRoZSBtb250aFxuICBkOiBmdW5jdGlvbiBkKGRhdGUsIHRva2VuKSB7XG4gICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyhkYXRlLmdldFVUQ0RhdGUoKSwgdG9rZW4ubGVuZ3RoKTtcbiAgfSxcbiAgLy8gQU0gb3IgUE1cbiAgYTogZnVuY3Rpb24gYShkYXRlLCB0b2tlbikge1xuICAgIHZhciBkYXlQZXJpb2RFbnVtVmFsdWUgPSBkYXRlLmdldFVUQ0hvdXJzKCkgLyAxMiA+PSAxID8gJ3BtJyA6ICdhbSc7XG4gICAgc3dpdGNoICh0b2tlbikge1xuICAgICAgY2FzZSAnYSc6XG4gICAgICBjYXNlICdhYSc6XG4gICAgICAgIHJldHVybiBkYXlQZXJpb2RFbnVtVmFsdWUudG9VcHBlckNhc2UoKTtcbiAgICAgIGNhc2UgJ2FhYSc6XG4gICAgICAgIHJldHVybiBkYXlQZXJpb2RFbnVtVmFsdWU7XG4gICAgICBjYXNlICdhYWFhYSc6XG4gICAgICAgIHJldHVybiBkYXlQZXJpb2RFbnVtVmFsdWVbMF07XG4gICAgICBjYXNlICdhYWFhJzpcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBkYXlQZXJpb2RFbnVtVmFsdWUgPT09ICdhbScgPyAnYS5tLicgOiAncC5tLic7XG4gICAgfVxuICB9LFxuICAvLyBIb3VyIFsxLTEyXVxuICBoOiBmdW5jdGlvbiBoKGRhdGUsIHRva2VuKSB7XG4gICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyhkYXRlLmdldFVUQ0hvdXJzKCkgJSAxMiB8fCAxMiwgdG9rZW4ubGVuZ3RoKTtcbiAgfSxcbiAgLy8gSG91ciBbMC0yM11cbiAgSDogZnVuY3Rpb24gSChkYXRlLCB0b2tlbikge1xuICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MoZGF0ZS5nZXRVVENIb3VycygpLCB0b2tlbi5sZW5ndGgpO1xuICB9LFxuICAvLyBNaW51dGVcbiAgbTogZnVuY3Rpb24gbShkYXRlLCB0b2tlbikge1xuICAgIHJldHVybiBhZGRMZWFkaW5nWmVyb3MoZGF0ZS5nZXRVVENNaW51dGVzKCksIHRva2VuLmxlbmd0aCk7XG4gIH0sXG4gIC8vIFNlY29uZFxuICBzOiBmdW5jdGlvbiBzKGRhdGUsIHRva2VuKSB7XG4gICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyhkYXRlLmdldFVUQ1NlY29uZHMoKSwgdG9rZW4ubGVuZ3RoKTtcbiAgfSxcbiAgLy8gRnJhY3Rpb24gb2Ygc2Vjb25kXG4gIFM6IGZ1bmN0aW9uIFMoZGF0ZSwgdG9rZW4pIHtcbiAgICB2YXIgbnVtYmVyT2ZEaWdpdHMgPSB0b2tlbi5sZW5ndGg7XG4gICAgdmFyIG1pbGxpc2Vjb25kcyA9IGRhdGUuZ2V0VVRDTWlsbGlzZWNvbmRzKCk7XG4gICAgdmFyIGZyYWN0aW9uYWxTZWNvbmRzID0gTWF0aC5mbG9vcihtaWxsaXNlY29uZHMgKiBNYXRoLnBvdygxMCwgbnVtYmVyT2ZEaWdpdHMgLSAzKSk7XG4gICAgcmV0dXJuIGFkZExlYWRpbmdaZXJvcyhmcmFjdGlvbmFsU2Vjb25kcywgdG9rZW4ubGVuZ3RoKTtcbiAgfVxufTtcbmV4cG9ydCBkZWZhdWx0IGZvcm1hdHRlcnM7IiwidmFyIGRhdGVMb25nRm9ybWF0dGVyID0gZnVuY3Rpb24gZGF0ZUxvbmdGb3JtYXR0ZXIocGF0dGVybiwgZm9ybWF0TG9uZykge1xuICBzd2l0Y2ggKHBhdHRlcm4pIHtcbiAgICBjYXNlICdQJzpcbiAgICAgIHJldHVybiBmb3JtYXRMb25nLmRhdGUoe1xuICAgICAgICB3aWR0aDogJ3Nob3J0J1xuICAgICAgfSk7XG4gICAgY2FzZSAnUFAnOlxuICAgICAgcmV0dXJuIGZvcm1hdExvbmcuZGF0ZSh7XG4gICAgICAgIHdpZHRoOiAnbWVkaXVtJ1xuICAgICAgfSk7XG4gICAgY2FzZSAnUFBQJzpcbiAgICAgIHJldHVybiBmb3JtYXRMb25nLmRhdGUoe1xuICAgICAgICB3aWR0aDogJ2xvbmcnXG4gICAgICB9KTtcbiAgICBjYXNlICdQUFBQJzpcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZvcm1hdExvbmcuZGF0ZSh7XG4gICAgICAgIHdpZHRoOiAnZnVsbCdcbiAgICAgIH0pO1xuICB9XG59O1xudmFyIHRpbWVMb25nRm9ybWF0dGVyID0gZnVuY3Rpb24gdGltZUxvbmdGb3JtYXR0ZXIocGF0dGVybiwgZm9ybWF0TG9uZykge1xuICBzd2l0Y2ggKHBhdHRlcm4pIHtcbiAgICBjYXNlICdwJzpcbiAgICAgIHJldHVybiBmb3JtYXRMb25nLnRpbWUoe1xuICAgICAgICB3aWR0aDogJ3Nob3J0J1xuICAgICAgfSk7XG4gICAgY2FzZSAncHAnOlxuICAgICAgcmV0dXJuIGZvcm1hdExvbmcudGltZSh7XG4gICAgICAgIHdpZHRoOiAnbWVkaXVtJ1xuICAgICAgfSk7XG4gICAgY2FzZSAncHBwJzpcbiAgICAgIHJldHVybiBmb3JtYXRMb25nLnRpbWUoe1xuICAgICAgICB3aWR0aDogJ2xvbmcnXG4gICAgICB9KTtcbiAgICBjYXNlICdwcHBwJzpcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZvcm1hdExvbmcudGltZSh7XG4gICAgICAgIHdpZHRoOiAnZnVsbCdcbiAgICAgIH0pO1xuICB9XG59O1xudmFyIGRhdGVUaW1lTG9uZ0Zvcm1hdHRlciA9IGZ1bmN0aW9uIGRhdGVUaW1lTG9uZ0Zvcm1hdHRlcihwYXR0ZXJuLCBmb3JtYXRMb25nKSB7XG4gIHZhciBtYXRjaFJlc3VsdCA9IHBhdHRlcm4ubWF0Y2goLyhQKykocCspPy8pIHx8IFtdO1xuICB2YXIgZGF0ZVBhdHRlcm4gPSBtYXRjaFJlc3VsdFsxXTtcbiAgdmFyIHRpbWVQYXR0ZXJuID0gbWF0Y2hSZXN1bHRbMl07XG4gIGlmICghdGltZVBhdHRlcm4pIHtcbiAgICByZXR1cm4gZGF0ZUxvbmdGb3JtYXR0ZXIocGF0dGVybiwgZm9ybWF0TG9uZyk7XG4gIH1cbiAgdmFyIGRhdGVUaW1lRm9ybWF0O1xuICBzd2l0Y2ggKGRhdGVQYXR0ZXJuKSB7XG4gICAgY2FzZSAnUCc6XG4gICAgICBkYXRlVGltZUZvcm1hdCA9IGZvcm1hdExvbmcuZGF0ZVRpbWUoe1xuICAgICAgICB3aWR0aDogJ3Nob3J0J1xuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdQUCc6XG4gICAgICBkYXRlVGltZUZvcm1hdCA9IGZvcm1hdExvbmcuZGF0ZVRpbWUoe1xuICAgICAgICB3aWR0aDogJ21lZGl1bSdcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnUFBQJzpcbiAgICAgIGRhdGVUaW1lRm9ybWF0ID0gZm9ybWF0TG9uZy5kYXRlVGltZSh7XG4gICAgICAgIHdpZHRoOiAnbG9uZydcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnUFBQUCc6XG4gICAgZGVmYXVsdDpcbiAgICAgIGRhdGVUaW1lRm9ybWF0ID0gZm9ybWF0TG9uZy5kYXRlVGltZSh7XG4gICAgICAgIHdpZHRoOiAnZnVsbCdcbiAgICAgIH0pO1xuICAgICAgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIGRhdGVUaW1lRm9ybWF0LnJlcGxhY2UoJ3t7ZGF0ZX19JywgZGF0ZUxvbmdGb3JtYXR0ZXIoZGF0ZVBhdHRlcm4sIGZvcm1hdExvbmcpKS5yZXBsYWNlKCd7e3RpbWV9fScsIHRpbWVMb25nRm9ybWF0dGVyKHRpbWVQYXR0ZXJuLCBmb3JtYXRMb25nKSk7XG59O1xudmFyIGxvbmdGb3JtYXR0ZXJzID0ge1xuICBwOiB0aW1lTG9uZ0Zvcm1hdHRlcixcbiAgUDogZGF0ZVRpbWVMb25nRm9ybWF0dGVyXG59O1xuZXhwb3J0IGRlZmF1bHQgbG9uZ0Zvcm1hdHRlcnM7IiwiLyoqXG4gKiBHb29nbGUgQ2hyb21lIGFzIG9mIDY3LjAuMzM5Ni44NyBpbnRyb2R1Y2VkIHRpbWV6b25lcyB3aXRoIG9mZnNldCB0aGF0IGluY2x1ZGVzIHNlY29uZHMuXG4gKiBUaGV5IHVzdWFsbHkgYXBwZWFyIGZvciBkYXRlcyB0aGF0IGRlbm90ZSB0aW1lIGJlZm9yZSB0aGUgdGltZXpvbmVzIHdlcmUgaW50cm9kdWNlZFxuICogKGUuZy4gZm9yICdFdXJvcGUvUHJhZ3VlJyB0aW1lem9uZSB0aGUgb2Zmc2V0IGlzIEdNVCswMDo1Nzo0NCBiZWZvcmUgMSBPY3RvYmVyIDE4OTFcbiAqIGFuZCBHTVQrMDE6MDA6MDAgYWZ0ZXIgdGhhdCBkYXRlKVxuICpcbiAqIERhdGUjZ2V0VGltZXpvbmVPZmZzZXQgcmV0dXJucyB0aGUgb2Zmc2V0IGluIG1pbnV0ZXMgYW5kIHdvdWxkIHJldHVybiA1NyBmb3IgdGhlIGV4YW1wbGUgYWJvdmUsXG4gKiB3aGljaCB3b3VsZCBsZWFkIHRvIGluY29ycmVjdCBjYWxjdWxhdGlvbnMuXG4gKlxuICogVGhpcyBmdW5jdGlvbiByZXR1cm5zIHRoZSB0aW1lem9uZSBvZmZzZXQgaW4gbWlsbGlzZWNvbmRzIHRoYXQgdGFrZXMgc2Vjb25kcyBpbiBhY2NvdW50LlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRUaW1lem9uZU9mZnNldEluTWlsbGlzZWNvbmRzKGRhdGUpIHtcbiAgdmFyIHV0Y0RhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQyhkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSwgZGF0ZS5nZXREYXRlKCksIGRhdGUuZ2V0SG91cnMoKSwgZGF0ZS5nZXRNaW51dGVzKCksIGRhdGUuZ2V0U2Vjb25kcygpLCBkYXRlLmdldE1pbGxpc2Vjb25kcygpKSk7XG4gIHV0Y0RhdGUuc2V0VVRDRnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpKTtcbiAgcmV0dXJuIGRhdGUuZ2V0VGltZSgpIC0gdXRjRGF0ZS5nZXRUaW1lKCk7XG59IiwiaW1wb3J0IHRvRGF0ZSBmcm9tIFwiLi4vLi4vdG9EYXRlL2luZGV4LmpzXCI7XG5pbXBvcnQgcmVxdWlyZWRBcmdzIGZyb20gXCIuLi9yZXF1aXJlZEFyZ3MvaW5kZXguanNcIjtcbnZhciBNSUxMSVNFQ09ORFNfSU5fREFZID0gODY0MDAwMDA7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRVVENEYXlPZlllYXIoZGlydHlEYXRlKSB7XG4gIHJlcXVpcmVkQXJncygxLCBhcmd1bWVudHMpO1xuICB2YXIgZGF0ZSA9IHRvRGF0ZShkaXJ0eURhdGUpO1xuICB2YXIgdGltZXN0YW1wID0gZGF0ZS5nZXRUaW1lKCk7XG4gIGRhdGUuc2V0VVRDTW9udGgoMCwgMSk7XG4gIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIHZhciBzdGFydE9mWWVhclRpbWVzdGFtcCA9IGRhdGUuZ2V0VGltZSgpO1xuICB2YXIgZGlmZmVyZW5jZSA9IHRpbWVzdGFtcCAtIHN0YXJ0T2ZZZWFyVGltZXN0YW1wO1xuICByZXR1cm4gTWF0aC5mbG9vcihkaWZmZXJlbmNlIC8gTUlMTElTRUNPTkRTX0lOX0RBWSkgKyAxO1xufSIsImltcG9ydCB0b0RhdGUgZnJvbSBcIi4uLy4uL3RvRGF0ZS9pbmRleC5qc1wiO1xuaW1wb3J0IHN0YXJ0T2ZVVENJU09XZWVrIGZyb20gXCIuLi9zdGFydE9mVVRDSVNPV2Vlay9pbmRleC5qc1wiO1xuaW1wb3J0IHN0YXJ0T2ZVVENJU09XZWVrWWVhciBmcm9tIFwiLi4vc3RhcnRPZlVUQ0lTT1dlZWtZZWFyL2luZGV4LmpzXCI7XG5pbXBvcnQgcmVxdWlyZWRBcmdzIGZyb20gXCIuLi9yZXF1aXJlZEFyZ3MvaW5kZXguanNcIjtcbnZhciBNSUxMSVNFQ09ORFNfSU5fV0VFSyA9IDYwNDgwMDAwMDtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFVUQ0lTT1dlZWsoZGlydHlEYXRlKSB7XG4gIHJlcXVpcmVkQXJncygxLCBhcmd1bWVudHMpO1xuICB2YXIgZGF0ZSA9IHRvRGF0ZShkaXJ0eURhdGUpO1xuICB2YXIgZGlmZiA9IHN0YXJ0T2ZVVENJU09XZWVrKGRhdGUpLmdldFRpbWUoKSAtIHN0YXJ0T2ZVVENJU09XZWVrWWVhcihkYXRlKS5nZXRUaW1lKCk7XG5cbiAgLy8gUm91bmQgdGhlIG51bWJlciBvZiBkYXlzIHRvIHRoZSBuZWFyZXN0IGludGVnZXJcbiAgLy8gYmVjYXVzZSB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpbiBhIHdlZWsgaXMgbm90IGNvbnN0YW50XG4gIC8vIChlLmcuIGl0J3MgZGlmZmVyZW50IGluIHRoZSB3ZWVrIG9mIHRoZSBkYXlsaWdodCBzYXZpbmcgdGltZSBjbG9jayBzaGlmdClcbiAgcmV0dXJuIE1hdGgucm91bmQoZGlmZiAvIE1JTExJU0VDT05EU19JTl9XRUVLKSArIDE7XG59IiwiaW1wb3J0IHRvRGF0ZSBmcm9tIFwiLi4vLi4vdG9EYXRlL2luZGV4LmpzXCI7XG5pbXBvcnQgcmVxdWlyZWRBcmdzIGZyb20gXCIuLi9yZXF1aXJlZEFyZ3MvaW5kZXguanNcIjtcbmltcG9ydCBzdGFydE9mVVRDSVNPV2VlayBmcm9tIFwiLi4vc3RhcnRPZlVUQ0lTT1dlZWsvaW5kZXguanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFVUQ0lTT1dlZWtZZWFyKGRpcnR5RGF0ZSkge1xuICByZXF1aXJlZEFyZ3MoMSwgYXJndW1lbnRzKTtcbiAgdmFyIGRhdGUgPSB0b0RhdGUoZGlydHlEYXRlKTtcbiAgdmFyIHllYXIgPSBkYXRlLmdldFVUQ0Z1bGxZZWFyKCk7XG4gIHZhciBmb3VydGhPZkphbnVhcnlPZk5leHRZZWFyID0gbmV3IERhdGUoMCk7XG4gIGZvdXJ0aE9mSmFudWFyeU9mTmV4dFllYXIuc2V0VVRDRnVsbFllYXIoeWVhciArIDEsIDAsIDQpO1xuICBmb3VydGhPZkphbnVhcnlPZk5leHRZZWFyLnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICB2YXIgc3RhcnRPZk5leHRZZWFyID0gc3RhcnRPZlVUQ0lTT1dlZWsoZm91cnRoT2ZKYW51YXJ5T2ZOZXh0WWVhcik7XG4gIHZhciBmb3VydGhPZkphbnVhcnlPZlRoaXNZZWFyID0gbmV3IERhdGUoMCk7XG4gIGZvdXJ0aE9mSmFudWFyeU9mVGhpc1llYXIuc2V0VVRDRnVsbFllYXIoeWVhciwgMCwgNCk7XG4gIGZvdXJ0aE9mSmFudWFyeU9mVGhpc1llYXIuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIHZhciBzdGFydE9mVGhpc1llYXIgPSBzdGFydE9mVVRDSVNPV2Vlayhmb3VydGhPZkphbnVhcnlPZlRoaXNZZWFyKTtcbiAgaWYgKGRhdGUuZ2V0VGltZSgpID49IHN0YXJ0T2ZOZXh0WWVhci5nZXRUaW1lKCkpIHtcbiAgICByZXR1cm4geWVhciArIDE7XG4gIH0gZWxzZSBpZiAoZGF0ZS5nZXRUaW1lKCkgPj0gc3RhcnRPZlRoaXNZZWFyLmdldFRpbWUoKSkge1xuICAgIHJldHVybiB5ZWFyO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB5ZWFyIC0gMTtcbiAgfVxufSIsImltcG9ydCB0b0RhdGUgZnJvbSBcIi4uLy4uL3RvRGF0ZS9pbmRleC5qc1wiO1xuaW1wb3J0IHN0YXJ0T2ZVVENXZWVrIGZyb20gXCIuLi9zdGFydE9mVVRDV2Vlay9pbmRleC5qc1wiO1xuaW1wb3J0IHN0YXJ0T2ZVVENXZWVrWWVhciBmcm9tIFwiLi4vc3RhcnRPZlVUQ1dlZWtZZWFyL2luZGV4LmpzXCI7XG5pbXBvcnQgcmVxdWlyZWRBcmdzIGZyb20gXCIuLi9yZXF1aXJlZEFyZ3MvaW5kZXguanNcIjtcbnZhciBNSUxMSVNFQ09ORFNfSU5fV0VFSyA9IDYwNDgwMDAwMDtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFVUQ1dlZWsoZGlydHlEYXRlLCBvcHRpb25zKSB7XG4gIHJlcXVpcmVkQXJncygxLCBhcmd1bWVudHMpO1xuICB2YXIgZGF0ZSA9IHRvRGF0ZShkaXJ0eURhdGUpO1xuICB2YXIgZGlmZiA9IHN0YXJ0T2ZVVENXZWVrKGRhdGUsIG9wdGlvbnMpLmdldFRpbWUoKSAtIHN0YXJ0T2ZVVENXZWVrWWVhcihkYXRlLCBvcHRpb25zKS5nZXRUaW1lKCk7XG5cbiAgLy8gUm91bmQgdGhlIG51bWJlciBvZiBkYXlzIHRvIHRoZSBuZWFyZXN0IGludGVnZXJcbiAgLy8gYmVjYXVzZSB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpbiBhIHdlZWsgaXMgbm90IGNvbnN0YW50XG4gIC8vIChlLmcuIGl0J3MgZGlmZmVyZW50IGluIHRoZSB3ZWVrIG9mIHRoZSBkYXlsaWdodCBzYXZpbmcgdGltZSBjbG9jayBzaGlmdClcbiAgcmV0dXJuIE1hdGgucm91bmQoZGlmZiAvIE1JTExJU0VDT05EU19JTl9XRUVLKSArIDE7XG59IiwiaW1wb3J0IHRvRGF0ZSBmcm9tIFwiLi4vLi4vdG9EYXRlL2luZGV4LmpzXCI7XG5pbXBvcnQgcmVxdWlyZWRBcmdzIGZyb20gXCIuLi9yZXF1aXJlZEFyZ3MvaW5kZXguanNcIjtcbmltcG9ydCBzdGFydE9mVVRDV2VlayBmcm9tIFwiLi4vc3RhcnRPZlVUQ1dlZWsvaW5kZXguanNcIjtcbmltcG9ydCB0b0ludGVnZXIgZnJvbSBcIi4uL3RvSW50ZWdlci9pbmRleC5qc1wiO1xuaW1wb3J0IHsgZ2V0RGVmYXVsdE9wdGlvbnMgfSBmcm9tIFwiLi4vZGVmYXVsdE9wdGlvbnMvaW5kZXguanNcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGdldFVUQ1dlZWtZZWFyKGRpcnR5RGF0ZSwgb3B0aW9ucykge1xuICB2YXIgX3JlZiwgX3JlZjIsIF9yZWYzLCBfb3B0aW9ucyRmaXJzdFdlZWtDb24sIF9vcHRpb25zJGxvY2FsZSwgX29wdGlvbnMkbG9jYWxlJG9wdGlvLCBfZGVmYXVsdE9wdGlvbnMkbG9jYWwsIF9kZWZhdWx0T3B0aW9ucyRsb2NhbDI7XG4gIHJlcXVpcmVkQXJncygxLCBhcmd1bWVudHMpO1xuICB2YXIgZGF0ZSA9IHRvRGF0ZShkaXJ0eURhdGUpO1xuICB2YXIgeWVhciA9IGRhdGUuZ2V0VVRDRnVsbFllYXIoKTtcbiAgdmFyIGRlZmF1bHRPcHRpb25zID0gZ2V0RGVmYXVsdE9wdGlvbnMoKTtcbiAgdmFyIGZpcnN0V2Vla0NvbnRhaW5zRGF0ZSA9IHRvSW50ZWdlcigoX3JlZiA9IChfcmVmMiA9IChfcmVmMyA9IChfb3B0aW9ucyRmaXJzdFdlZWtDb24gPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuZmlyc3RXZWVrQ29udGFpbnNEYXRlKSAhPT0gbnVsbCAmJiBfb3B0aW9ucyRmaXJzdFdlZWtDb24gIT09IHZvaWQgMCA/IF9vcHRpb25zJGZpcnN0V2Vla0NvbiA6IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogKF9vcHRpb25zJGxvY2FsZSA9IG9wdGlvbnMubG9jYWxlKSA9PT0gbnVsbCB8fCBfb3B0aW9ucyRsb2NhbGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChfb3B0aW9ucyRsb2NhbGUkb3B0aW8gPSBfb3B0aW9ucyRsb2NhbGUub3B0aW9ucykgPT09IG51bGwgfHwgX29wdGlvbnMkbG9jYWxlJG9wdGlvID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfb3B0aW9ucyRsb2NhbGUkb3B0aW8uZmlyc3RXZWVrQ29udGFpbnNEYXRlKSAhPT0gbnVsbCAmJiBfcmVmMyAhPT0gdm9pZCAwID8gX3JlZjMgOiBkZWZhdWx0T3B0aW9ucy5maXJzdFdlZWtDb250YWluc0RhdGUpICE9PSBudWxsICYmIF9yZWYyICE9PSB2b2lkIDAgPyBfcmVmMiA6IChfZGVmYXVsdE9wdGlvbnMkbG9jYWwgPSBkZWZhdWx0T3B0aW9ucy5sb2NhbGUpID09PSBudWxsIHx8IF9kZWZhdWx0T3B0aW9ucyRsb2NhbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogKF9kZWZhdWx0T3B0aW9ucyRsb2NhbDIgPSBfZGVmYXVsdE9wdGlvbnMkbG9jYWwub3B0aW9ucykgPT09IG51bGwgfHwgX2RlZmF1bHRPcHRpb25zJGxvY2FsMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2RlZmF1bHRPcHRpb25zJGxvY2FsMi5maXJzdFdlZWtDb250YWluc0RhdGUpICE9PSBudWxsICYmIF9yZWYgIT09IHZvaWQgMCA/IF9yZWYgOiAxKTtcblxuICAvLyBUZXN0IGlmIHdlZWtTdGFydHNPbiBpcyBiZXR3ZWVuIDEgYW5kIDcgX2FuZF8gaXMgbm90IE5hTlxuICBpZiAoIShmaXJzdFdlZWtDb250YWluc0RhdGUgPj0gMSAmJiBmaXJzdFdlZWtDb250YWluc0RhdGUgPD0gNykpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignZmlyc3RXZWVrQ29udGFpbnNEYXRlIG11c3QgYmUgYmV0d2VlbiAxIGFuZCA3IGluY2x1c2l2ZWx5Jyk7XG4gIH1cbiAgdmFyIGZpcnN0V2Vla09mTmV4dFllYXIgPSBuZXcgRGF0ZSgwKTtcbiAgZmlyc3RXZWVrT2ZOZXh0WWVhci5zZXRVVENGdWxsWWVhcih5ZWFyICsgMSwgMCwgZmlyc3RXZWVrQ29udGFpbnNEYXRlKTtcbiAgZmlyc3RXZWVrT2ZOZXh0WWVhci5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgdmFyIHN0YXJ0T2ZOZXh0WWVhciA9IHN0YXJ0T2ZVVENXZWVrKGZpcnN0V2Vla09mTmV4dFllYXIsIG9wdGlvbnMpO1xuICB2YXIgZmlyc3RXZWVrT2ZUaGlzWWVhciA9IG5ldyBEYXRlKDApO1xuICBmaXJzdFdlZWtPZlRoaXNZZWFyLnNldFVUQ0Z1bGxZZWFyKHllYXIsIDAsIGZpcnN0V2Vla0NvbnRhaW5zRGF0ZSk7XG4gIGZpcnN0V2Vla09mVGhpc1llYXIuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIHZhciBzdGFydE9mVGhpc1llYXIgPSBzdGFydE9mVVRDV2VlayhmaXJzdFdlZWtPZlRoaXNZZWFyLCBvcHRpb25zKTtcbiAgaWYgKGRhdGUuZ2V0VGltZSgpID49IHN0YXJ0T2ZOZXh0WWVhci5nZXRUaW1lKCkpIHtcbiAgICByZXR1cm4geWVhciArIDE7XG4gIH0gZWxzZSBpZiAoZGF0ZS5nZXRUaW1lKCkgPj0gc3RhcnRPZlRoaXNZZWFyLmdldFRpbWUoKSkge1xuICAgIHJldHVybiB5ZWFyO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB5ZWFyIC0gMTtcbiAgfVxufSIsInZhciBwcm90ZWN0ZWREYXlPZlllYXJUb2tlbnMgPSBbJ0QnLCAnREQnXTtcbnZhciBwcm90ZWN0ZWRXZWVrWWVhclRva2VucyA9IFsnWVknLCAnWVlZWSddO1xuZXhwb3J0IGZ1bmN0aW9uIGlzUHJvdGVjdGVkRGF5T2ZZZWFyVG9rZW4odG9rZW4pIHtcbiAgcmV0dXJuIHByb3RlY3RlZERheU9mWWVhclRva2Vucy5pbmRleE9mKHRva2VuKSAhPT0gLTE7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNQcm90ZWN0ZWRXZWVrWWVhclRva2VuKHRva2VuKSB7XG4gIHJldHVybiBwcm90ZWN0ZWRXZWVrWWVhclRva2Vucy5pbmRleE9mKHRva2VuKSAhPT0gLTE7XG59XG5leHBvcnQgZnVuY3Rpb24gdGhyb3dQcm90ZWN0ZWRFcnJvcih0b2tlbiwgZm9ybWF0LCBpbnB1dCkge1xuICBpZiAodG9rZW4gPT09ICdZWVlZJykge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiVXNlIGB5eXl5YCBpbnN0ZWFkIG9mIGBZWVlZYCAoaW4gYFwiLmNvbmNhdChmb3JtYXQsIFwiYCkgZm9yIGZvcm1hdHRpbmcgeWVhcnMgdG8gdGhlIGlucHV0IGBcIikuY29uY2F0KGlucHV0LCBcImA7IHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdW5pY29kZVRva2Vucy5tZFwiKSk7XG4gIH0gZWxzZSBpZiAodG9rZW4gPT09ICdZWScpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIlVzZSBgeXlgIGluc3RlYWQgb2YgYFlZYCAoaW4gYFwiLmNvbmNhdChmb3JtYXQsIFwiYCkgZm9yIGZvcm1hdHRpbmcgeWVhcnMgdG8gdGhlIGlucHV0IGBcIikuY29uY2F0KGlucHV0LCBcImA7IHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdW5pY29kZVRva2Vucy5tZFwiKSk7XG4gIH0gZWxzZSBpZiAodG9rZW4gPT09ICdEJykge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKFwiVXNlIGBkYCBpbnN0ZWFkIG9mIGBEYCAoaW4gYFwiLmNvbmNhdChmb3JtYXQsIFwiYCkgZm9yIGZvcm1hdHRpbmcgZGF5cyBvZiB0aGUgbW9udGggdG8gdGhlIGlucHV0IGBcIikuY29uY2F0KGlucHV0LCBcImA7IHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdW5pY29kZVRva2Vucy5tZFwiKSk7XG4gIH0gZWxzZSBpZiAodG9rZW4gPT09ICdERCcpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcIlVzZSBgZGRgIGluc3RlYWQgb2YgYEREYCAoaW4gYFwiLmNvbmNhdChmb3JtYXQsIFwiYCkgZm9yIGZvcm1hdHRpbmcgZGF5cyBvZiB0aGUgbW9udGggdG8gdGhlIGlucHV0IGBcIikuY29uY2F0KGlucHV0LCBcImA7IHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdW5pY29kZVRva2Vucy5tZFwiKSk7XG4gIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZXF1aXJlZEFyZ3MocmVxdWlyZWQsIGFyZ3MpIHtcbiAgaWYgKGFyZ3MubGVuZ3RoIDwgcmVxdWlyZWQpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHJlcXVpcmVkICsgJyBhcmd1bWVudCcgKyAocmVxdWlyZWQgPiAxID8gJ3MnIDogJycpICsgJyByZXF1aXJlZCwgYnV0IG9ubHkgJyArIGFyZ3MubGVuZ3RoICsgJyBwcmVzZW50Jyk7XG4gIH1cbn0iLCJpbXBvcnQgdG9EYXRlIGZyb20gXCIuLi8uLi90b0RhdGUvaW5kZXguanNcIjtcbmltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL3JlcXVpcmVkQXJncy9pbmRleC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3RhcnRPZlVUQ0lTT1dlZWsoZGlydHlEYXRlKSB7XG4gIHJlcXVpcmVkQXJncygxLCBhcmd1bWVudHMpO1xuICB2YXIgd2Vla1N0YXJ0c09uID0gMTtcbiAgdmFyIGRhdGUgPSB0b0RhdGUoZGlydHlEYXRlKTtcbiAgdmFyIGRheSA9IGRhdGUuZ2V0VVRDRGF5KCk7XG4gIHZhciBkaWZmID0gKGRheSA8IHdlZWtTdGFydHNPbiA/IDcgOiAwKSArIGRheSAtIHdlZWtTdGFydHNPbjtcbiAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpIC0gZGlmZik7XG4gIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIHJldHVybiBkYXRlO1xufSIsImltcG9ydCBnZXRVVENJU09XZWVrWWVhciBmcm9tIFwiLi4vZ2V0VVRDSVNPV2Vla1llYXIvaW5kZXguanNcIjtcbmltcG9ydCBzdGFydE9mVVRDSVNPV2VlayBmcm9tIFwiLi4vc3RhcnRPZlVUQ0lTT1dlZWsvaW5kZXguanNcIjtcbmltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL3JlcXVpcmVkQXJncy9pbmRleC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3RhcnRPZlVUQ0lTT1dlZWtZZWFyKGRpcnR5RGF0ZSkge1xuICByZXF1aXJlZEFyZ3MoMSwgYXJndW1lbnRzKTtcbiAgdmFyIHllYXIgPSBnZXRVVENJU09XZWVrWWVhcihkaXJ0eURhdGUpO1xuICB2YXIgZm91cnRoT2ZKYW51YXJ5ID0gbmV3IERhdGUoMCk7XG4gIGZvdXJ0aE9mSmFudWFyeS5zZXRVVENGdWxsWWVhcih5ZWFyLCAwLCA0KTtcbiAgZm91cnRoT2ZKYW51YXJ5LnNldFVUQ0hvdXJzKDAsIDAsIDAsIDApO1xuICB2YXIgZGF0ZSA9IHN0YXJ0T2ZVVENJU09XZWVrKGZvdXJ0aE9mSmFudWFyeSk7XG4gIHJldHVybiBkYXRlO1xufSIsImltcG9ydCB0b0RhdGUgZnJvbSBcIi4uLy4uL3RvRGF0ZS9pbmRleC5qc1wiO1xuaW1wb3J0IHJlcXVpcmVkQXJncyBmcm9tIFwiLi4vcmVxdWlyZWRBcmdzL2luZGV4LmpzXCI7XG5pbXBvcnQgdG9JbnRlZ2VyIGZyb20gXCIuLi90b0ludGVnZXIvaW5kZXguanNcIjtcbmltcG9ydCB7IGdldERlZmF1bHRPcHRpb25zIH0gZnJvbSBcIi4uL2RlZmF1bHRPcHRpb25zL2luZGV4LmpzXCI7XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdGFydE9mVVRDV2VlayhkaXJ0eURhdGUsIG9wdGlvbnMpIHtcbiAgdmFyIF9yZWYsIF9yZWYyLCBfcmVmMywgX29wdGlvbnMkd2Vla1N0YXJ0c09uLCBfb3B0aW9ucyRsb2NhbGUsIF9vcHRpb25zJGxvY2FsZSRvcHRpbywgX2RlZmF1bHRPcHRpb25zJGxvY2FsLCBfZGVmYXVsdE9wdGlvbnMkbG9jYWwyO1xuICByZXF1aXJlZEFyZ3MoMSwgYXJndW1lbnRzKTtcbiAgdmFyIGRlZmF1bHRPcHRpb25zID0gZ2V0RGVmYXVsdE9wdGlvbnMoKTtcbiAgdmFyIHdlZWtTdGFydHNPbiA9IHRvSW50ZWdlcigoX3JlZiA9IChfcmVmMiA9IChfcmVmMyA9IChfb3B0aW9ucyR3ZWVrU3RhcnRzT24gPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMud2Vla1N0YXJ0c09uKSAhPT0gbnVsbCAmJiBfb3B0aW9ucyR3ZWVrU3RhcnRzT24gIT09IHZvaWQgMCA/IF9vcHRpb25zJHdlZWtTdGFydHNPbiA6IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogKF9vcHRpb25zJGxvY2FsZSA9IG9wdGlvbnMubG9jYWxlKSA9PT0gbnVsbCB8fCBfb3B0aW9ucyRsb2NhbGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChfb3B0aW9ucyRsb2NhbGUkb3B0aW8gPSBfb3B0aW9ucyRsb2NhbGUub3B0aW9ucykgPT09IG51bGwgfHwgX29wdGlvbnMkbG9jYWxlJG9wdGlvID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfb3B0aW9ucyRsb2NhbGUkb3B0aW8ud2Vla1N0YXJ0c09uKSAhPT0gbnVsbCAmJiBfcmVmMyAhPT0gdm9pZCAwID8gX3JlZjMgOiBkZWZhdWx0T3B0aW9ucy53ZWVrU3RhcnRzT24pICE9PSBudWxsICYmIF9yZWYyICE9PSB2b2lkIDAgPyBfcmVmMiA6IChfZGVmYXVsdE9wdGlvbnMkbG9jYWwgPSBkZWZhdWx0T3B0aW9ucy5sb2NhbGUpID09PSBudWxsIHx8IF9kZWZhdWx0T3B0aW9ucyRsb2NhbCA9PT0gdm9pZCAwID8gdm9pZCAwIDogKF9kZWZhdWx0T3B0aW9ucyRsb2NhbDIgPSBfZGVmYXVsdE9wdGlvbnMkbG9jYWwub3B0aW9ucykgPT09IG51bGwgfHwgX2RlZmF1bHRPcHRpb25zJGxvY2FsMiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2RlZmF1bHRPcHRpb25zJGxvY2FsMi53ZWVrU3RhcnRzT24pICE9PSBudWxsICYmIF9yZWYgIT09IHZvaWQgMCA/IF9yZWYgOiAwKTtcblxuICAvLyBUZXN0IGlmIHdlZWtTdGFydHNPbiBpcyBiZXR3ZWVuIDAgYW5kIDYgX2FuZF8gaXMgbm90IE5hTlxuICBpZiAoISh3ZWVrU3RhcnRzT24gPj0gMCAmJiB3ZWVrU3RhcnRzT24gPD0gNikpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignd2Vla1N0YXJ0c09uIG11c3QgYmUgYmV0d2VlbiAwIGFuZCA2IGluY2x1c2l2ZWx5Jyk7XG4gIH1cbiAgdmFyIGRhdGUgPSB0b0RhdGUoZGlydHlEYXRlKTtcbiAgdmFyIGRheSA9IGRhdGUuZ2V0VVRDRGF5KCk7XG4gIHZhciBkaWZmID0gKGRheSA8IHdlZWtTdGFydHNPbiA/IDcgOiAwKSArIGRheSAtIHdlZWtTdGFydHNPbjtcbiAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpIC0gZGlmZik7XG4gIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIHJldHVybiBkYXRlO1xufSIsImltcG9ydCBnZXRVVENXZWVrWWVhciBmcm9tIFwiLi4vZ2V0VVRDV2Vla1llYXIvaW5kZXguanNcIjtcbmltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL3JlcXVpcmVkQXJncy9pbmRleC5qc1wiO1xuaW1wb3J0IHN0YXJ0T2ZVVENXZWVrIGZyb20gXCIuLi9zdGFydE9mVVRDV2Vlay9pbmRleC5qc1wiO1xuaW1wb3J0IHRvSW50ZWdlciBmcm9tIFwiLi4vdG9JbnRlZ2VyL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBnZXREZWZhdWx0T3B0aW9ucyB9IGZyb20gXCIuLi9kZWZhdWx0T3B0aW9ucy9pbmRleC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3RhcnRPZlVUQ1dlZWtZZWFyKGRpcnR5RGF0ZSwgb3B0aW9ucykge1xuICB2YXIgX3JlZiwgX3JlZjIsIF9yZWYzLCBfb3B0aW9ucyRmaXJzdFdlZWtDb24sIF9vcHRpb25zJGxvY2FsZSwgX29wdGlvbnMkbG9jYWxlJG9wdGlvLCBfZGVmYXVsdE9wdGlvbnMkbG9jYWwsIF9kZWZhdWx0T3B0aW9ucyRsb2NhbDI7XG4gIHJlcXVpcmVkQXJncygxLCBhcmd1bWVudHMpO1xuICB2YXIgZGVmYXVsdE9wdGlvbnMgPSBnZXREZWZhdWx0T3B0aW9ucygpO1xuICB2YXIgZmlyc3RXZWVrQ29udGFpbnNEYXRlID0gdG9JbnRlZ2VyKChfcmVmID0gKF9yZWYyID0gKF9yZWYzID0gKF9vcHRpb25zJGZpcnN0V2Vla0NvbiA9IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5maXJzdFdlZWtDb250YWluc0RhdGUpICE9PSBudWxsICYmIF9vcHRpb25zJGZpcnN0V2Vla0NvbiAhPT0gdm9pZCAwID8gX29wdGlvbnMkZmlyc3RXZWVrQ29uIDogb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiAoX29wdGlvbnMkbG9jYWxlID0gb3B0aW9ucy5sb2NhbGUpID09PSBudWxsIHx8IF9vcHRpb25zJGxvY2FsZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogKF9vcHRpb25zJGxvY2FsZSRvcHRpbyA9IF9vcHRpb25zJGxvY2FsZS5vcHRpb25zKSA9PT0gbnVsbCB8fCBfb3B0aW9ucyRsb2NhbGUkb3B0aW8gPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9vcHRpb25zJGxvY2FsZSRvcHRpby5maXJzdFdlZWtDb250YWluc0RhdGUpICE9PSBudWxsICYmIF9yZWYzICE9PSB2b2lkIDAgPyBfcmVmMyA6IGRlZmF1bHRPcHRpb25zLmZpcnN0V2Vla0NvbnRhaW5zRGF0ZSkgIT09IG51bGwgJiYgX3JlZjIgIT09IHZvaWQgMCA/IF9yZWYyIDogKF9kZWZhdWx0T3B0aW9ucyRsb2NhbCA9IGRlZmF1bHRPcHRpb25zLmxvY2FsZSkgPT09IG51bGwgfHwgX2RlZmF1bHRPcHRpb25zJGxvY2FsID09PSB2b2lkIDAgPyB2b2lkIDAgOiAoX2RlZmF1bHRPcHRpb25zJGxvY2FsMiA9IF9kZWZhdWx0T3B0aW9ucyRsb2NhbC5vcHRpb25zKSA9PT0gbnVsbCB8fCBfZGVmYXVsdE9wdGlvbnMkbG9jYWwyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZGVmYXVsdE9wdGlvbnMkbG9jYWwyLmZpcnN0V2Vla0NvbnRhaW5zRGF0ZSkgIT09IG51bGwgJiYgX3JlZiAhPT0gdm9pZCAwID8gX3JlZiA6IDEpO1xuICB2YXIgeWVhciA9IGdldFVUQ1dlZWtZZWFyKGRpcnR5RGF0ZSwgb3B0aW9ucyk7XG4gIHZhciBmaXJzdFdlZWsgPSBuZXcgRGF0ZSgwKTtcbiAgZmlyc3RXZWVrLnNldFVUQ0Z1bGxZZWFyKHllYXIsIDAsIGZpcnN0V2Vla0NvbnRhaW5zRGF0ZSk7XG4gIGZpcnN0V2Vlay5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgdmFyIGRhdGUgPSBzdGFydE9mVVRDV2VlayhmaXJzdFdlZWssIG9wdGlvbnMpO1xuICByZXR1cm4gZGF0ZTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0b0ludGVnZXIoZGlydHlOdW1iZXIpIHtcbiAgaWYgKGRpcnR5TnVtYmVyID09PSBudWxsIHx8IGRpcnR5TnVtYmVyID09PSB0cnVlIHx8IGRpcnR5TnVtYmVyID09PSBmYWxzZSkge1xuICAgIHJldHVybiBOYU47XG4gIH1cbiAgdmFyIG51bWJlciA9IE51bWJlcihkaXJ0eU51bWJlcik7XG4gIGlmIChpc05hTihudW1iZXIpKSB7XG4gICAgcmV0dXJuIG51bWJlcjtcbiAgfVxuICByZXR1cm4gbnVtYmVyIDwgMCA/IE1hdGguY2VpbChudW1iZXIpIDogTWF0aC5mbG9vcihudW1iZXIpO1xufSIsImltcG9ydCB0b0ludGVnZXIgZnJvbSBcIi4uL19saWIvdG9JbnRlZ2VyL2luZGV4LmpzXCI7XG5pbXBvcnQgdG9EYXRlIGZyb20gXCIuLi90b0RhdGUvaW5kZXguanNcIjtcbmltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL19saWIvcmVxdWlyZWRBcmdzL2luZGV4LmpzXCI7XG4vKipcbiAqIEBuYW1lIGFkZE1pbGxpc2Vjb25kc1xuICogQGNhdGVnb3J5IE1pbGxpc2Vjb25kIEhlbHBlcnNcbiAqIEBzdW1tYXJ5IEFkZCB0aGUgc3BlY2lmaWVkIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gdGhlIGdpdmVuIGRhdGUuXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBZGQgdGhlIHNwZWNpZmllZCBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHRoZSBnaXZlbiBkYXRlLlxuICpcbiAqIEBwYXJhbSB7RGF0ZXxOdW1iZXJ9IGRhdGUgLSB0aGUgZGF0ZSB0byBiZSBjaGFuZ2VkXG4gKiBAcGFyYW0ge051bWJlcn0gYW1vdW50IC0gdGhlIGFtb3VudCBvZiBtaWxsaXNlY29uZHMgdG8gYmUgYWRkZWQuIFBvc2l0aXZlIGRlY2ltYWxzIHdpbGwgYmUgcm91bmRlZCB1c2luZyBgTWF0aC5mbG9vcmAsIGRlY2ltYWxzIGxlc3MgdGhhbiB6ZXJvIHdpbGwgYmUgcm91bmRlZCB1c2luZyBgTWF0aC5jZWlsYC5cbiAqIEByZXR1cm5zIHtEYXRlfSB0aGUgbmV3IGRhdGUgd2l0aCB0aGUgbWlsbGlzZWNvbmRzIGFkZGVkXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9IDIgYXJndW1lbnRzIHJlcXVpcmVkXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIEFkZCA3NTAgbWlsbGlzZWNvbmRzIHRvIDEwIEp1bHkgMjAxNCAxMjo0NTozMC4wMDA6XG4gKiBjb25zdCByZXN1bHQgPSBhZGRNaWxsaXNlY29uZHMobmV3IERhdGUoMjAxNCwgNiwgMTAsIDEyLCA0NSwgMzAsIDApLCA3NTApXG4gKiAvLz0+IFRodSBKdWwgMTAgMjAxNCAxMjo0NTozMC43NTBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWRkTWlsbGlzZWNvbmRzKGRpcnR5RGF0ZSwgZGlydHlBbW91bnQpIHtcbiAgcmVxdWlyZWRBcmdzKDIsIGFyZ3VtZW50cyk7XG4gIHZhciB0aW1lc3RhbXAgPSB0b0RhdGUoZGlydHlEYXRlKS5nZXRUaW1lKCk7XG4gIHZhciBhbW91bnQgPSB0b0ludGVnZXIoZGlydHlBbW91bnQpO1xuICByZXR1cm4gbmV3IERhdGUodGltZXN0YW1wICsgYW1vdW50KTtcbn0iLCJpbXBvcnQgaXNWYWxpZCBmcm9tIFwiLi4vaXNWYWxpZC9pbmRleC5qc1wiO1xuaW1wb3J0IHN1Yk1pbGxpc2Vjb25kcyBmcm9tIFwiLi4vc3ViTWlsbGlzZWNvbmRzL2luZGV4LmpzXCI7XG5pbXBvcnQgdG9EYXRlIGZyb20gXCIuLi90b0RhdGUvaW5kZXguanNcIjtcbmltcG9ydCBmb3JtYXR0ZXJzIGZyb20gXCIuLi9fbGliL2Zvcm1hdC9mb3JtYXR0ZXJzL2luZGV4LmpzXCI7XG5pbXBvcnQgbG9uZ0Zvcm1hdHRlcnMgZnJvbSBcIi4uL19saWIvZm9ybWF0L2xvbmdGb3JtYXR0ZXJzL2luZGV4LmpzXCI7XG5pbXBvcnQgZ2V0VGltZXpvbmVPZmZzZXRJbk1pbGxpc2Vjb25kcyBmcm9tIFwiLi4vX2xpYi9nZXRUaW1lem9uZU9mZnNldEluTWlsbGlzZWNvbmRzL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBpc1Byb3RlY3RlZERheU9mWWVhclRva2VuLCBpc1Byb3RlY3RlZFdlZWtZZWFyVG9rZW4sIHRocm93UHJvdGVjdGVkRXJyb3IgfSBmcm9tIFwiLi4vX2xpYi9wcm90ZWN0ZWRUb2tlbnMvaW5kZXguanNcIjtcbmltcG9ydCB0b0ludGVnZXIgZnJvbSBcIi4uL19saWIvdG9JbnRlZ2VyL2luZGV4LmpzXCI7XG5pbXBvcnQgcmVxdWlyZWRBcmdzIGZyb20gXCIuLi9fbGliL3JlcXVpcmVkQXJncy9pbmRleC5qc1wiO1xuaW1wb3J0IHsgZ2V0RGVmYXVsdE9wdGlvbnMgfSBmcm9tIFwiLi4vX2xpYi9kZWZhdWx0T3B0aW9ucy9pbmRleC5qc1wiO1xuaW1wb3J0IGRlZmF1bHRMb2NhbGUgZnJvbSBcIi4uL19saWIvZGVmYXVsdExvY2FsZS9pbmRleC5qc1wiOyAvLyBUaGlzIFJlZ0V4cCBjb25zaXN0cyBvZiB0aHJlZSBwYXJ0cyBzZXBhcmF0ZWQgYnkgYHxgOlxuLy8gLSBbeVlRcU1Md0lkRGVjaWhIS2ttc11vIG1hdGNoZXMgYW55IGF2YWlsYWJsZSBvcmRpbmFsIG51bWJlciB0b2tlblxuLy8gICAob25lIG9mIHRoZSBjZXJ0YWluIGxldHRlcnMgZm9sbG93ZWQgYnkgYG9gKVxuLy8gLSAoXFx3KVxcMSogbWF0Y2hlcyBhbnkgc2VxdWVuY2VzIG9mIHRoZSBzYW1lIGxldHRlclxuLy8gLSAnJyBtYXRjaGVzIHR3byBxdW90ZSBjaGFyYWN0ZXJzIGluIGEgcm93XG4vLyAtICcoJyd8W14nXSkrKCd8JCkgbWF0Y2hlcyBhbnl0aGluZyBzdXJyb3VuZGVkIGJ5IHR3byBxdW90ZSBjaGFyYWN0ZXJzICgnKSxcbi8vICAgZXhjZXB0IGEgc2luZ2xlIHF1b3RlIHN5bWJvbCwgd2hpY2ggZW5kcyB0aGUgc2VxdWVuY2UuXG4vLyAgIFR3byBxdW90ZSBjaGFyYWN0ZXJzIGRvIG5vdCBlbmQgdGhlIHNlcXVlbmNlLlxuLy8gICBJZiB0aGVyZSBpcyBubyBtYXRjaGluZyBzaW5nbGUgcXVvdGVcbi8vICAgdGhlbiB0aGUgc2VxdWVuY2Ugd2lsbCBjb250aW51ZSB1bnRpbCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcuXG4vLyAtIC4gbWF0Y2hlcyBhbnkgc2luZ2xlIGNoYXJhY3RlciB1bm1hdGNoZWQgYnkgcHJldmlvdXMgcGFydHMgb2YgdGhlIFJlZ0V4cHNcbnZhciBmb3JtYXR0aW5nVG9rZW5zUmVnRXhwID0gL1t5WVFxTUx3SWREZWNpaEhLa21zXW98KFxcdylcXDEqfCcnfCcoJyd8W14nXSkrKCd8JCl8Li9nO1xuXG4vLyBUaGlzIFJlZ0V4cCBjYXRjaGVzIHN5bWJvbHMgZXNjYXBlZCBieSBxdW90ZXMsIGFuZCBhbHNvXG4vLyBzZXF1ZW5jZXMgb2Ygc3ltYm9scyBQLCBwLCBhbmQgdGhlIGNvbWJpbmF0aW9ucyBsaWtlIGBQUFBQUFBQcHBwcHBgXG52YXIgbG9uZ0Zvcm1hdHRpbmdUb2tlbnNSZWdFeHAgPSAvUCtwK3xQK3xwK3wnJ3wnKCcnfFteJ10pKygnfCQpfC4vZztcbnZhciBlc2NhcGVkU3RyaW5nUmVnRXhwID0gL14nKFteXSo/KSc/JC87XG52YXIgZG91YmxlUXVvdGVSZWdFeHAgPSAvJycvZztcbnZhciB1bmVzY2FwZWRMYXRpbkNoYXJhY3RlclJlZ0V4cCA9IC9bYS16QS1aXS87XG5cbi8qKlxuICogQG5hbWUgZm9ybWF0XG4gKiBAY2F0ZWdvcnkgQ29tbW9uIEhlbHBlcnNcbiAqIEBzdW1tYXJ5IEZvcm1hdCB0aGUgZGF0ZS5cbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFJldHVybiB0aGUgZm9ybWF0dGVkIGRhdGUgc3RyaW5nIGluIHRoZSBnaXZlbiBmb3JtYXQuIFRoZSByZXN1bHQgbWF5IHZhcnkgYnkgbG9jYWxlLlxuICpcbiAqID4g4pqg77iPIFBsZWFzZSBub3RlIHRoYXQgdGhlIGBmb3JtYXRgIHRva2VucyBkaWZmZXIgZnJvbSBNb21lbnQuanMgYW5kIG90aGVyIGxpYnJhcmllcy5cbiAqID4gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZGF0ZS1mbnMvZGF0ZS1mbnMvYmxvYi9tYXN0ZXIvZG9jcy91bmljb2RlVG9rZW5zLm1kXG4gKlxuICogVGhlIGNoYXJhY3RlcnMgd3JhcHBlZCBiZXR3ZWVuIHR3byBzaW5nbGUgcXVvdGVzIGNoYXJhY3RlcnMgKCcpIGFyZSBlc2NhcGVkLlxuICogVHdvIHNpbmdsZSBxdW90ZXMgaW4gYSByb3csIHdoZXRoZXIgaW5zaWRlIG9yIG91dHNpZGUgYSBxdW90ZWQgc2VxdWVuY2UsIHJlcHJlc2VudCBhICdyZWFsJyBzaW5nbGUgcXVvdGUuXG4gKiAoc2VlIHRoZSBsYXN0IGV4YW1wbGUpXG4gKlxuICogRm9ybWF0IG9mIHRoZSBzdHJpbmcgaXMgYmFzZWQgb24gVW5pY29kZSBUZWNobmljYWwgU3RhbmRhcmQgIzM1OlxuICogaHR0cHM6Ly93d3cudW5pY29kZS5vcmcvcmVwb3J0cy90cjM1L3RyMzUtZGF0ZXMuaHRtbCNEYXRlX0ZpZWxkX1N5bWJvbF9UYWJsZVxuICogd2l0aCBhIGZldyBhZGRpdGlvbnMgKHNlZSBub3RlIDcgYmVsb3cgdGhlIHRhYmxlKS5cbiAqXG4gKiBBY2NlcHRlZCBwYXR0ZXJuczpcbiAqIHwgVW5pdCAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFBhdHRlcm4gfCBSZXN1bHQgZXhhbXBsZXMgICAgICAgICAgICAgICAgICAgfCBOb3RlcyB8XG4gKiB8LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tfC0tLS0tLS0tLXwtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXwtLS0tLS0tfFxuICogfCBFcmEgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgRy4uR0dHICB8IEFELCBCQyAgICAgICAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IEdHR0cgICAgfCBBbm5vIERvbWluaSwgQmVmb3JlIENocmlzdCAgICAgICAgfCAyICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBHR0dHRyAgIHwgQSwgQiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCBDYWxlbmRhciB5ZWFyICAgICAgICAgICAgICAgICAgIHwgeSAgICAgICB8IDQ0LCAxLCAxOTAwLCAyMDE3ICAgICAgICAgICAgICAgICB8IDUgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHlvICAgICAgfCA0NHRoLCAxc3QsIDB0aCwgMTd0aCAgICAgICAgICAgICAgfCA1LDcgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCB5eSAgICAgIHwgNDQsIDAxLCAwMCwgMTcgICAgICAgICAgICAgICAgICAgIHwgNSAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgeXl5ICAgICB8IDA0NCwgMDAxLCAxOTAwLCAyMDE3ICAgICAgICAgICAgICB8IDUgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHl5eXkgICAgfCAwMDQ0LCAwMDAxLCAxOTAwLCAyMDE3ICAgICAgICAgICAgfCA1ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCB5eXl5eSAgIHwgLi4uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgMyw1ICAgfFxuICogfCBMb2NhbCB3ZWVrLW51bWJlcmluZyB5ZWFyICAgICAgIHwgWSAgICAgICB8IDQ0LCAxLCAxOTAwLCAyMDE3ICAgICAgICAgICAgICAgICB8IDUgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFlvICAgICAgfCA0NHRoLCAxc3QsIDE5MDB0aCwgMjAxN3RoICAgICAgICAgfCA1LDcgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBZWSAgICAgIHwgNDQsIDAxLCAwMCwgMTcgICAgICAgICAgICAgICAgICAgIHwgNSw4ICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgWVlZICAgICB8IDA0NCwgMDAxLCAxOTAwLCAyMDE3ICAgICAgICAgICAgICB8IDUgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFlZWVkgICAgfCAwMDQ0LCAwMDAxLCAxOTAwLCAyMDE3ICAgICAgICAgICAgfCA1LDggICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBZWVlZWSAgIHwgLi4uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgMyw1ICAgfFxuICogfCBJU08gd2Vlay1udW1iZXJpbmcgeWVhciAgICAgICAgIHwgUiAgICAgICB8IC00MywgMCwgMSwgMTkwMCwgMjAxNyAgICAgICAgICAgICB8IDUsNyAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFJSICAgICAgfCAtNDMsIDAwLCAwMSwgMTkwMCwgMjAxNyAgICAgICAgICAgfCA1LDcgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBSUlIgICAgIHwgLTA0MywgMDAwLCAwMDEsIDE5MDAsIDIwMTcgICAgICAgIHwgNSw3ICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgUlJSUiAgICB8IC0wMDQzLCAwMDAwLCAwMDAxLCAxOTAwLCAyMDE3ICAgICB8IDUsNyAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFJSUlJSICAgfCAuLi4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAzLDUsNyB8XG4gKiB8IEV4dGVuZGVkIHllYXIgICAgICAgICAgICAgICAgICAgfCB1ICAgICAgIHwgLTQzLCAwLCAxLCAxOTAwLCAyMDE3ICAgICAgICAgICAgIHwgNSAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgdXUgICAgICB8IC00MywgMDEsIDE5MDAsIDIwMTcgICAgICAgICAgICAgICB8IDUgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHV1dSAgICAgfCAtMDQzLCAwMDEsIDE5MDAsIDIwMTcgICAgICAgICAgICAgfCA1ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCB1dXV1ICAgIHwgLTAwNDMsIDAwMDEsIDE5MDAsIDIwMTcgICAgICAgICAgIHwgNSAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgdXV1dXUgICB8IC4uLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IDMsNSAgIHxcbiAqIHwgUXVhcnRlciAoZm9ybWF0dGluZykgICAgICAgICAgICB8IFEgICAgICAgfCAxLCAyLCAzLCA0ICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBRbyAgICAgIHwgMXN0LCAybmQsIDNyZCwgNHRoICAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgUVEgICAgICB8IDAxLCAwMiwgMDMsIDA0ICAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFFRUSAgICAgfCBRMSwgUTIsIFEzLCBRNCAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBRUVFRICAgIHwgMXN0IHF1YXJ0ZXIsIDJuZCBxdWFydGVyLCAuLi4gICAgIHwgMiAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgUVFRUVEgICB8IDEsIDIsIDMsIDQgICAgICAgICAgICAgICAgICAgICAgICB8IDQgICAgIHxcbiAqIHwgUXVhcnRlciAoc3RhbmQtYWxvbmUpICAgICAgICAgICB8IHEgICAgICAgfCAxLCAyLCAzLCA0ICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBxbyAgICAgIHwgMXN0LCAybmQsIDNyZCwgNHRoICAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgcXEgICAgICB8IDAxLCAwMiwgMDMsIDA0ICAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHFxcSAgICAgfCBRMSwgUTIsIFEzLCBRNCAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBxcXFxICAgIHwgMXN0IHF1YXJ0ZXIsIDJuZCBxdWFydGVyLCAuLi4gICAgIHwgMiAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgcXFxcXEgICB8IDEsIDIsIDMsIDQgICAgICAgICAgICAgICAgICAgICAgICB8IDQgICAgIHxcbiAqIHwgTW9udGggKGZvcm1hdHRpbmcpICAgICAgICAgICAgICB8IE0gICAgICAgfCAxLCAyLCAuLi4sIDEyICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBNbyAgICAgIHwgMXN0LCAybmQsIC4uLiwgMTJ0aCAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgTU0gICAgICB8IDAxLCAwMiwgLi4uLCAxMiAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IE1NTSAgICAgfCBKYW4sIEZlYiwgLi4uLCBEZWMgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBNTU1NICAgIHwgSmFudWFyeSwgRmVicnVhcnksIC4uLiwgRGVjZW1iZXIgIHwgMiAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgTU1NTU0gICB8IEosIEYsIC4uLiwgRCAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgTW9udGggKHN0YW5kLWFsb25lKSAgICAgICAgICAgICB8IEwgICAgICAgfCAxLCAyLCAuLi4sIDEyICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBMbyAgICAgIHwgMXN0LCAybmQsIC4uLiwgMTJ0aCAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgTEwgICAgICB8IDAxLCAwMiwgLi4uLCAxMiAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IExMTCAgICAgfCBKYW4sIEZlYiwgLi4uLCBEZWMgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBMTExMICAgIHwgSmFudWFyeSwgRmVicnVhcnksIC4uLiwgRGVjZW1iZXIgIHwgMiAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgTExMTEwgICB8IEosIEYsIC4uLiwgRCAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgTG9jYWwgd2VlayBvZiB5ZWFyICAgICAgICAgICAgICB8IHcgICAgICAgfCAxLCAyLCAuLi4sIDUzICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCB3byAgICAgIHwgMXN0LCAybmQsIC4uLiwgNTN0aCAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgd3cgICAgICB8IDAxLCAwMiwgLi4uLCA1MyAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgSVNPIHdlZWsgb2YgeWVhciAgICAgICAgICAgICAgICB8IEkgICAgICAgfCAxLCAyLCAuLi4sIDUzICAgICAgICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBJbyAgICAgIHwgMXN0LCAybmQsIC4uLiwgNTN0aCAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgSUkgICAgICB8IDAxLCAwMiwgLi4uLCA1MyAgICAgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgRGF5IG9mIG1vbnRoICAgICAgICAgICAgICAgICAgICB8IGQgICAgICAgfCAxLCAyLCAuLi4sIDMxICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBkbyAgICAgIHwgMXN0LCAybmQsIC4uLiwgMzFzdCAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgZGQgICAgICB8IDAxLCAwMiwgLi4uLCAzMSAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgRGF5IG9mIHllYXIgICAgICAgICAgICAgICAgICAgICB8IEQgICAgICAgfCAxLCAyLCAuLi4sIDM2NSwgMzY2ICAgICAgICAgICAgICAgfCA5ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBEbyAgICAgIHwgMXN0LCAybmQsIC4uLiwgMzY1dGgsIDM2NnRoICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgREQgICAgICB8IDAxLCAwMiwgLi4uLCAzNjUsIDM2NiAgICAgICAgICAgICB8IDkgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IERERCAgICAgfCAwMDEsIDAwMiwgLi4uLCAzNjUsIDM2NiAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBEREREICAgIHwgLi4uICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgMyAgICAgfFxuICogfCBEYXkgb2Ygd2VlayAoZm9ybWF0dGluZykgICAgICAgIHwgRS4uRUVFICB8IE1vbiwgVHVlLCBXZWQsIC4uLiwgU3VuICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IEVFRUUgICAgfCBNb25kYXksIFR1ZXNkYXksIC4uLiwgU3VuZGF5ICAgICAgfCAyICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBFRUVFRSAgIHwgTSwgVCwgVywgVCwgRiwgUywgUyAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgRUVFRUVFICB8IE1vLCBUdSwgV2UsIFRoLCBGciwgU2EsIFN1ICAgICAgICB8ICAgICAgIHxcbiAqIHwgSVNPIGRheSBvZiB3ZWVrIChmb3JtYXR0aW5nKSAgICB8IGkgICAgICAgfCAxLCAyLCAzLCAuLi4sIDcgICAgICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBpbyAgICAgIHwgMXN0LCAybmQsIC4uLiwgN3RoICAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgaWkgICAgICB8IDAxLCAwMiwgLi4uLCAwNyAgICAgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGlpaSAgICAgfCBNb24sIFR1ZSwgV2VkLCAuLi4sIFN1biAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBpaWlpICAgIHwgTW9uZGF5LCBUdWVzZGF5LCAuLi4sIFN1bmRheSAgICAgIHwgMiw3ICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgaWlpaWkgICB8IE0sIFQsIFcsIFQsIEYsIFMsIFMgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGlpaWlpaSAgfCBNbywgVHUsIFdlLCBUaCwgRnIsIFNhLCBTdSAgICAgICAgfCA3ICAgICB8XG4gKiB8IExvY2FsIGRheSBvZiB3ZWVrIChmb3JtYXR0aW5nKSAgfCBlICAgICAgIHwgMiwgMywgNCwgLi4uLCAxICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgZW8gICAgICB8IDJuZCwgM3JkLCAuLi4sIDFzdCAgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGVlICAgICAgfCAwMiwgMDMsIC4uLiwgMDEgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBlZWUgICAgIHwgTW9uLCBUdWUsIFdlZCwgLi4uLCBTdW4gICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgZWVlZSAgICB8IE1vbmRheSwgVHVlc2RheSwgLi4uLCBTdW5kYXkgICAgICB8IDIgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGVlZWVlICAgfCBNLCBULCBXLCBULCBGLCBTLCBTICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBlZWVlZWUgIHwgTW8sIFR1LCBXZSwgVGgsIEZyLCBTYSwgU3UgICAgICAgIHwgICAgICAgfFxuICogfCBMb2NhbCBkYXkgb2Ygd2VlayAoc3RhbmQtYWxvbmUpIHwgYyAgICAgICB8IDIsIDMsIDQsIC4uLiwgMSAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGNvICAgICAgfCAybmQsIDNyZCwgLi4uLCAxc3QgICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBjYyAgICAgIHwgMDIsIDAzLCAuLi4sIDAxICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgY2NjICAgICB8IE1vbiwgVHVlLCBXZWQsIC4uLiwgU3VuICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGNjY2MgICAgfCBNb25kYXksIFR1ZXNkYXksIC4uLiwgU3VuZGF5ICAgICAgfCAyICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBjY2NjYyAgIHwgTSwgVCwgVywgVCwgRiwgUywgUyAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgY2NjY2NjICB8IE1vLCBUdSwgV2UsIFRoLCBGciwgU2EsIFN1ICAgICAgICB8ICAgICAgIHxcbiAqIHwgQU0sIFBNICAgICAgICAgICAgICAgICAgICAgICAgICB8IGEuLmFhICAgfCBBTSwgUE0gICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBhYWEgICAgIHwgYW0sIHBtICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgYWFhYSAgICB8IGEubS4sIHAubS4gICAgICAgICAgICAgICAgICAgICAgICB8IDIgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGFhYWFhICAgfCBhLCBwICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8IEFNLCBQTSwgbm9vbiwgbWlkbmlnaHQgICAgICAgICAgfCBiLi5iYiAgIHwgQU0sIFBNLCBub29uLCBtaWRuaWdodCAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgYmJiICAgICB8IGFtLCBwbSwgbm9vbiwgbWlkbmlnaHQgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGJiYmIgICAgfCBhLm0uLCBwLm0uLCBub29uLCBtaWRuaWdodCAgICAgICAgfCAyICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBiYmJiYiAgIHwgYSwgcCwgbiwgbWkgICAgICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCBGbGV4aWJsZSBkYXkgcGVyaW9kICAgICAgICAgICAgIHwgQi4uQkJCICB8IGF0IG5pZ2h0LCBpbiB0aGUgbW9ybmluZywgLi4uICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IEJCQkIgICAgfCBhdCBuaWdodCwgaW4gdGhlIG1vcm5pbmcsIC4uLiAgICAgfCAyICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBCQkJCQiAgIHwgYXQgbmlnaHQsIGluIHRoZSBtb3JuaW5nLCAuLi4gICAgIHwgICAgICAgfFxuICogfCBIb3VyIFsxLTEyXSAgICAgICAgICAgICAgICAgICAgIHwgaCAgICAgICB8IDEsIDIsIC4uLiwgMTEsIDEyICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGhvICAgICAgfCAxc3QsIDJuZCwgLi4uLCAxMXRoLCAxMnRoICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBoaCAgICAgIHwgMDEsIDAyLCAuLi4sIDExLCAxMiAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCBIb3VyIFswLTIzXSAgICAgICAgICAgICAgICAgICAgIHwgSCAgICAgICB8IDAsIDEsIDIsIC4uLiwgMjMgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IEhvICAgICAgfCAwdGgsIDFzdCwgMm5kLCAuLi4sIDIzcmQgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBISCAgICAgIHwgMDAsIDAxLCAwMiwgLi4uLCAyMyAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCBIb3VyIFswLTExXSAgICAgICAgICAgICAgICAgICAgIHwgSyAgICAgICB8IDEsIDIsIC4uLiwgMTEsIDAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IEtvICAgICAgfCAxc3QsIDJuZCwgLi4uLCAxMXRoLCAwdGggICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBLSyAgICAgIHwgMDEsIDAyLCAuLi4sIDExLCAwMCAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCBIb3VyIFsxLTI0XSAgICAgICAgICAgICAgICAgICAgIHwgayAgICAgICB8IDI0LCAxLCAyLCAuLi4sIDIzICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IGtvICAgICAgfCAyNHRoLCAxc3QsIDJuZCwgLi4uLCAyM3JkICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBrayAgICAgIHwgMjQsIDAxLCAwMiwgLi4uLCAyMyAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCBNaW51dGUgICAgICAgICAgICAgICAgICAgICAgICAgIHwgbSAgICAgICB8IDAsIDEsIC4uLiwgNTkgICAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IG1vICAgICAgfCAwdGgsIDFzdCwgLi4uLCA1OXRoICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBtbSAgICAgIHwgMDAsIDAxLCAuLi4sIDU5ICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCBTZWNvbmQgICAgICAgICAgICAgICAgICAgICAgICAgIHwgcyAgICAgICB8IDAsIDEsIC4uLiwgNTkgICAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHNvICAgICAgfCAwdGgsIDFzdCwgLi4uLCA1OXRoICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBzcyAgICAgIHwgMDAsIDAxLCAuLi4sIDU5ICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCBGcmFjdGlvbiBvZiBzZWNvbmQgICAgICAgICAgICAgIHwgUyAgICAgICB8IDAsIDEsIC4uLiwgOSAgICAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFNTICAgICAgfCAwMCwgMDEsIC4uLiwgOTkgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBTU1MgICAgIHwgMDAwLCAwMDEsIC4uLiwgOTk5ICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgU1NTUyAgICB8IC4uLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IDMgICAgIHxcbiAqIHwgVGltZXpvbmUgKElTTy04NjAxIHcvIFopICAgICAgICB8IFggICAgICAgfCAtMDgsICswNTMwLCBaICAgICAgICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBYWCAgICAgIHwgLTA4MDAsICswNTMwLCBaICAgICAgICAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgWFhYICAgICB8IC0wODowMCwgKzA1OjMwLCBaICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFhYWFggICAgfCAtMDgwMCwgKzA1MzAsIFosICsxMjM0NTYgICAgICAgICAgfCAyICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBYWFhYWCAgIHwgLTA4OjAwLCArMDU6MzAsIFosICsxMjozNDo1NiAgICAgIHwgICAgICAgfFxuICogfCBUaW1lem9uZSAoSVNPLTg2MDEgdy9vIFopICAgICAgIHwgeCAgICAgICB8IC0wOCwgKzA1MzAsICswMCAgICAgICAgICAgICAgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHh4ICAgICAgfCAtMDgwMCwgKzA1MzAsICswMDAwICAgICAgICAgICAgICAgfCAgICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCB4eHggICAgIHwgLTA4OjAwLCArMDU6MzAsICswMDowMCAgICAgICAgICAgIHwgMiAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgeHh4eCAgICB8IC0wODAwLCArMDUzMCwgKzAwMDAsICsxMjM0NTYgICAgICB8ICAgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHh4eHh4ICAgfCAtMDg6MDAsICswNTozMCwgKzAwOjAwLCArMTI6MzQ6NTYgfCAgICAgICB8XG4gKiB8IFRpbWV6b25lIChHTVQpICAgICAgICAgICAgICAgICAgfCBPLi4uT09PIHwgR01ULTgsIEdNVCs1OjMwLCBHTVQrMCAgICAgICAgICAgIHwgICAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgT09PTyAgICB8IEdNVC0wODowMCwgR01UKzA1OjMwLCBHTVQrMDA6MDAgICB8IDIgICAgIHxcbiAqIHwgVGltZXpvbmUgKHNwZWNpZmljIG5vbi1sb2NhdC4pICB8IHouLi56enogfCBHTVQtOCwgR01UKzU6MzAsIEdNVCswICAgICAgICAgICAgfCA2ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCB6enp6ICAgIHwgR01ULTA4OjAwLCBHTVQrMDU6MzAsIEdNVCswMDowMCAgIHwgMiw2ICAgfFxuICogfCBTZWNvbmRzIHRpbWVzdGFtcCAgICAgICAgICAgICAgIHwgdCAgICAgICB8IDUxMjk2OTUyMCAgICAgICAgICAgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHR0ICAgICAgfCAuLi4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCAzLDcgICB8XG4gKiB8IE1pbGxpc2Vjb25kcyB0aW1lc3RhbXAgICAgICAgICAgfCBUICAgICAgIHwgNTEyOTY5NTIwOTAwICAgICAgICAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgVFQgICAgICB8IC4uLiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IDMsNyAgIHxcbiAqIHwgTG9uZyBsb2NhbGl6ZWQgZGF0ZSAgICAgICAgICAgICB8IFAgICAgICAgfCAwNC8yOS8xNDUzICAgICAgICAgICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBQUCAgICAgIHwgQXByIDI5LCAxNDUzICAgICAgICAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgUFBQICAgICB8IEFwcmlsIDI5dGgsIDE0NTMgICAgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFBQUFAgICAgfCBGcmlkYXksIEFwcmlsIDI5dGgsIDE0NTMgICAgICAgICAgfCAyLDcgICB8XG4gKiB8IExvbmcgbG9jYWxpemVkIHRpbWUgICAgICAgICAgICAgfCBwICAgICAgIHwgMTI6MDAgQU0gICAgICAgICAgICAgICAgICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgcHAgICAgICB8IDEyOjAwOjAwIEFNICAgICAgICAgICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IHBwcCAgICAgfCAxMjowMDowMCBBTSBHTVQrMiAgICAgICAgICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBwcHBwICAgIHwgMTI6MDA6MDAgQU0gR01UKzAyOjAwICAgICAgICAgICAgIHwgMiw3ICAgfFxuICogfCBDb21iaW5hdGlvbiBvZiBkYXRlIGFuZCB0aW1lICAgIHwgUHAgICAgICB8IDA0LzI5LzE0NTMsIDEyOjAwIEFNICAgICAgICAgICAgICB8IDcgICAgIHxcbiAqIHwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8IFBQcHAgICAgfCBBcHIgMjksIDE0NTMsIDEyOjAwOjAwIEFNICAgICAgICAgfCA3ICAgICB8XG4gKiB8ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfCBQUFBwcHAgIHwgQXByaWwgMjl0aCwgMTQ1MyBhdCAuLi4gICAgICAgICAgIHwgNyAgICAgfFxuICogfCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHwgUFBQUHBwcHB8IEZyaWRheSwgQXByaWwgMjl0aCwgMTQ1MyBhdCAuLi4gICB8IDIsNyAgIHxcbiAqIE5vdGVzOlxuICogMS4gXCJGb3JtYXR0aW5nXCIgdW5pdHMgKGUuZy4gZm9ybWF0dGluZyBxdWFydGVyKSBpbiB0aGUgZGVmYXVsdCBlbi1VUyBsb2NhbGVcbiAqICAgIGFyZSB0aGUgc2FtZSBhcyBcInN0YW5kLWFsb25lXCIgdW5pdHMsIGJ1dCBhcmUgZGlmZmVyZW50IGluIHNvbWUgbGFuZ3VhZ2VzLlxuICogICAgXCJGb3JtYXR0aW5nXCIgdW5pdHMgYXJlIGRlY2xpbmVkIGFjY29yZGluZyB0byB0aGUgcnVsZXMgb2YgdGhlIGxhbmd1YWdlXG4gKiAgICBpbiB0aGUgY29udGV4dCBvZiBhIGRhdGUuIFwiU3RhbmQtYWxvbmVcIiB1bml0cyBhcmUgYWx3YXlzIG5vbWluYXRpdmUgc2luZ3VsYXI6XG4gKlxuICogICAgYGZvcm1hdChuZXcgRGF0ZSgyMDE3LCAxMCwgNiksICdkbyBMTExMJywge2xvY2FsZTogY3N9KSAvLz0+ICc2LiBsaXN0b3BhZCdgXG4gKlxuICogICAgYGZvcm1hdChuZXcgRGF0ZSgyMDE3LCAxMCwgNiksICdkbyBNTU1NJywge2xvY2FsZTogY3N9KSAvLz0+ICc2LiBsaXN0b3BhZHUnYFxuICpcbiAqIDIuIEFueSBzZXF1ZW5jZSBvZiB0aGUgaWRlbnRpY2FsIGxldHRlcnMgaXMgYSBwYXR0ZXJuLCB1bmxlc3MgaXQgaXMgZXNjYXBlZCBieVxuICogICAgdGhlIHNpbmdsZSBxdW90ZSBjaGFyYWN0ZXJzIChzZWUgYmVsb3cpLlxuICogICAgSWYgdGhlIHNlcXVlbmNlIGlzIGxvbmdlciB0aGFuIGxpc3RlZCBpbiB0YWJsZSAoZS5nLiBgRUVFRUVFRUVFRUVgKVxuICogICAgdGhlIG91dHB1dCB3aWxsIGJlIHRoZSBzYW1lIGFzIGRlZmF1bHQgcGF0dGVybiBmb3IgdGhpcyB1bml0LCB1c3VhbGx5XG4gKiAgICB0aGUgbG9uZ2VzdCBvbmUgKGluIGNhc2Ugb2YgSVNPIHdlZWtkYXlzLCBgRUVFRWApLiBEZWZhdWx0IHBhdHRlcm5zIGZvciB1bml0c1xuICogICAgYXJlIG1hcmtlZCB3aXRoIFwiMlwiIGluIHRoZSBsYXN0IGNvbHVtbiBvZiB0aGUgdGFibGUuXG4gKlxuICogICAgYGZvcm1hdChuZXcgRGF0ZSgyMDE3LCAxMCwgNiksICdNTU0nKSAvLz0+ICdOb3YnYFxuICpcbiAqICAgIGBmb3JtYXQobmV3IERhdGUoMjAxNywgMTAsIDYpLCAnTU1NTScpIC8vPT4gJ05vdmVtYmVyJ2BcbiAqXG4gKiAgICBgZm9ybWF0KG5ldyBEYXRlKDIwMTcsIDEwLCA2KSwgJ01NTU1NJykgLy89PiAnTidgXG4gKlxuICogICAgYGZvcm1hdChuZXcgRGF0ZSgyMDE3LCAxMCwgNiksICdNTU1NTU0nKSAvLz0+ICdOb3ZlbWJlcidgXG4gKlxuICogICAgYGZvcm1hdChuZXcgRGF0ZSgyMDE3LCAxMCwgNiksICdNTU1NTU1NJykgLy89PiAnTm92ZW1iZXInYFxuICpcbiAqIDMuIFNvbWUgcGF0dGVybnMgY291bGQgYmUgdW5saW1pdGVkIGxlbmd0aCAoc3VjaCBhcyBgeXl5eXl5eXlgKS5cbiAqICAgIFRoZSBvdXRwdXQgd2lsbCBiZSBwYWRkZWQgd2l0aCB6ZXJvcyB0byBtYXRjaCB0aGUgbGVuZ3RoIG9mIHRoZSBwYXR0ZXJuLlxuICpcbiAqICAgIGBmb3JtYXQobmV3IERhdGUoMjAxNywgMTAsIDYpLCAneXl5eXl5eXknKSAvLz0+ICcwMDAwMjAxNydgXG4gKlxuICogNC4gYFFRUVFRYCBhbmQgYHFxcXFxYCBjb3VsZCBiZSBub3Qgc3RyaWN0bHkgbnVtZXJpY2FsIGluIHNvbWUgbG9jYWxlcy5cbiAqICAgIFRoZXNlIHRva2VucyByZXByZXNlbnQgdGhlIHNob3J0ZXN0IGZvcm0gb2YgdGhlIHF1YXJ0ZXIuXG4gKlxuICogNS4gVGhlIG1haW4gZGlmZmVyZW5jZSBiZXR3ZWVuIGB5YCBhbmQgYHVgIHBhdHRlcm5zIGFyZSBCLkMuIHllYXJzOlxuICpcbiAqICAgIHwgWWVhciB8IGB5YCB8IGB1YCB8XG4gKiAgICB8LS0tLS0tfC0tLS0tfC0tLS0tfFxuICogICAgfCBBQyAxIHwgICAxIHwgICAxIHxcbiAqICAgIHwgQkMgMSB8ICAgMSB8ICAgMCB8XG4gKiAgICB8IEJDIDIgfCAgIDIgfCAgLTEgfFxuICpcbiAqICAgIEFsc28gYHl5YCBhbHdheXMgcmV0dXJucyB0aGUgbGFzdCB0d28gZGlnaXRzIG9mIGEgeWVhcixcbiAqICAgIHdoaWxlIGB1dWAgcGFkcyBzaW5nbGUgZGlnaXQgeWVhcnMgdG8gMiBjaGFyYWN0ZXJzIGFuZCByZXR1cm5zIG90aGVyIHllYXJzIHVuY2hhbmdlZDpcbiAqXG4gKiAgICB8IFllYXIgfCBgeXlgIHwgYHV1YCB8XG4gKiAgICB8LS0tLS0tfC0tLS0tLXwtLS0tLS18XG4gKiAgICB8IDEgICAgfCAgIDAxIHwgICAwMSB8XG4gKiAgICB8IDE0ICAgfCAgIDE0IHwgICAxNCB8XG4gKiAgICB8IDM3NiAgfCAgIDc2IHwgIDM3NiB8XG4gKiAgICB8IDE0NTMgfCAgIDUzIHwgMTQ1MyB8XG4gKlxuICogICAgVGhlIHNhbWUgZGlmZmVyZW5jZSBpcyB0cnVlIGZvciBsb2NhbCBhbmQgSVNPIHdlZWstbnVtYmVyaW5nIHllYXJzIChgWWAgYW5kIGBSYCksXG4gKiAgICBleGNlcHQgbG9jYWwgd2Vlay1udW1iZXJpbmcgeWVhcnMgYXJlIGRlcGVuZGVudCBvbiBgb3B0aW9ucy53ZWVrU3RhcnRzT25gXG4gKiAgICBhbmQgYG9wdGlvbnMuZmlyc3RXZWVrQ29udGFpbnNEYXRlYCAoY29tcGFyZSBbZ2V0SVNPV2Vla1llYXJde0BsaW5rIGh0dHBzOi8vZGF0ZS1mbnMub3JnL2RvY3MvZ2V0SVNPV2Vla1llYXJ9XG4gKiAgICBhbmQgW2dldFdlZWtZZWFyXXtAbGluayBodHRwczovL2RhdGUtZm5zLm9yZy9kb2NzL2dldFdlZWtZZWFyfSkuXG4gKlxuICogNi4gU3BlY2lmaWMgbm9uLWxvY2F0aW9uIHRpbWV6b25lcyBhcmUgY3VycmVudGx5IHVuYXZhaWxhYmxlIGluIGBkYXRlLWZuc2AsXG4gKiAgICBzbyByaWdodCBub3cgdGhlc2UgdG9rZW5zIGZhbGwgYmFjayB0byBHTVQgdGltZXpvbmVzLlxuICpcbiAqIDcuIFRoZXNlIHBhdHRlcm5zIGFyZSBub3QgaW4gdGhlIFVuaWNvZGUgVGVjaG5pY2FsIFN0YW5kYXJkICMzNTpcbiAqICAgIC0gYGlgOiBJU08gZGF5IG9mIHdlZWtcbiAqICAgIC0gYElgOiBJU08gd2VlayBvZiB5ZWFyXG4gKiAgICAtIGBSYDogSVNPIHdlZWstbnVtYmVyaW5nIHllYXJcbiAqICAgIC0gYHRgOiBzZWNvbmRzIHRpbWVzdGFtcFxuICogICAgLSBgVGA6IG1pbGxpc2Vjb25kcyB0aW1lc3RhbXBcbiAqICAgIC0gYG9gOiBvcmRpbmFsIG51bWJlciBtb2RpZmllclxuICogICAgLSBgUGA6IGxvbmcgbG9jYWxpemVkIGRhdGVcbiAqICAgIC0gYHBgOiBsb25nIGxvY2FsaXplZCB0aW1lXG4gKlxuICogOC4gYFlZYCBhbmQgYFlZWVlgIHRva2VucyByZXByZXNlbnQgd2Vlay1udW1iZXJpbmcgeWVhcnMgYnV0IHRoZXkgYXJlIG9mdGVuIGNvbmZ1c2VkIHdpdGggeWVhcnMuXG4gKiAgICBZb3Ugc2hvdWxkIGVuYWJsZSBgb3B0aW9ucy51c2VBZGRpdGlvbmFsV2Vla1llYXJUb2tlbnNgIHRvIHVzZSB0aGVtLiBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRlLWZucy9kYXRlLWZucy9ibG9iL21hc3Rlci9kb2NzL3VuaWNvZGVUb2tlbnMubWRcbiAqXG4gKiA5LiBgRGAgYW5kIGBERGAgdG9rZW5zIHJlcHJlc2VudCBkYXlzIG9mIHRoZSB5ZWFyIGJ1dCB0aGV5IGFyZSBvZnRlbiBjb25mdXNlZCB3aXRoIGRheXMgb2YgdGhlIG1vbnRoLlxuICogICAgWW91IHNob3VsZCBlbmFibGUgYG9wdGlvbnMudXNlQWRkaXRpb25hbERheU9mWWVhclRva2Vuc2AgdG8gdXNlIHRoZW0uIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdW5pY29kZVRva2Vucy5tZFxuICpcbiAqIEBwYXJhbSB7RGF0ZXxOdW1iZXJ9IGRhdGUgLSB0aGUgb3JpZ2luYWwgZGF0ZVxuICogQHBhcmFtIHtTdHJpbmd9IGZvcm1hdCAtIHRoZSBzdHJpbmcgb2YgdG9rZW5zXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gYW4gb2JqZWN0IHdpdGggb3B0aW9ucy5cbiAqIEBwYXJhbSB7TG9jYWxlfSBbb3B0aW9ucy5sb2NhbGU9ZGVmYXVsdExvY2FsZV0gLSB0aGUgbG9jYWxlIG9iamVjdC4gU2VlIFtMb2NhbGVde0BsaW5rIGh0dHBzOi8vZGF0ZS1mbnMub3JnL2RvY3MvTG9jYWxlfVxuICogQHBhcmFtIHswfDF8MnwzfDR8NXw2fSBbb3B0aW9ucy53ZWVrU3RhcnRzT249MF0gLSB0aGUgaW5kZXggb2YgdGhlIGZpcnN0IGRheSBvZiB0aGUgd2VlayAoMCAtIFN1bmRheSlcbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5maXJzdFdlZWtDb250YWluc0RhdGU9MV0gLSB0aGUgZGF5IG9mIEphbnVhcnksIHdoaWNoIGlzXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnVzZUFkZGl0aW9uYWxXZWVrWWVhclRva2Vucz1mYWxzZV0gLSBpZiB0cnVlLCBhbGxvd3MgdXNhZ2Ugb2YgdGhlIHdlZWstbnVtYmVyaW5nIHllYXIgdG9rZW5zIGBZWWAgYW5kIGBZWVlZYDtcbiAqICAgc2VlOiBodHRwczovL2dpdGh1Yi5jb20vZGF0ZS1mbnMvZGF0ZS1mbnMvYmxvYi9tYXN0ZXIvZG9jcy91bmljb2RlVG9rZW5zLm1kXG4gKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLnVzZUFkZGl0aW9uYWxEYXlPZlllYXJUb2tlbnM9ZmFsc2VdIC0gaWYgdHJ1ZSwgYWxsb3dzIHVzYWdlIG9mIHRoZSBkYXkgb2YgeWVhciB0b2tlbnMgYERgIGFuZCBgRERgO1xuICogICBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRlLWZucy9kYXRlLWZucy9ibG9iL21hc3Rlci9kb2NzL3VuaWNvZGVUb2tlbnMubWRcbiAqIEByZXR1cm5zIHtTdHJpbmd9IHRoZSBmb3JtYXR0ZWQgZGF0ZSBzdHJpbmdcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gMiBhcmd1bWVudHMgcmVxdWlyZWRcbiAqIEB0aHJvd3Mge1JhbmdlRXJyb3J9IGBkYXRlYCBtdXN0IG5vdCBiZSBJbnZhbGlkIERhdGVcbiAqIEB0aHJvd3Mge1JhbmdlRXJyb3J9IGBvcHRpb25zLmxvY2FsZWAgbXVzdCBjb250YWluIGBsb2NhbGl6ZWAgcHJvcGVydHlcbiAqIEB0aHJvd3Mge1JhbmdlRXJyb3J9IGBvcHRpb25zLmxvY2FsZWAgbXVzdCBjb250YWluIGBmb3JtYXRMb25nYCBwcm9wZXJ0eVxuICogQHRocm93cyB7UmFuZ2VFcnJvcn0gYG9wdGlvbnMud2Vla1N0YXJ0c09uYCBtdXN0IGJlIGJldHdlZW4gMCBhbmQgNlxuICogQHRocm93cyB7UmFuZ2VFcnJvcn0gYG9wdGlvbnMuZmlyc3RXZWVrQ29udGFpbnNEYXRlYCBtdXN0IGJlIGJldHdlZW4gMSBhbmQgN1xuICogQHRocm93cyB7UmFuZ2VFcnJvcn0gdXNlIGB5eXl5YCBpbnN0ZWFkIG9mIGBZWVlZYCBmb3IgZm9ybWF0dGluZyB5ZWFycyB1c2luZyBbZm9ybWF0IHByb3ZpZGVkXSB0byB0aGUgaW5wdXQgW2lucHV0IHByb3ZpZGVkXTsgc2VlOiBodHRwczovL2dpdGh1Yi5jb20vZGF0ZS1mbnMvZGF0ZS1mbnMvYmxvYi9tYXN0ZXIvZG9jcy91bmljb2RlVG9rZW5zLm1kXG4gKiBAdGhyb3dzIHtSYW5nZUVycm9yfSB1c2UgYHl5YCBpbnN0ZWFkIG9mIGBZWWAgZm9yIGZvcm1hdHRpbmcgeWVhcnMgdXNpbmcgW2Zvcm1hdCBwcm92aWRlZF0gdG8gdGhlIGlucHV0IFtpbnB1dCBwcm92aWRlZF07IHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdW5pY29kZVRva2Vucy5tZFxuICogQHRocm93cyB7UmFuZ2VFcnJvcn0gdXNlIGBkYCBpbnN0ZWFkIG9mIGBEYCBmb3IgZm9ybWF0dGluZyBkYXlzIG9mIHRoZSBtb250aCB1c2luZyBbZm9ybWF0IHByb3ZpZGVkXSB0byB0aGUgaW5wdXQgW2lucHV0IHByb3ZpZGVkXTsgc2VlOiBodHRwczovL2dpdGh1Yi5jb20vZGF0ZS1mbnMvZGF0ZS1mbnMvYmxvYi9tYXN0ZXIvZG9jcy91bmljb2RlVG9rZW5zLm1kXG4gKiBAdGhyb3dzIHtSYW5nZUVycm9yfSB1c2UgYGRkYCBpbnN0ZWFkIG9mIGBERGAgZm9yIGZvcm1hdHRpbmcgZGF5cyBvZiB0aGUgbW9udGggdXNpbmcgW2Zvcm1hdCBwcm92aWRlZF0gdG8gdGhlIGlucHV0IFtpbnB1dCBwcm92aWRlZF07IHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdW5pY29kZVRva2Vucy5tZFxuICogQHRocm93cyB7UmFuZ2VFcnJvcn0gZm9ybWF0IHN0cmluZyBjb250YWlucyBhbiB1bmVzY2FwZWQgbGF0aW4gYWxwaGFiZXQgY2hhcmFjdGVyXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIFJlcHJlc2VudCAxMSBGZWJydWFyeSAyMDE0IGluIG1pZGRsZS1lbmRpYW4gZm9ybWF0OlxuICogY29uc3QgcmVzdWx0ID0gZm9ybWF0KG5ldyBEYXRlKDIwMTQsIDEsIDExKSwgJ01NL2RkL3l5eXknKVxuICogLy89PiAnMDIvMTEvMjAxNCdcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gUmVwcmVzZW50IDIgSnVseSAyMDE0IGluIEVzcGVyYW50bzpcbiAqIGltcG9ydCB7IGVvTG9jYWxlIH0gZnJvbSAnZGF0ZS1mbnMvbG9jYWxlL2VvJ1xuICogY29uc3QgcmVzdWx0ID0gZm9ybWF0KG5ldyBEYXRlKDIwMTQsIDYsIDIpLCBcImRvICdkZScgTU1NTSB5eXl5XCIsIHtcbiAqICAgbG9jYWxlOiBlb0xvY2FsZVxuICogfSlcbiAqIC8vPT4gJzItYSBkZSBqdWxpbyAyMDE0J1xuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBFc2NhcGUgc3RyaW5nIGJ5IHNpbmdsZSBxdW90ZSBjaGFyYWN0ZXJzOlxuICogY29uc3QgcmVzdWx0ID0gZm9ybWF0KG5ldyBEYXRlKDIwMTQsIDYsIDIsIDE1KSwgXCJoICdvJydjbG9jaydcIilcbiAqIC8vPT4gXCIzIG8nY2xvY2tcIlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZvcm1hdChkaXJ0eURhdGUsIGRpcnR5Rm9ybWF0U3RyLCBvcHRpb25zKSB7XG4gIHZhciBfcmVmLCBfb3B0aW9ucyRsb2NhbGUsIF9yZWYyLCBfcmVmMywgX3JlZjQsIF9vcHRpb25zJGZpcnN0V2Vla0NvbiwgX29wdGlvbnMkbG9jYWxlMiwgX29wdGlvbnMkbG9jYWxlMiRvcHRpLCBfZGVmYXVsdE9wdGlvbnMkbG9jYWwsIF9kZWZhdWx0T3B0aW9ucyRsb2NhbDIsIF9yZWY1LCBfcmVmNiwgX3JlZjcsIF9vcHRpb25zJHdlZWtTdGFydHNPbiwgX29wdGlvbnMkbG9jYWxlMywgX29wdGlvbnMkbG9jYWxlMyRvcHRpLCBfZGVmYXVsdE9wdGlvbnMkbG9jYWwzLCBfZGVmYXVsdE9wdGlvbnMkbG9jYWw0O1xuICByZXF1aXJlZEFyZ3MoMiwgYXJndW1lbnRzKTtcbiAgdmFyIGZvcm1hdFN0ciA9IFN0cmluZyhkaXJ0eUZvcm1hdFN0cik7XG4gIHZhciBkZWZhdWx0T3B0aW9ucyA9IGdldERlZmF1bHRPcHRpb25zKCk7XG4gIHZhciBsb2NhbGUgPSAoX3JlZiA9IChfb3B0aW9ucyRsb2NhbGUgPSBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMubG9jYWxlKSAhPT0gbnVsbCAmJiBfb3B0aW9ucyRsb2NhbGUgIT09IHZvaWQgMCA/IF9vcHRpb25zJGxvY2FsZSA6IGRlZmF1bHRPcHRpb25zLmxvY2FsZSkgIT09IG51bGwgJiYgX3JlZiAhPT0gdm9pZCAwID8gX3JlZiA6IGRlZmF1bHRMb2NhbGU7XG4gIHZhciBmaXJzdFdlZWtDb250YWluc0RhdGUgPSB0b0ludGVnZXIoKF9yZWYyID0gKF9yZWYzID0gKF9yZWY0ID0gKF9vcHRpb25zJGZpcnN0V2Vla0NvbiA9IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5maXJzdFdlZWtDb250YWluc0RhdGUpICE9PSBudWxsICYmIF9vcHRpb25zJGZpcnN0V2Vla0NvbiAhPT0gdm9pZCAwID8gX29wdGlvbnMkZmlyc3RXZWVrQ29uIDogb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiAoX29wdGlvbnMkbG9jYWxlMiA9IG9wdGlvbnMubG9jYWxlKSA9PT0gbnVsbCB8fCBfb3B0aW9ucyRsb2NhbGUyID09PSB2b2lkIDAgPyB2b2lkIDAgOiAoX29wdGlvbnMkbG9jYWxlMiRvcHRpID0gX29wdGlvbnMkbG9jYWxlMi5vcHRpb25zKSA9PT0gbnVsbCB8fCBfb3B0aW9ucyRsb2NhbGUyJG9wdGkgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9vcHRpb25zJGxvY2FsZTIkb3B0aS5maXJzdFdlZWtDb250YWluc0RhdGUpICE9PSBudWxsICYmIF9yZWY0ICE9PSB2b2lkIDAgPyBfcmVmNCA6IGRlZmF1bHRPcHRpb25zLmZpcnN0V2Vla0NvbnRhaW5zRGF0ZSkgIT09IG51bGwgJiYgX3JlZjMgIT09IHZvaWQgMCA/IF9yZWYzIDogKF9kZWZhdWx0T3B0aW9ucyRsb2NhbCA9IGRlZmF1bHRPcHRpb25zLmxvY2FsZSkgPT09IG51bGwgfHwgX2RlZmF1bHRPcHRpb25zJGxvY2FsID09PSB2b2lkIDAgPyB2b2lkIDAgOiAoX2RlZmF1bHRPcHRpb25zJGxvY2FsMiA9IF9kZWZhdWx0T3B0aW9ucyRsb2NhbC5vcHRpb25zKSA9PT0gbnVsbCB8fCBfZGVmYXVsdE9wdGlvbnMkbG9jYWwyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZGVmYXVsdE9wdGlvbnMkbG9jYWwyLmZpcnN0V2Vla0NvbnRhaW5zRGF0ZSkgIT09IG51bGwgJiYgX3JlZjIgIT09IHZvaWQgMCA/IF9yZWYyIDogMSk7XG5cbiAgLy8gVGVzdCBpZiB3ZWVrU3RhcnRzT24gaXMgYmV0d2VlbiAxIGFuZCA3IF9hbmRfIGlzIG5vdCBOYU5cbiAgaWYgKCEoZmlyc3RXZWVrQ29udGFpbnNEYXRlID49IDEgJiYgZmlyc3RXZWVrQ29udGFpbnNEYXRlIDw9IDcpKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2ZpcnN0V2Vla0NvbnRhaW5zRGF0ZSBtdXN0IGJlIGJldHdlZW4gMSBhbmQgNyBpbmNsdXNpdmVseScpO1xuICB9XG4gIHZhciB3ZWVrU3RhcnRzT24gPSB0b0ludGVnZXIoKF9yZWY1ID0gKF9yZWY2ID0gKF9yZWY3ID0gKF9vcHRpb25zJHdlZWtTdGFydHNPbiA9IG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy53ZWVrU3RhcnRzT24pICE9PSBudWxsICYmIF9vcHRpb25zJHdlZWtTdGFydHNPbiAhPT0gdm9pZCAwID8gX29wdGlvbnMkd2Vla1N0YXJ0c09uIDogb3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiAoX29wdGlvbnMkbG9jYWxlMyA9IG9wdGlvbnMubG9jYWxlKSA9PT0gbnVsbCB8fCBfb3B0aW9ucyRsb2NhbGUzID09PSB2b2lkIDAgPyB2b2lkIDAgOiAoX29wdGlvbnMkbG9jYWxlMyRvcHRpID0gX29wdGlvbnMkbG9jYWxlMy5vcHRpb25zKSA9PT0gbnVsbCB8fCBfb3B0aW9ucyRsb2NhbGUzJG9wdGkgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9vcHRpb25zJGxvY2FsZTMkb3B0aS53ZWVrU3RhcnRzT24pICE9PSBudWxsICYmIF9yZWY3ICE9PSB2b2lkIDAgPyBfcmVmNyA6IGRlZmF1bHRPcHRpb25zLndlZWtTdGFydHNPbikgIT09IG51bGwgJiYgX3JlZjYgIT09IHZvaWQgMCA/IF9yZWY2IDogKF9kZWZhdWx0T3B0aW9ucyRsb2NhbDMgPSBkZWZhdWx0T3B0aW9ucy5sb2NhbGUpID09PSBudWxsIHx8IF9kZWZhdWx0T3B0aW9ucyRsb2NhbDMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IChfZGVmYXVsdE9wdGlvbnMkbG9jYWw0ID0gX2RlZmF1bHRPcHRpb25zJGxvY2FsMy5vcHRpb25zKSA9PT0gbnVsbCB8fCBfZGVmYXVsdE9wdGlvbnMkbG9jYWw0ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZGVmYXVsdE9wdGlvbnMkbG9jYWw0LndlZWtTdGFydHNPbikgIT09IG51bGwgJiYgX3JlZjUgIT09IHZvaWQgMCA/IF9yZWY1IDogMCk7XG5cbiAgLy8gVGVzdCBpZiB3ZWVrU3RhcnRzT24gaXMgYmV0d2VlbiAwIGFuZCA2IF9hbmRfIGlzIG5vdCBOYU5cbiAgaWYgKCEod2Vla1N0YXJ0c09uID49IDAgJiYgd2Vla1N0YXJ0c09uIDw9IDYpKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3dlZWtTdGFydHNPbiBtdXN0IGJlIGJldHdlZW4gMCBhbmQgNiBpbmNsdXNpdmVseScpO1xuICB9XG4gIGlmICghbG9jYWxlLmxvY2FsaXplKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2xvY2FsZSBtdXN0IGNvbnRhaW4gbG9jYWxpemUgcHJvcGVydHknKTtcbiAgfVxuICBpZiAoIWxvY2FsZS5mb3JtYXRMb25nKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ2xvY2FsZSBtdXN0IGNvbnRhaW4gZm9ybWF0TG9uZyBwcm9wZXJ0eScpO1xuICB9XG4gIHZhciBvcmlnaW5hbERhdGUgPSB0b0RhdGUoZGlydHlEYXRlKTtcbiAgaWYgKCFpc1ZhbGlkKG9yaWdpbmFsRGF0ZSkpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW52YWxpZCB0aW1lIHZhbHVlJyk7XG4gIH1cblxuICAvLyBDb252ZXJ0IHRoZSBkYXRlIGluIHN5c3RlbSB0aW1lem9uZSB0byB0aGUgc2FtZSBkYXRlIGluIFVUQyswMDowMCB0aW1lem9uZS5cbiAgLy8gVGhpcyBlbnN1cmVzIHRoYXQgd2hlbiBVVEMgZnVuY3Rpb25zIHdpbGwgYmUgaW1wbGVtZW50ZWQsIGxvY2FsZXMgd2lsbCBiZSBjb21wYXRpYmxlIHdpdGggdGhlbS5cbiAgLy8gU2VlIGFuIGlzc3VlIGFib3V0IFVUQyBmdW5jdGlvbnM6IGh0dHBzOi8vZ2l0aHViLmNvbS9kYXRlLWZucy9kYXRlLWZucy9pc3N1ZXMvMzc2XG4gIHZhciB0aW1lem9uZU9mZnNldCA9IGdldFRpbWV6b25lT2Zmc2V0SW5NaWxsaXNlY29uZHMob3JpZ2luYWxEYXRlKTtcbiAgdmFyIHV0Y0RhdGUgPSBzdWJNaWxsaXNlY29uZHMob3JpZ2luYWxEYXRlLCB0aW1lem9uZU9mZnNldCk7XG4gIHZhciBmb3JtYXR0ZXJPcHRpb25zID0ge1xuICAgIGZpcnN0V2Vla0NvbnRhaW5zRGF0ZTogZmlyc3RXZWVrQ29udGFpbnNEYXRlLFxuICAgIHdlZWtTdGFydHNPbjogd2Vla1N0YXJ0c09uLFxuICAgIGxvY2FsZTogbG9jYWxlLFxuICAgIF9vcmlnaW5hbERhdGU6IG9yaWdpbmFsRGF0ZVxuICB9O1xuICB2YXIgcmVzdWx0ID0gZm9ybWF0U3RyLm1hdGNoKGxvbmdGb3JtYXR0aW5nVG9rZW5zUmVnRXhwKS5tYXAoZnVuY3Rpb24gKHN1YnN0cmluZykge1xuICAgIHZhciBmaXJzdENoYXJhY3RlciA9IHN1YnN0cmluZ1swXTtcbiAgICBpZiAoZmlyc3RDaGFyYWN0ZXIgPT09ICdwJyB8fCBmaXJzdENoYXJhY3RlciA9PT0gJ1AnKSB7XG4gICAgICB2YXIgbG9uZ0Zvcm1hdHRlciA9IGxvbmdGb3JtYXR0ZXJzW2ZpcnN0Q2hhcmFjdGVyXTtcbiAgICAgIHJldHVybiBsb25nRm9ybWF0dGVyKHN1YnN0cmluZywgbG9jYWxlLmZvcm1hdExvbmcpO1xuICAgIH1cbiAgICByZXR1cm4gc3Vic3RyaW5nO1xuICB9KS5qb2luKCcnKS5tYXRjaChmb3JtYXR0aW5nVG9rZW5zUmVnRXhwKS5tYXAoZnVuY3Rpb24gKHN1YnN0cmluZykge1xuICAgIC8vIFJlcGxhY2UgdHdvIHNpbmdsZSBxdW90ZSBjaGFyYWN0ZXJzIHdpdGggb25lIHNpbmdsZSBxdW90ZSBjaGFyYWN0ZXJcbiAgICBpZiAoc3Vic3RyaW5nID09PSBcIicnXCIpIHtcbiAgICAgIHJldHVybiBcIidcIjtcbiAgICB9XG4gICAgdmFyIGZpcnN0Q2hhcmFjdGVyID0gc3Vic3RyaW5nWzBdO1xuICAgIGlmIChmaXJzdENoYXJhY3RlciA9PT0gXCInXCIpIHtcbiAgICAgIHJldHVybiBjbGVhbkVzY2FwZWRTdHJpbmcoc3Vic3RyaW5nKTtcbiAgICB9XG4gICAgdmFyIGZvcm1hdHRlciA9IGZvcm1hdHRlcnNbZmlyc3RDaGFyYWN0ZXJdO1xuICAgIGlmIChmb3JtYXR0ZXIpIHtcbiAgICAgIGlmICghKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucyAhPT0gdm9pZCAwICYmIG9wdGlvbnMudXNlQWRkaXRpb25hbFdlZWtZZWFyVG9rZW5zKSAmJiBpc1Byb3RlY3RlZFdlZWtZZWFyVG9rZW4oc3Vic3RyaW5nKSkge1xuICAgICAgICB0aHJvd1Byb3RlY3RlZEVycm9yKHN1YnN0cmluZywgZGlydHlGb3JtYXRTdHIsIFN0cmluZyhkaXJ0eURhdGUpKTtcbiAgICAgIH1cbiAgICAgIGlmICghKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucyAhPT0gdm9pZCAwICYmIG9wdGlvbnMudXNlQWRkaXRpb25hbERheU9mWWVhclRva2VucykgJiYgaXNQcm90ZWN0ZWREYXlPZlllYXJUb2tlbihzdWJzdHJpbmcpKSB7XG4gICAgICAgIHRocm93UHJvdGVjdGVkRXJyb3Ioc3Vic3RyaW5nLCBkaXJ0eUZvcm1hdFN0ciwgU3RyaW5nKGRpcnR5RGF0ZSkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZvcm1hdHRlcih1dGNEYXRlLCBzdWJzdHJpbmcsIGxvY2FsZS5sb2NhbGl6ZSwgZm9ybWF0dGVyT3B0aW9ucyk7XG4gICAgfVxuICAgIGlmIChmaXJzdENoYXJhY3Rlci5tYXRjaCh1bmVzY2FwZWRMYXRpbkNoYXJhY3RlclJlZ0V4cCkpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdGb3JtYXQgc3RyaW5nIGNvbnRhaW5zIGFuIHVuZXNjYXBlZCBsYXRpbiBhbHBoYWJldCBjaGFyYWN0ZXIgYCcgKyBmaXJzdENoYXJhY3RlciArICdgJyk7XG4gICAgfVxuICAgIHJldHVybiBzdWJzdHJpbmc7XG4gIH0pLmpvaW4oJycpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gY2xlYW5Fc2NhcGVkU3RyaW5nKGlucHV0KSB7XG4gIHZhciBtYXRjaGVkID0gaW5wdXQubWF0Y2goZXNjYXBlZFN0cmluZ1JlZ0V4cCk7XG4gIGlmICghbWF0Y2hlZCkge1xuICAgIHJldHVybiBpbnB1dDtcbiAgfVxuICByZXR1cm4gbWF0Y2hlZFsxXS5yZXBsYWNlKGRvdWJsZVF1b3RlUmVnRXhwLCBcIidcIik7XG59IiwiaW1wb3J0IF90eXBlb2YgZnJvbSBcIkBiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL3R5cGVvZlwiO1xuaW1wb3J0IHJlcXVpcmVkQXJncyBmcm9tIFwiLi4vX2xpYi9yZXF1aXJlZEFyZ3MvaW5kZXguanNcIjtcbi8qKlxuICogQG5hbWUgaXNEYXRlXG4gKiBAY2F0ZWdvcnkgQ29tbW9uIEhlbHBlcnNcbiAqIEBzdW1tYXJ5IElzIHRoZSBnaXZlbiB2YWx1ZSBhIGRhdGU/XG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIGdpdmVuIHZhbHVlIGlzIGFuIGluc3RhbmNlIG9mIERhdGUuIFRoZSBmdW5jdGlvbiB3b3JrcyBmb3IgZGF0ZXMgdHJhbnNmZXJyZWQgYWNyb3NzIGlmcmFtZXMuXG4gKlxuICogQHBhcmFtIHsqfSB2YWx1ZSAtIHRoZSB2YWx1ZSB0byBjaGVja1xuICogQHJldHVybnMge2Jvb2xlYW59IHRydWUgaWYgdGhlIGdpdmVuIHZhbHVlIGlzIGEgZGF0ZVxuICogQHRocm93cyB7VHlwZUVycm9yfSAxIGFyZ3VtZW50cyByZXF1aXJlZFxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBGb3IgYSB2YWxpZCBkYXRlOlxuICogY29uc3QgcmVzdWx0ID0gaXNEYXRlKG5ldyBEYXRlKCkpXG4gKiAvLz0+IHRydWVcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gRm9yIGFuIGludmFsaWQgZGF0ZTpcbiAqIGNvbnN0IHJlc3VsdCA9IGlzRGF0ZShuZXcgRGF0ZShOYU4pKVxuICogLy89PiB0cnVlXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIEZvciBzb21lIHZhbHVlOlxuICogY29uc3QgcmVzdWx0ID0gaXNEYXRlKCcyMDE0LTAyLTMxJylcbiAqIC8vPT4gZmFsc2VcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gRm9yIGFuIG9iamVjdDpcbiAqIGNvbnN0IHJlc3VsdCA9IGlzRGF0ZSh7fSlcbiAqIC8vPT4gZmFsc2VcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNEYXRlKHZhbHVlKSB7XG4gIHJlcXVpcmVkQXJncygxLCBhcmd1bWVudHMpO1xuICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlIHx8IF90eXBlb2YodmFsdWUpID09PSAnb2JqZWN0JyAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBEYXRlXSc7XG59IiwiaW1wb3J0IGlzRGF0ZSBmcm9tIFwiLi4vaXNEYXRlL2luZGV4LmpzXCI7XG5pbXBvcnQgdG9EYXRlIGZyb20gXCIuLi90b0RhdGUvaW5kZXguanNcIjtcbmltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL19saWIvcmVxdWlyZWRBcmdzL2luZGV4LmpzXCI7XG4vKipcbiAqIEBuYW1lIGlzVmFsaWRcbiAqIEBjYXRlZ29yeSBDb21tb24gSGVscGVyc1xuICogQHN1bW1hcnkgSXMgdGhlIGdpdmVuIGRhdGUgdmFsaWQ/XG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBSZXR1cm5zIGZhbHNlIGlmIGFyZ3VtZW50IGlzIEludmFsaWQgRGF0ZSBhbmQgdHJ1ZSBvdGhlcndpc2UuXG4gKiBBcmd1bWVudCBpcyBjb252ZXJ0ZWQgdG8gRGF0ZSB1c2luZyBgdG9EYXRlYC4gU2VlIFt0b0RhdGVde0BsaW5rIGh0dHBzOi8vZGF0ZS1mbnMub3JnL2RvY3MvdG9EYXRlfVxuICogSW52YWxpZCBEYXRlIGlzIGEgRGF0ZSwgd2hvc2UgdGltZSB2YWx1ZSBpcyBOYU4uXG4gKlxuICogVGltZSB2YWx1ZSBvZiBEYXRlOiBodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDE1LjkuMS4xXG4gKlxuICogQHBhcmFtIHsqfSBkYXRlIC0gdGhlIGRhdGUgdG8gY2hlY2tcbiAqIEByZXR1cm5zIHtCb29sZWFufSB0aGUgZGF0ZSBpcyB2YWxpZFxuICogQHRocm93cyB7VHlwZUVycm9yfSAxIGFyZ3VtZW50IHJlcXVpcmVkXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIEZvciB0aGUgdmFsaWQgZGF0ZTpcbiAqIGNvbnN0IHJlc3VsdCA9IGlzVmFsaWQobmV3IERhdGUoMjAxNCwgMSwgMzEpKVxuICogLy89PiB0cnVlXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIEZvciB0aGUgdmFsdWUsIGNvbnZlcnRhYmxlIGludG8gYSBkYXRlOlxuICogY29uc3QgcmVzdWx0ID0gaXNWYWxpZCgxMzkzODA0ODAwMDAwKVxuICogLy89PiB0cnVlXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIEZvciB0aGUgaW52YWxpZCBkYXRlOlxuICogY29uc3QgcmVzdWx0ID0gaXNWYWxpZChuZXcgRGF0ZSgnJykpXG4gKiAvLz0+IGZhbHNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzVmFsaWQoZGlydHlEYXRlKSB7XG4gIHJlcXVpcmVkQXJncygxLCBhcmd1bWVudHMpO1xuICBpZiAoIWlzRGF0ZShkaXJ0eURhdGUpICYmIHR5cGVvZiBkaXJ0eURhdGUgIT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBkYXRlID0gdG9EYXRlKGRpcnR5RGF0ZSk7XG4gIHJldHVybiAhaXNOYU4oTnVtYmVyKGRhdGUpKTtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBidWlsZEZvcm1hdExvbmdGbihhcmdzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMCAmJiBhcmd1bWVudHNbMF0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1swXSA6IHt9O1xuICAgIC8vIFRPRE86IFJlbW92ZSBTdHJpbmcoKVxuICAgIHZhciB3aWR0aCA9IG9wdGlvbnMud2lkdGggPyBTdHJpbmcob3B0aW9ucy53aWR0aCkgOiBhcmdzLmRlZmF1bHRXaWR0aDtcbiAgICB2YXIgZm9ybWF0ID0gYXJncy5mb3JtYXRzW3dpZHRoXSB8fCBhcmdzLmZvcm1hdHNbYXJncy5kZWZhdWx0V2lkdGhdO1xuICAgIHJldHVybiBmb3JtYXQ7XG4gIH07XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVpbGRMb2NhbGl6ZUZuKGFyZ3MpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChkaXJ0eUluZGV4LCBvcHRpb25zKSB7XG4gICAgdmFyIGNvbnRleHQgPSBvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMgIT09IHZvaWQgMCAmJiBvcHRpb25zLmNvbnRleHQgPyBTdHJpbmcob3B0aW9ucy5jb250ZXh0KSA6ICdzdGFuZGFsb25lJztcbiAgICB2YXIgdmFsdWVzQXJyYXk7XG4gICAgaWYgKGNvbnRleHQgPT09ICdmb3JtYXR0aW5nJyAmJiBhcmdzLmZvcm1hdHRpbmdWYWx1ZXMpIHtcbiAgICAgIHZhciBkZWZhdWx0V2lkdGggPSBhcmdzLmRlZmF1bHRGb3JtYXR0aW5nV2lkdGggfHwgYXJncy5kZWZhdWx0V2lkdGg7XG4gICAgICB2YXIgd2lkdGggPSBvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMgIT09IHZvaWQgMCAmJiBvcHRpb25zLndpZHRoID8gU3RyaW5nKG9wdGlvbnMud2lkdGgpIDogZGVmYXVsdFdpZHRoO1xuICAgICAgdmFsdWVzQXJyYXkgPSBhcmdzLmZvcm1hdHRpbmdWYWx1ZXNbd2lkdGhdIHx8IGFyZ3MuZm9ybWF0dGluZ1ZhbHVlc1tkZWZhdWx0V2lkdGhdO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgX2RlZmF1bHRXaWR0aCA9IGFyZ3MuZGVmYXVsdFdpZHRoO1xuICAgICAgdmFyIF93aWR0aCA9IG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucyAhPT0gdm9pZCAwICYmIG9wdGlvbnMud2lkdGggPyBTdHJpbmcob3B0aW9ucy53aWR0aCkgOiBhcmdzLmRlZmF1bHRXaWR0aDtcbiAgICAgIHZhbHVlc0FycmF5ID0gYXJncy52YWx1ZXNbX3dpZHRoXSB8fCBhcmdzLnZhbHVlc1tfZGVmYXVsdFdpZHRoXTtcbiAgICB9XG4gICAgdmFyIGluZGV4ID0gYXJncy5hcmd1bWVudENhbGxiYWNrID8gYXJncy5hcmd1bWVudENhbGxiYWNrKGRpcnR5SW5kZXgpIDogZGlydHlJbmRleDtcbiAgICAvLyBAdHMtaWdub3JlOiBGb3Igc29tZSByZWFzb24gVHlwZVNjcmlwdCBqdXN0IGRvbid0IHdhbnQgdG8gbWF0Y2ggaXQsIG5vIG1hdHRlciBob3cgaGFyZCB3ZSB0cnkuIEkgY2hhbGxlbmdlIHlvdSB0byB0cnkgdG8gcmVtb3ZlIGl0IVxuICAgIHJldHVybiB2YWx1ZXNBcnJheVtpbmRleF07XG4gIH07XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVpbGRNYXRjaEZuKGFyZ3MpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICB2YXIgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gICAgdmFyIHdpZHRoID0gb3B0aW9ucy53aWR0aDtcbiAgICB2YXIgbWF0Y2hQYXR0ZXJuID0gd2lkdGggJiYgYXJncy5tYXRjaFBhdHRlcm5zW3dpZHRoXSB8fCBhcmdzLm1hdGNoUGF0dGVybnNbYXJncy5kZWZhdWx0TWF0Y2hXaWR0aF07XG4gICAgdmFyIG1hdGNoUmVzdWx0ID0gc3RyaW5nLm1hdGNoKG1hdGNoUGF0dGVybik7XG4gICAgaWYgKCFtYXRjaFJlc3VsdCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHZhciBtYXRjaGVkU3RyaW5nID0gbWF0Y2hSZXN1bHRbMF07XG4gICAgdmFyIHBhcnNlUGF0dGVybnMgPSB3aWR0aCAmJiBhcmdzLnBhcnNlUGF0dGVybnNbd2lkdGhdIHx8IGFyZ3MucGFyc2VQYXR0ZXJuc1thcmdzLmRlZmF1bHRQYXJzZVdpZHRoXTtcbiAgICB2YXIga2V5ID0gQXJyYXkuaXNBcnJheShwYXJzZVBhdHRlcm5zKSA/IGZpbmRJbmRleChwYXJzZVBhdHRlcm5zLCBmdW5jdGlvbiAocGF0dGVybikge1xuICAgICAgcmV0dXJuIHBhdHRlcm4udGVzdChtYXRjaGVkU3RyaW5nKTtcbiAgICB9KSA6IGZpbmRLZXkocGFyc2VQYXR0ZXJucywgZnVuY3Rpb24gKHBhdHRlcm4pIHtcbiAgICAgIHJldHVybiBwYXR0ZXJuLnRlc3QobWF0Y2hlZFN0cmluZyk7XG4gICAgfSk7XG4gICAgdmFyIHZhbHVlO1xuICAgIHZhbHVlID0gYXJncy52YWx1ZUNhbGxiYWNrID8gYXJncy52YWx1ZUNhbGxiYWNrKGtleSkgOiBrZXk7XG4gICAgdmFsdWUgPSBvcHRpb25zLnZhbHVlQ2FsbGJhY2sgPyBvcHRpb25zLnZhbHVlQ2FsbGJhY2sodmFsdWUpIDogdmFsdWU7XG4gICAgdmFyIHJlc3QgPSBzdHJpbmcuc2xpY2UobWF0Y2hlZFN0cmluZy5sZW5ndGgpO1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICByZXN0OiByZXN0XG4gICAgfTtcbiAgfTtcbn1cbmZ1bmN0aW9uIGZpbmRLZXkob2JqZWN0LCBwcmVkaWNhdGUpIHtcbiAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHkoa2V5KSAmJiBwcmVkaWNhdGUob2JqZWN0W2tleV0pKSB7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuZnVuY3Rpb24gZmluZEluZGV4KGFycmF5LCBwcmVkaWNhdGUpIHtcbiAgZm9yICh2YXIga2V5ID0gMDsga2V5IDwgYXJyYXkubGVuZ3RoOyBrZXkrKykge1xuICAgIGlmIChwcmVkaWNhdGUoYXJyYXlba2V5XSkpIHtcbiAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuICB9XG4gIHJldHVybiB1bmRlZmluZWQ7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVpbGRNYXRjaFBhdHRlcm5GbihhcmdzKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoc3RyaW5nKSB7XG4gICAgdmFyIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IHt9O1xuICAgIHZhciBtYXRjaFJlc3VsdCA9IHN0cmluZy5tYXRjaChhcmdzLm1hdGNoUGF0dGVybik7XG4gICAgaWYgKCFtYXRjaFJlc3VsdCkgcmV0dXJuIG51bGw7XG4gICAgdmFyIG1hdGNoZWRTdHJpbmcgPSBtYXRjaFJlc3VsdFswXTtcbiAgICB2YXIgcGFyc2VSZXN1bHQgPSBzdHJpbmcubWF0Y2goYXJncy5wYXJzZVBhdHRlcm4pO1xuICAgIGlmICghcGFyc2VSZXN1bHQpIHJldHVybiBudWxsO1xuICAgIHZhciB2YWx1ZSA9IGFyZ3MudmFsdWVDYWxsYmFjayA/IGFyZ3MudmFsdWVDYWxsYmFjayhwYXJzZVJlc3VsdFswXSkgOiBwYXJzZVJlc3VsdFswXTtcbiAgICB2YWx1ZSA9IG9wdGlvbnMudmFsdWVDYWxsYmFjayA/IG9wdGlvbnMudmFsdWVDYWxsYmFjayh2YWx1ZSkgOiB2YWx1ZTtcbiAgICB2YXIgcmVzdCA9IHN0cmluZy5zbGljZShtYXRjaGVkU3RyaW5nLmxlbmd0aCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgIHJlc3Q6IHJlc3RcbiAgICB9O1xuICB9O1xufSIsInZhciBmb3JtYXREaXN0YW5jZUxvY2FsZSA9IHtcbiAgbGVzc1RoYW5YU2Vjb25kczoge1xuICAgIG9uZTogJ2xlc3MgdGhhbiBhIHNlY29uZCcsXG4gICAgb3RoZXI6ICdsZXNzIHRoYW4ge3tjb3VudH19IHNlY29uZHMnXG4gIH0sXG4gIHhTZWNvbmRzOiB7XG4gICAgb25lOiAnMSBzZWNvbmQnLFxuICAgIG90aGVyOiAne3tjb3VudH19IHNlY29uZHMnXG4gIH0sXG4gIGhhbGZBTWludXRlOiAnaGFsZiBhIG1pbnV0ZScsXG4gIGxlc3NUaGFuWE1pbnV0ZXM6IHtcbiAgICBvbmU6ICdsZXNzIHRoYW4gYSBtaW51dGUnLFxuICAgIG90aGVyOiAnbGVzcyB0aGFuIHt7Y291bnR9fSBtaW51dGVzJ1xuICB9LFxuICB4TWludXRlczoge1xuICAgIG9uZTogJzEgbWludXRlJyxcbiAgICBvdGhlcjogJ3t7Y291bnR9fSBtaW51dGVzJ1xuICB9LFxuICBhYm91dFhIb3Vyczoge1xuICAgIG9uZTogJ2Fib3V0IDEgaG91cicsXG4gICAgb3RoZXI6ICdhYm91dCB7e2NvdW50fX0gaG91cnMnXG4gIH0sXG4gIHhIb3Vyczoge1xuICAgIG9uZTogJzEgaG91cicsXG4gICAgb3RoZXI6ICd7e2NvdW50fX0gaG91cnMnXG4gIH0sXG4gIHhEYXlzOiB7XG4gICAgb25lOiAnMSBkYXknLFxuICAgIG90aGVyOiAne3tjb3VudH19IGRheXMnXG4gIH0sXG4gIGFib3V0WFdlZWtzOiB7XG4gICAgb25lOiAnYWJvdXQgMSB3ZWVrJyxcbiAgICBvdGhlcjogJ2Fib3V0IHt7Y291bnR9fSB3ZWVrcydcbiAgfSxcbiAgeFdlZWtzOiB7XG4gICAgb25lOiAnMSB3ZWVrJyxcbiAgICBvdGhlcjogJ3t7Y291bnR9fSB3ZWVrcydcbiAgfSxcbiAgYWJvdXRYTW9udGhzOiB7XG4gICAgb25lOiAnYWJvdXQgMSBtb250aCcsXG4gICAgb3RoZXI6ICdhYm91dCB7e2NvdW50fX0gbW9udGhzJ1xuICB9LFxuICB4TW9udGhzOiB7XG4gICAgb25lOiAnMSBtb250aCcsXG4gICAgb3RoZXI6ICd7e2NvdW50fX0gbW9udGhzJ1xuICB9LFxuICBhYm91dFhZZWFyczoge1xuICAgIG9uZTogJ2Fib3V0IDEgeWVhcicsXG4gICAgb3RoZXI6ICdhYm91dCB7e2NvdW50fX0geWVhcnMnXG4gIH0sXG4gIHhZZWFyczoge1xuICAgIG9uZTogJzEgeWVhcicsXG4gICAgb3RoZXI6ICd7e2NvdW50fX0geWVhcnMnXG4gIH0sXG4gIG92ZXJYWWVhcnM6IHtcbiAgICBvbmU6ICdvdmVyIDEgeWVhcicsXG4gICAgb3RoZXI6ICdvdmVyIHt7Y291bnR9fSB5ZWFycydcbiAgfSxcbiAgYWxtb3N0WFllYXJzOiB7XG4gICAgb25lOiAnYWxtb3N0IDEgeWVhcicsXG4gICAgb3RoZXI6ICdhbG1vc3Qge3tjb3VudH19IHllYXJzJ1xuICB9XG59O1xudmFyIGZvcm1hdERpc3RhbmNlID0gZnVuY3Rpb24gZm9ybWF0RGlzdGFuY2UodG9rZW4sIGNvdW50LCBvcHRpb25zKSB7XG4gIHZhciByZXN1bHQ7XG4gIHZhciB0b2tlblZhbHVlID0gZm9ybWF0RGlzdGFuY2VMb2NhbGVbdG9rZW5dO1xuICBpZiAodHlwZW9mIHRva2VuVmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmVzdWx0ID0gdG9rZW5WYWx1ZTtcbiAgfSBlbHNlIGlmIChjb3VudCA9PT0gMSkge1xuICAgIHJlc3VsdCA9IHRva2VuVmFsdWUub25lO1xuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9IHRva2VuVmFsdWUub3RoZXIucmVwbGFjZSgne3tjb3VudH19JywgY291bnQudG9TdHJpbmcoKSk7XG4gIH1cbiAgaWYgKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucyAhPT0gdm9pZCAwICYmIG9wdGlvbnMuYWRkU3VmZml4KSB7XG4gICAgaWYgKG9wdGlvbnMuY29tcGFyaXNvbiAmJiBvcHRpb25zLmNvbXBhcmlzb24gPiAwKSB7XG4gICAgICByZXR1cm4gJ2luICcgKyByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiByZXN1bHQgKyAnIGFnbyc7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuZXhwb3J0IGRlZmF1bHQgZm9ybWF0RGlzdGFuY2U7IiwiaW1wb3J0IGJ1aWxkRm9ybWF0TG9uZ0ZuIGZyb20gXCIuLi8uLi8uLi9fbGliL2J1aWxkRm9ybWF0TG9uZ0ZuL2luZGV4LmpzXCI7XG52YXIgZGF0ZUZvcm1hdHMgPSB7XG4gIGZ1bGw6ICdFRUVFLCBNTU1NIGRvLCB5JyxcbiAgbG9uZzogJ01NTU0gZG8sIHknLFxuICBtZWRpdW06ICdNTU0gZCwgeScsXG4gIHNob3J0OiAnTU0vZGQveXl5eSdcbn07XG52YXIgdGltZUZvcm1hdHMgPSB7XG4gIGZ1bGw6ICdoOm1tOnNzIGEgenp6eicsXG4gIGxvbmc6ICdoOm1tOnNzIGEgeicsXG4gIG1lZGl1bTogJ2g6bW06c3MgYScsXG4gIHNob3J0OiAnaDptbSBhJ1xufTtcbnZhciBkYXRlVGltZUZvcm1hdHMgPSB7XG4gIGZ1bGw6IFwie3tkYXRlfX0gJ2F0JyB7e3RpbWV9fVwiLFxuICBsb25nOiBcInt7ZGF0ZX19ICdhdCcge3t0aW1lfX1cIixcbiAgbWVkaXVtOiAne3tkYXRlfX0sIHt7dGltZX19JyxcbiAgc2hvcnQ6ICd7e2RhdGV9fSwge3t0aW1lfX0nXG59O1xudmFyIGZvcm1hdExvbmcgPSB7XG4gIGRhdGU6IGJ1aWxkRm9ybWF0TG9uZ0ZuKHtcbiAgICBmb3JtYXRzOiBkYXRlRm9ybWF0cyxcbiAgICBkZWZhdWx0V2lkdGg6ICdmdWxsJ1xuICB9KSxcbiAgdGltZTogYnVpbGRGb3JtYXRMb25nRm4oe1xuICAgIGZvcm1hdHM6IHRpbWVGb3JtYXRzLFxuICAgIGRlZmF1bHRXaWR0aDogJ2Z1bGwnXG4gIH0pLFxuICBkYXRlVGltZTogYnVpbGRGb3JtYXRMb25nRm4oe1xuICAgIGZvcm1hdHM6IGRhdGVUaW1lRm9ybWF0cyxcbiAgICBkZWZhdWx0V2lkdGg6ICdmdWxsJ1xuICB9KVxufTtcbmV4cG9ydCBkZWZhdWx0IGZvcm1hdExvbmc7IiwidmFyIGZvcm1hdFJlbGF0aXZlTG9jYWxlID0ge1xuICBsYXN0V2VlazogXCInbGFzdCcgZWVlZSAnYXQnIHBcIixcbiAgeWVzdGVyZGF5OiBcIid5ZXN0ZXJkYXkgYXQnIHBcIixcbiAgdG9kYXk6IFwiJ3RvZGF5IGF0JyBwXCIsXG4gIHRvbW9ycm93OiBcIid0b21vcnJvdyBhdCcgcFwiLFxuICBuZXh0V2VlazogXCJlZWVlICdhdCcgcFwiLFxuICBvdGhlcjogJ1AnXG59O1xudmFyIGZvcm1hdFJlbGF0aXZlID0gZnVuY3Rpb24gZm9ybWF0UmVsYXRpdmUodG9rZW4sIF9kYXRlLCBfYmFzZURhdGUsIF9vcHRpb25zKSB7XG4gIHJldHVybiBmb3JtYXRSZWxhdGl2ZUxvY2FsZVt0b2tlbl07XG59O1xuZXhwb3J0IGRlZmF1bHQgZm9ybWF0UmVsYXRpdmU7IiwiaW1wb3J0IGJ1aWxkTG9jYWxpemVGbiBmcm9tIFwiLi4vLi4vLi4vX2xpYi9idWlsZExvY2FsaXplRm4vaW5kZXguanNcIjtcbnZhciBlcmFWYWx1ZXMgPSB7XG4gIG5hcnJvdzogWydCJywgJ0EnXSxcbiAgYWJicmV2aWF0ZWQ6IFsnQkMnLCAnQUQnXSxcbiAgd2lkZTogWydCZWZvcmUgQ2hyaXN0JywgJ0Fubm8gRG9taW5pJ11cbn07XG52YXIgcXVhcnRlclZhbHVlcyA9IHtcbiAgbmFycm93OiBbJzEnLCAnMicsICczJywgJzQnXSxcbiAgYWJicmV2aWF0ZWQ6IFsnUTEnLCAnUTInLCAnUTMnLCAnUTQnXSxcbiAgd2lkZTogWycxc3QgcXVhcnRlcicsICcybmQgcXVhcnRlcicsICczcmQgcXVhcnRlcicsICc0dGggcXVhcnRlciddXG59O1xuXG4vLyBOb3RlOiBpbiBFbmdsaXNoLCB0aGUgbmFtZXMgb2YgZGF5cyBvZiB0aGUgd2VlayBhbmQgbW9udGhzIGFyZSBjYXBpdGFsaXplZC5cbi8vIElmIHlvdSBhcmUgbWFraW5nIGEgbmV3IGxvY2FsZSBiYXNlZCBvbiB0aGlzIG9uZSwgY2hlY2sgaWYgdGhlIHNhbWUgaXMgdHJ1ZSBmb3IgdGhlIGxhbmd1YWdlIHlvdSdyZSB3b3JraW5nIG9uLlxuLy8gR2VuZXJhbGx5LCBmb3JtYXR0ZWQgZGF0ZXMgc2hvdWxkIGxvb2sgbGlrZSB0aGV5IGFyZSBpbiB0aGUgbWlkZGxlIG9mIGEgc2VudGVuY2UsXG4vLyBlLmcuIGluIFNwYW5pc2ggbGFuZ3VhZ2UgdGhlIHdlZWtkYXlzIGFuZCBtb250aHMgc2hvdWxkIGJlIGluIHRoZSBsb3dlcmNhc2UuXG52YXIgbW9udGhWYWx1ZXMgPSB7XG4gIG5hcnJvdzogWydKJywgJ0YnLCAnTScsICdBJywgJ00nLCAnSicsICdKJywgJ0EnLCAnUycsICdPJywgJ04nLCAnRCddLFxuICBhYmJyZXZpYXRlZDogWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsICdPY3QnLCAnTm92JywgJ0RlYyddLFxuICB3aWRlOiBbJ0phbnVhcnknLCAnRmVicnVhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLCAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXVxufTtcbnZhciBkYXlWYWx1ZXMgPSB7XG4gIG5hcnJvdzogWydTJywgJ00nLCAnVCcsICdXJywgJ1QnLCAnRicsICdTJ10sXG4gIHNob3J0OiBbJ1N1JywgJ01vJywgJ1R1JywgJ1dlJywgJ1RoJywgJ0ZyJywgJ1NhJ10sXG4gIGFiYnJldmlhdGVkOiBbJ1N1bicsICdNb24nLCAnVHVlJywgJ1dlZCcsICdUaHUnLCAnRnJpJywgJ1NhdCddLFxuICB3aWRlOiBbJ1N1bmRheScsICdNb25kYXknLCAnVHVlc2RheScsICdXZWRuZXNkYXknLCAnVGh1cnNkYXknLCAnRnJpZGF5JywgJ1NhdHVyZGF5J11cbn07XG52YXIgZGF5UGVyaW9kVmFsdWVzID0ge1xuICBuYXJyb3c6IHtcbiAgICBhbTogJ2EnLFxuICAgIHBtOiAncCcsXG4gICAgbWlkbmlnaHQ6ICdtaScsXG4gICAgbm9vbjogJ24nLFxuICAgIG1vcm5pbmc6ICdtb3JuaW5nJyxcbiAgICBhZnRlcm5vb246ICdhZnRlcm5vb24nLFxuICAgIGV2ZW5pbmc6ICdldmVuaW5nJyxcbiAgICBuaWdodDogJ25pZ2h0J1xuICB9LFxuICBhYmJyZXZpYXRlZDoge1xuICAgIGFtOiAnQU0nLFxuICAgIHBtOiAnUE0nLFxuICAgIG1pZG5pZ2h0OiAnbWlkbmlnaHQnLFxuICAgIG5vb246ICdub29uJyxcbiAgICBtb3JuaW5nOiAnbW9ybmluZycsXG4gICAgYWZ0ZXJub29uOiAnYWZ0ZXJub29uJyxcbiAgICBldmVuaW5nOiAnZXZlbmluZycsXG4gICAgbmlnaHQ6ICduaWdodCdcbiAgfSxcbiAgd2lkZToge1xuICAgIGFtOiAnYS5tLicsXG4gICAgcG06ICdwLm0uJyxcbiAgICBtaWRuaWdodDogJ21pZG5pZ2h0JyxcbiAgICBub29uOiAnbm9vbicsXG4gICAgbW9ybmluZzogJ21vcm5pbmcnLFxuICAgIGFmdGVybm9vbjogJ2FmdGVybm9vbicsXG4gICAgZXZlbmluZzogJ2V2ZW5pbmcnLFxuICAgIG5pZ2h0OiAnbmlnaHQnXG4gIH1cbn07XG52YXIgZm9ybWF0dGluZ0RheVBlcmlvZFZhbHVlcyA9IHtcbiAgbmFycm93OiB7XG4gICAgYW06ICdhJyxcbiAgICBwbTogJ3AnLFxuICAgIG1pZG5pZ2h0OiAnbWknLFxuICAgIG5vb246ICduJyxcbiAgICBtb3JuaW5nOiAnaW4gdGhlIG1vcm5pbmcnLFxuICAgIGFmdGVybm9vbjogJ2luIHRoZSBhZnRlcm5vb24nLFxuICAgIGV2ZW5pbmc6ICdpbiB0aGUgZXZlbmluZycsXG4gICAgbmlnaHQ6ICdhdCBuaWdodCdcbiAgfSxcbiAgYWJicmV2aWF0ZWQ6IHtcbiAgICBhbTogJ0FNJyxcbiAgICBwbTogJ1BNJyxcbiAgICBtaWRuaWdodDogJ21pZG5pZ2h0JyxcbiAgICBub29uOiAnbm9vbicsXG4gICAgbW9ybmluZzogJ2luIHRoZSBtb3JuaW5nJyxcbiAgICBhZnRlcm5vb246ICdpbiB0aGUgYWZ0ZXJub29uJyxcbiAgICBldmVuaW5nOiAnaW4gdGhlIGV2ZW5pbmcnLFxuICAgIG5pZ2h0OiAnYXQgbmlnaHQnXG4gIH0sXG4gIHdpZGU6IHtcbiAgICBhbTogJ2EubS4nLFxuICAgIHBtOiAncC5tLicsXG4gICAgbWlkbmlnaHQ6ICdtaWRuaWdodCcsXG4gICAgbm9vbjogJ25vb24nLFxuICAgIG1vcm5pbmc6ICdpbiB0aGUgbW9ybmluZycsXG4gICAgYWZ0ZXJub29uOiAnaW4gdGhlIGFmdGVybm9vbicsXG4gICAgZXZlbmluZzogJ2luIHRoZSBldmVuaW5nJyxcbiAgICBuaWdodDogJ2F0IG5pZ2h0J1xuICB9XG59O1xudmFyIG9yZGluYWxOdW1iZXIgPSBmdW5jdGlvbiBvcmRpbmFsTnVtYmVyKGRpcnR5TnVtYmVyLCBfb3B0aW9ucykge1xuICB2YXIgbnVtYmVyID0gTnVtYmVyKGRpcnR5TnVtYmVyKTtcblxuICAvLyBJZiBvcmRpbmFsIG51bWJlcnMgZGVwZW5kIG9uIGNvbnRleHQsIGZvciBleGFtcGxlLFxuICAvLyBpZiB0aGV5IGFyZSBkaWZmZXJlbnQgZm9yIGRpZmZlcmVudCBncmFtbWF0aWNhbCBnZW5kZXJzLFxuICAvLyB1c2UgYG9wdGlvbnMudW5pdGAuXG4gIC8vXG4gIC8vIGB1bml0YCBjYW4gYmUgJ3llYXInLCAncXVhcnRlcicsICdtb250aCcsICd3ZWVrJywgJ2RhdGUnLCAnZGF5T2ZZZWFyJyxcbiAgLy8gJ2RheScsICdob3VyJywgJ21pbnV0ZScsICdzZWNvbmQnLlxuXG4gIHZhciByZW0xMDAgPSBudW1iZXIgJSAxMDA7XG4gIGlmIChyZW0xMDAgPiAyMCB8fCByZW0xMDAgPCAxMCkge1xuICAgIHN3aXRjaCAocmVtMTAwICUgMTApIHtcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIG51bWJlciArICdzdCc7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHJldHVybiBudW1iZXIgKyAnbmQnO1xuICAgICAgY2FzZSAzOlxuICAgICAgICByZXR1cm4gbnVtYmVyICsgJ3JkJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG51bWJlciArICd0aCc7XG59O1xudmFyIGxvY2FsaXplID0ge1xuICBvcmRpbmFsTnVtYmVyOiBvcmRpbmFsTnVtYmVyLFxuICBlcmE6IGJ1aWxkTG9jYWxpemVGbih7XG4gICAgdmFsdWVzOiBlcmFWYWx1ZXMsXG4gICAgZGVmYXVsdFdpZHRoOiAnd2lkZSdcbiAgfSksXG4gIHF1YXJ0ZXI6IGJ1aWxkTG9jYWxpemVGbih7XG4gICAgdmFsdWVzOiBxdWFydGVyVmFsdWVzLFxuICAgIGRlZmF1bHRXaWR0aDogJ3dpZGUnLFxuICAgIGFyZ3VtZW50Q2FsbGJhY2s6IGZ1bmN0aW9uIGFyZ3VtZW50Q2FsbGJhY2socXVhcnRlcikge1xuICAgICAgcmV0dXJuIHF1YXJ0ZXIgLSAxO1xuICAgIH1cbiAgfSksXG4gIG1vbnRoOiBidWlsZExvY2FsaXplRm4oe1xuICAgIHZhbHVlczogbW9udGhWYWx1ZXMsXG4gICAgZGVmYXVsdFdpZHRoOiAnd2lkZSdcbiAgfSksXG4gIGRheTogYnVpbGRMb2NhbGl6ZUZuKHtcbiAgICB2YWx1ZXM6IGRheVZhbHVlcyxcbiAgICBkZWZhdWx0V2lkdGg6ICd3aWRlJ1xuICB9KSxcbiAgZGF5UGVyaW9kOiBidWlsZExvY2FsaXplRm4oe1xuICAgIHZhbHVlczogZGF5UGVyaW9kVmFsdWVzLFxuICAgIGRlZmF1bHRXaWR0aDogJ3dpZGUnLFxuICAgIGZvcm1hdHRpbmdWYWx1ZXM6IGZvcm1hdHRpbmdEYXlQZXJpb2RWYWx1ZXMsXG4gICAgZGVmYXVsdEZvcm1hdHRpbmdXaWR0aDogJ3dpZGUnXG4gIH0pXG59O1xuZXhwb3J0IGRlZmF1bHQgbG9jYWxpemU7IiwiaW1wb3J0IGJ1aWxkTWF0Y2hGbiBmcm9tIFwiLi4vLi4vLi4vX2xpYi9idWlsZE1hdGNoRm4vaW5kZXguanNcIjtcbmltcG9ydCBidWlsZE1hdGNoUGF0dGVybkZuIGZyb20gXCIuLi8uLi8uLi9fbGliL2J1aWxkTWF0Y2hQYXR0ZXJuRm4vaW5kZXguanNcIjtcbnZhciBtYXRjaE9yZGluYWxOdW1iZXJQYXR0ZXJuID0gL14oXFxkKykodGh8c3R8bmR8cmQpPy9pO1xudmFyIHBhcnNlT3JkaW5hbE51bWJlclBhdHRlcm4gPSAvXFxkKy9pO1xudmFyIG1hdGNoRXJhUGF0dGVybnMgPSB7XG4gIG5hcnJvdzogL14oYnxhKS9pLFxuICBhYmJyZXZpYXRlZDogL14oYlxcLj9cXHM/Y1xcLj98YlxcLj9cXHM/Y1xcLj9cXHM/ZVxcLj98YVxcLj9cXHM/ZFxcLj98Y1xcLj9cXHM/ZVxcLj8pL2ksXG4gIHdpZGU6IC9eKGJlZm9yZSBjaHJpc3R8YmVmb3JlIGNvbW1vbiBlcmF8YW5ubyBkb21pbml8Y29tbW9uIGVyYSkvaVxufTtcbnZhciBwYXJzZUVyYVBhdHRlcm5zID0ge1xuICBhbnk6IFsvXmIvaSwgL14oYXxjKS9pXVxufTtcbnZhciBtYXRjaFF1YXJ0ZXJQYXR0ZXJucyA9IHtcbiAgbmFycm93OiAvXlsxMjM0XS9pLFxuICBhYmJyZXZpYXRlZDogL15xWzEyMzRdL2ksXG4gIHdpZGU6IC9eWzEyMzRdKHRofHN0fG5kfHJkKT8gcXVhcnRlci9pXG59O1xudmFyIHBhcnNlUXVhcnRlclBhdHRlcm5zID0ge1xuICBhbnk6IFsvMS9pLCAvMi9pLCAvMy9pLCAvNC9pXVxufTtcbnZhciBtYXRjaE1vbnRoUGF0dGVybnMgPSB7XG4gIG5hcnJvdzogL15bamZtYXNvbmRdL2ksXG4gIGFiYnJldmlhdGVkOiAvXihqYW58ZmVifG1hcnxhcHJ8bWF5fGp1bnxqdWx8YXVnfHNlcHxvY3R8bm92fGRlYykvaSxcbiAgd2lkZTogL14oamFudWFyeXxmZWJydWFyeXxtYXJjaHxhcHJpbHxtYXl8anVuZXxqdWx5fGF1Z3VzdHxzZXB0ZW1iZXJ8b2N0b2Jlcnxub3ZlbWJlcnxkZWNlbWJlcikvaVxufTtcbnZhciBwYXJzZU1vbnRoUGF0dGVybnMgPSB7XG4gIG5hcnJvdzogWy9eai9pLCAvXmYvaSwgL15tL2ksIC9eYS9pLCAvXm0vaSwgL15qL2ksIC9eai9pLCAvXmEvaSwgL15zL2ksIC9eby9pLCAvXm4vaSwgL15kL2ldLFxuICBhbnk6IFsvXmphL2ksIC9eZi9pLCAvXm1hci9pLCAvXmFwL2ksIC9ebWF5L2ksIC9eanVuL2ksIC9eanVsL2ksIC9eYXUvaSwgL15zL2ksIC9eby9pLCAvXm4vaSwgL15kL2ldXG59O1xudmFyIG1hdGNoRGF5UGF0dGVybnMgPSB7XG4gIG5hcnJvdzogL15bc210d2ZdL2ksXG4gIHNob3J0OiAvXihzdXxtb3x0dXx3ZXx0aHxmcnxzYSkvaSxcbiAgYWJicmV2aWF0ZWQ6IC9eKHN1bnxtb258dHVlfHdlZHx0aHV8ZnJpfHNhdCkvaSxcbiAgd2lkZTogL14oc3VuZGF5fG1vbmRheXx0dWVzZGF5fHdlZG5lc2RheXx0aHVyc2RheXxmcmlkYXl8c2F0dXJkYXkpL2lcbn07XG52YXIgcGFyc2VEYXlQYXR0ZXJucyA9IHtcbiAgbmFycm93OiBbL15zL2ksIC9ebS9pLCAvXnQvaSwgL153L2ksIC9edC9pLCAvXmYvaSwgL15zL2ldLFxuICBhbnk6IFsvXnN1L2ksIC9ebS9pLCAvXnR1L2ksIC9edy9pLCAvXnRoL2ksIC9eZi9pLCAvXnNhL2ldXG59O1xudmFyIG1hdGNoRGF5UGVyaW9kUGF0dGVybnMgPSB7XG4gIG5hcnJvdzogL14oYXxwfG1pfG58KGluIHRoZXxhdCkgKG1vcm5pbmd8YWZ0ZXJub29ufGV2ZW5pbmd8bmlnaHQpKS9pLFxuICBhbnk6IC9eKFthcF1cXC4/XFxzP21cXC4/fG1pZG5pZ2h0fG5vb258KGluIHRoZXxhdCkgKG1vcm5pbmd8YWZ0ZXJub29ufGV2ZW5pbmd8bmlnaHQpKS9pXG59O1xudmFyIHBhcnNlRGF5UGVyaW9kUGF0dGVybnMgPSB7XG4gIGFueToge1xuICAgIGFtOiAvXmEvaSxcbiAgICBwbTogL15wL2ksXG4gICAgbWlkbmlnaHQ6IC9ebWkvaSxcbiAgICBub29uOiAvXm5vL2ksXG4gICAgbW9ybmluZzogL21vcm5pbmcvaSxcbiAgICBhZnRlcm5vb246IC9hZnRlcm5vb24vaSxcbiAgICBldmVuaW5nOiAvZXZlbmluZy9pLFxuICAgIG5pZ2h0OiAvbmlnaHQvaVxuICB9XG59O1xudmFyIG1hdGNoID0ge1xuICBvcmRpbmFsTnVtYmVyOiBidWlsZE1hdGNoUGF0dGVybkZuKHtcbiAgICBtYXRjaFBhdHRlcm46IG1hdGNoT3JkaW5hbE51bWJlclBhdHRlcm4sXG4gICAgcGFyc2VQYXR0ZXJuOiBwYXJzZU9yZGluYWxOdW1iZXJQYXR0ZXJuLFxuICAgIHZhbHVlQ2FsbGJhY2s6IGZ1bmN0aW9uIHZhbHVlQ2FsbGJhY2sodmFsdWUpIHtcbiAgICAgIHJldHVybiBwYXJzZUludCh2YWx1ZSwgMTApO1xuICAgIH1cbiAgfSksXG4gIGVyYTogYnVpbGRNYXRjaEZuKHtcbiAgICBtYXRjaFBhdHRlcm5zOiBtYXRjaEVyYVBhdHRlcm5zLFxuICAgIGRlZmF1bHRNYXRjaFdpZHRoOiAnd2lkZScsXG4gICAgcGFyc2VQYXR0ZXJuczogcGFyc2VFcmFQYXR0ZXJucyxcbiAgICBkZWZhdWx0UGFyc2VXaWR0aDogJ2FueSdcbiAgfSksXG4gIHF1YXJ0ZXI6IGJ1aWxkTWF0Y2hGbih7XG4gICAgbWF0Y2hQYXR0ZXJuczogbWF0Y2hRdWFydGVyUGF0dGVybnMsXG4gICAgZGVmYXVsdE1hdGNoV2lkdGg6ICd3aWRlJyxcbiAgICBwYXJzZVBhdHRlcm5zOiBwYXJzZVF1YXJ0ZXJQYXR0ZXJucyxcbiAgICBkZWZhdWx0UGFyc2VXaWR0aDogJ2FueScsXG4gICAgdmFsdWVDYWxsYmFjazogZnVuY3Rpb24gdmFsdWVDYWxsYmFjayhpbmRleCkge1xuICAgICAgcmV0dXJuIGluZGV4ICsgMTtcbiAgICB9XG4gIH0pLFxuICBtb250aDogYnVpbGRNYXRjaEZuKHtcbiAgICBtYXRjaFBhdHRlcm5zOiBtYXRjaE1vbnRoUGF0dGVybnMsXG4gICAgZGVmYXVsdE1hdGNoV2lkdGg6ICd3aWRlJyxcbiAgICBwYXJzZVBhdHRlcm5zOiBwYXJzZU1vbnRoUGF0dGVybnMsXG4gICAgZGVmYXVsdFBhcnNlV2lkdGg6ICdhbnknXG4gIH0pLFxuICBkYXk6IGJ1aWxkTWF0Y2hGbih7XG4gICAgbWF0Y2hQYXR0ZXJuczogbWF0Y2hEYXlQYXR0ZXJucyxcbiAgICBkZWZhdWx0TWF0Y2hXaWR0aDogJ3dpZGUnLFxuICAgIHBhcnNlUGF0dGVybnM6IHBhcnNlRGF5UGF0dGVybnMsXG4gICAgZGVmYXVsdFBhcnNlV2lkdGg6ICdhbnknXG4gIH0pLFxuICBkYXlQZXJpb2Q6IGJ1aWxkTWF0Y2hGbih7XG4gICAgbWF0Y2hQYXR0ZXJuczogbWF0Y2hEYXlQZXJpb2RQYXR0ZXJucyxcbiAgICBkZWZhdWx0TWF0Y2hXaWR0aDogJ2FueScsXG4gICAgcGFyc2VQYXR0ZXJuczogcGFyc2VEYXlQZXJpb2RQYXR0ZXJucyxcbiAgICBkZWZhdWx0UGFyc2VXaWR0aDogJ2FueSdcbiAgfSlcbn07XG5leHBvcnQgZGVmYXVsdCBtYXRjaDsiLCJpbXBvcnQgZm9ybWF0RGlzdGFuY2UgZnJvbSBcIi4vX2xpYi9mb3JtYXREaXN0YW5jZS9pbmRleC5qc1wiO1xuaW1wb3J0IGZvcm1hdExvbmcgZnJvbSBcIi4vX2xpYi9mb3JtYXRMb25nL2luZGV4LmpzXCI7XG5pbXBvcnQgZm9ybWF0UmVsYXRpdmUgZnJvbSBcIi4vX2xpYi9mb3JtYXRSZWxhdGl2ZS9pbmRleC5qc1wiO1xuaW1wb3J0IGxvY2FsaXplIGZyb20gXCIuL19saWIvbG9jYWxpemUvaW5kZXguanNcIjtcbmltcG9ydCBtYXRjaCBmcm9tIFwiLi9fbGliL21hdGNoL2luZGV4LmpzXCI7XG4vKipcbiAqIEB0eXBlIHtMb2NhbGV9XG4gKiBAY2F0ZWdvcnkgTG9jYWxlc1xuICogQHN1bW1hcnkgRW5nbGlzaCBsb2NhbGUgKFVuaXRlZCBTdGF0ZXMpLlxuICogQGxhbmd1YWdlIEVuZ2xpc2hcbiAqIEBpc28tNjM5LTIgZW5nXG4gKiBAYXV0aG9yIFNhc2hhIEtvc3MgW0Brb3Nzbm9jb3JwXXtAbGluayBodHRwczovL2dpdGh1Yi5jb20va29zc25vY29ycH1cbiAqIEBhdXRob3IgTGVzaGEgS29zcyBbQGxlc2hha29zc117QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2xlc2hha29zc31cbiAqL1xudmFyIGxvY2FsZSA9IHtcbiAgY29kZTogJ2VuLVVTJyxcbiAgZm9ybWF0RGlzdGFuY2U6IGZvcm1hdERpc3RhbmNlLFxuICBmb3JtYXRMb25nOiBmb3JtYXRMb25nLFxuICBmb3JtYXRSZWxhdGl2ZTogZm9ybWF0UmVsYXRpdmUsXG4gIGxvY2FsaXplOiBsb2NhbGl6ZSxcbiAgbWF0Y2g6IG1hdGNoLFxuICBvcHRpb25zOiB7XG4gICAgd2Vla1N0YXJ0c09uOiAwIC8qIFN1bmRheSAqLyxcbiAgICBmaXJzdFdlZWtDb250YWluc0RhdGU6IDFcbiAgfVxufTtcbmV4cG9ydCBkZWZhdWx0IGxvY2FsZTsiLCJpbXBvcnQgYWRkTWlsbGlzZWNvbmRzIGZyb20gXCIuLi9hZGRNaWxsaXNlY29uZHMvaW5kZXguanNcIjtcbmltcG9ydCByZXF1aXJlZEFyZ3MgZnJvbSBcIi4uL19saWIvcmVxdWlyZWRBcmdzL2luZGV4LmpzXCI7XG5pbXBvcnQgdG9JbnRlZ2VyIGZyb20gXCIuLi9fbGliL3RvSW50ZWdlci9pbmRleC5qc1wiO1xuLyoqXG4gKiBAbmFtZSBzdWJNaWxsaXNlY29uZHNcbiAqIEBjYXRlZ29yeSBNaWxsaXNlY29uZCBIZWxwZXJzXG4gKiBAc3VtbWFyeSBTdWJ0cmFjdCB0aGUgc3BlY2lmaWVkIG51bWJlciBvZiBtaWxsaXNlY29uZHMgZnJvbSB0aGUgZ2l2ZW4gZGF0ZS5cbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFN1YnRyYWN0IHRoZSBzcGVjaWZpZWQgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBmcm9tIHRoZSBnaXZlbiBkYXRlLlxuICpcbiAqIEBwYXJhbSB7RGF0ZXxOdW1iZXJ9IGRhdGUgLSB0aGUgZGF0ZSB0byBiZSBjaGFuZ2VkXG4gKiBAcGFyYW0ge051bWJlcn0gYW1vdW50IC0gdGhlIGFtb3VudCBvZiBtaWxsaXNlY29uZHMgdG8gYmUgc3VidHJhY3RlZC4gUG9zaXRpdmUgZGVjaW1hbHMgd2lsbCBiZSByb3VuZGVkIHVzaW5nIGBNYXRoLmZsb29yYCwgZGVjaW1hbHMgbGVzcyB0aGFuIHplcm8gd2lsbCBiZSByb3VuZGVkIHVzaW5nIGBNYXRoLmNlaWxgLlxuICogQHJldHVybnMge0RhdGV9IHRoZSBuZXcgZGF0ZSB3aXRoIHRoZSBtaWxsaXNlY29uZHMgc3VidHJhY3RlZFxuICogQHRocm93cyB7VHlwZUVycm9yfSAyIGFyZ3VtZW50cyByZXF1aXJlZFxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBTdWJ0cmFjdCA3NTAgbWlsbGlzZWNvbmRzIGZyb20gMTAgSnVseSAyMDE0IDEyOjQ1OjMwLjAwMDpcbiAqIGNvbnN0IHJlc3VsdCA9IHN1Yk1pbGxpc2Vjb25kcyhuZXcgRGF0ZSgyMDE0LCA2LCAxMCwgMTIsIDQ1LCAzMCwgMCksIDc1MClcbiAqIC8vPT4gVGh1IEp1bCAxMCAyMDE0IDEyOjQ1OjI5LjI1MFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdWJNaWxsaXNlY29uZHMoZGlydHlEYXRlLCBkaXJ0eUFtb3VudCkge1xuICByZXF1aXJlZEFyZ3MoMiwgYXJndW1lbnRzKTtcbiAgdmFyIGFtb3VudCA9IHRvSW50ZWdlcihkaXJ0eUFtb3VudCk7XG4gIHJldHVybiBhZGRNaWxsaXNlY29uZHMoZGlydHlEYXRlLCAtYW1vdW50KTtcbn0iLCJpbXBvcnQgX3R5cGVvZiBmcm9tIFwiQGJhYmVsL3J1bnRpbWUvaGVscGVycy9lc20vdHlwZW9mXCI7XG5pbXBvcnQgcmVxdWlyZWRBcmdzIGZyb20gXCIuLi9fbGliL3JlcXVpcmVkQXJncy9pbmRleC5qc1wiO1xuLyoqXG4gKiBAbmFtZSB0b0RhdGVcbiAqIEBjYXRlZ29yeSBDb21tb24gSGVscGVyc1xuICogQHN1bW1hcnkgQ29udmVydCB0aGUgZ2l2ZW4gYXJndW1lbnQgdG8gYW4gaW5zdGFuY2Ugb2YgRGF0ZS5cbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIENvbnZlcnQgdGhlIGdpdmVuIGFyZ3VtZW50IHRvIGFuIGluc3RhbmNlIG9mIERhdGUuXG4gKlxuICogSWYgdGhlIGFyZ3VtZW50IGlzIGFuIGluc3RhbmNlIG9mIERhdGUsIHRoZSBmdW5jdGlvbiByZXR1cm5zIGl0cyBjbG9uZS5cbiAqXG4gKiBJZiB0aGUgYXJndW1lbnQgaXMgYSBudW1iZXIsIGl0IGlzIHRyZWF0ZWQgYXMgYSB0aW1lc3RhbXAuXG4gKlxuICogSWYgdGhlIGFyZ3VtZW50IGlzIG5vbmUgb2YgdGhlIGFib3ZlLCB0aGUgZnVuY3Rpb24gcmV0dXJucyBJbnZhbGlkIERhdGUuXG4gKlxuICogKipOb3RlKio6ICphbGwqIERhdGUgYXJndW1lbnRzIHBhc3NlZCB0byBhbnkgKmRhdGUtZm5zKiBmdW5jdGlvbiBpcyBwcm9jZXNzZWQgYnkgYHRvRGF0ZWAuXG4gKlxuICogQHBhcmFtIHtEYXRlfE51bWJlcn0gYXJndW1lbnQgLSB0aGUgdmFsdWUgdG8gY29udmVydFxuICogQHJldHVybnMge0RhdGV9IHRoZSBwYXJzZWQgZGF0ZSBpbiB0aGUgbG9jYWwgdGltZSB6b25lXG4gKiBAdGhyb3dzIHtUeXBlRXJyb3J9IDEgYXJndW1lbnQgcmVxdWlyZWRcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gQ2xvbmUgdGhlIGRhdGU6XG4gKiBjb25zdCByZXN1bHQgPSB0b0RhdGUobmV3IERhdGUoMjAxNCwgMSwgMTEsIDExLCAzMCwgMzApKVxuICogLy89PiBUdWUgRmViIDExIDIwMTQgMTE6MzA6MzBcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gQ29udmVydCB0aGUgdGltZXN0YW1wIHRvIGRhdGU6XG4gKiBjb25zdCByZXN1bHQgPSB0b0RhdGUoMTM5MjA5ODQzMDAwMClcbiAqIC8vPT4gVHVlIEZlYiAxMSAyMDE0IDExOjMwOjMwXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRvRGF0ZShhcmd1bWVudCkge1xuICByZXF1aXJlZEFyZ3MoMSwgYXJndW1lbnRzKTtcbiAgdmFyIGFyZ1N0ciA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcmd1bWVudCk7XG5cbiAgLy8gQ2xvbmUgdGhlIGRhdGVcbiAgaWYgKGFyZ3VtZW50IGluc3RhbmNlb2YgRGF0ZSB8fCBfdHlwZW9mKGFyZ3VtZW50KSA9PT0gJ29iamVjdCcgJiYgYXJnU3RyID09PSAnW29iamVjdCBEYXRlXScpIHtcbiAgICAvLyBQcmV2ZW50IHRoZSBkYXRlIHRvIGxvc2UgdGhlIG1pbGxpc2Vjb25kcyB3aGVuIHBhc3NlZCB0byBuZXcgRGF0ZSgpIGluIElFMTBcbiAgICByZXR1cm4gbmV3IERhdGUoYXJndW1lbnQuZ2V0VGltZSgpKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgYXJndW1lbnQgPT09ICdudW1iZXInIHx8IGFyZ1N0ciA9PT0gJ1tvYmplY3QgTnVtYmVyXScpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoYXJndW1lbnQpO1xuICB9IGVsc2Uge1xuICAgIGlmICgodHlwZW9mIGFyZ3VtZW50ID09PSAnc3RyaW5nJyB8fCBhcmdTdHIgPT09ICdbb2JqZWN0IFN0cmluZ10nKSAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLndhcm4oXCJTdGFydGluZyB3aXRoIHYyLjAuMC1iZXRhLjEgZGF0ZS1mbnMgZG9lc24ndCBhY2NlcHQgc3RyaW5ncyBhcyBkYXRlIGFyZ3VtZW50cy4gUGxlYXNlIHVzZSBgcGFyc2VJU09gIHRvIHBhcnNlIHN0cmluZ3MuIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2RhdGUtZm5zL2RhdGUtZm5zL2Jsb2IvbWFzdGVyL2RvY3MvdXBncmFkZUd1aWRlLm1kI3N0cmluZy1hcmd1bWVudHNcIik7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgICAgY29uc29sZS53YXJuKG5ldyBFcnJvcigpLnN0YWNrKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBEYXRlKE5hTik7XG4gIH1cbn0iLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3Byb2plY3RNb2R1bGUuc2Nzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3Byb2plY3RNb2R1bGUuc2Nzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9vcGVuSW5ib3guY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9vcGVuSW5ib3guY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3Byb2plY3RDb250cm9sbGVyLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcHJvamVjdENvbnRyb2xsZXIuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3Byb2plY3RGb3JtLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vcHJvamVjdEZvcm0uY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3Byb2plY3RNb2R1bGUuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9wcm9qZWN0TW9kdWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi90YXNrRm9ybS5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3Rhc2tGb3JtLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX3R5cGVvZihvYmopIHtcbiAgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiO1xuXG4gIHJldHVybiBfdHlwZW9mID0gXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgJiYgXCJzeW1ib2xcIiA9PSB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID8gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiB0eXBlb2Ygb2JqO1xuICB9IDogZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBvYmogJiYgXCJmdW5jdGlvblwiID09IHR5cGVvZiBTeW1ib2wgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG4gIH0sIF90eXBlb2Yob2JqKTtcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCIvLyBUT0RPOiBGSVggcHJvamVjdHNDb250YWluZXIncyBIZWlnaHRcblxuaW1wb3J0IFwiLi9zdHlsZS5jc3NcIjtcbmltcG9ydCBcIi4vcHJvamVjdEZvcm0uY3NzXCI7XG5pbXBvcnQgeyBldmVudHMgfSBmcm9tIFwiLi9wdWJzdWJcIjtcbmltcG9ydCB7IGNyZWF0ZVRvZG8sIGNyZWF0ZVByb2plY3QgfSBmcm9tIFwiLi90b2RvXCI7XG5pbXBvcnQgZGlzcGxheVByb2plY3RJbnB1dEZpZWxkIGZyb20gXCIuL3Byb2plY3RGb3JtXCI7XG5cbmNvbnN0IGJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKTtcblxuLy8gQmFyc1xuY29uc3QgbmF2QmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImhlYWRlclwiKTtcbm5hdkJhci5pZCA9IFwibmF2QmFyXCI7XG5jb25zdCBteVNpZGViYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibmF2XCIpO1xubXlTaWRlYmFyLmNsYXNzTGlzdC5hZGQoXCJzaWRlYmFyXCIpO1xubXlTaWRlYmFyLmNsYXNzTGlzdC5hZGQoXCJzaWRlYmFyT3BlblwiKTtcblxuLy8gSW5ib3ggV2hlcmUgQWxsIFRoZSBUb0RvcyBXaWxsIEJlIEtlcHRcbmNvbnN0IHNpZGVCYXJJbmJveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5zaWRlQmFySW5ib3guaWQgPSBcInNpZGVCYXJJbmJveFwiO1xuc2lkZUJhckluYm94LmlubmVyVGV4dCA9IFwiVG9EbyBJbmJveFwiO1xuc2lkZUJhckluYm94LnRpdGxlID0gXCJUT0RPIElOQk9YXCI7XG5zaWRlQmFySW5ib3guYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgZXZlbnRzLmVtaXQoXCJvcGVuSW5ib3hcIik7XG59KTtcbi8vIENpcmNsZSBUaGF0IERpc3BsYXlzIFRvZG8gQ291bnRcbmNvbnN0IGNvbG9yQ2lyY2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG5jb2xvckNpcmNsZS5jbGFzc0xpc3QuYWRkKFwiY29sb3JDaXJjbGUtSW5ib3hcIik7XG5jb2xvckNpcmNsZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIndoaXRlXCI7XG5zaWRlQmFySW5ib3guYXBwZW5kQ2hpbGQoY29sb3JDaXJjbGUpO1xuXG4vLyBQcm9qZWN0cyBGb3IgdGhlIFNpZGVCYXJcbi8vIExhYmVsXG5jb25zdCBwcm9qZWN0TGFiZWxDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2VjdGlvblwiKTtcbmNvbnN0IHByb2plY3RMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xucHJvamVjdExhYmVsQ29udGFpbmVyLmlkID0gXCJwcm9qZWN0TGFiZWxDb250YWluZXJcIjtcbnByb2plY3RMYWJlbC5pZCA9IFwicHJvamVjdExhYmVsXCI7XG5wcm9qZWN0TGFiZWwuaW5uZXJUZXh0ID0gXCJQUk9KRUNUU1wiO1xucHJvamVjdExhYmVsLnRpdGxlID0gXCJQUk9KRUNUU1wiO1xuLy8gQnV0dG9ucyBGb3IgUHJvamVjdHNcbmNvbnN0IHNpZGJhckJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5jb25zdCBvcGVuQ2xvc2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbmNvbnN0IGFkZFByb2plY3RzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG5cbnNpZGJhckJ1dHRvbkNvbnRhaW5lci5pZCA9IFwic2lkYmFyQnV0dG9uQ29udGFpbmVyXCI7XG5vcGVuQ2xvc2UuaW5uZXJUZXh0ID0gXCJcXHUxNDJGXCI7IC8vICAgLVxcdTI3OTYgfCArXFx1Mjc5NSB8IGRvd25BcnJvdyBcXHUxNDJGXG5hZGRQcm9qZWN0cy5pbm5lclRleHQgPSBcIlxcdTI3OTVcIjtcbmFkZFByb2plY3RzLnRpdGxlID0gXCJBREQgUFJPSkVDVFNcIjtcbm9wZW5DbG9zZS50aXRsZSA9IFwiVE9HR0xFIFBST0pFQ1QgTElTVFwiO1xuXG5hZGRQcm9qZWN0cy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZGlzcGxheVByb2plY3RJbnB1dEZpZWxkLCBmYWxzZSk7XG5cbi8vIER1bW15IGNvbnRlbnQgZm9yIHNpdGVcbmNvbnN0IGNvbnRlbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibWFpblwiKTtcbmNvbnN0IGNvbnRlbnRIb21lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgxXCIpO1xuY29uc3QgaG9tZUFkZFByb2plY3RCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuLy8gSUQncyBhbmQgSW5uZXJUZXh0XG5jb250ZW50LmlkID0gXCJjb250ZW50XCI7XG5jb250ZW50LmNsYXNzTGlzdC5hZGQoXCJjb250ZW50UHVzaGVkXCIpO1xuY29udGVudEhvbWUuaWQgPSBcImNvbnRlbnRIb21lXCI7XG5jb250ZW50SG9tZS5pbm5lclRleHQgPSBcIlByb2plY3RzXCI7XG5ob21lQWRkUHJvamVjdEJ0bi5pbm5lclRleHQgPSBcIlxcdTI3OTUgQWRkIFByb2plY3RcIjtcbmhvbWVBZGRQcm9qZWN0QnRuLmlkID0gXCJob21lQWRkUHJvamVjdEJ0blwiO1xuLy8gRnVuY3Rpb25hbGl0eVxuaG9tZUFkZFByb2plY3RCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGRpc3BsYXlQcm9qZWN0SW5wdXRGaWVsZCwgZmFsc2UpO1xuLy8gQXBwZW5kIENoaWxkcmVuXG5jb250ZW50SG9tZS5hcHBlbmRDaGlsZChob21lQWRkUHJvamVjdEJ0bik7XG5cbi8vIEhhbmRsZXMgcHJvamVjdHNcbmNvbnN0IHByb2plY3RzQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbnByb2plY3RzQ29udGFpbmVyLmlkID0gXCJwcm9qZWN0c0NvbnRhaW5lclwiO1xuZnVuY3Rpb24gY29sbGFwZVByb2plY3RzKGV2dCkge1xuICBjb25zdCBlbCA9IGV2dC50YXJnZXQ7XG4gIGVsLmlubmVyVGV4dCA9PT0gXCJcXHUxNDJGXCJcbiAgICA/IChlbC5pbm5lclRleHQgPSBcIlxcdTE0MzhcIilcbiAgICA6IChlbC5pbm5lclRleHQgPSBcIlxcdTE0MkZcIik7XG4gIHByb2plY3RzQ29udGFpbmVyLmNsYXNzTGlzdC50b2dnbGUoXCJwcm9qZWN0c09wZW5cIik7XG59XG5vcGVuQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGNvbGxhcGVQcm9qZWN0cywgZmFsc2UpO1xucHJvamVjdHNDb250YWluZXIuY2xhc3NMaXN0LmFkZChcInByb2plY3RzT3BlblwiKTtcblxuLyogSGFtYnVyZ2VyIFN3aXRjaCBUb2dnbGUgRnVuY3Rpb25zICovXG5mdW5jdGlvbiBoYW5kbGVDbGlja0V2ZW50KGV2dCkge1xuICBjb25zdCBlbCA9IGV2dC50YXJnZXQ7XG4gIC8qIGVzbGludCBuby11bnVzZWQtZXhwcmVzc2lvbnM6IFtcImVycm9yXCIsIHsgXCJhbGxvd1Rlcm5hcnlcIjogdHJ1ZSB9XSAqL1xuICBlbC5nZXRBdHRyaWJ1dGUoXCJhcmlhLWNoZWNrZWRcIikgPT09IFwidHJ1ZVwiXG4gICAgPyBlbC5zZXRBdHRyaWJ1dGUoXCJhcmlhLWNoZWNrZWRcIiwgXCJmYWxzZVwiKVxuICAgIDogZWwuc2V0QXR0cmlidXRlKFwiYXJpYS1jaGVja2VkXCIsIFwidHJ1ZVwiKTtcbiAgbXlTaWRlYmFyLmNsYXNzTGlzdC50b2dnbGUoXCJzaWRlYmFyT3BlblwiKTtcbiAgY29udGVudC5jbGFzc0xpc3QudG9nZ2xlKFwiY29udGVudFB1c2hlZFwiKTtcbn1cblxuLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG4vLyBIYW1idXJnZXIgSW4gVG9wIGxlZnRcbmNvbnN0IHNpZGViYXJIYW1idXJnZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuc2lkZWJhckhhbWJ1cmdlci5jbGFzc0xpc3QuYWRkKFwib3BlbkJ0blwiKTtcbnNpZGViYXJIYW1idXJnZXIuaW5uZXJIVE1MID0gXCImIzk3NzZcIjtcbnNpZGViYXJIYW1idXJnZXIuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcbnNpZGViYXJIYW1idXJnZXIuc2V0QXR0cmlidXRlKFwicm9sZVwiLCBcInN3aXRjaFwiKTtcbnNpZGViYXJIYW1idXJnZXIuc2V0QXR0cmlidXRlKFwiYXJpYS1jaGVja2VkXCIsIFwidHJ1ZVwiKTtcbnNpZGViYXJIYW1idXJnZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrRXZlbnQsIGZhbHNlKTtcbi8vIHNpZGViYXJIYW1idXJnZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrRXZlbnQsIGZhbHNlKTtcblxuLyogQXBwZW5kIENoaWxkcmVuICovXG5ib2R5LmFwcGVuZChuYXZCYXIsIG15U2lkZWJhciwgY29udGVudCk7XG5uYXZCYXIuYXBwZW5kQ2hpbGQoc2lkZWJhckhhbWJ1cmdlcik7XG5jb250ZW50LmFwcGVuZENoaWxkKGNvbnRlbnRIb21lKTtcbnNpZGJhckJ1dHRvbkNvbnRhaW5lci5hcHBlbmQoYWRkUHJvamVjdHMsIG9wZW5DbG9zZSk7XG5wcm9qZWN0TGFiZWxDb250YWluZXIuYXBwZW5kKHByb2plY3RMYWJlbCwgc2lkYmFyQnV0dG9uQ29udGFpbmVyKTtcbm15U2lkZWJhci5hcHBlbmQoc2lkZUJhckluYm94LCBwcm9qZWN0TGFiZWxDb250YWluZXIsIHByb2plY3RzQ29udGFpbmVyKTtcbi8qLS0tLS0tLS0tLS0tLS0tKi9cblxucmVxdWlyZShcIi4vcHJvamVjdENvbnRyb2xsZXJcIik7XG5cbi8vIFRoZSBQcm9qZWN0cyBUaGVtc2VsdmVzXG5jb25zdCBwcm9qZWN0SG9tZSA9IGNyZWF0ZVByb2plY3QoXCJIb21lXCIsIFwiI0RDMTQzQ1wiKTtcbmNvbnN0IHByb2plY3RXb3JrID0gY3JlYXRlUHJvamVjdChcIldvcmtcIiwgXCIjMDBGRjAwXCIpO1xuY29uc3QgcHJvamVjdEVkdWNhdGlvbiA9IGNyZWF0ZVByb2plY3QoXCJFZHVjYXRpb25cIiwgXCIjRkZENzAwXCIpO1xuXG5mdW5jdGlvbiBpbml0aWFsaXplU2V0dXAoKSB7XG4gIGxldCB0b2RvID0gY3JlYXRlVG9kbyhcbiAgICBcIlN0dWR5XCIsXG4gICAgXCJOb3dcIixcbiAgICBcIjIwMjMtMDEtMTBcIixcbiAgICBcIlByaW9yaXR5IDFcIixcbiAgICBwcm9qZWN0SG9tZVxuICApO1xuICBwcm9qZWN0SG9tZS5hZGRUb0RvKHRvZG8pO1xuICBldmVudHMuZW1pdChcImFkZFRvZG9cIiwgdG9kbyk7XG4gIHRvZG8gPSBjcmVhdGVUb2RvKFxuICAgIFwiV2Fsa1wiLFxuICAgIFwiR290dGEgRXhlcmNpc2VcIixcbiAgICBcIjIwMjMtMDItMjhcIixcbiAgICBcIlByaW9yaXR5IDJcIixcbiAgICBwcm9qZWN0SG9tZVxuICApO1xuICBwcm9qZWN0SG9tZS5hZGRUb0RvKHRvZG8pO1xuICBldmVudHMuZW1pdChcImFkZFRvZG9cIiwgdG9kbyk7XG4gIHRvZG8gPSBjcmVhdGVUb2RvKFxuICAgIFwiRGlubmVyXCIsXG4gICAgXCJNYWtlIERpbm5lciBGb3IgUGFyZW50c1wiLFxuICAgIFwiMjAyMy0wNC0yMVwiLFxuICAgIFwiUHJpb3JpdHkgM1wiLFxuICAgIHByb2plY3RIb21lXG4gICk7XG4gIHByb2plY3RIb21lLmFkZFRvRG8odG9kbyk7XG4gIGV2ZW50cy5lbWl0KFwiYWRkVG9kb1wiLCB0b2RvKTtcbiAgdG9kbyA9IGNyZWF0ZVRvZG8oXG4gICAgXCJKb2IgSHVudFwiLFxuICAgIFwiU2VuZCBPdXQgQXBwbGljYXRpb25zXCIsXG4gICAgXCIyMDI0LTA0LTE5XCIsXG4gICAgXCJQcmlvcml0eSA0XCIsXG4gICAgcHJvamVjdEhvbWVcbiAgKTtcbiAgcHJvamVjdEhvbWUuYWRkVG9Ebyh0b2RvKTtcbiAgZXZlbnRzLmVtaXQoXCJhZGRUb2RvXCIsIHRvZG8pO1xuXG4gIHRvZG8gPSBjcmVhdGVUb2RvKFxuICAgIFwiUmVwb3J0XCIsXG4gICAgXCJSZXBvcnQgRHVlIE9uIEZyaWRheVwiLFxuICAgIFwiMjAyMy0wMi0yOFwiLFxuICAgIFwiUHJpb3JpdHkgMlwiLFxuICAgIHByb2plY3RXb3JrXG4gICk7XG4gIHByb2plY3RXb3JrLmFkZFRvRG8odG9kbyk7XG4gIGV2ZW50cy5lbWl0KFwiYWRkVG9kb1wiLCB0b2RvKTtcbiAgdG9kbyA9IGNyZWF0ZVRvZG8oXG4gICAgXCJNZWV0aW5nXCIsXG4gICAgXCJBdHRlbmQgTWVldGluZyBGb3IgTmV3IEZlYXR1cmVcIixcbiAgICBcIjIwMjMtMDQtMjFcIixcbiAgICBcIlByaW9yaXR5IDNcIixcbiAgICBwcm9qZWN0V29ya1xuICApO1xuICBwcm9qZWN0V29yay5hZGRUb0RvKHRvZG8pO1xuICBldmVudHMuZW1pdChcImFkZFRvZG9cIiwgdG9kbyk7XG4gIHRvZG8gPSBjcmVhdGVUb2RvKFxuICAgIFwiU3RhcGxlc1wiLFxuICAgIFwiTm8gTW9yZSBTdGFwbGVzIEluIFN0YXBsZXJcIixcbiAgICBcIjIwMjQtMDQtMTlcIixcbiAgICBcIlByaW9yaXR5IDRcIixcbiAgICBwcm9qZWN0V29ya1xuICApO1xuICBwcm9qZWN0V29yay5hZGRUb0RvKHRvZG8pO1xuICBldmVudHMuZW1pdChcImFkZFRvZG9cIiwgdG9kbyk7XG5cbiAgZXZlbnRzLmVtaXQoXCJhZGRQcm9qZWN0XCIsIHByb2plY3RIb21lKTtcbiAgZXZlbnRzLmVtaXQoXCJhZGRQcm9qZWN0XCIsIHByb2plY3RXb3JrKTtcbiAgZXZlbnRzLmVtaXQoXCJhZGRQcm9qZWN0XCIsIHByb2plY3RFZHVjYXRpb24pO1xufVxuLy8gTm90IEZ1bnRpb25hbCBSaWdodCBOb3cgQnV0LFxuLy8gUGxhbm5lZCBUbyBIYXZlIENoZWNrIEZvciBzdG9yYWdlUHJvamVjdExpc3QgSW4gTG9jYWwgU3RvcmFnZVxuZnVuY3Rpb24gc3RvcmFnZUF2YWlsYWJsZSh0eXBlKSB7XG4gIGxldCBzdG9yYWdlO1xuICB0cnkge1xuICAgIHN0b3JhZ2UgPSB3aW5kb3dbdHlwZV07XG4gICAgY29uc3QgeCA9IFwiX19zdG9yYWdlX3Rlc3RfX1wiO1xuICAgIHN0b3JhZ2Uuc2V0SXRlbSh4LCB4KTtcbiAgICBzdG9yYWdlLnJlbW92ZUl0ZW0oeCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gKFxuICAgICAgZSBpbnN0YW5jZW9mIERPTUV4Y2VwdGlvbiAmJlxuICAgICAgLy8gZXZlcnl0aGluZyBleGNlcHQgRmlyZWZveFxuICAgICAgKGUuY29kZSA9PT0gMjIgfHxcbiAgICAgICAgLy8gRmlyZWZveFxuICAgICAgICBlLmNvZGUgPT09IDEwMTQgfHxcbiAgICAgICAgLy8gdGVzdCBuYW1lIGZpZWxkIHRvbywgYmVjYXVzZSBjb2RlIG1pZ2h0IG5vdCBiZSBwcmVzZW50XG4gICAgICAgIC8vIGV2ZXJ5dGhpbmcgZXhjZXB0IEZpcmVmb3hcbiAgICAgICAgZS5uYW1lID09PSBcIlF1b3RhRXhjZWVkZWRFcnJvclwiIHx8XG4gICAgICAgIC8vIEZpcmVmb3hcbiAgICAgICAgZS5uYW1lID09PSBcIk5TX0VSUk9SX0RPTV9RVU9UQV9SRUFDSEVEXCIpICYmXG4gICAgICAvLyBhY2tub3dsZWRnZSBRdW90YUV4Y2VlZGVkRXJyb3Igb25seSBpZiB0aGVyZSdzIHNvbWV0aGluZyBhbHJlYWR5IHN0b3JlZFxuICAgICAgc3RvcmFnZSAmJlxuICAgICAgc3RvcmFnZS5sZW5ndGggIT09IDBcbiAgICApO1xuICB9XG59XG5pZiAoc3RvcmFnZUF2YWlsYWJsZShcImxvY2FsU3RvcmFnZVwiKSkge1xuICBpZiAoIWxvY2FsU3RvcmFnZS5nZXRJdGVtKFwic3RvcmFnZVByb2plY3RMaXN0XCIpKSB7XG4gICAgaW5pdGlhbGl6ZVNldHVwKCk7XG4gIH0gZWxzZSB7XG4gICAgLy8gR3JhYiBPYmplY3QgRnJvbSBMb2NhbCBTdG9yYWdlXG4gICAgY29uc3QgcHJvamVjdE9iamVjdCA9IEpTT04ucGFyc2UoXG4gICAgICBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInN0b3JhZ2VQcm9qZWN0TGlzdFwiKVxuICAgICk7XG4gICAgLy8gR2V0IFRoZSBQcm9qZWN0c1xuICAgIGNvbnN0IHByb2plY3RMaXN0ID0gT2JqZWN0LmtleXMocHJvamVjdE9iamVjdCk7XG5cbiAgICAvLyBGb3IgRWFjaCBQcm9qZWN0IEluIFN0b3JhZ2VcbiAgICBwcm9qZWN0TGlzdC5mb3JFYWNoKChwcm9qZWN0U3RyaW5nKSA9PiB7XG4gICAgICAvLyBQcm9wZXJ0eSBOYW1lIE9uIFRoZSBPYmplY3QgU3RvcmVkIElzXG4gICAgICAvLyBTcGxpdCBJbnRvIFByb2plY3QgTmFtZSBBbmQgQ29sb3JcbiAgICAgIC8vIEV4OiBIb21lI0RDMTQzQ1xuICAgICAgY29uc3QgaGFzaHRhZ1Bvc2l0aW9uID0gcHJvamVjdFN0cmluZy5sYXN0SW5kZXhPZihcIiNcIik7IC8vIEluY2FzZSBIYXNodGFnIElzIEluIFByb2plY3RzIE5hbWUgT2YgVXNlclxuICAgICAgY29uc3QgY29sb3IgPSBwcm9qZWN0U3RyaW5nLnN1YnN0cmluZyhoYXNodGFnUG9zaXRpb24pO1xuICAgICAgY29uc3QgcHJvamVjdE5hbWUgPSBwcm9qZWN0U3RyaW5nLnN1YnN0cmluZygwLCBoYXNodGFnUG9zaXRpb24pO1xuICAgICAgLy8gUHJvamVjdCBSZXZlcnNlIEVuZ2luZWVyZWQgRnJvbSBsb2NhbFN0b3JhZ2VcbiAgICAgIGNvbnN0IHByb2plY3RHZW5lcmF0ZWQgPSBjcmVhdGVQcm9qZWN0KHByb2plY3ROYW1lLCBjb2xvcik7XG5cbiAgICAgIC8vIFRoZSBPYmplY3QgT2YgVG9kb3NcbiAgICAgIGNvbnN0IHRvZG9PYmplY3QgPSBwcm9qZWN0T2JqZWN0W3Byb2plY3RTdHJpbmddO1xuICAgICAgLy8gRWFjaCBUb2RvIE9uIFRoZSBPYmplY3RcbiAgICAgIGNvbnN0IHRvZG9MaXN0ID0gT2JqZWN0LmtleXMocHJvamVjdE9iamVjdFtwcm9qZWN0U3RyaW5nXSk7XG5cbiAgICAgIHRvZG9MaXN0LmZvckVhY2goKHRvZG9TdHJpbmcpID0+IHtcbiAgICAgICAgLy8gQXJyYXkgT2YgSW5mcm9tYXRpb24gQWJvdXQgVGhlIFRvZG9cbiAgICAgICAgY29uc3QgdG9kb0luZm8gPSBPYmplY3QudmFsdWVzKHRvZG9PYmplY3RbdG9kb1N0cmluZ10pO1xuXG4gICAgICAgIC8vIFNldCBJbmZvcm1hdGlvbiBVc2luZyBXaGF0cyBJbiBUaGUgQXJyYXlcbiAgICAgICAgLy8gQWx3YXlzIFNhbWUgT3JkZXJcbiAgICAgICAgY29uc3QgdGFza05hbWUgPSB0b2RvU3RyaW5nO1xuICAgICAgICBjb25zdCBjb25uZWN0ZWRQcm9qZWN0ID0gcHJvamVjdEdlbmVyYXRlZDtcbiAgICAgICAgY29uc3QgZHVlRGF0ZSA9IHRvZG9JbmZvWzFdO1xuICAgICAgICBjb25zdCBwcmlvcml0eSA9IHRvZG9JbmZvWzJdO1xuICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IHRvZG9JbmZvWzNdO1xuICAgICAgICBjb25zdCBjb21wbGV0ZWQgPSB0b2RvSW5mb1s0XTtcbiAgICAgICAgLy8gTWFrZSBUaGUgVG9kb1xuICAgICAgICBjb25zdCB0b2RvR2VuZXJhdGVkID0gY3JlYXRlVG9kbyhcbiAgICAgICAgICB0YXNrTmFtZSxcbiAgICAgICAgICBkZXNjcmlwdGlvbixcbiAgICAgICAgICBkdWVEYXRlLFxuICAgICAgICAgIHByaW9yaXR5LFxuICAgICAgICAgIGNvbm5lY3RlZFByb2plY3RcbiAgICAgICAgKTtcbiAgICAgICAgLy8gT24gQ3JlYXRpb24gVGhlIENvbXBsZXRpb24gT2YgQSBUb2RvIElzIFNldCBUbyBGYWxzZVxuICAgICAgICAvLyBTbyBJZiBUaGUgVG9kbyBXYXMgRG9uZSBUb2dnbGUgSXQgVG8gQ29tcGxldGVcbiAgICAgICAgaWYgKGNvbXBsZXRlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHRvZG9HZW5lcmF0ZWQudG9nZ2xlQ29tcGxldGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgIGAke3RvZG9HZW5lcmF0ZWQuZ2V0VGFzaygpfSB8ICR7dG9kb0dlbmVyYXRlZC5nZXREZXNjcmlwdGlvbigpfSB8ICR7dG9kb0dlbmVyYXRlZC5nZXREdWVEYXRlKCl9IHwgJHt0b2RvR2VuZXJhdGVkLmdldFByaW9yaXR5KCl9ICB8ICR7dG9kb0dlbmVyYXRlZC5nZXRQcm9qZWN0KCl9YFxuICAgICAgICApO1xuICAgICAgICAvLyBBZGQgVG9kbyBUbyBDb3JyZWN0IFByb2plY3RcbiAgICAgICAgcHJvamVjdEdlbmVyYXRlZC5hZGRUb0RvKHRvZG9HZW5lcmF0ZWQpO1xuICAgICAgICBldmVudHMuZW1pdChcImFkZFRvZG9cIiwgdG9kb0dlbmVyYXRlZCk7XG4gICAgICB9KTtcblxuICAgICAgY29uc29sZS5sb2coKTtcbiAgICAgIGNvbnNvbGUubG9nKHByb2plY3RHZW5lcmF0ZWQuZ2V0VG9EbygpKTtcbiAgICAgIGV2ZW50cy5lbWl0KFwiYWRkUHJvamVjdFwiLCBwcm9qZWN0R2VuZXJhdGVkKTtcbiAgICB9KTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbIm1ha2VUb2RvIiwib3BlbkluYm94IiwidG9kb0xpc3QiLCJjb250ZW50IiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwicmVwbGFjZUNoaWxkcmVuIiwiaW5ib3giLCJjcmVhdGVFbGVtZW50IiwiaW5ib3hMYWJlbCIsImlkIiwiaW5uZXJUZXh0IiwiYXBwZW5kQ2hpbGQiLCJmb3JFYWNoIiwidG9EbyIsInByb2plY3QiLCJnZXRQcm9qZWN0IiwidG9kbyIsImV2ZW50cyIsImRpc3BsYXlQcm9qZWN0SW5wdXRGaWVsZCIsInByb2plY3RNb2R1bGUiLCJib2R5IiwiZ2V0RWxlbWVudEJ5SWQiLCJjb250ZW50SG9tZSIsInByb2plY3RMYWJlbCIsInByb2plY3RzQ29udGFpbmVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImVtaXQiLCJwcm9qZWN0Q29udHJvbGxlciIsInByb2plY3RMaXN0IiwiYWRkT3BlcmF0aW9uIiwiYWRkTG9jYXRpb24iLCJyZU9yZGVyUHJvamVjdHMiLCJzcGxpY2UiLCJwb3AiLCJuZXdQcm9qZWN0IiwiY2xvbmUiLCJyZW5kZXJTaWRlQmFyIiwicHJqY3QiLCJyZW5kZXIiLCJhZGRQcm9qZWN0VG9TaWRlQmFyIiwiZWxlbSIsImNvbG9yQ2lyY2xlIiwidG9kb0NvdW50IiwibmFtZSIsInN0eWxlIiwiYmFja2dyb3VuZENvbG9yIiwiZ2V0Q29sb3IiLCJnZXROYW1lIiwidGl0bGUiLCJjbGFzc0xpc3QiLCJhZGQiLCJnZXRUb0RvIiwiY29tcGxldGVDdHIiLCJnZXRTdGF0dXMiLCJyZW1vdmVQcm9qZWN0T3B0aW9ucyIsInByb2plY3RPcHRpb25zIiwidG9vbHMiLCJuZXdFbGVtZW50IiwiY2xvbmVOb2RlIiwicmVwbGFjZUNoaWxkIiwicmVtb3ZlQ2hpbGQiLCJyZW1vdmUiLCJvcHRpb25FdmVudExpc3RlbmVycyIsIm9wZXJhdGlvbiIsImVsZW1lbnQiLCJwYXJlbnRFbGVtZW50IiwiaW5kZXgiLCJBcnJheSIsImZyb20iLCJjaGlsZHJlbiIsImluZGV4T2YiLCJwcm9qZWN0T3B0aW9uc0JHIiwiYWRkUHJvamVjdE9wdGlvbnMiLCJvcHRpb25zQ29udGFpbmVyIiwiYWRkQWJvdmUiLCJhZGRCZWxvdyIsImVkaXQiLCJhcHBlbmQiLCJjcmVhdGVPcHRpb25zQm94IiwicGFnZVByb2plY3RDb250YWluZXIiLCJldmVudCIsIndpdGhpbkJvdW5kYXJpZXMiLCJjb21wb3NlZFBhdGgiLCJpbmNsdWRlcyIsImFkZFByb2plY3RUb1BhZ2UiLCJlbGxpcHNlIiwidXBkYXRlUHJvamVjdExpc3QiLCJwdXNoIiwidXBkYXRlUHJvamVjdFRvZG9Db3VudCIsImxpc3RQb3NpdGlvbiIsImNvbnRhaW5lciIsInByb2plY3RFbGVtZW50IiwiZmlyc3RDaGlsZCIsInVwZGF0ZUxvY2FsU3RvcmFnZSIsInN0b3JhZ2VQcm9qZWN0TGlzdCIsInByb2plY3ROYW1lIiwicHJvamVjdE5hbWVBbmRDb2xvciIsInRvZG9PYmplY3QiLCJpbmZvIiwiY29ubmVjdGVkUHJvamVjdCIsImR1ZURhdGUiLCJnZXREdWVEYXRlIiwicHJpb3JpdHkiLCJnZXRQcmlvcml0eSIsImRlc2NyaXB0aW9uIiwiZ2V0RGVzY3JpcHRpb24iLCJzdGF0dXMiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0aWVzIiwiUHJvamVjdCIsInZhbHVlIiwiZW51bWVyYWJsZSIsIndyaXRhYmxlIiwiRHVlRGF0ZSIsIlByaW9yaXR5IiwiRGVzY3JpcHRpb24iLCJTdGF0dXMiLCJ0YXNrTmFtZSIsImdldFRhc2siLCJkZWZpbmVQcm9wZXJ0eSIsImNvbmZpZ3VyYWJsZSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJKU09OIiwic3RyaW5naWZ5IiwiY2xlYXJPcGVyYXRpb25zIiwib24iLCJjcmVhdGVQcm9qZWN0IiwicmVtb3ZlUHJvamVjdElucHV0RmllbGQiLCJwcm9qZWN0VXNlcklucHV0IiwicHJvamVjdEZvcm1TdWJtaXNzaW9uIiwiZm9ybSIsImVsZW1lbnRzIiwibmFtZUlucHV0IiwiY29sb3IiLCJjb2xvcnNTZWxlY3QiLCJpbnB1dENvbnRhaW5lciIsImFkZFByb2plY3RMYWJlbCIsIm5hbWVJbnB1dExhYmVsIiwibmFtZUlucHV0U3BhbiIsInByb2plY3RGb3JtIiwiYnV0dG9uQ29udGFpbmVyIiwiY2FuY2VsIiwic2F2ZSIsImRpc2FibGVkIiwic2V0QXR0cmlidXRlIiwidG9nZ2xlQXR0cmlidXRlIiwicHJldmVudERlZmF1bHQiLCJ2YWxpZGl0eSIsInZhbGlkIiwiY29sb3JzIiwiQ3JpbXNvbiIsIkNvcmFsIiwiR29sZCIsIkxpbWUiLCJBcXVhIiwiUm95YWxCbHVlIiwiVmlvbGV0IiwiU2llbmEiLCJMYXZlbmRlciIsIkhvbmV5RGV3IiwiU2lsdmVyIiwib3B0aW9uIiwidmFsIiwidmFsdWVzIiwia2V5Iiwia2V5cyIsInNlbGVjdGVkIiwiaXNQcm9qZWN0IiwiaGFzT3duIiwib3B0aW9ucyIsImNoaWxkTm9kZXMiLCJlbCIsImZvcm1hdCIsImRpc3BsYXlUYXNrSW5wdXRGaWVsZCIsInJlbW92ZURldGFpbHMiLCJ0YXNrQmFja2dyb3VuZCIsImRpc3BsYXlEZXRhaWxzIiwidGFza0luZm8iLCJjbG9zZUljb24iLCJmb3JQcm9qZWN0IiwiZHVlRGF0ZUVsIiwidGFza0Rlc2NyaXB0aW9uIiwieWVhciIsInN1YnN0cmluZyIsImRheSIsImxhc3RJbmRleE9mIiwibW9udGgiLCJwYXJzZUludCIsIkRhdGUiLCJwcmlvcml0eUNvbG9yIiwidG9kb0NoZWNrYm94IiwiZGV0YWlsc0J0biIsInRyYXNoQ2FuIiwiZWRpdEljb24iLCJ0b2dnbGVDb21wbGV0ZSIsInRvZ2dsZSIsInJlbW92ZVRvRG8iLCJzZWxlY3RlZFByb2plY3QiLCJhZGRUb2RvQnRuIiwicHJpb3JpdHlPbmUiLCJwcmlvcml0eVR3byIsInByaW9yaXR5VGhyZWUiLCJwcmlvcml0eUZvdXIiLCJldmVudE5hbWUiLCJmbiIsIm9mZiIsImkiLCJsZW5ndGgiLCJkYXRhIiwibW9kdWxlIiwiZXhwb3J0cyIsImNyZWF0ZVRvZG8iLCJyZXF1aXJlIiwicmVtb3ZlVGFza0lucHV0RmllbGQiLCJ0YXNrRm9ybVN1Ym1pc3Npb24iLCJ0YXNrRm9ybSIsInNlbGVjdFByaW9yaXR5IiwibmV3VG9kbyIsInVuZGVmaW5lZCIsImFkZFRvRG8iLCJ0YXNrVXNlcklucHV0IiwiZHVlRGF0ZUJ0biIsInRhc2tPcHRpb25zQ29udGFpbmVyIiwiY2FuY2VsQnRuIiwic2F2ZUJ0biIsImNoZWNrVmFsaWRhdGlvbiIsInByaW9yaXRpZXMiLCJQcmlvcml0eUxhYmVsIiwidG9ETyIsInNvcnQiLCJsYXN0IiwibmV4dCIsImxvY2F0aW9uIiwicHJvamVjdE9uZSIsInByb2plY3RUd28iLCJzZXRQcm9qZWN0IiwidGFzayIsInR5cGUiLCJjb21wbGV0ZSIsInRvZG9Db250cm9sbGVyIiwidXBkYXRlVG9kbyIsInVwZGF0ZVRvZG9MaXN0IiwiZ2V0VG9kb0xpc3QiLCJjb25zb2xlIiwibG9nIiwidG9kb0luYm94IiwidXBkYXRlVG9kb0NvdW50Iiwic2lkZUJhckluYm94IiwibGFzdENoaWxkIiwibmF2QmFyIiwibXlTaWRlYmFyIiwicHJvamVjdExhYmVsQ29udGFpbmVyIiwic2lkYmFyQnV0dG9uQ29udGFpbmVyIiwib3BlbkNsb3NlIiwiYWRkUHJvamVjdHMiLCJob21lQWRkUHJvamVjdEJ0biIsImNvbGxhcGVQcm9qZWN0cyIsImV2dCIsInRhcmdldCIsImhhbmRsZUNsaWNrRXZlbnQiLCJnZXRBdHRyaWJ1dGUiLCJzaWRlYmFySGFtYnVyZ2VyIiwiaW5uZXJIVE1MIiwicHJvamVjdEhvbWUiLCJwcm9qZWN0V29yayIsInByb2plY3RFZHVjYXRpb24iLCJpbml0aWFsaXplU2V0dXAiLCJzdG9yYWdlQXZhaWxhYmxlIiwic3RvcmFnZSIsIndpbmRvdyIsIngiLCJyZW1vdmVJdGVtIiwiZSIsIkRPTUV4Y2VwdGlvbiIsImNvZGUiLCJnZXRJdGVtIiwicHJvamVjdE9iamVjdCIsInBhcnNlIiwicHJvamVjdFN0cmluZyIsImhhc2h0YWdQb3NpdGlvbiIsInByb2plY3RHZW5lcmF0ZWQiLCJ0b2RvU3RyaW5nIiwidG9kb0luZm8iLCJjb21wbGV0ZWQiLCJ0b2RvR2VuZXJhdGVkIl0sInNvdXJjZVJvb3QiOiIifQ==