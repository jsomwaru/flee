import React from "react"
import logo from './flee.png';
import "./style/auth-cluster.css"
import {useCurrentUser, Init} from  "./hooks/current-user.hook"
import {initProfile} from "./hooks/init-flee-profile.hook"
import {useRecoilValue} from "recoil"

//import {useHistory} from "react-router-dom"

export function AuthCluster () {
    const user =  useCurrentUser()
    const init = useRecoilValue(Init)
    var button;
    if (!init) {
        
        button = <button className="auth-bttn" onClick={() => initProfile(user)}>Initialize</button>
    } else {
        button = <button className="auth-bttn" >Profile</button>
    }

    if (user.loggedIn) {
        return (
            // Login button
            <div className="auth-cluster">
                <div className="logo">
                    <img className="logo" src={logo} alt="logo"></img>
                </div>
                <div className="auth-buttn-container">
                    <button className="auth-bttn" onClick={user.tools.logout}>Log Out</button>
                    {button}
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
}
