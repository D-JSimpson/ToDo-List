import { format } from "date-fns";
import "./projectModule.scss";
import "./projectModule.css";
import displayTaskInputField from "./taskForm";
import { events } from "./pubsub";

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
  const month =
    parseInt(
      dueDate.substring(dueDate.indexOf("-") + 1, dueDate.lastIndexOf("-")),
      10
    ) - 1; // Subtract 1 for dates-fns format
  dueDate = format(new Date(year, month, day), "MMM d yyyy");

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
  taskBackground.addEventListener("click", (event) => {
    const withinBoundaries = event.composedPath().includes(taskInfo);
    if (!withinBoundaries) removeDetails(taskBackground);
  });

  // Close Details If Icon Clicked
  closeIcon.addEventListener("click", () => {
    body.removeChild(taskBackground);
  });

  taskInfo.append(
    closeIcon,
    taskName,
    forProject,
    dueDateEl,
    priority,
    taskDescription
  );
  taskBackground.appendChild(taskInfo);
  body.appendChild(taskBackground);
}
// Export So openInbox Can Use As Well
export function makeTodo(project, toDo) {
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
  const month =
    parseInt(
      dueDate.substring(dueDate.indexOf("-") + 1, dueDate.lastIndexOf("-")),
      10
    ) - 1; // Subtract 1 for dates-fns format
  dueDateEl.innerText = format(new Date(year, month, day), "MMM d");

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
    events.emit("updateTodoCount");
    events.emit("updateProjectTodoCount", project);
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
    displayTaskInputField(project, toDo);
  });

  // Delete The Todo From The Project
  // Then Update Page
  trashCan.addEventListener("click", () => {
    project.removeToDo(toDo);
    events.emit("removeToDo", toDo);
    events.emit("updateTodo", project);
    events.emit("updateTodoCount");
    events.emit("updateProjectTodoCount", project);
  });

  // Append
  todo.append(
    priorityColor,
    todoCheckbox,
    taskName,
    detailsBtn,
    dueDateEl,
    editIcon,
    trashCan
  );

  return todo;
}

export default function projectModule(project) {
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
    displayTaskInputField(project);
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
  content.append(
    selectedProject,
    priorityOne,
    priorityTwo,
    priorityThree,
    priorityFour
  );

  const todoList = project.getToDo();

  todoList.forEach((todo) => {
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
