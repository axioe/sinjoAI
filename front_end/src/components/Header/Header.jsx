import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">🟣 신세대 번역기</div>

      <nav>
        <a href="">번역</a>
        <a href="">사전</a>
        <a href="">맞추기 게임</a>
        <a href="">커뮤니티</a>
      </nav>

      <div className="right">
        <input placeholder="검색" />

        <button>로그인</button>
      </div>
    </header>
  );
}

export default Header;
