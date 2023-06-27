import "./openInbox.css";

export default function openInbox() {
  // Make Space For New Project Todos
  const content = document.querySelector("#content");
  content.replaceChildren();

  const inbox = document.createElement("div");
  inbox.id = "inbox";
  inbox.innerText = "Inbox";

  content.appendChild(inbox);
}
