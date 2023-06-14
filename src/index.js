/*
    <div id="mySidebar" class="sidebar">
      <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
      <a href="#">About</a>
*/
import './style.css';

const body = document.querySelector("body");

//Bars
const navBar = document.createElement("div");
    navBar.id = "navBar";
const mySidebar = document.createElement('div'); 
    mySidebar.classList.add("sidebar")

//Dummy content for site
const content = document.createElement('div');
    content.id = "content";
let h2 = document.createElement('h2');
    h2.innerText = "Collapsed Sidebar"
let p = document.createElement('p');
    p.innerText = "Content..."

//Hamburger In Top Right
const hamburgerContainer = document.createElement('div'); body.append(mySidebar, hamburgerContainer); navBar.appendChild(hamburgerContainer);
const sidebarHamburger = document.createElement('button'); 
    sidebarHamburger.classList.add('openBtn');
    sidebarHamburger.innerHTML = "\&#9776";
    sidebarHamburger.setAttribute("type", "button"); sidebarHamburger.setAttribute("role", "switch"); sidebarHamburger.setAttribute("aria-checked", "true"); 
    sidebarHamburger.addEventListener("click", handleClickEvent, false);
    sidebarHamburger.addEventListener("click", handleClickEvent, false);

/*Append Children*/
body.append(navBar, mySidebar, content);
navBar.appendChild(hamburgerContainer)
content.append(h2, p);
hamburgerContainer.appendChild(sidebarHamburger);
/*---------------*/

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
    content.style.marginLeft = "250px";
}
function removeSideBar(el)
{
    el.setAttribute("aria-checked", "true");
    mySidebar.style.width = "0";
    content.style.marginLeft = "0px";
}
/*--------------------------------------------*/