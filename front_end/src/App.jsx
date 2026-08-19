import { Routes, Route } from "react-router-dom";

import Layout from "./layouts/Layout";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";

import Main from "./pages/Main";
import Translate from "./pages/Translate";
import Dictionary from "./pages/Dictionary";
import Ranking from "./pages/Ranking";
import TodayWord from "./pages/TodayWord";
import Test from "./pages/Test";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage";
import AdminPage from "./pages/Admin/AdminPage";
import NotFound from "./pages/NotFound";
// 비밀번호 찾기 페이지 라우팅
import FindPassword from "./pages/FindPassword";
// 네이버 소셜 로그인
import OAuthCallback from "./pages/OAuthCallback";

import QuizMain from "./pages/QuizMain";
import MultipleChoiceQuiz from "./pages/MultipleChoiceQuiz";
import InitialSoundQuiz from "./pages/InitialSoundQuiz";
import SubjectiveQuiz from "./pages/SubjectiveQuiz";

/**
 * 바깥 Route 에 Layout 을 두면 그 안의 모든 페이지가 헤더·푸터를 공유한다.
 * 페이지는 Layout 의 Outlet 자리에 들어간다.
 *
 * [수정 1] BrowserRouter import 를 지웠다.
 *   main.jsx 에서 이미 감싸고 있어 여기서는 쓰지 않는데 import 만 남아 있었다.
 *   (npm run lint 가 이 줄 때문에 실패했다)
 * [수정 2] 같은 파일을 Trend 와 Ranking 두 이름으로 import 하고 있었다.
 *   Trend 는 아무 데도 쓰이지 않는다. 하나로 정리했다.
 * [수정 3] 404 라우트를 추가했다.
 *   없는 주소로 들어가면 헤더·푸터만 남고 본문이 텅 비어
 *   사용자가 오류인지 로딩 중인지 알 수 없었다.
 */
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Main />} />

        <Route path="/translate" element={<Translate />} />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route path="/ranking" element={<Ranking />} />
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
        {/* 비밀번호 찾기 */}
        <Route path="/find-password" element={<FindPassword />} />
        {/* 네이버 소셜 로그인 */}
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          }
        />

        {/* 게임: /game 에서 종류를 고르고 각 퀴즈로 이동한다 */}
        <Route path="/game" element={<QuizMain />} />
        <Route path="/game/multiple" element={<MultipleChoiceQuiz />} />
        <Route path="/game/initial" element={<InitialSoundQuiz />} />
        <Route path="/game/subjective" element={<SubjectiveQuiz />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
