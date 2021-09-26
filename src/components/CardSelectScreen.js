import "./CardSelectScreen.css";
import { useRef } from "react";

function CardSelectScreen({
  players,
  setPlayers,
  setCurrentScreen,
  gameElements,
}) {
  const howManyCards = Math.floor(18 / players.length);
  const playerCards = Array(howManyCards).fill("Ksiądz Zieliński");

  //   refs for selects
  const playerCardsRefs = [
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
    useRef(),
  ];
  playerCardsRefs.length = howManyCards;

  return (
    <div className="card-select-screen fade-in">
      <p>Wybierz swoje karty:</p>
      <form className="card-form">
        {playerCards.map((_, idx) => (
          <select
            key={idx}
            ref={playerCardsRefs[idx]}
            onChange={(e) => {
              // remove error shadow when changing to another value
              e.target.classList.remove("error-shadow");
              // modify playerCards
              playerCards[idx] = e.target.value;
            }}
          >
            <optgroup label="Podejrzani">
              {gameElements.suspects.map((suspect, idx) => (
                <option key={idx} value={suspect}>
                  {suspect}
                </option>
              ))}
            </optgroup>
            <optgroup label="Narzędzia zbrodni">
              {gameElements.tools.map((tool, idx) => (
                <option key={idx} value={tool}>
                  {tool}
                </option>
              ))}
            </optgroup>
            <optgroup label="Pomieszczenia">
              {gameElements.rooms.map((room, idx) => (
                <option key={idx} value={room}>
                  {room}
                </option>
              ))}
            </optgroup>
          </select>
        ))}
      </form>
      <div className="next-btn-container">
        <i
          className="next-btn bi bi-arrow-right-circle-fill"
          onClick={() => {
            // check for duplicates

            const counter = {};
            playerCards.forEach((el) => {
              if (Object.keys(counter).includes(el)) {
                counter[el] += 1;
              } else {
                counter[el] = 1;
              }
            });

            const duplicates = [];
            for (const key in counter) {
              if (counter[key] > 1) {
                duplicates.push(key);
              }
            }

            const duplicateIndices = [];
            for (let i = 0; i < playerCards.length; i++) {
              if (duplicates.includes(playerCards[i])) {
                duplicateIndices.push(i);
              }
            }

            for (const ref of playerCardsRefs) {
              ref.current.classList.remove("error-shadow");
            }

            let allowNext = true;
            for (const idx of duplicateIndices) {
              const ref = playerCardsRefs[idx];
              ref.current.classList.add("error-shake");
              ref.current.classList.add("error-shadow");
              setTimeout(() => {
                ref.current.classList.remove("error-shake");
              }, 1000);
              allowNext = false;
            }

            // check for 6 suspects or 6 tools
            debugger;
            for (const element of [gameElements.suspects, gameElements.tools]) {
              if (
                element.filter((el) => !playerCards.includes(el)).length === 0
              ) {
                allowNext = false;
                for (const ref of playerCardsRefs) {
                  ref.current.classList.add("error-shake");
                  ref.current.classList.add("error-shadow");
                  setTimeout(() => {
                    ref.current.classList.remove("error-shake");
                  }, 1000);
                }
                break;
              }
            }

            if (allowNext) {
              // go to next screen
              // put all cards that player doesn't have to notCards
              let notCards = [];
              for (const notType of ["suspects", "tools", "rooms"]) {
                const notTypeCards = gameElements[notType].filter(
                  (el) => !playerCards.includes(el)
                );

                notCards = [...notCards, ...notTypeCards];
              }

              players[0].cards = playerCards;
              players[0].notCards = notCards;

              //   put player's cards into notCards of other players
              for (const player of players) {
                if (player !== players[0]) {
                  player.notCards = [...playerCards];
                }
              }

              setPlayers([...players]);
              setCurrentScreen("MainScreen");
            }
          }}
        ></i>
      </div>
    </div>
  );
}

export default CardSelectScreen;
