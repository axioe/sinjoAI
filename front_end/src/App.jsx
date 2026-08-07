import { Routes, Route } from "react-router-dom";

import Main from "./pages/Main/Main";
import Translate from "./pages/Translate";
import Game from "./pages/Game";
// import Community from "./pages/Community";
import Login from "./pages/Login/Login";
import Test from "./pages/Test";
import Trend from "./pages/Trend";
import TodayWord from "./pages/Todayword";
import Dictionary from "./pages/Dictionary";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />

      <Route path="/login" element={<Login />} />

      <Route path="/translate" element={<Translate />} />

      <Route path="/game" element={<Game />} />

      <Route path="/test" element={<Test />} />

      <Route path="/trend" element={<Trend />} />

      <Route path="/today" element={<TodayWord />} />

      <Route path="/dictionary" element={<Dictionary />} />
    </Routes>
  );
}

export default App;
