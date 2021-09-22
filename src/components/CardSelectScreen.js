// TODO
// fix shake animation

import "./CardSelectScreen.css";
import { useEffect, useRef } from "react";

function CardSelectScreen({
  players,
  playerCards,
  setPlayerCards,
  setCurrentScreen,
  gameElements,
}) {
  const howManyCards = Math.floor(18 / players.length);

  // at first render, fill all selects with first item
  useEffect(() => {
    playerCards.length = howManyCards;
    playerCards.fill("Ksiądz Zieliński");
    setPlayerCards([...playerCards]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              setPlayerCards([...playerCards]);
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

            let flag = true;
            for (const idx of duplicateIndices) {
              const ref = playerCardsRefs[idx];
              ref.current.classList.add("error-shake");
              ref.current.classList.add("error-shadow");
              setTimeout(() => {
                ref.current.classList.remove("error-shake");
              }, 1000);
              flag = false;
            }

            // go to next screen
            if (flag) {
              setCurrentScreen("MainScreen");
            }
          }}
        ></i>
      </div>
    </div>
  );
}

export default CardSelectScreen;
