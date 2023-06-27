import "./openInbox.css";

export default function openInbox() {
  // Make Space For Todos
  const content = document.querySelector("#content");
  content.replaceChildren();
  // The Label For The Page
  const inbox = document.createElement("div");
  inbox.id = "inbox";
  inbox.innerText = "Inbox";
  // Append To Show On Page
  content.appendChild(inbox);
}
