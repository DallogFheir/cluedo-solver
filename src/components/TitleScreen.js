import "./TitleScreen.css";

function TitleScreen({ players, setPlayers }) {
  return (
    <div class="title-screen">
      <img src="logo.png" alt="logo" />
      <p>Wpisz imiona graczy:</p>
      <form class="player-form">
        {players.map((_) => (
          <input placeholder="Wpisz imię gracza..." />
        ))}
      </form>
      {players.length < 6 && (
        <p>
          Dodaj więcej graczy{" "}
          <i
            class="add-btn bi bi-plus-circle-fill"
            onClick={() => setPlayers([...players, ""])}
          ></i>
        </p>
      )}
    </div>
  );
}

export default TitleScreen;
