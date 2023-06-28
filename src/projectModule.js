import "./projectModule.css";
import displayTaskInputField from "./taskForm";

export default function projectModule(project) {
  // Make Space For New Project Todos
  const content = document.querySelector("#content");
  content.replaceChildren();
  // Display The Project That Was Clicked/Created
  const selectedProject = document.createElement("div");
  const addTodoBtn = document.createElement("button");

  selectedProject.id = "selectedProject";
  selectedProject.innerText = project.getName();
  addTodoBtn.innerText = "\u2795 Add Task";
  addTodoBtn.id = "addTodoBtn";
  // Functionality
  addTodoBtn.addEventListener("click", displayTaskInputField, false);

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
}
