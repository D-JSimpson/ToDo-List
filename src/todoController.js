import projectModule from "./projectModule";
import { events } from "./pubsub";
import { createTodo } from "./todo";

const todoController = (() => {
  const todoList = [];
  const updateTodo = (project) => {
    projectModule(project);
  };
  const updateTodoList = (todo) => {
    if (todo instanceof createTodo) todoList.push(todo);
  };
  const getTodoList = () => {
    console.log(todoList);
  };
  events.on("updateTodo", updateTodo);
  events.on("addTodo", updateTodoList);

  return { getTodoList };
})();

todoController.getTodoList();
