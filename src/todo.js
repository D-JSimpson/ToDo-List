export function createProject(name, color) {
  this.name = name;
  this.color = color;
}
export function createTodo(task, description, dueDate, priority, notes) {
  const getTask = () => task;
  const getDescription = () => description;
  const getDueDate = () => dueDate;
  const getPriority = () => priority;
  const getNotes = () => notes;
  return { getTask, getDescription, getDueDate, getPriority, getNotes };
}
