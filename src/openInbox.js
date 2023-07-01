import "./openInbox.css";

export default function openInbox(todoList) {
  // Make Space For Todos
  const content = document.querySelector("#content");
  content.replaceChildren();
  // The Label For The Page
  const inbox = document.createElement("div");
  inbox.id = "inbox";
  inbox.innerText = "Inbox";

  todoList.forEach((toDo) => {
    const project = toDo.getProject();
    const name = project.getName();
  });
  // Append To Show On Page
  content.appendChild(inbox);
}
