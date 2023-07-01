import projectModule from "./projectModule";
import { events } from "./pubsub";
import openInbox from "./openInbox";

const todoController = (() => {
  const todoList = [];
  const updateTodo = (project) => {
    projectModule(project);
  };
  const updateTodoList = (todo) => {
    // Only Add If has tpye set to Todo
    const { type } = todo;
    if (type === "Todo") todoList.push(todo);
  };
  const getTodoList = () => {
    console.log(todoList);
  };

  const todoInbox = () => {
    openInbox(todoList);
  };
  events.on("updateTodo", updateTodo);
  events.on("addTodo", updateTodoList);
  events.on("openInbox", todoInbox);

  return { getTodoList };
})();

todoController.getTodoList();
