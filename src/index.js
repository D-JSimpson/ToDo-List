/*
    <div id="mySidebar" class="sidebar">
      <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
      <a href="#">About</a>
      <a href="#">Services</a>
      <a href="#">Clients</a>
      <a href="#">Contact</a>
    </div>
    
    <div id="main">
      <button class="openbtn" onclick="openNav()">&#9776; Open Sidebar</button>
      <h2>Collapsed Sidebar</h2>
      <p>Content...</p>
    </div>

<button
  type="button"
  role="switch"
  aria-checked="true"
  id="speakerPower"
  class="switch">
  <span aria-hidden="true">off</span>
  <span aria-hidden="true">on</span>
</button>
*/
import './style.css';

const body = document.querySelector("body"); 
const mySidebar = document.createElement('div'); 
    mySidebar.classList.add("sidebar")
const hamburgerContainer = document.createElement('div'); body.append(mySidebar, hamburgerContainer);
const sidebarHamburger = document.createElement('button'); hamburgerContainer.appendChild(sidebarHamburger);
    sidebarHamburger.classList.add('openBtn');
    sidebarHamburger.innerHTML = "\&#9776";
    sidebarHamburger.setAttribute("type", "button"); sidebarHamburger.setAttribute("role", "switch"); sidebarHamburger.setAttribute("aria-checked", "true"); 
    sidebarHamburger.addEventListener("click", handleClickEvent, false);
    sidebarHamburger.addEventListener("click", handleClickEvent, false);

/*Hamburger Switch Toggle Functions*/
function handleClickEvent(evt)
{
    const el = evt.target;
    el.getAttribute("aria-checked") === "true" ? addSidebar(el) : removeSideBar(el);
}
function addSidebar(el)
{
    el.setAttribute("aria-checked", "false")
    mySidebar.style.width = "250px";
    hamburgerContainer.style.marginLeft = "250px";
}
function removeSideBar(el)
{
    el.setAttribute("aria-checked", "true");
    mySidebar.style.width = "0";
    hamburgerContainer.style.marginLeft = "0";
}
/*--------------------------------------------*/