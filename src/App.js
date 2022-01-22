import './App.css';
import Services from './pages/Services'
import Navbar from './Components/Navbar';
import Header from './Components/Header';
import {BrowserRouter as Router,Switch,Route}  from 'react-router-dom'
import Book from './pages/Book'
import {bookContext,BookProvider} from './Context/BookContext'
import dotenv from 'dotenv'
import ThankYou from './pages/ThankYou'
import Home from './pages/Home'

dotenv.config()

function App() {
  return (
    <BookProvider>
      <Router>
        <div>
          <Navbar/>
          <Header/>
          <Switch>
            <Route exact path="/">
                <Home/>
            </Route>
            <Route exact path="/booking">
              <Services/>
            </Route>
            <Route exact path="/payment">
              <Book/>
            </Route>
            <Route exact path="/ThankYou/:id">
              <ThankYou/>
            </Route>
            
          </Switch>
        </div>
      </Router>
    </BookProvider>
  );
}

export default App;
