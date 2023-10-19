import './task_edit.css'
import BA_logo from "../images/BA.png";
import {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";

function Task_Edit() {
    const location = useLocation()
    const navigate = useNavigate()
    let {id, page} = useParams()
    let {name, page_tasks} = location.state
    let [task_mod_date, set_mod_date] = useState('1970/01/01')
    let [task_rev_date, set_rev_date] = useState('1970/01/01')
    let [edit_text, set_edit_text] = useState('')
    let [edit_image, set_edit_image] = useState()
    let [tasks, set_tasks] = useState(page_tasks)

    const options = { timeZone: 'Africa/Cairo', year: 'numeric', month: 'long',
        day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };

    let change_task = (change) => {
        navigate(`/task/${Number(id) + change}/${page}`, {state: {tasks, name}})
    }

    let save = async () =>{
        await fetch('http://localhost:3001/ground-truth-editor/task/save', {
            method : 'PUT',
            headers : {'Content-Type': 'application/json',
                       'auth-token': localStorage.getItem('jrevwappt')},
            body: JSON.stringify(tasks[Number(id)])
        }).then((res) => res.json()).then((data) => {
            if (data.message === 'Saved Successfully!' || data.message === 'Revised Successfully!')
                tasks[Number(id)].edit_text = edit_text
            window.alert(data.message)
        })

        await fetch(`http://localhost:3001/ground-truth-editor/tasks/${page}`, {
            method : 'GET',
        }).then((res) => res.json()).then((data) => {
            console.log(data, 'from server')
            let new_tasks = data.entries
            set_tasks(new_tasks)
        })
    }
    let revert = async () => {
        await fetch(`http://localhost:3001/ground-truth-editor/task/revert/${tasks[Number(id)].filename}`, {
            method : 'GET',
            headers : {'Content-Type': 'application/json',
                       'auth-token': localStorage.getItem('jrevwappt')},
        }).then((res) => res.json()).then((data) => {
            if(data.edit_text) set_edit_text(data.edit_text)
            else set_edit_text('')
        })
    }

    let unread = async () => {
        await fetch('https://2ce0aa36-774d-48d5-a90d-13319970e9a5.mock.pstmn.io/revapp/unread', {
            method : 'PUT',
            headers : {'Content-Type': 'application/json'},
            body: JSON.stringify(tasks[Number(id)])
        }).then(() => {console.log('done')})

        await fetch(`http://localhost:3001/ground-truth-editor/tasks/${page}`, {
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
    }, [Number(id)]);


    useEffect(() => {
        fetch(`http://localhost:3001/ground-truth-editor/task/text/${tasks[Number(id)].filename}`, {
            method : 'GET',
            headers : {'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('jrevwappt')},
        }).then((res) => res.json()).then((data) => {
            if(data.edit_text) set_edit_text(data.edit_text)
            else set_edit_text('')
        })
        return () => {}
    }, [Number(id)])

    useEffect(() => {
        fetch(`http://localhost:3001/ground-truth-editor/task/date/${tasks[Number(id)].filename}`, {
            method : 'GET',
            headers : {'Content-Type': 'application/json',
                       'auth-token': localStorage.getItem('jrevwappt')},
        }).then((res) => res.json()).then((data) => {
            if(data.modified_at !== ''){
                const mod_date = new Date(data.modified_at);
                console.log(mod_date)
                set_mod_date(mod_date.toLocaleDateString('en-US', options))
            }
            else set_mod_date('')

            if(data.revised_at !== ''){
                const rev_date = new Date(data.revised_at);
                set_rev_date(rev_date.toLocaleDateString('en-US', options))
            }
            else set_rev_date('')

        })
        return () => {}
    }, [Number(id)])

    useEffect(() => {
        fetch(`http://localhost:3001/ground-truth-editor/task/image/${tasks[Number(id)].filename}`, {
            method : 'GET',
            headers : {'Content-Type': 'application/json',
                       'auth-token': localStorage.getItem('jrevwappt')},
        }).then(response => response.blob()).then(blob => {
            const reader = new FileReader();
            reader.onloadend = () => {set_edit_image(reader.result);};
            reader.readAsDataURL(blob);
        });
        return () => {}
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
                            <td> {tasks[Number(id)].modified} {task_rev_date === ''? '' : (' at ' + task_mod_date)}
                                (Marked as {tasks[Number(id) % 13].readable === 'yes'? 'Readable' : 'Not Readable'}) </td>
                        </tr>
                        <tr>
                            <th> Revised by </th>
                            <td> {tasks[Number(id)].revised} {task_rev_date === ""? '' : (' at '+ task_rev_date)} </td>
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