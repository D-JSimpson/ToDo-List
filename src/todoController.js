import projectModule from "./projectModule";
import { events } from "./pubsub";
import openInbox from "./openInbox";

const todoController = (() => {
  const todoList = [];
  // Used To Render Todo After Deletion Or Checked
  const updateTodo = (project) => {
    const selectedProject = document.querySelector("#selectedProject");
    // selectedProject will be null when a project is
    // Deleted from the todo inbox but,
    // Not When a Project Is Selected
    if (selectedProject !== null) {
      projectModule(project);
    } else {
      openInbox(todoList);
    }
  };
  const updateTodoList = (todo) => {
    // Only Add If has tpye set to Todo
    const { type } = todo;
    if (type === "Todo") todoList.push(todo);
    // Sort The Todos By DueDate
    todoList.sort((last, next) => {
      if (last.getDueDate() >= next.getDueDate()) {
        return 1;
      }
      return -1;
    });
  };
  const getTodoList = () => {
    console.log(todoList);
  };

  const todoInbox = () => {
    openInbox(todoList);
  };
  const removeToDo = (todo) => {
    const location = todoList.indexOf(todo);
    todoList.splice(location, 1);
  };
  const updateTodoCount = () => {
    // Update Todo Count
    const sideBarInbox = document.querySelector("#sideBarInbox");
    const colorCircle = sideBarInbox.lastChild;
    let completeCtr = 0;
    todoList.forEach((toDo) => {
      if (toDo.getStatus() !== true) {
        completeCtr += 1;
      }
    });
    colorCircle.innerText = completeCtr;
  };
  events.on("updateTodo", updateTodo);
  events.on("addTodo", updateTodoList);
  events.on("openInbox", todoInbox);
  events.on("removeToDo", removeToDo);
  events.on("updateTodoCount", updateTodoCount);
  events.on("addTodo", updateTodoCount);

  return { getTodoList };
})();

todoController.getTodoList();
