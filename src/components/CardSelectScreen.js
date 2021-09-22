import "./CardSelectScreen.css";
import { useEffect } from "react";

function CardSelectScreen({
  players,
  playerCards,
  setPlayerCards,
  gameElements,
}) {
  // at first render,
  useEffect(() => {
    const howManyCards = Math.floor(18 / players.length);
    playerCards.length = howManyCards;
    playerCards.fill("Ksiądz Zieliński");
    setPlayerCards([...playerCards]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="card-select-screen fade-in">
      <p>Wybierz swoje karty:</p>
      <form className="card-form">
        {playerCards.map((_, idx) => (
          <select
            key={idx}
            onChange={(e) => {
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
    </div>
  );
}

export default CardSelectScreen;
