import initialData from '@/data/initialData.json';

export const initStorage = () => {
  const projects = localStorage.getItem('projects');
  const tasks = localStorage.getItem('tasks');

  if (!projects) {
    localStorage.setItem('projects', JSON.stringify(initialData.projects));
  }

  if (!tasks) {
    localStorage.setItem('tasks', JSON.stringify(initialData.tasks));
  }
};
