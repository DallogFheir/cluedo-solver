import "./MainScreen.css";

function MainScreen({ players, gameElements }) {
  return (
    <div className="container fade-in">
      <div className="row">
        <div className="col-lg-6 col-12">
          <table className="table text-light">
            <thead>
              <tr>
                <th></th>
                {players.map((player, idx) => (
                  <th key={idx}>{player.player}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* SUSPECTS */}
              <tr>
                <td className="header-text" colSpan="4">
                  Podejrzani
                </td>
              </tr>
              {gameElements.suspects.map((suspect) => (
                <tr>
                  <td>{suspect}</td>
                  {players.map((player) => (
                    <td
                      className={
                        player.notCards.includes(suspect) ? "not-card" : ""
                      }
                    >
                      {player.cards.includes(suspect)
                        ? "✓"
                        : player.notCards.includes(suspect)
                        ? "✕"
                        : ""}
                    </td>
                  ))}
                </tr>
              ))}
              {/* TOOLS */}
              <tr>
                <td className="header-text" colSpan="4">
                  Narzędzia zbrodni
                </td>
              </tr>
              {gameElements.tools.map((tool) => (
                <tr>
                  <td>{tool}</td>
                  {players.map((player) => (
                    <td
                      className={
                        player.notCards.includes(tool) ? "not-card" : ""
                      }
                    >
                      {player.cards.includes(tool)
                        ? "✓"
                        : player.notCards.includes(tool)
                        ? "✕"
                        : ""}
                    </td>
                  ))}
                </tr>
              ))}
              {/* ROOMS */}
              <tr>
                <td className="header-text" colSpan="4">
                  Pomieszczenia
                </td>
              </tr>
              {gameElements.rooms.map((room) => (
                <tr>
                  <td>{room}</td>
                  {players.map((player) => (
                    <td
                      className={
                        player.notCards.includes(room) ? "not-card" : ""
                      }
                    >
                      {player.cards.includes(room)
                        ? "✓"
                        : player.notCards.includes(room)
                        ? "✕"
                        : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="w-100 d-lg-none"></div>
        <div className="col-lg-6 col-12">tekst2</div>
      </div>
    </div>
  );
}

export default MainScreen;
