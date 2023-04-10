export declare global {
  interface Window {
    api: {
      createTodo: () => Promise<any>;
      getTodoList: () => any;
    };
  }
}
