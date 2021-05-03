import React from "react"
import logo from './flee.png';
import "./style/auth-cluster.css"
import {useCurrentUser, Init} from  "./hooks/current-user.hook"
import {InitProfile, test} from "./hooks/init-flee-profile.hook"
import {useRecoilValue} from "recoil"
import {Modal} from "./parts/modal"
import { initAccount } from './flow/init-account';
//import {useHistory} from "react-router-dom"

const refopen = (ref) => { 
    if (ref.current) {
        ref.current.open()
    }
}

export function AuthCluster (props) {
    const user =  useCurrentUser()
    const init = useRecoilValue(Init)
    const modal = React.useRef(null)
    const [username, setUsername] = React.useState("")
    var modalform = null;
    var button;
    if (!init) {
        modalform = (
            <React.Suspense fallback="Loading..">
                <Modal ref={modal} >
                        <form>
                        <label>Username:</label>
                        <input  onChange={event => setUsername(event.target.value)} id="username" type="text"></input>
                        <InitButton user={user} username={username}/>
                    </form>
                </Modal>
            </React.Suspense>
        )
        button = <button className="auth-bttn" onClick={() => refopen(modal) }>Initialize</button>
    } else {
        button = <button className="auth-bttn" >Profile</button>
    }

    if (user.loggedIn) {
        return (
            // Login butto,

            <div className="auth-cluster">
                {modalform}
                <div className="logo">
                    <img className="logo" src={logo} alt="logo"></img>
                </div>
                <div className="auth-buttn-container">
                    <button className="auth-bttn" onClick={user.tools.logout}>Log Out</button>
                    {button}
                    <InitButtonTest auth={user.tools.authenticate} title="Gimme NFTs"/>
                </div>
                <span>{user?.addr ?? "No address"}</span>
                
            </div>
  
        )
    } else {  
        
        return (
        
        <div className="auth-cluster">
            
            <div className="logo">
                <img className="logo" src={logo} alt="logo"></img>
            </div>
        <div class="auth-buttn-container">
            <button className="auth-bttn" onClick={user.tools.login}>Log In</button>
            <button className="auth-bttn" onClick={user.tools.signup}>Sign Up</button>
        </div>   
        </div>
        )
    }
};


export function InitButton({user, username}) {

    return ( 
        <button className="class" onClick={ async () => await  InitProfile(user, username).catch(e => console.log(e))}>Submit</button>
    )
}


export function InitButtonTest({title, auth}) {
    return <button className="tmp" onClick={async () =>  await initAccount(auth).catch(e => console.log(e))}>{title}</button>
}

export default AuthCluster;
