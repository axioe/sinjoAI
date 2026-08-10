import { FaCamera } from "react-icons/fa";

function ProfileCard({ profile }) {
  return (
    <section className="mypage-profile">
      <div className="mypage-avatar-wrap">
        <div className="mypage-avatar" aria-hidden="true">🙂</div>
        <button type="button" className="mypage-avatar-edit" aria-label="프로필 사진 변경">
          <FaCamera />
        </button>
      </div>

      <div className="mypage-profile-text">
        <h1 className="mypage-greeting">
          {profile.nickname} 님, 안녕하세요! <span aria-hidden="true">👋</span>
        </h1>
        <p className="mypage-greeting-sub">오늘도 새로운 표현을 함께 배워봐요!</p>

        <div className="mypage-meta">
          <span className="mypage-meta-item">
            가입일 <strong>{profile.joinedAt}</strong>
          </span>
          <span className="mypage-meta-item">
            마지막 접속 <strong>{profile.lastLoginAt}</strong>
          </span>
        </div>
      </div>
    </section>
  );
}

export default ProfileCard;
