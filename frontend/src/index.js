import React from 'react';
import ReactDOM from 'react-dom/client';
// import reportWebVitals from './reportWebVitals';
import Login_page from "./login_component/login_page";
import Task_list from "./task_list_component/task_list";
import Task_Edit from "./task_edit_component/task_edit";
import {mytasks} from "./task_list_component/tasks";
import MyRoutes from "./routes";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <MyRoutes/>
    {/*<Task_list init_page = {0}/>*/}
      {/*<Login_page/>*/}
    {/*<Task_Edit task_number={1} page_number={0} page_tasks={mytasks}/>*/}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
