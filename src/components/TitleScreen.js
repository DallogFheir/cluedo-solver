// TODO
// make image responsive

import "./TitleScreen.css";
import { useRef } from "react";

function TitleScreen({ players, setPlayers, setCurrentScreen }) {
  const refs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  return (
    <div className="title-screen">
      <img src="logo.png" alt="logo" />
      <p>Wpisz imiona graczy:</p>
      <form className="player-form">
        {players.map((player, idx) => (
          <div key={idx} className="input">
            <input
              ref={refs[idx]}
              placeholder="Wpisz imię gracza..."
              value={player.player}
              onChange={(e) => {
                players[idx] = { player: e.target.value };
                setPlayers([...players]);
                e.target.classList.remove("error-shadow");
              }}
            />
            {idx >= 3 && (
              <i
                className="del-btn bi bi-x-circle-fill"
                onClick={() =>
                  setPlayers(players.filter((el) => el !== player))
                }
              ></i>
            )}
          </div>
        ))}
      </form>
      {players.length < 6 && (
        <p>
          Dodaj więcej graczy{" "}
          <i
            className="add-btn bi bi-plus-circle-fill"
            onClick={() => setPlayers([...players, { player: null }])}
          ></i>
        </p>
      )}
      <i
        className="next-btn bi bi-arrow-right-circle-fill"
        onClick={() => {
          let flag = true;

          for (const ref of refs) {
            if (ref.current) {
              if (ref.current.value === "") {
                ref.current.classList.add("error-shake");
                ref.current.classList.add("error-shadow");
                setTimeout(() => {
                  ref.current.classList.remove("error-shake");
                }, 1000);
                flag = false;
              }
            }
          }

          if (flag) {
            setCurrentScreen("CardSelectScreen");
          }
        }}
      ></i>
    </div>
  );
}

export default TitleScreen;
