import logo from './logo.svg';
import './App.css';
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import HomePage from './Pages/Home';
import AdminPage from './Pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/admin" element={<AdminPage />}/>
          <Route path="/" element={<HomePage />}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
