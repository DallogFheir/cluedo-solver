import "./TitleScreen.css";
import { useEffect, useMemo } from "react";

function TitleScreen({ players, setPlayers, setCurrentScreen }) {
  const refs = useMemo(() => [null, null, null, null, null, null], []);

  //   focus last input
  useEffect(() => {
    const input = refs[players.length - 1];
    if (input) {
      input.focus();
    }
  }, [refs, players.length]);
  //   on first render, focus the first input
  useEffect(() => {
    refs[0].focus();
  }, [refs]);

  return (
    <div className="title-screen">
      <picture>
        <source srcSet="logo_big.png" media="(min-width: 900px)" />
        <source srcSet="logo_medium.png" media="(min-width: 500px)" />
        <img className="logo" src="logo_small.png" alt="logo" />
      </picture>
      <p>Wpisz imiona graczy:</p>
      <form className="player-form">
        {players.map((player, idx) => (
          <div key={idx} className="input">
            <input
              ref={(thisInput) => {
                refs[idx] = thisInput;
              }}
              placeholder={
                idx === 0 ? "Wpisz swoję imię." : "Wpisz imię gracza."
              }
              value={player.player ?? undefined}
              onChange={(e) => {
                players[idx].player = e.target.value;
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
            onClick={() => {
              setPlayers([
                ...players,
                { player: null, cards: new Set(), notCards: new Set() },
              ]);
            }}
          ></i>
        </p>
      )}
      <div className="next-btn-container">
        <i
          className="next-btn bi bi-arrow-right-circle-fill"
          onClick={() => {
            let allowNext = true;

            for (const ref of refs) {
              if (ref) {
                if (ref.value === "") {
                  ref.classList.add("error-shake");
                  ref.classList.add("error-shadow");
                  setTimeout(() => {
                    ref.classList.remove("error-shake");
                  }, 1000);
                  allowNext = false;
                }
              }
            }

            if (allowNext) {
              setCurrentScreen("CardSelectScreen");
            }
          }}
        ></i>
      </div>
    </div>
  );
}

export default TitleScreen;
