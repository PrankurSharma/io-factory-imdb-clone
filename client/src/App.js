import './App.css';
import AddMovie from './AddMovie';
import FetchMovies from './FetchMovies';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route exact path="/" element={<FetchMovies />} />
            <Route exact path="/addmovie" element={<AddMovie />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
