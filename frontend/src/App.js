import logo from './logo.svg';
import './App.css';
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";

import AdminPage from './Pages/Admin';
import PriceCompare from './Pages/PriceCompare';
import QuantityCompare from './Pages/QuantityCompare';
import PriceCompareTableView from './Pages/PriceCompareTableView';

function App() {


  return (
      <Routes>
          <Route path="/" element={<QuantityCompare />}/>
          <Route path="/price_compare" element={<PriceCompare />}/>
          <Route path="/admin" element={<AdminPage />}/>
          <Route path="/price_compare_table" element={<PriceCompareTableView />}/>
      </Routes>
  );
}

export default App;
