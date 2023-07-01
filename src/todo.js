export function createProject(name, color) {
  let toDO = [];
  const getName = () => name;
  const getColor = () => color;
  const addToDo = (todo) => {
    toDO.push(todo);
    toDO.sort((last, next) => {
      if (last.getDueDate() > next.getDueDate()) {
        return 1;
      }
      return -1;
    });
  };
  const getToDo = () => toDO;
  const removeToDo = (todo) => {
    const location = toDO.indexOf(todo);
    toDO.splice(location, 1);
  };
  const clone = (projectOne, projectTwo) => {
    const todoList = projectTwo.getToDo();
    toDO = [...todoList];
    toDO.forEach((todo) => {
      todo.setProject(projectOne);
    });
  };
  return { getName, getColor, addToDo, getToDo, removeToDo, clone };
}
export function createTodo(task, description, dueDate, priority, project) {
  const type = "Todo";
  let complete = false;
  const getTask = () => task;
  const getDescription = () => description;
  const getDueDate = () => dueDate;
  const getPriority = () => priority;
  const getProject = () => project;
  const setProject = (newProject) => {
    // eslint-disable-next-line no-param-reassign
    project = newProject;
  };
  const toggleComplete = () => {
    if (complete === true) {
      complete = false;
    } else {
      complete = true;
    }
  };
  const getStatus = () => complete;
  return {
    getTask,
    getDescription,
    getDueDate,
    getPriority,
    getProject,
    type,
    setProject,
    toggleComplete,
    getStatus,
  };
}
