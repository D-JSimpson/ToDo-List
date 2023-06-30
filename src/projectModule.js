import "./projectModule.scss";
import "./projectModule.css";
import displayTaskInputField from "./taskForm";

function makeTodo(toDo) {
  // The ToDos For The Project
  const todo = document.createElement("section");
  const priorityColor = document.createElement("span");
  const todoCheckbox = document.createElement("input");
  const taskName = document.createElement("label");
  const detailsBtn = document.createElement("button");
  const trashCan = document.createElement("span");
  const editIcon = document.createElement("span");

  // Classes and Innertext
  todo.classList.add("todo");
  priorityColor.classList.add("priorityColor");
  todoCheckbox.classList.add("todoCheckbox");
  taskName.classList.add("taskName");
  detailsBtn.classList.add("detailsBtn");
  trashCan.classList.add("trashCan");
  editIcon.classList.add("editIcon");
  taskName.innerText = toDo.getTask();
  detailsBtn.innerText = "DETAILS";

  // Funtionality
  todoCheckbox.setAttribute("type", "checkbox");
  todoCheckbox.setAttribute("name", "checkbox");
  taskName.setAttribute("for", "checkbox");

  todoCheckbox.addEventListener("click", () => {
    taskName.classList.toggle("strikeThrough");
    detailsBtn.classList.toggle("detailsBtnChecked");
    trashCan.classList.toggle("trashCanChecked");
    editIcon.classList.toggle("editIconChecked");
  });

  // Append
  todo.append(
    priorityColor,
    todoCheckbox,
    taskName,
    detailsBtn,
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
        priorityOne.appendChild(makeTodo(todo));
        break;
      case "2":
        priorityTwo.appendChild(makeTodo(todo));
        break;
      case "3":
        priorityThree.appendChild(makeTodo(todo));
        break;
      case "4":
        priorityFour.appendChild(makeTodo(todo));
        break;
      default:
        break;
    }
  });
}
