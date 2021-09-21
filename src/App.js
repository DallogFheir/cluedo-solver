import "./App.css";
import TitleScreen from "./components/TitleScreen";
import { useState } from "react";

function App() {
  const [currentScreen, setCurrentScreen] = useState("titleScreen");

  const [players, setPlayers] = useState([
    { player: "" },
    { player: "" },
    { player: "" },
  ]);

  return (
    <div className="container">
      {currentScreen === "titleScreen" && (
        <TitleScreen
          players={players}
          setPlayers={setPlayers}
          setCurrentScreen={setCurrentScreen}
        />
      )}
    </div>
  );
}

export default App;
