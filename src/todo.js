export function createProject(name, color) {
  const getName = () => name;
  const getColor = () => color;
  return { getName, getColor };
}
export function createTodo(task, description, dueDate, priority, notes) {
  const getTask = () => task;
  const getDescription = () => description;
  const getDueDate = () => dueDate;
  const getPriority = () => priority;
  const getNotes = () => notes;
  return { getTask, getDescription, getDueDate, getPriority, getNotes };
}
