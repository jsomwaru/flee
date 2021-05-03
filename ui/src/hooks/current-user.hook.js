import {useEffect} from 'react'
import {useSetRecoilState, atom, useRecoilValue, selector } from 'recoil'
import {loadProfile} from './load-profile.hook'
import * as fcl from "@onflow/fcl"

export const  currentUser = atom({
    key: "CURRENT_USER",
    default: { loggedIn: null, addr: null, cid: null }
})

const tools = {
    login: fcl.logIn,
    logout: fcl.unauthenticate,
    signup: fcl.signUp,
    changeuser: fcl.reauthenticate,
    authenticate: fcl.authenticate
}

export const initUser = atom({
    key: "initUser", 
    default: false
})

export const Init = selector({
    key: "INIT",
    get: async ( { get } ) => {
        const cu = get(currentUser)
        const res = await loadProfile(cu);
        const js = await res.json()
        if (js.length === 0) return false;
        return true;
    },
    set: async ({ set }) => {
        set(initUser)
    }
})

// export const CurrentUserInitilization = () => {
//     const [initUser, setInitUser] = useRecoilState()
//     useEffect( ()  => set())
// }

export const CurrentUserSubScription = () => {
    let setUser = useSetRecoilState(currentUser)
    useEffect(() => fcl.currentUser().subscribe(setUser), [setUser])
    return null
}

export function useCurrentUser() {
    const user = useRecoilValue(currentUser)
    console.log(user)
    return {
        ...user,
        tools
    }
}

