import './App.css';
import { useEffect, useState } from 'react'
import ReactDefault from './components/react-default/react-default';
import AreaMapbox from './components/maps/area-mapbox';

function App() {


  return (
    <div className="App w-screen h-screen">
      {/* <ReactDefault/> */}
      <AreaMapbox />
    </div>
  );
}

export default App;
