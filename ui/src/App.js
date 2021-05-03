import './style/App.css';
import './AuthCluster'
import { AuthCluster, InitButtonTest } from './AuthCluster';
import { CurrentUserSubScription } from "./hooks/current-user.hook"
import {InitProfile} from "./hooks/init-flee-profile.hook"
import { RecoilRoot } from 'recoil'
import React, {useRef} from "react"
import "./config"
import {Modal} from "./parts/modal"
import { ref } from '@onflow/fcl';


function App() {
  return (
    <div className="App">
      <RecoilRoot>
        <CurrentUserSubScription />
        <React.Suspense fallback={"Loading"}>
          <div className="top-bar">
            <AuthCluster  />
          </div>
          </React.Suspense>
      </RecoilRoot>
   </div>
  );
}

export default App;
 