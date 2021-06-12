import './App.css';
// import MainWrapperContainer from "./components/MainWrapper/MainWrapperContainer";
import HeaderContainer from "./components/Header/HeaderContainer";
import CleanContent from "./components/MainWrapper/Templates/CleanContent/CleanContent";
import MainWrapperContainer from "./components/MainWrapper/MainWrapperContainer";

function App() {
    // debugger;
  return (
    <div>
        <HeaderContainer />
        <MainWrapperContainer />
    </div>
  );
}

export default App;
