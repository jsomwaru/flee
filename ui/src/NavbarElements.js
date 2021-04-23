import {useCurrentUser } from "./services/hooks/currentUser.hook"

export function NavbarElements() {
    return (
        <div classname="nav-element">
            <div className="auth-buttn-container">
                    <button className="auth-bttn" onClick={user.tools.unauthenticate}>Log Out</button>
            </div>
        </div>
    )
}