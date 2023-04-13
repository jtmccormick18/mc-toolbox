import React from 'react';
import { Routes, Route } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import ToolboxNav from './components/Navbar';

import Home from './views/Home';
import GIS from './views/GIS';


import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import 'leaflet/dist/leaflet.css';

function App() {
  
  return (
    <div className="App">
      <ToolboxNav />
      <Container fluid className={"bg-dark text-light"}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/team/:team_id" element={<Team />}  /> */}
          <Route path="/gis" element={<GIS />}  />
        </Routes>


      </Container>
    </div>
  );
}

export default App;