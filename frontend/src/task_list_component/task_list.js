import './task_list.css'
import BA_logo from "../images/BA.png";
import {useEffect, useState} from "react";
import {useParams, useLocation, useNavigate} from "react-router-dom";

function Task_list() {
    const location = useLocation()
    const navigate = useNavigate()
    const {page} = useParams()
    let name = location.state
    let [max_page_num, set_max_page] = useState(26)
    let [page_tasks, set_tasks] = useState([])

    useEffect(() => {
        if(!localStorage.getItem('jrevwappt')) navigate('/login')
        if (!name) name = localStorage.getItem('revappname')
        if(!Number.isInteger(Number(page))) navigate('/task/0')
        console.log(page)
        fetch(`https://2ce0aa36-774d-48d5-a90d-13319970e9a5.mock.pstmn.io/revapp/tasks?page=${page}`, {
            method : 'GET',
        }).then((res) => res.json()).then((data) => {
            console.log(data, 'from server')
            set_max_page(data.max_page)
            set_tasks(data.entries)
        })
    }, [page]);

    let change_page = async (change) => {
        navigate(`/tasks/${Number(page) + change}`, {state: name})
    }

    return <div className={"task-list"}>
        <nav className={'list-navbar'}>
            <div className={'BA-logo-name'}>
                <img src={BA_logo} alt={"BA logo"} className={'BA_logo'}></img>
                <h3 className={'BA_name'}>bibliotheca <span className={'alex-span'}>alexandrina</span> </h3>
            </div>
            <div className={'user-name-logout'}>
                <h3 className={'greeting'}> Hello {name} </h3>
                <label className={'logout'} onClick={() => {
                    localStorage.removeItem('jrevwappt')
                    navigate('/login')
                }}>log out <i className="fas fa-sign-out-alt"></i> </label>
            </div>
        </nav>

        <div className={'task-table'} style={{left: window.innerWidth / 6.2, top: window.innerHeight / 8,
            width: window.innerWidth *  2 / 3, height: window.innerHeight * 2 / 3}}>
            <table className={'table'}>
                <thead>
                    <tr>
                        <th> </th> <th>Filename</th> <th>Modified</th> <th>Revised</th> <th>Readable</th> <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {page_tasks.map((task, index) => (
                        <tr key={index}>
                            <td> {13 * Number(page) + index + 1} </td> <td className={'filename'}> {task.filename} </td>
                            <td> {task.modified} </td> <td> {task.revised} </td> <td> {task.readable} </td>
                            {task.revised? <td></td> :
                                <td> <button className={'edit-entry-btn'} onClick={() => {
                                    navigate(`/task/${index}/${page}`, {state: {page_tasks, name}})
                                }}>edit <i className="fas fa-edit"></i></button> </td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className={'page-slider'} style={{top: window.innerHeight * 21 / 24, left: window.innerWidth / 2.3}}>
            <button className={'slider-btn'} disabled={Number(page) <= 0} onClick={() => change_page(-1)}>
                &larr; prev </button>
            <input type={'text'} disabled={true} value={page + ' / '+ max_page_num.toString()} className={'page-num'}/>
            <button className={'slider-btn'} disabled={Number(page) >= max_page_num}
                onClick={() => change_page(1)}>next &rarr; </button>
        </div>

    </div>
}

export default Task_list