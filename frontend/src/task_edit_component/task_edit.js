import './task_edit.css'
import BA_logo from "../images/BA.png";
import {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";

function Task_Edit() {
    const location = useLocation()
    let name = location.state

    const navigate = useNavigate()
    let {filename} = useParams()

    let [task_mod_date, set_mod_date] = useState('1970/01/01')
    let [task_modifier, set_modifier] = useState('')

    let [task_rev_date, set_rev_date] = useState('1970/01/01')
    let [task_reviewer, set_reviewer] = useState('')

    let [edit_text, set_edit_text] = useState('')
    let [edit_image, set_edit_image] = useState()
    let [readable, set_readable] = useState(true)
    let [max_tasks, set_max_tasks] = useState(0)
    let [task_number, set_task_number] = useState(0)

    let [need_to_fetch, set_need_to_fetch] = useState(true)

    const options = { timeZone: 'Africa/Cairo', year: 'numeric', month: 'long',
                            day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };

    let change_task = async (is_prev) => {
        let direction = (is_prev)? 'prev' : 'next'
        let response = await fetch(`http://localhost:3001/ground-truth-editor/task/change/${direction}/${filename}`, {
                method : 'GET',
                headers : {'Content-Type': 'application/json', 'auth-token': localStorage.getItem('jrevwappt')},
            })
        let data = await response.json()
        navigate(`/task/${data.filename}`, {state: name})
    }

    let go_to_list_page = async () => {
        let response = await fetch(`http://localhost:3001/ground-truth-editor/task/page/${filename}`, {
            method : 'GET',
            headers : {'Content-Type': 'application/json', 'auth-token': localStorage.getItem('jrevwappt')},
        })
        let data = await response.json()
        navigate(`/tasks/${Math.ceil(data.page)}`, {state: name})
    }

    let save = async () => {
        let edit_object = {filename: filename, modified: name, edit_text: edit_text, readable: readable}
        let response = await fetch (`http://localhost:3001/ground-truth-editor/task/save`, {
            method : 'PUT',
            headers : {'Content-Type': 'application/json', 'auth-token': localStorage.getItem('jrevwappt')},
            body: JSON.stringify(edit_object)
        })
        let res_json = await response.json()
        window.alert(res_json.message)
        set_need_to_fetch(!need_to_fetch)
    }

    useEffect(() => { /// getting history of the task
        fetch(`http://localhost:3001/ground-truth-editor/task/history/${filename}`, {
            method: 'GET',
            headers : {'Content-Type': 'application/json', 'auth-token': localStorage.getItem('jrevwappt')}
        })
            .then((res) => res.json())
            .then((data) => {
                set_reviewer(data.revised)
                set_modifier(data.modified)

                if(data.modified_at !== ""){
                    const mod_date = new Date(data.modified_at);
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
    }, [need_to_fetch, filename])

    useEffect(() => {/// getting task last readability mark, last written text, max_task_number, task_number
        fetch(`http://localhost:3001/ground-truth-editor/task/text-readable/${filename}`, {
            method: 'GET',
            headers : {'Content-Type': 'application/json', 'auth-token': localStorage.getItem('jrevwappt')}
        }).then(res => res.json())
          .then((data) => {
              set_edit_text(data.edit_text? data.edit_text : '')
              set_readable(data.readable)
          })

        fetch(`http://localhost:3001/ground-truth-editor/task/number/${filename}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'auth-token': localStorage.getItem('jrevwappt')}
        }).then(res => res.json())
          .then(data => {
              set_max_tasks(data.max)
              set_task_number(data.current)
          })
        return () => {}
    }, [need_to_fetch, filename])

    useEffect(() => { /// getting task image
        fetch(`http://localhost:3001/ground-truth-editor/task/image/${filename}`, {
            method : 'GET',
            headers : {'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('jrevwappt')},
        }).then(response => response.blob()).then(blob => {
            const reader = new FileReader();
            reader.onloadend = () => {set_edit_image(reader.result);};
            reader.readAsDataURL(blob);
        });
        return () => {}
    }, [filename])

    return <div className={'task-edit'}>
        <nav className={'list-navbar'}>
            <div className={'BA-logo-name'}>
                <img src={BA_logo} alt={"BA logo"} className={'BA_logo'}></img>
                <h3 className={'BA_name'}>bibliotheca <span className={'alex-span'}>alexandrina</span> </h3>
            </div>
            <div className={'user-name-logout'}>
                <h3 className={'greeting'}> Hello {name} </h3>
                <label className={'logout'} onClick={() => go_to_list_page()}>
                    <i className={"fa fa-list"}></i> List </label>
                <label className={'logout'} onClick={() => {
                    localStorage.removeItem('jrevwappt')
                    navigate('/login')
                }}> log out <i className="fas fa-sign-out-alt"></i> </label>
            </div>
        </nav>

        <div className={'task'} style={{left: window.innerWidth / 6.2, top: window.innerHeight / 10,
            width: window.innerWidth *  2 / 3, height: window.innerHeight * 5 / 6}}>
            <div className={'task-info'} style={{height: window.innerHeight * 0.8 / 6}}>
                <table className={'task-info-table'}>
                    <tbody>
                    <tr>
                        <th> File Name </th>
                        <td> {filename} (Marked as {readable? 'Readable' : 'Not Readable'})</td>
                    </tr>
                    <tr>
                        <th> Modified by </th>
                        <td> {task_modifier} {task_mod_date === ''? '' : (' at ' + task_mod_date)} </td>
                    </tr>
                    <tr>
                        <th> Revised by </th>
                        <td> {task_reviewer} {task_rev_date === ""? '' : (' at '+ task_rev_date)} </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <div className={'task-image-text'} style={{height: window.innerHeight * 2 / 3 * 1.7 / 3}}>
                <div className={'task-image'} style={{height: window.innerHeight * 2 / 3 * 1.7 / 3}}>
                    <img className={'image'} src={edit_image} alt={'task image'}/>
                </div>
                <div className={'task-text'} style={{height: window.innerHeight * 13 / 60}}>
                    <textarea className={'text'} value={edit_text} disabled={task_reviewer}
                              onChange={(event) => set_edit_text(event.target.value)}> </textarea>
                </div>
            </div>

            <div className={'task-settings'}
                 style={{height: window.innerHeight / 12.9, top: window.innerHeight * 4.4 / 6}}>
                <div className={'task-slider'}>
                    <button className={'slider-btn'} disabled={!(task_number - 1)}
                            onClick={() => change_task(true)}>&larr; prev </button>
                    <input type={'text'} disabled={true} value={ (task_number) + ' / ' + max_tasks}
                           className={'page-num'}/> <button className={'slider-btn'} disabled={task_number === max_tasks}
                                                            onClick={() => change_task(false)}> next &rarr; </button>
                </div>
                <div className={'task-save-read'}>
                    <button className={'save-btn'} onClick={() => save()} >
                        save <i className="fas fa-save"></i> </button>
                    <button className={'revert-btn'} onClick={() => {set_need_to_fetch(!need_to_fetch)}} >
                        revert <i className="fas fa-undo"></i> </button>
                    <button className={'unread-btn'} onClick={() => {set_readable(!readable)}} disabled={!!task_reviewer}>
                        {readable? (<> mark unreadable <i className="fas fa-eye-slash"></i> </>) :
                                    (<> mark readable <i className="fas fa-eye"></i> </>)} </button>
                </div>
            </div>
        </div>
    </div>
}

export default Task_Edit