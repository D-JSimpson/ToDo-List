import "./projectModule.css";

export default function projectModule() {
  // Make Space For New Project Todos
  const content = document.querySelector("#content");
  content.replaceChildren();

  // Create The Different Priority Levels
  const priorityOne = document.createElement("div");
  const priorityTwo = document.createElement("div");
  const priorityThree = document.createElement("div");
  const priorityFour = document.createElement("div");

  priorityOne.classList.add("priorityOne");
  priorityTwo.classList.add("priorityTwo");
  priorityThree.classList.add("priorityThree");
  priorityFour.classList.add("priorityFour");

  priorityOne.innerText = "Priority 1";
  priorityTwo.innerText = "Priority 2";
  priorityThree.innerText = "Priority 3";
  priorityFour.innerText = "Priority 4";

  content.append(priorityOne, priorityTwo, priorityThree, priorityFour);
}
