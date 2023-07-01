export function createProject(name, color) {
  const toDO = [];
  const getName = () => name;
  const getColor = () => color;
  const addToDo = (todo) => toDO.push(todo);
  const getToDo = () => toDO;
  const removeToDo = (todo) => {
    const location = toDO.indexOf(todo);
    toDO.splice(location, 1);
  };
  return { getName, getColor, addToDo, getToDo, removeToDo };
}
export function createTodo(task, description, dueDate, priority, project) {
  const getTask = () => task;
  const getDescription = () => description;
  const getDueDate = () => dueDate;
  const getPriority = () => priority;
  const getProject = () => project;
  const type = "Todo";
  return { getTask, getDescription, getDueDate, getPriority, getProject, type };
}
