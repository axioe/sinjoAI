import Header from "../components/Header/Header";
import "./Game.css";

function Game() {
  return (
    <>
      <Header />

      <div className="game-page">
        <h1>🎮 세대 맞추기 게임</h1>

        <div className="question">
          <h2>"억까"는 어느 세대가 많이 사용할까요?</h2>

          <button>10대</button>

          <button>20대</button>

          <button>30대</button>
        </div>
      </div>
    </>
  );
}

export default Game;
