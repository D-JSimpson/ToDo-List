import "./openInbox.css";
import { makeTodo } from "./projectModule";

export default function openInbox(todoList) {
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
