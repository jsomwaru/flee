import './style/App.css';
import './AuthCluster'
import { AuthCluster } from './AuthCluster';
import { CurrentUserSubScription} from "./hooks/current-user.hook"
import { RecoilRoot } from 'recoil'
import React from "react"
import "./config"


function App() {
  return (
    <div className="App">
      <RecoilRoot>
      <CurrentUserSubScription />
      <React.Suspense fallback={"Loading"}>
      <div className="top-bar">
        <AuthCluster />
      </div>
      </React.Suspense>
      <h1>Welcome To Flee</h1>
      </RecoilRoot>
   </div>
  );
}

export default App;
