import { Routes, Route } from "react-router-dom";

import Main from "./pages/Main/Main";
import Translate from "./pages/Translate";
import Dictionary from "./pages/Dictionary";
import Game from "./pages/Game";
import Community from "./pages/Community";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />

      <Route path="/translate" element={<Translate />} />

      <Route path="/dictionary" element={<Dictionary />} />

      <Route path="/game" element={<Game />} />

      <Route path="/community" element={<Community />} />

      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
