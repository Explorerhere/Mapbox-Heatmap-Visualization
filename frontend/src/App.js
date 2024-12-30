import React from 'react';
import './App.css';
import MapboxNavigation from './MapboxNavigation';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Mapbox Navigation App</h1>
        <p>Get directions, search for places, and explore with ease!</p>
      </header>
      <main>
        <MapboxNavigation />
      </main>
      <footer>
        <p>© 2024 Mapbox Navigation. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
