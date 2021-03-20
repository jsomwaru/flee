import logo from './flee.png';
import './App.css';
import './AuthCluster'
import { AuthCluster } from './AuthCluster';


function App() {
  return (
    <div className="App">
      <div className="top-bar">
        <AuthCluster />
        <div className="logo">
          <img className="logo" src={logo} alt="logo"></img>
        </div>
        <form> 
        <input type="text" id="text">Text</input>
      </form>
    </div>
    
   </div>
  );
}

export default App;
