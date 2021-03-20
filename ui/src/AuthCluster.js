import React, {useState, useEffect} from "react"
import * as fcl from "@onflow/fcl"

export function AuthCluster () {
    // this fucken kills me
    const [user, setUser] = useState({loggedIn: null})
    useEffect(() => fcl.currentUser().subscribe(setUser), [])
    // nvm i like now
    if (user.loggedIn) {
        return (
            // Login button
            <div className="auth-buttn-container">
                <span>user?.addr ?? "No address"</span>
                <button className="auth-bttn" onClick={fcl.unauthenticate}>Log Out</button>
            </div>
        )
    } else {
        return (
        <div class="auth-buttn-container">
            <button className="auth-bttn" onClick={fcl.logIn}>Log In</button>
            <button className="auth-bttn" onClick={fcl.signUp}>Sign Up</button>
        </div>
        
        )
    }

}