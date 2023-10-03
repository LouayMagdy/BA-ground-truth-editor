import './login_page.css'
import BA_logo from '../images/BA.png'
import {useState} from "react";

function Login_page(){
    let [user, set_user] = useState({username: "", password: ""})
    let update_user = (e) => {
        set_user({...user, [e.target.name]: e.target.value})
    }

    let submit = (e) => {
        e.preventDefault()
        const usernameWarning = document.querySelector('.nwarnings');
        const passwordWarning = document.querySelector('.pwarnings');
        usernameWarning.style.display = "none"
        passwordWarning.style.display = "none"
        if(user.username === '') usernameWarning.style.display = "block"
        if(user.password === '') passwordWarning.style.display = "block"
        if(user.username === '' || user.password === '') return
        
        console.log(user)
        set_user({username: "", password: ""});
    }

    let togglePasswordVisibility = () => {
        const passwordInput = document.querySelector('#password');
        const eyeIcon = document.querySelector('.password-toggle i');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            eyeIcon.classList.remove('fa-eye');
            eyeIcon.classList.add('fa-eye-slash');
        }
        else {
            passwordInput.type = 'password';
            eyeIcon.classList.remove('fa-eye-slash');
            eyeIcon.classList.add('fa-eye');
        }
    }

    return <div className={'login-page'}>
        <nav className={'navbar'}>
            <img src={BA_logo} alt={"BA logo"} className={'BA_logo'}></img>
            <h3 className={'BA_name'}>bibliotheca alexandrina</h3>
        </nav>

        <form className={'login-form'} onSubmit={(event) => submit(event)}
              style={{left: window.innerWidth / 2.9, width: window.innerWidth / 3.4, top: window.innerHeight / 4.5}}>
            <div className={'username-div'}>
                <label className={"user-labels"} htmlFor={'username'}> Username: </label>
                <input id={'username'} type={"text"} name={"username"} value={user.username}
                       placeholder={'Enter Your Username..'}
                       onChange={(event) => update_user(event)}></input>
            </div>
            <p className={'nwarnings'} style={{display: "none"}}> Username Field seems to be Empty!! </p>
            <div className={'password-div'}>
                <label className={"user-labels"} htmlFor={'password'}> Password: </label>
                <input id={'password'} type={"password"} name={"password"} value={user.password}
                       placeholder={'Enter Your password..'}
                       onChange={(event) => update_user(event)}></input>
                <span className="password-toggle" onClick={() => togglePasswordVisibility()}>
                    <i className="far fa-eye"></i> </span>
            </div>
            <p className={'pwarnings'} style={{display: "none" }}> Password Field seems to be Empty!! </p>
            <div className={'submit-div'}>
                <button type={'submit'} className={'submit-btn'}> login </button>
            </div>
        </form>
    </div>
}

export default Login_page