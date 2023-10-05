import './task_list.css'
import BA_logo from "../images/BA.png";
import {name} from "./tasks";
import {useEffect, useState} from "react";

function Task_list() {
    let [page_num, set_page] = useState(0)
    let [max_page_num, set_max_page] = useState(26)
    let [page_tasks, set_tasks] = useState([])

    useEffect(() => {
        fetch('https://2ce0aa36-774d-48d5-a90d-13319970e9a5.mock.pstmn.io/revapp/tasks?page=0', {
            method : 'GET',
        }).then((res) => res.json()).then((data) => {
            console.log(data, 'from server')
            set_max_page(data.max_page)
            set_tasks(data.entries)
        })
    }, []);

    let change_page = async (change) => {
        set_page(page_num + change)
        let response = await fetch(`https://2ce0aa36-774d-48d5-a90d-13319970e9a5.mock.pstmn.io/revapp/tasks?page=${page_num+change}`, {
            method : 'GET',
        }).then((res) => res.json()).then((data) => {
            console.log(data, 'from server')
            set_max_page(data.max_page)
            set_tasks(data.entries)
        })
    }

    return <div className={"task-list"}>
        <nav className={'list-navbar'}>
            <div className={'BA-logo-name'}>
                <img src={BA_logo} alt={"BA logo"} className={'BA_logo'}></img>
                <h3 className={'BA_name'}>bibliotheca <span className={'alex-span'}>alexandrina</span> </h3>
            </div>
            <div className={'user-name-logout'}>
                <h3 className={'greeting'}> Hello {name} </h3>
                <label className={'logout'}> log out <i className="fas fa-sign-out-alt"></i> </label>
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
                            <td> {13 * page_num + index + 1} </td> <td className={'filename'}> {task.filename} </td>
                            <td> {task.modified} </td> <td> {task.revised} </td> <td> {task.readable} </td>
                            {task.revised? <td></td> :
                                <td> <button className={'edit-entry-btn'} onClick={() => {}}>
                                    edit <i className="fas fa-edit"></i>
                                </button> </td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className={'page-slider'} style={{top: window.innerHeight * 21 / 24, left: window.innerWidth / 2.3}}>
            <button className={'slider-btn'} disabled={page_num <= 0} onClick={() => change_page(-1)}>
                &larr; prev </button>
            <input type={'text'} disabled={true} value={page_num} className={'page-num'}/>
            <button className={'slider-btn'} disabled={page_num >= max_page_num}
                onClick={() => change_page(1)}>next &rarr; </button>
        </div>

    </div>
}

export default Task_list