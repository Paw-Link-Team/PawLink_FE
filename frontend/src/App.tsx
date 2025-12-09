import "./App.css";
import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import Home from "./Home";

function App() {
  return (
    <div className="app-root">
      {/* <Home /> */}
      <Header location="서울시 강남구" />
      <Navbar />
    </div>
  );
}

export default App;
