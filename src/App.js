import './App.css'
import { BrowserRouter as Router , Route } from 'react-router-dom';
import WorldClock from './components/HW-6.1/WorldClock'
import CRUDTask from './components/HW-6.2/CRUDTask'
import Chat from './components/HW-6.3/Chat'
import Navigation from './components/Navigation/Navigation'

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <div className="task">
          <Route path="/first" component={ WorldClock } />
          <Route path="/second" component={ CRUDTask } />
          <Route path="/third" component={ Chat } />
        </div>
      </div>
    </Router>
  );
}

export default App;
