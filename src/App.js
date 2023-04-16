import logo from './logo.svg';
import './App.css';
import Header from './common';

function Appo ()
{
  return (
    <div className="App">
      <header className="App-header">
        <img src={ logo } className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}


function sideBar ()
{

}

function App ()
{
  return (
    <>
      <Header />
    </>
  );
}

export default App;
