import projectModule from "./projectModule";
import { events } from "./pubsub";
import openInbox from "./openInbox";

const todoController = (() => {
  const todoList = [];
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
    todoList.sort((last, next) => {
      if (last.getDueDate() > next.getDueDate()) {
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
  events.on("updateTodo", updateTodo);
  events.on("addTodo", updateTodoList);
  events.on("openInbox", todoInbox);
  events.on("removeToDo", removeToDo);

  return { getTodoList };
})();

todoController.getTodoList();
