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
  events.on("addTodoToProject", updateTodo);
  events.on("addTodo", updateTodoList);
})();
