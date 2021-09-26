import "./MainScreen.css";
import { useState } from "react";

function MainScreen({ players, setPlayers, gameElements }) {
  const [popup, setPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);

  let whoShowed = players[1].player;
  let whatWasShown = null;

  const popups = {
    "someone-showed-me": (
      <div className="popup">
        <p className="popup-title">ktoś pokazał mi kartę</p>
        <p className="popup-text">Wybierz osobę, która pokazała Ci kartę:</p>
        <select
          onChange={(e) => {
            whoShowed = e.target.value;
          }}
        >
          {players.slice(1).map((player, idx) => (
            <option key={idx}>{player.player}</option>
          ))}
        </select>
        <p className="popup-text">Wybierz pokazaną Ci kartę:</p>
        <select
          onChange={(e) => {
            whatWasShown = e.target.value;
            // TODO
            // make it so it ignores cards whose ownership is known
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
        <i
          className="popup-icon bi bi-check-circle-fill"
          onClick={() => {
            //   handles pushing what was shown into cards and notCards
            for (const player of players.slice(1)) {
              if (player.player === whoShowed) {
                player.cards.push(whatWasShown);
                debugger;
                for (const otherPlayer of players.slice(1)) {
                  console.log(players[2].notCards);
                  if (otherPlayer.player !== whoShowed) {
                    otherPlayer.notCards.push(whatWasShown);
                  }
                }
                setPlayers([...players]);
                setPopup(false);
                break;
              }
            }
          }}
        ></i>
      </div>
    ),
  };

  return (
    <>
      <div
        className={["container", "fade-in", popup ? "inactive" : ""].join(" ")}
      >
        <div className="row mb-5">
          <div className="col-12 events">
            <p className="event-title">Wydarzenia</p>
            <button
              className="btn btn-light event-btn"
              onClick={() => {
                setPopup(true);
                setPopupType("someone-showed-me");
              }}
            >
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
                  <td className="header-text" colSpan="7">
                    Podejrzani
                  </td>
                </tr>
                {gameElements.suspects.map((suspect, susIdx) => (
                  <tr key={susIdx}>
                    <td>{suspect}</td>
                    {players.map((player, idx) => (
                      <td
                        key={idx}
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
                  <td className="header-text" colSpan="7">
                    Narzędzia zbrodni
                  </td>
                </tr>
                {gameElements.tools.map((tool, toolIdx) => (
                  <tr key={toolIdx}>
                    <td>{tool}</td>
                    {players.map((player, idx) => (
                      <td
                        key={idx}
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
                  <td className="header-text" colSpan="7">
                    Pomieszczenia
                  </td>
                </tr>
                {gameElements.rooms.map((room, roomIdx) => (
                  <tr key={roomIdx}>
                    <td>{room}</td>
                    {players.map((player, idx) => (
                      <td
                        key={idx}
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
      {popup && popups[popupType]}
    </>
  );
}

export default MainScreen;
