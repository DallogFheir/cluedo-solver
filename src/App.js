import "./App.css";
import TitleScreen from "./components/TitleScreen";
import { useState } from "react";

function App() {
  const [players, setPlayers] = useState(["", "", ""]);

  return (
    <div class="container">
      <TitleScreen players={players} setPlayers={setPlayers} />
    </div>
  );
}

export default App;
