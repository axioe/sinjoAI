import Header from "../components/Header/Header";
import Hero from "../components/Hero/Hero";
import Translate from "../components/Translate/Translate";
import Result from "../components/Result/Result";
// import Trend from "../components/Trend/Trend";
// import Quiz from "../components/Quiz/Quiz";

import "../Main.css";

function Main() {
  return (
    <div className="container">
      <Header />

      <Hero />

      <div className="translate-section">
        <Translate />

        <Result />
      </div>

      <div className="bottom">
        {/* <Trend />

        <Quiz /> */}
      </div>
    </div>
  );
}

export default Main;
