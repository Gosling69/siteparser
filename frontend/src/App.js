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
import NavBar from './Components/NavBar';
import PriceCompare from './Pages/PriceCompare';
import QuantityCompare from './Pages/QuantityCompare';

function App() {
  return (
    <>
    
    <BrowserRouter>
    {/* <NavBar/> */}
      <Routes>
          <Route path="/" element={<QuantityCompare />}/>
          <Route path="/price_compare" element={<PriceCompare />}/>
          {/* <Route path="/quantity_compare" element={<QuantityCompare />}/> */}
          <Route path="/admin" element={<AdminPage />}/>
        </Routes>
      </BrowserRouter>
      </>
  );
}

export default App;
