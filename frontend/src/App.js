import logo from './logo.svg';
import './App.css';
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import { useCallback, useEffect, useState, useRef, useContext } from 'react';

import AdminPage from './Pages/Admin';
import PriceCompare from './Pages/PriceCompare';
import QuantityCompare from './Pages/QuantityCompare';
import Hohol from './Pages/Hohol';
import { ThemeContext } from './ThemeContext';

function App() {


  // const hoholTheme = useContext(ThemeContext)
  // const isHohol = hoholTheme.isHoholTheme
  const navigate = useNavigate();
  const goToHohol = useCallback(() => navigate('/hohol', {replace: true}), [navigate]);
  const probability = (n) => {
    let randNum = Math.random()
    console.log(randNum)
    return randNum < n
  }

  const hoholListener = () => {
    if(probability(0.1)) {
      goToHohol()
    }
  }

  // useEffect(() => {
  //   window.addEventListener("click", hoholListener)
  // },[])


  return (
    // <BrowserRouter> 
      // <ThemeContext.Consumer>
      <Routes>
          <Route path="/" element={<QuantityCompare />}/>
          <Route path="/price_compare" element={<PriceCompare />}/>
          <Route path="/admin" element={<AdminPage />}/>
          <Route path="/hohol" element={<Hohol />}/>
      </Routes>
      //</ThemeContext.Consumer> 
    // </BrowserRouter> 
  );
}

export default App;
