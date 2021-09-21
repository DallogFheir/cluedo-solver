import "./CardSelectScreen.css";

function CardSelectScreen({ players, gameElements }) {
  const howManyCards = Math.floor(18 / players.length);

  return (
    <div className="card-select-screen fade-in">
      <p>Wybierz swoje karty:</p>
      <form className="card-form">
        {Array(howManyCards)
          .fill(0)
          .map((_, idx) => (
            <input key={idx} />
          ))}
      </form>
    </div>
  );
}

export default CardSelectScreen;
