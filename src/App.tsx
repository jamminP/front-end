import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./header/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/mypage" />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;