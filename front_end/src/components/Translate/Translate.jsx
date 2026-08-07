import "./Translate.css";

function Translate() {
  return (
    <div className="translate-card">
      <h3>신조어 입력</h3>

      <textarea rows="10" placeholder="신조어를 입력하세요." />

      <button>번역하기</button>
    </div>
  );
}

export default Translate;
