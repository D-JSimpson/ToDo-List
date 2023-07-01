import "./openInbox.css";
import { makeTodo } from "./projectModule";

export default function openInbox(todoList) {
  // Make Space For Todos
  const content = document.querySelector("#content");
  content.replaceChildren();
  // The Label For The Page
  const inbox = document.createElement("div");
  inbox.id = "inbox";
  inbox.innerText = "Inbox";

  todoList.forEach((toDo) => {
    // Get The Project And Create Element
    // Use Function Already Made Before
    const project = toDo.getProject();
    const todo = makeTodo(project, toDo);
    inbox.appendChild(todo);
  });
  // Append To Show On Page
  content.appendChild(inbox);
}
