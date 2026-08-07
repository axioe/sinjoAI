import Header from "../../components/Header/Header";
import { Link } from "react-router-dom";
import {
  FaFire,
  FaBook,
  FaGamepad,
  FaBrain,
  FaArrowRight,
} from "react-icons/fa";

import "./Main.css";

function Main() {
  return (
    <>
      <Header />

      <div className="main">
        {/* Hero */}

        <section className="hero">
          <div className="hero-left">
            <span className="badge">🚀 AI 신조어 번역 서비스</span>

            <h1>
              신조어가 어렵다면
              <br />
              AI에게 맡겨보세요.
            </h1>

            <p>
              실시간 신조어 번역부터 퀴즈, 신조어 게임까지 하나의 서비스에서
              제공합니다.
            </p>

            <Link to="/translate">
              <button className="start">
                번역 시작하기
                <FaArrowRight />
              </button>
            </Link>
          </div>

          <div className="hero-right">
            <img src="/hero.png" alt="" />
          </div>
        </section>

        {/* 기능 */}

        <section className="feature-grid">
          <div className="feature-card">
            <FaFire className="icon" />

            <Link to="/trend">
              <h3>🔥 실시간 인기 신조어</h3>
            </Link>

            <ul>
              <li>🔥 억까</li>

              <li>🔥 갓생</li>

              <li>🔥 킹받네</li>

              <li>🔥 알잘딱깔센</li>
            </ul>
          </div>

          <div className="feature-card">
            <FaBook className="icon" />

            <Link to="/today">
              <h3>📖 오늘의 신조어</h3>
            </Link>

            <h2>알잘딱깔센</h2>

            <p>알아서 잘 딱 깔끔하고 센스있게</p>
          </div>

          <div className="feature-card">
            <FaGamepad className="icon" />

            <h3>신조어 게임</h3>

            <p>신조어로 재밌는 게임을 즐겨보세요.</p>

            <Link to="/game">
              <button>게임 시작</button>
            </Link>
          </div>

          <div className="feature-card">
            <FaBrain className="icon" />

            <h3>신조어 이해도 테스트</h3>

            <p>당신의 신조어 실력을 확인하세요.</p>

            <Link to="/test">
              <button>테스트 하기</button>
            </Link>
          </div>
        </section>

        {/* 최근 번역 */}

        <section className="history">
          <h2>최근 번역</h2>

          <div className="history-box">
            <div>오늘 시험 억까였다</div>

            <div>오늘 시험에서 부당한 불이익을 받았다.</div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Main;
