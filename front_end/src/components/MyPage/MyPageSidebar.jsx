import { useNavigate } from "react-router-dom";
import {
  FaHome, FaBookmark, FaUser, FaStar, FaClipboardList,
  FaGamepad, FaChartBar, FaBell, FaCog, FaSignOutAlt,
} from "react-icons/fa";

/**
 * 마이페이지 좌측 메뉴.
 * 아직 하위 화면이 없어 선택 상태만 바꾼다.
 * 화면을 만들면서 to 를 채워 라우팅으로 바꾸면 된다.
 */
const MENUS = [
  { key: "home", label: "마이페이지", Icon: FaHome },
  { key: "saved", label: "번역 저장", Icon: FaBookmark },
  { key: "profile", label: "유저 정보 변경", Icon: FaUser },
  { key: "favorite", label: "즐겨찾기 단어", Icon: FaStar },
  { key: "test", label: "나의 테스트 결과", Icon: FaClipboardList },
  { key: "game", label: "게임 기록", Icon: FaGamepad },
  { key: "stats", label: "활동 통계", Icon: FaChartBar },
  { key: "alarm", label: "알림", Icon: FaBell },
  { key: "setting", label: "설정", Icon: FaCog },
];

function MyPageSidebar({ active, onSelect }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: 서버 연동 시 로그아웃 요청을 보낸 뒤 이동한다.
    navigate("/login");
  };

  return (
    <aside className="mypage-sidebar">
      <nav className="mypage-menu">
        {MENUS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            className={`mypage-menu-item ${active === key ? "active" : ""}`}
            onClick={() => onSelect(key)}
          >
            <Icon className="mypage-menu-icon" />
            <span>{label}</span>
          </button>
        ))}

        <button type="button" className="mypage-menu-item" onClick={handleLogout}>
          <FaSignOutAlt className="mypage-menu-icon" />
          <span>로그아웃</span>
        </button>
      </nav>

      <div className="mypage-invite">
        <p className="mypage-invite-title">세대 간 소통을 더 즐겁게!</p>
        <p className="mypage-invite-desc">친구를 초대하면 포인트를 드려요.</p>
        <div className="mypage-invite-art" aria-hidden="true">🧑‍🤝‍🧑 🎁 💜</div>
        <button type="button" className="mypage-invite-btn">
          친구 초대하기 <span aria-hidden="true">›</span>
        </button>
      </div>
    </aside>
  );
}

export default MyPageSidebar;
