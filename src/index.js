/*
    <div id="mySidebar" class="sidebar">
      <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
      <a href="#">About</a>
*/
import "./style.css";

const body = document.querySelector("body");

// Bars
const navBar = document.createElement("div");
navBar.id = "navBar";
const mySidebar = document.createElement("div");
mySidebar.classList.add("sidebar");

// Projects For the SideBar
const projectLabelContainer = document.createElement("div");
projectLabelContainer.id = "projectLabelContainer";
const projectLabel = document.createElement("span");
projectLabel.innerText = "Projects";
const openClose = document.createElement("span");
openClose.innerText = "\\x2796"; //   \02795

const projectsContainer = document.createElement("div");
const projectHome = document.createElement("a");
projectHome.innerText = "Home";
const projectWork = document.createElement("a");
projectWork.innerText = "Work";
const projectEducation = document.createElement("a");
projectEducation.innerText = "Educaition";
// Dummy content for site
const content = document.createElement("div");
content.id = "content";
const h2 = document.createElement("h2");
h2.innerText = "Collapsed Sidebar";
const p = document.createElement("p");
p.innerText = "Content...";

/* Hamburger Switch Toggle Functions */
function addSidebar(el) {
  el.setAttribute("aria-checked", "false");
  mySidebar.style.width = "250px";
  content.style.marginLeft = "250px";
}
// Change To Classes Instead of Inline CSS Also solves being there on open
function removeSideBar(el) {
  el.setAttribute("aria-checked", "true");
  mySidebar.style.width = "0";
  content.style.marginLeft = "0px";
}
function handleClickEvent(evt) {
  const el = evt.target;
  el.getAttribute("aria-checked") === "true"
    ? addSidebar(el)
    : removeSideBar(el);
}

/*--------------------------------------------*/
// Hamburger In Top Right
const hamburgerContainer = document.createElement("div");
body.append(mySidebar, hamburgerContainer);
navBar.appendChild(hamburgerContainer);
const sidebarHamburger = document.createElement("button");
sidebarHamburger.classList.add("openBtn");
sidebarHamburger.innerHTML = "&#9776";
sidebarHamburger.setAttribute("type", "button");
sidebarHamburger.setAttribute("role", "switch");
sidebarHamburger.setAttribute("aria-checked", "true");
sidebarHamburger.addEventListener("click", handleClickEvent, false);
sidebarHamburger.addEventListener("click", handleClickEvent, false);

/* Append Children */
body.append(navBar, mySidebar, content);
navBar.appendChild(hamburgerContainer);
content.append(h2, p);
projectsContainer.append(projectHome, projectWork, projectEducation);
projectLabelContainer.append(projectLabel, openClose);
mySidebar.append(projectLabelContainer, projectsContainer);
hamburgerContainer.appendChild(sidebarHamburger);
/*---------------*/
