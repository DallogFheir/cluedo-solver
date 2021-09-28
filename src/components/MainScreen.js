import "./MainScreen.css";
import { useState, useEffect, useRef } from "react";

function MainScreen({ players, setPlayers, background, gameElements }) {
  const calculatePlayersCards = (player) =>
    gameElements.suspects
      .concat(gameElements.tools)
      .concat(gameElements.rooms)
      .filter(
        (el) => !player.cards.includes(el) && !player.notCards.includes(el)
      );

  const [popup, setPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);

  const popupRef = useRef();

  //   whoShowed is first player that can still show cards
  let whoShowedTemp;
  for (const player of players.slice(1)) {
    if (calculatePlayersCards(player) !== 0) {
      whoShowedTemp = player;
      break;
    }
  }

  //   states to handle events
  const [whoShowed, setWhoShowed] = useState(whoShowedTemp);
  let whatWasShown = calculatePlayersCards(whoShowed)[0];

  const [whoAsked, setWhoAsked] = useState(players[0]);
  let whatNoOneHad = {
    suspect: gameElements.suspects.filter(
      (el) =>
        !players
          .filter((el) => el !== whoAsked)
          .some((player) => player.cards.includes(el))
    )[0],
    tool: gameElements.tools.filter(
      (el) =>
        !players
          .filter((el) => el !== whoAsked)
          .some((player) => player.cards.includes(el))
    )[0],
    room: gameElements.rooms.filter(
      (el) =>
        !players
          .filter((el) => el !== whoAsked)
          .some((player) => player.cards.includes(el))
    )[0],
  };

  //   add listener to background to close the popup
  useEffect(() => {
    const backg = background.current;

    const closePopup = (e) => {
      if (popup) {
        const checkBtn = popupRef.current.querySelector("i");

        const popupChildren = Array.from(
          popupRef.current.querySelectorAll("*")
        );
        if (
          !popupChildren.includes(e.target) &&
          e.target !== popupRef.current &&
          e.target !== checkBtn
        ) {
          setPopup(false);
        }
      }
    };

    backg.addEventListener("click", closePopup);
    return () => {
      backg.removeEventListener("click", closePopup);
    };
  }, [background, popup]);

  const popups = {
    "someone-showed-me": (
      <div className="popup" ref={popupRef}>
        <p className="popup-title">ktoś pokazał mi kartę</p>
        <p className="popup-text">Wybierz osobę, która pokazała Ci kartę:</p>
        <select
          onChange={(e) => {
            const playerName = e.target.value;

            for (const player of players.slice(1)) {
              if (player.player === playerName) {
                setWhoShowed(player);
              }
            }
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
          }}
        >
          <optgroup label="Podejrzani">
            {gameElements.suspects
              .filter((el) => calculatePlayersCards(whoShowed).includes(el))
              .map((suspect, idx) => (
                <option key={idx} value={suspect}>
                  {suspect}
                </option>
              ))}
          </optgroup>
          <optgroup label="Narzędzia zbrodni">
            {gameElements.tools
              .filter((el) => calculatePlayersCards(whoShowed).includes(el))
              .map((tool, idx) => (
                <option key={idx} value={tool}>
                  {tool}
                </option>
              ))}
          </optgroup>
          <optgroup label="Pomieszczenia">
            {gameElements.rooms
              .filter((el) => calculatePlayersCards(whoShowed).includes(el))
              .map((room, idx) => (
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
              if (player === whoShowed) {
                player.cards.push(whatWasShown);
                for (const otherPlayer of players.slice(1)) {
                  if (otherPlayer !== whoShowed) {
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
    "no-one-had-cards": (
      <div className="popup" ref={popupRef}>
        <p className="popup-title">nikt nie miał kart</p>
        <p className="popup-text">Wybierz osobę, która pytała o karty:</p>
        <select
          onChange={(e) => {
            const playerName = e.target.value;

            for (const player of players) {
              if (player.player === playerName) {
                setWhoAsked(player);
              }
            }
          }}
        >
          {players.map((player, idx) => (
            <option key={idx}>{player.player}</option>
          ))}
        </select>
        <p className="popup-text">Wybierz karty, których nikt nie miał:</p>
        <select
          className="popup-select"
          onChange={(e) => {
            whatNoOneHad.suspect = e.target.value;
          }}
        >
          {gameElements.suspects
            .filter(
              (el) =>
                !players
                  .filter((el) => el !== whoAsked)
                  .some((player) => player.cards.includes(el))
            )
            .map((suspect, idx) => (
              <option key={idx} value={suspect}>
                {suspect}
              </option>
            ))}
        </select>
        <select
          className="popup-select"
          onChange={(e) => {
            whatNoOneHad.tool = e.target.value;
          }}
        >
          {gameElements.tools
            .filter(
              (el) =>
                !players
                  .filter((el) => el !== whoAsked)
                  .some((player) => player.cards.includes(el))
            )
            .map((tool, idx) => (
              <option key={idx} value={tool}>
                {tool}
              </option>
            ))}
        </select>
        <select
          className="popup-select"
          onChange={(e) => {
            whatNoOneHad.room = e.target.value;
          }}
        >
          {gameElements.rooms
            .filter(
              (el) =>
                !players
                  .filter((el) => el !== whoAsked)
                  .some((player) => player.cards.includes(el))
            )
            .map((room, idx) => (
              <option key={idx} value={room}>
                {room}
              </option>
            ))}
        </select>
        <i
          className="popup-icon bi bi-check-circle-fill"
          onClick={() => {
            //   pushes what no one had into not cards
            for (const player of players.filter(
              (player) => player !== whoAsked
            )) {
              player.notCards.push(...Object.values(whatNoOneHad));
            }

            setPlayers([...players]);
            setPopup(false);
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
            <button
              className="btn btn-light event-btn"
              onClick={() => {
                setPopup(true);
                setPopupType("no-one-had-cards");
              }}
            >
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
                    <td
                      className={
                        players.filter(
                          (player) => !player.notCards.includes(suspect)
                        ).length === 0
                          ? "solution"
                          : players.filter((player) =>
                              player.cards.includes(suspect)
                            ).length > 0
                          ? "not-solution"
                          : ""
                      }
                    >
                      {suspect}
                    </td>
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
                    <td
                      className={
                        players.filter(
                          (player) => !player.notCards.includes(tool)
                        ).length === 0
                          ? "solution"
                          : players.filter((player) =>
                              player.cards.includes(tool)
                            ).length > 0
                          ? "not-solution"
                          : ""
                      }
                    >
                      {tool}
                    </td>
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
                    <td
                      className={
                        players.filter(
                          (player) => !player.notCards.includes(room)
                        ).length === 0
                          ? "solution"
                          : players.filter((player) =>
                              player.cards.includes(room)
                            ).length > 0
                          ? "not-solution"
                          : ""
                      }
                    >
                      {room}
                    </td>
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
