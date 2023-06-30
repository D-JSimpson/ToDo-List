export function createProject(name, color) {
  const toDO = [];
  const getName = () => name;
  const getColor = () => color;
  const addToDo = (todo) => toDO.push(todo);
  const getToDo = () => toDO;
  return { getName, getColor, addToDo, getToDo };
}
export function createTodo(task, description, dueDate, priority) {
  const getTask = () => task;
  const getDescription = () => description;
  const getDueDate = () => dueDate;
  const getPriority = () => priority;
  return { getTask, getDescription, getDueDate, getPriority };
}
