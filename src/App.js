// TODO
// zmienic odcisk na ciemnozielony

import "./App.css";
import TitleScreen from "./components/TitleScreen";
import CardSelectScreen from "./components/CardSelectScreen";
import { useState } from "react";

function App() {
  const gameElements = {
    rooms: [
      "biblioteka",
      "gabinet",
      "hol",
      "jadalnia",
      "kuchnia",
      "sala balowa",
      "sala bilardowa",
      "salon",
      "weranda",
    ],
    people: [
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
    { player: "" },
    { player: "" },
    { player: "" },
  ]);

  return (
    <div className="container">
      {currentScreen === "TitleScreen" && (
        <TitleScreen
          players={players}
          setPlayers={setPlayers}
          setCurrentScreen={setCurrentScreen}
        />
      )}
      {currentScreen === "CardSelectScreen" && (
        <CardSelectScreen players={players} gameElements={gameElements} />
      )}
    </div>
  );
}

export default App;
