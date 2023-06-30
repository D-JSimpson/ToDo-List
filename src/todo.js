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
export function createTodo(task, description, dueDate, priority) {
  const getTask = () => task;
  const getDescription = () => description;
  const getDueDate = () => dueDate;
  const getPriority = () => priority;
  return { getTask, getDescription, getDueDate, getPriority };
}
