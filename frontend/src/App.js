import logo from './logo.svg';
import './App.css';
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import AdminPage from './Pages/Admin';
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
          <Route path="/admin" element={<AdminPage />}/>
        </Routes>
      </BrowserRouter>
      </>
  );
}

export default App;
