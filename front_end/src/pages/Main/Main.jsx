import Header from "../../components/Header/Header";
import { Link } from "react-router-dom";
import "./Main.css";

function Main() {
  return (
    <>
      <Header />

      <div className="main-container">
        {/* Hero */}
        <section className="hero">
          <div className="hero-text">
            <h1>신조어 번역기</h1>

            <p>
              어려운 신조어를 표준어로 번역하고, 세대 맞추기 게임과 퀴즈까지
              즐겨보세요.
            </p>

            <Link to="/translate">
              <button className="start-btn">번역 시작하기</button>
            </Link>
          </div>

          <div className="hero-image">
            <img src="/main.png" alt="메인 이미지" />
          </div>
        </section>

        {/* 카드 */}

        <section className="card-grid">
          <div className="card">
            <h2>🔥 실시간 인기 신조어</h2>

            <ul>
              <li>1. 억까</li>

              <li>2. 갓생</li>

              <li>3. 킹받네</li>

              <li>4. 중꺾마</li>
            </ul>
          </div>

          <div className="card">
            <h2>🎮 세대 맞추기 게임</h2>

            <p>신조어를 보고 어느 세대가 사용하는지 맞혀보세요.</p>

            <Link to="/game">
              <button>게임 시작</button>
            </Link>
          </div>

          <div className="card">
            <h2>📖 최근 번역</h2>

            <p>오늘 시험 억까였다</p>

            <p>→ 오늘 시험이 unfair했다.</p>
          </div>

          <div className="card">
            <h2>📝 신조어 테스트</h2>

            <p>당신의 신조어 실력을 확인해보세요.</p>
          </div>
        </section>
      </div>
    </>
  );
}

export default Main;
