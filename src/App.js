import "./App.css";
import TitleScreen from "./components/TitleScreen";
import CardSelectScreen from "./components/CardSelectScreen";
import MainScreen from "./components/MainScreen";
import { useState, useEffect, useRef } from "react";

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
      "Klucz francuski",
      "Lina",
      "Metalowa rurka",
      "Rewolwer",
      "Sztylet",
      "Świecznik",
    ],
  };

  const [currentScreen, setCurrentScreen] = useState("");
  const [players, setPlayers] = useState([
    { player: "", cards: new Set(), notCards: new Set() },
    { player: "", cards: new Set(), notCards: new Set() },
    { player: "", cards: new Set(), notCards: new Set() },
  ]);
  const [enquiries, setEnquiries] = useState([]);

  const background = useRef();

  //   SAVED STATE
  //   load saved state on first render
  useEffect(() => {
    const savedState = localStorage.getItem("savedState");

    if (savedState) {
      const { players, enquiries } = JSON.parse(savedState, (key, value) =>
        key === "cards" || key === "notCards" ? new Set(value) : value
      );

      setCurrentScreen("MainScreen");
      setPlayers([...players]);
      setEnquiries([...enquiries]);
    } else {
      setCurrentScreen("TitleScreen");
    }
  }, [setCurrentScreen, setPlayers, setEnquiries]);
  //   save state on each change to players or enquiries
  useEffect(() => {
    //   need to convert sets to arrays by replacer function
    if (currentScreen === "MainScreen") {
      const savedState = JSON.stringify({ players, enquiries }, (_, value) =>
        value instanceof Set ? [...value] : value
      );

      localStorage.setItem("savedState", savedState);
    }
  }, [currentScreen, players, enquiries]);

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
          setCurrentScreen={setCurrentScreen}
          players={players}
          setPlayers={setPlayers}
          enquiries={enquiries}
          setEnquiries={setEnquiries}
          background={background}
          gameElements={gameElements}
        />
      )}
    </div>
  );
}

export default App;
