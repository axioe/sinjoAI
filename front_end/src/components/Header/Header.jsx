import "./Header.css";
import { Link } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">🟣 신세대 번역기</Link>
      </div>

      <nav className="nav-menu">
        <Link to="/translate">번역</Link>
        <Link to="/dictionary">사전</Link>
        <Link to="/game">맞추기 게임</Link>
        <Link to="/community">커뮤니티</Link>
      </nav>

      <div className="header-right">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="신조어 검색" />
        </div>

        <Link to="/login" className="login-btn">
          <FaUser />
          로그인
        </Link>
      </div>
    </header>
  );
}

export default Header;
