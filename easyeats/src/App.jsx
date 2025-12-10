import "./App.css";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./pages/Home"
import Profile from "./pages/Profile";
import RecipeDetail from "./pages/DetailRecipe";
import CreateRecipe from "./pages/CreateRecipe";

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/profile' element={<Profile />} />
            <Route path='/recipe/:id' element={<RecipeDetail />} />
            <Route path='/makerecipe' element={<CreateRecipe />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
