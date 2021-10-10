import "./App.css";
import TitleScreen from "./components/TitleScreen";
import CardSelectScreen from "./components/CardSelectScreen";
import MainScreen from "./components/MainScreen";
import { useState, useRef } from "react";

// TODO
// make everything responsive
// A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component.

function App() {
  const gameElements = {
    rooms: [
      "Biblioteka",
      "Gabinet",
      "Hol",
      "Jadalnia",
      "Kuchnia",
      "Sala balowa",
      "Sala bilardowa",
      "Salon",
      "Weranda",
    ],
    suspects: [
      "Ksiądz Zieliński",
      "Pani Bielecka",
      "Pani Pawińska",
      "Panna Czerwińska",
      "Profesor Śliwiński",
      "Pułkownik Żółtkowski",
    ],
    tools: [
      "Klucz",
      "Lina",
      "Metalowa rurka",
      "Rewolwer",
      "Sztylet",
      "Świecznik",
    ],
  };

  const [currentScreen, setCurrentScreen] = useState("TitleScreen");
  const [players, setPlayers] = useState([
    { player: "", cards: new Set(), notCards: new Set() },
    { player: "", cards: new Set(), notCards: new Set() },
    { player: "", cards: new Set(), notCards: new Set() },
  ]);

  const background = useRef();

  return (
    <div className="background" ref={background}>
      {currentScreen === "TitleScreen" && (
        <TitleScreen
          players={players}
          setPlayers={setPlayers}
          setCurrentScreen={setCurrentScreen}
        />
      )}
      {currentScreen === "CardSelectScreen" && (
        <CardSelectScreen
          players={players}
          setPlayers={setPlayers}
          setCurrentScreen={setCurrentScreen}
          gameElements={gameElements}
        />
      )}
      {currentScreen === "MainScreen" && (
        <MainScreen
          players={players}
          setPlayers={setPlayers}
          background={background}
          gameElements={gameElements}
        />
      )}
    </div>
  );
}

export default App;
