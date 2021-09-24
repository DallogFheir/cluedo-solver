import "./MainScreen.css";

function MainScreen({ players, gameElements }) {
  return (
    <div className="container fade-in">
      <div className="row mb-5">
        <div className="col-12 events">
          <p className="event-title">Wydarzenia</p>
          <button className="btn btn-light event-btn">
            ktoś pokazał mi kartę
          </button>
          <button className="btn btn-light event-btn">
            ktoś pokazał komuś innemu kartę
          </button>
          <button className="btn btn-light event-btn">
            nikt nie miał kart
          </button>
        </div>
      </div>
      <div className="row mt-5">
        {/* SUSPECTS */}
        <div className="col-lg-4 col-12">
          <table className="table text-light">
            <thead>
              <tr>
                <th></th>
                {players.map((player, idx) => (
                  <th key={idx} className="table-item">
                    {player.player}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
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
                      className={[
                        player.notCards.includes(suspect) ? "not-card" : "",
                        "table-item",
                      ].join(" ")}
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
            </tbody>
          </table>
        </div>
        <div className="w-100 d-lg-none"></div>
        {/* TOOLS */}
        <div className="col-lg-4 col-12">
          <table className="table text-light">
            <thead>
              <tr>
                <th></th>
                {players.map((player, idx) => (
                  <th key={idx} className="table-item">
                    {player.player}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
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
                      className={[
                        player.notCards.includes(tool) ? "not-card" : "",
                        "table-item",
                      ].join(" ")}
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
            </tbody>
          </table>
        </div>
        <div className="w-100 d-lg-none"></div>
        {/* ROOMS */}
        <div className="col-lg-4 col-12">
          <table className="table text-light">
            <thead>
              <tr>
                <th></th>
                {players.map((player, idx) => (
                  <th key={idx} className="table-item">
                    {player.player}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
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
                      className={[
                        player.notCards.includes(room) ? "not-card" : "",
                        "table-item",
                      ].join(" ")}
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
      </div>
    </div>
  );
}

export default MainScreen;
