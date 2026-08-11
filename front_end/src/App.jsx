import { Routes, Route } from "react-router-dom";

import Layout from "./layouts/Layout";

import Main from "./pages/Main";
import Translate from "./pages/Translate";
import Dictionary from "./pages/Dictionary";
import Trend from "./pages/Trend";
import TodayWord from "./pages/TodayWord";
import Test from "./pages/Test";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage";

import QuizMain from "./pages/QuizMain";
import MultipleChoiceQuiz from "./pages/MultipleChoiceQuiz";
import InitialSoundQuiz from "./pages/InitialSoundQuiz";
import SubjectiveQuiz from "./pages/SubjectiveQuiz";
import RequireAuth from "./components/RequireAuth";

/**
 * 바깥 Route 에 Layout 을 두면 그 안의 모든 페이지가 헤더·푸터를 공유한다.
 * 페이지는 Layout 의 Outlet 자리에 들어간다.
 */
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Main />} />

        <Route path="/translate" element={<Translate />} />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/trend" element={<Trend />} />
        <Route path="/today" element={<TodayWord />} />
        <Route path="/test" element={<Test />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/mypage"
          element={
            <RequireAuth>
              <MyPage />
            </RequireAuth>
          }
        />

        {/* 게임: /game 에서 종류를 고르고 각 퀴즈로 이동한다 */}
        <Route path="/game" element={<QuizMain />} />
        <Route path="/game/multiple" element={<MultipleChoiceQuiz />} />
        <Route path="/game/initial" element={<InitialSoundQuiz />} />
        <Route path="/game/subjective" element={<SubjectiveQuiz />} />
      </Route>
    </Routes>
  );
}

export default App;
