import { Routes, Route } from "react-router-dom";

import Main from "./pages/Main/Main";
import Translate from "./pages/Translate/Translate";
import Game from "./pages/Game/Game";
import Login from "./pages/Login/Login";
import Test from "./pages/Test/Test";
import Trend from "./pages/Trend/Trend";
import TodayWord from "./pages/TodayWord/TodayWord";
import Dictionary from "./pages/Dictionary/Dictionary";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />

      <Route path="/translate" element={<Translate />} />

      <Route path="/game" element={<Game />} />

      <Route path="/test" element={<Test />} />

      <Route path="/trend" element={<Trend />} />

      <Route path="/today" element={<TodayWord />} />

      <Route path="/dictionary" element={<Dictionary />} />

      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
