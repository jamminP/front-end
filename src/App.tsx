import { BrowserRouter } from "react-router-dom";
import "./App.css";
import MypageRoutes from "./mypage/MypageRoutes";

function App() {
  return (
    <>
      <BrowserRouter>
        <MypageRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;
