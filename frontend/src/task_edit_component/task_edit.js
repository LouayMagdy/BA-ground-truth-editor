import './task_edit.css'
import BA_logo from "../images/BA.png";
import {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";

function Task_Edit() {
    const location = useLocation()
    const navigate = useNavigate()
    let {id, page} = useParams()
    let {name, page_tasks} = location.state
    let [task_mod_date, set_mod_date] = useState('2023/01/01')
    let [edit_text, set_edit_text] = useState('')
    let [edit_image, set_edit_image] = useState()
    let [tasks, set_tasks] = useState(page_tasks)

    let change_task = (change) => {
        navigate(`/task/${Number(id) + change}/${page}`, {state: {tasks, name}})
    }

    let save = async () =>{
        await fetch('https://2ce0aa36-774d-48d5-a90d-13319970e9a5.mock.pstmn.io/revapp/save', {
            method : 'PUT',
            headers : {'Content-Type': 'application/json'},
            body: JSON.stringify(tasks[Number(id)])
        }).then((res) => res.json()).then((data) => {window.alert(data.message)})
    }
    let revert = async () => {
        await fetch('https://2ce0aa36-774d-48d5-a90d-13319970e9a5.mock.pstmn.io/revapp/revert', {
            method : 'POST',
            headers : {'Content-Type': 'application/json'},
            body: JSON.stringify(tasks[Number(id)])
        }).then((res) => res.json()).then((data) => {set_edit_text(data.edit_text)})
    }

    let unread = async () => {
        await fetch('https://2ce0aa36-774d-48d5-a90d-13319970e9a5.mock.pstmn.io/revapp/unread', {
            method : 'PUT',
            headers : {'Content-Type': 'application/json'},
            body: JSON.stringify(tasks[Number(id)])
        }).then(() => {console.log('done')})

        await fetch(`https://2ce0aa36-774d-48d5-a90d-13319970e9a5.mock.pstmn.io/revapp/tasks?page=${page}`, {
            method : 'GET',
        }).then((res) => res.json()).then((data) => {
            console.log(data, 'from server')
            let new_tasks = data.entries
            set_tasks(new_tasks)
        })
    }

    useEffect(() => {
        console.log(location.state)
        if(!localStorage.getItem('jrevwappt')) navigate('/login')
        if (!name) name = localStorage.getItem('revappname')
    }, []);

    useEffect(() => {
        fetch('https://2ce0aa36-774d-48d5-a90d-13319970e9a5.mock.pstmn.io/revapp/edit_text', {
            method : 'POST',
            headers : {'Content-Type': 'application/json'},
            body: JSON.stringify(tasks[Number(id)])
        }).then((res) => res.json()).then((data) => {set_edit_text(data.edit_text)})
    }, [Number(id)])

    useEffect(() => {
        fetch('https://2ce0aa36-774d-48d5-a90d-13319970e9a5.mock.pstmn.io/revapp/mod_date', {
            method : 'POST',
            headers : {'Content-Type': 'application/json'},
            body: JSON.stringify(tasks[Number(id)])
        }).then((res) => res.json()).then((data) => {set_mod_date(data.mod_date)})
    }, [Number(id)])

    useEffect(() => {
        fetch('https://images.pexels.com/photos/9638689/pexels-photo-9638689.jpeg?cs=srgb&dl=pexels-kammeran-gonzalezkeola-9638689.jpg&fm=jpg&_gl=1*1gxh0v*_ga*MTgzMTEwNDQ2My4xNjk2NTIzMzQz*_ga_8JE65Q40S6*MTY5NjUzMDQ0Ni4yLjEuMTY5NjUzMDQ1Ny4wLjAuMA..', {
            method : 'GET', // to be POST
            headers : {'Content-Type': 'application/json'},
            // body: JSON.stringify(tasks[Number(id)])
        }).then(response => response.blob()).then(blob => {
            const reader = new FileReader();
            reader.onloadend = () => {set_edit_image(reader.result);};
            reader.readAsDataURL(blob);
        });
    }, [Number(id)])
    
    return <div className={'task-edit'}>
        <nav className={'list-navbar'}>
            <div className={'BA-logo-name'}>
                <img src={BA_logo} alt={"BA logo"} className={'BA_logo'}></img>
                <h3 className={'BA_name'}>bibliotheca <span className={'alex-span'}>alexandrina</span> </h3>
            </div>
            <div className={'user-name-logout'}>
                <h3 className={'greeting'}> Hello {name} </h3>
                <label className={'logout'} onClick={() => {navigate(`/tasks/${page}`, {state: name})}}>
                    <i className={"fa fa-list"}></i> List </label>
                <label className={'logout'} onClick={() => {navigate('/login')}}>
                    log out <i className="fas fa-sign-out-alt"></i> </label>
            </div>
        </nav>

        <div className={'task'} style={{left: window.innerWidth / 6.2, top: window.innerHeight / 10,
            width: window.innerWidth *  2 / 3, height: window.innerHeight * 5 / 6}}>
            <div className={'task-info'} style={{height: window.innerHeight * 0.8 / 6}}>
                <table className={'task-info-table'}>
                    <tbody>
                        <tr>
                            <th> File Name </th>
                            <td> {tasks[Number(id)].filename} </td>
                        </tr>
                        <tr>
                            <th> Modified by </th>
                            <td> {tasks[Number(id)].modified} at {task_mod_date} (Marked as {tasks[Number(id) % 13].readable === 'yes'? 'Readable' : 'Not Readable'}) </td>
                        </tr>
                        <tr>
                            <th> Revised by </th>
                            <td> {tasks[Number(id)].revised} </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className={'task-image-text'} style={{height: window.innerHeight * 2 / 3 * 1.7 / 3}}>
                <div className={'task-image'} style={{height: window.innerHeight * 2 / 3 * 1.7 / 3}}>
                    <img className={'image'} src={edit_image} alt={'task image'}/>
                </div>
                <div className={'task-text'} style={{height: window.innerHeight * 13 / 60}}>
                    <textarea className={'text'} value={edit_text} disabled={tasks[Number(id)].revised}
                     onChange={(event) => set_edit_text(event.target.value)}> </textarea>
                </div>
            </div>

            <div className={'task-settings'}
                 style={{height: window.innerHeight / 12.9, top: window.innerHeight * 4.4 / 6}}>
                <div className={'task-slider'}>
                    <button className={'slider-btn'} disabled={Number(id) === 0}
                            onClick={() => change_task(-1)}>&larr; prev </button>
                    <input type={'text'} disabled={true} value={ (Number(id) + 1).toString() + ' / ' + tasks.length.toString()}
                           className={'page-num'}/> <button className={'slider-btn'} disabled={(Number(id) + 1) === tasks.length}
                            onClick={() => {change_task(1)}}> next &rarr; </button>
                </div>
                <div className={'task-save-read'}>
                    <button className={'save-btn'} onClick={() => save()}> save <i className="fas fa-save"></i> </button>
                    <button className={'revert-btn'} onClick={() => revert()}> revert <i className="fas fa-undo"></i> </button>
                    <button className={'unread-btn'} onClick={() => unread()}> not readable <i className="fas fa-eye-slash"></i> </button>
                </div>
            </div>
        </div>
    </div>
}
export default Task_Edit