
import {BrowserRouter as Router, Routes, Route, useParams, Navigate} from "react-router-dom";
import Login_page from "./login_component/login_page";
import Task_list from "./task_list_component/task_list";
import Task_Edit from "./task_edit_component/task_edit";
function MyRoutes(){
    const {page} = useParams()
    const {name} = useParams()
    return (
        <Router>
            <Routes>
                <Route path={"/"} element={<Navigate to={'/login'} replace={true}/> } />
                <Route path={'/login'} element={<Login_page/>}/>
                <Route path="/tasks/:page" element={<Task_list init_page={page} />}/>
                <Route path="/task/:filename" element={<Task_Edit task_name={name}/>}/>
            </Routes>
        </Router>
    )
}

export default MyRoutes