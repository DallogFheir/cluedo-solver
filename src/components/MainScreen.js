import "./MainScreen.css";
import { useState, useEffect, useRef } from "react";

function MainScreen({
  setCurrentScreen,
  players,
  setPlayers,
  enquiries,
  setEnquiries,
  background,
  gameElements,
}) {
  const calculatePlayersCards = (player) =>
    gameElements.suspects
      .concat(gameElements.tools)
      .concat(gameElements.rooms)
      .filter((el) => !player.cards.has(el) && !player.notCards.has(el));

  const mainLogic = () => {
    while (true) {
      const playersAtStart = [...players];

      //   CHECK FOR SOLUTION THAT CAME ABOUT BY REJECTING OTHERS
      // push the solution to everyone's notCards
      for (const cardType of Object.keys(gameElements)) {
        const length = gameElements[cardType].length;

        //   for each type, check if exactly n-1 cards (for n of possible cards) are in someone's cards
        const inSomeonesCards = [];
        for (const card of gameElements[cardType]) {
          for (const player of players) {
            if (player.cards.has(card)) {
              inSomeonesCards.push(card);
              break;
            }
          }
        }

        if (inSomeonesCards.length === length - 1) {
          const solution = gameElements[cardType].filter(
            (card) => !inSomeonesCards.includes(card)
          )[0];

          // push to everyone's notCards
          for (const player of players) {
            player.notCards.add(solution);
          }
        }
      }

      // CHECK FOR CARDS THAT N-1 PLAYERS DON'T HAVE
      // if solution is known, push them to the remaining player
      for (const cardType of Object.keys(gameElements)) {
        const ifSolution =
          gameElements[cardType].filter(
            (card) =>
              players.filter((player) => player.notCards.has(card)).length ===
              players.length
          ).length > 0;

        if (ifSolution) {
          for (const card of gameElements[cardType]) {
            const whoHasInNotCards = [];
            for (const player of players) {
              if (player.notCards.has(card)) {
                whoHasInNotCards.push(player);
              }
            }

            if (whoHasInNotCards.length === players.length - 1) {
              const remainingPlayer = players.filter(
                (player) => !whoHasInNotCards.includes(player)
              )[0];
              remainingPlayer.cards.add(card);
            }
          }
        }
      }

      // CHECK IF PLAYER HAS MAXIMUM NUMBER OF CARDS
      // if so, push everything else to notCards
      const howManyCards = Math.floor(18 / players.length);

      for (const player of players) {
        if (player.cards.size === howManyCards) {
          player.notCards = new Set(
            gameElements.suspects
              .concat(gameElements.tools)
              .concat(gameElements.rooms)
              .filter((el) => !player.cards.has(el))
          );
        }
      }

      // CHECK ENQUIRIES
      // if player was asked 3 cards, and they don't have 2 of them,
      // they have to have the other 1
      for (const enquiry of enquiries) {
        const enquiryPlayer = players.filter(
          (player) => player.player === enquiry.player
        )[0];

        const cards = enquiry.enquiryCards.filter(
          (card) => !enquiryPlayer.notCards.has(card)
        );

        if (cards.length === 1) {
          enquiryPlayer.cards.add(cards[0]);
          for (const player of players) {
            if (player !== enquiryPlayer) {
              player.notCards.add(cards[0]);
            }
          }
        }
      }

      // break if nothing changed
      if (
        players.every(
          (player) =>
            [...player.cards].filter(
              (card) =>
                !playersAtStart
                  .filter(
                    (playerAtStart) => playerAtStart.player === player.player
                  )[0]
                  .cards.has(card)
            ).length === 0 &&
            [...player.notCards].filter(
              (card) =>
                !playersAtStart
                  .filter(
                    (playerAtStart) => playerAtStart.player === player.player
                  )[0]
                  .notCards.has(card)
            ).length === 0
        )
      ) {
        break;
      }
    }
  };

  const [popup, setPopup] = useState(false);
  const [popupType, setPopupType] = useState(null);

  const popupRef = useRef();

  //   states to handle events
  const [whoShowed, setWhoShowed] = useState(players[1]);
  let whatWasShown = calculatePlayersCards(whoShowed)[0];

  const [whoDidntHaveCards, setWhoDidntHaveCards] = useState(players[1]);
  let whatSomeoneDidntHave = {
    suspect: gameElements.suspects.filter(
      (el) =>
        !players
          .filter((player) => player === whoDidntHaveCards)[0]
          .cards.has(el)
    )[0],
    tool: gameElements.tools.filter(
      (el) =>
        !players
          .filter((player) => player === whoDidntHaveCards)[0]
          .cards.has(el)
    )[0],
    room: gameElements.rooms.filter(
      (el) =>
        !players
          .filter((player) => player === whoDidntHaveCards)[0]
          .cards.has(el)
    )[0],
  };

  const [whoShowedToSomeoneElse, setWhoShowedToSomeoneElse] = useState(
    players[1]
  );
  let whatSomeoneShowedToSomeoneElse = {
    suspect: gameElements.suspects.filter((el) => {
      const player = players.filter(
        (player) => player.player === whoShowedToSomeoneElse.player
      )[0];

      return !player.cards.has(el);
    })[0],
    tool: gameElements.tools.filter((el) => {
      const player = players.filter(
        (player) => player.player === whoShowedToSomeoneElse.player
      )[0];

      return !player.cards.has(el);
    })[0],
    room: gameElements.rooms.filter((el) => {
      const player = players.filter(
        (player) => player.player === whoShowedToSomeoneElse.player
      )[0];

      return !player.cards.has(el);
    })[0],
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
  }, [background, popup, players]);

  const popups = {
    "someone-showed-me": (
      <div className="popup" ref={popupRef}>
        <p className="popup-title">ktoś pokazał mi kartę</p>
        <p className="popup-text">Wybierz osobę, która pokazała Ci kartę:</p>
        <select
          className="popup-select"
          onChange={(e) => {
            const playerName = e.target.value;

            for (const player of players.slice(1)) {
              if (player.player === playerName) {
                setWhoShowed(player);
              }
            }
          }}
        >
          {players
            .filter((player) => calculatePlayersCards(player).length !== 0)
            .map((player, idx) => (
              <option key={idx}>{player.player}</option>
            ))}
        </select>
        <p className="popup-text">Wybierz pokazaną Ci kartę:</p>
        <select
          className="popup-select"
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
                player.cards.add(whatWasShown);
                for (const otherPlayer of players.slice(1)) {
                  if (otherPlayer !== whoShowed) {
                    otherPlayer.notCards.add(whatWasShown);
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
    "someone-showed-someone-else": (
      <div className="popup" ref={popupRef}>
        <p className="popup-title">ktoś pokazał kartę komuś innemu</p>
        <p className="popup-text">Wybierz osobę, która pokazała kartę:</p>
        <select
          onChange={(e) => {
            const playerName = e.target.value;

            for (const player of players.slice(1)) {
              if (player.player === playerName) {
                setWhoShowedToSomeoneElse(player);
              }
            }
          }}
        >
          {players.slice(1).map((player, idx) => (
            <option key={idx}>{player.player}</option>
          ))}
        </select>
        <p className="popup-text">Wybierz karty, o które ktoś pytał:</p>
        <select
          className="popup-select"
          onChange={(e) => {
            whatSomeoneShowedToSomeoneElse.suspect = e.target.value;
          }}
        >
          {gameElements.suspects
            .filter((el) => {
              // filters out cards that player already has shown (there's no point in asking then)
              const player = players.filter(
                (player) => player.player === whoShowedToSomeoneElse.player
              )[0];

              return !player.cards.has(el);
            })
            .map((suspect, idx) => (
              <option key={idx} value={suspect}>
                {suspect}
              </option>
            ))}
        </select>
        <select
          className="popup-select"
          onChange={(e) => {
            whatSomeoneShowedToSomeoneElse.tool = e.target.value;
          }}
        >
          {gameElements.tools
            .filter((el) => {
              // filters out cards that player already has shown (there's no point in asking then)
              const player = players.filter(
                (player) => player.player === whoShowedToSomeoneElse.player
              )[0];

              return !player.cards.has(el);
            })
            .map((tool, idx) => (
              <option key={idx} value={tool}>
                {tool}
              </option>
            ))}
        </select>
        <select
          className="popup-select"
          onChange={(e) => {
            whatSomeoneShowedToSomeoneElse.room = e.target.value;
          }}
        >
          {gameElements.rooms
            .filter((el) => {
              // filters out cards that player already has shown (there's no point in asking then)
              const player = players.filter(
                (player) => player.player === whoShowedToSomeoneElse.player
              )[0];

              return !player.cards.has(el);
            })
            .map((room, idx) => (
              <option key={idx} value={room}>
                {room}
              </option>
            ))}
        </select>
        <i
          className="popup-icon bi bi-check-circle-fill"
          onClick={() => {
            enquiries.push({
              player: whoShowedToSomeoneElse.player,
              enquiryCards: Object.values(whatSomeoneShowedToSomeoneElse),
            });

            setEnquiries([...enquiries]);
            setPopup(false);
          }}
        ></i>
      </div>
    ),
    "someone-didnt-have-cards": (
      <div className="popup" ref={popupRef}>
        <p className="popup-title">ktoś nie miał kart</p>
        <p className="popup-text">Wybierz osobę, która nie miała kart:</p>
        <select
          className="popup-select"
          onChange={(e) => {
            const playerName = e.target.value;

            for (const player of players) {
              if (player.player === playerName) {
                setWhoDidntHaveCards(player);
              }
            }
          }}
        >
          {players.slice(1).map((player, idx) => (
            <option key={idx}>{player.player}</option>
          ))}
        </select>
        <p className="popup-text">Wybierz karty, których ktoś nie miał:</p>
        <select
          className="popup-select"
          onChange={(e) => {
            whatSomeoneDidntHave.suspect = e.target.value;
          }}
        >
          {gameElements.suspects
            .filter((suspect) => !whoDidntHaveCards.cards.has(suspect))
            .map((suspect, idx) => (
              <option key={idx}>{suspect}</option>
            ))}
        </select>
        <select
          className="popup-select"
          onChange={(e) => {
            whatSomeoneDidntHave.tool = e.target.value;
          }}
        >
          {gameElements.tools
            .filter((tool) => !whoDidntHaveCards.cards.has(tool))
            .map((tool, idx) => (
              <option key={idx}>{tool}</option>
            ))}
        </select>
        <select
          className="popup-select"
          onChange={(e) => {
            whatSomeoneDidntHave.room = e.target.value;
          }}
        >
          {gameElements.rooms
            .filter((room) => !whoDidntHaveCards.cards.has(room))
            .map((room, idx) => (
              <option key={idx}>{room}</option>
            ))}
        </select>
        <i
          className="popup-icon bi bi-check-circle-fill"
          onClick={() => {
            //   pushes what someone didn't have into their notCards
            const player = players.filter(
              (player) => player === whoDidntHaveCards
            )[0];

            player.notCards = new Set([
              ...player.notCards,
              ...Object.values(whatSomeoneDidntHave),
            ]);

            setWhoDidntHaveCards(players[1]);
            setPlayers([...players]);
            setPopup(false);
          }}
        ></i>
      </div>
    ),
  };

  //   only run mainLogic if there's no popup
  if (!popup) {
    mainLogic();
  }
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
                setWhoShowed(
                  players.filter(
                    (player) => calculatePlayersCards(player).length !== 0
                  )[0]
                );
                setPopup(true);
                setPopupType("someone-showed-me");
              }}
            >
              ktoś pokazał mi kartę
            </button>
            <button
              className="btn btn-light event-btn"
              onClick={() => {
                setWhoShowedToSomeoneElse(players[1]);
                setPopup(true);
                setPopupType("someone-showed-someone-else");
              }}
            >
              ktoś pokazał kartę komuś innemu
            </button>
            <button
              className="btn btn-light event-btn"
              onClick={() => {
                setWhoDidntHaveCards(players[1]);
                setPopup(true);
                setPopupType("someone-didnt-have-cards");
              }}
            >
              ktoś nie miał kart
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
                          (player) => !player.notCards.has(suspect)
                        ).length === 0
                          ? "solution"
                          : players.filter((player) =>
                              player.cards.has(suspect)
                            ).length > 0 ||
                            gameElements.suspects
                              .map(
                                (suspect) =>
                                  players.filter(
                                    (player) => !player.notCards.has(suspect)
                                  ).length === 0
                              )
                              .some((el) => el)
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
                          player.notCards.has(suspect) ? "not-card" : "",
                          "table-item",
                        ].join(" ")}
                      >
                        {player.cards.has(suspect)
                          ? "✓"
                          : player.notCards.has(suspect)
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
                        players.filter((player) => !player.notCards.has(tool))
                          .length === 0
                          ? "solution"
                          : players.filter((player) => player.cards.has(tool))
                              .length > 0 ||
                            gameElements.tools
                              .map(
                                (tool) =>
                                  players.filter(
                                    (player) => !player.notCards.has(tool)
                                  ).length === 0
                              )
                              .some((el) => el)
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
                          player.notCards.has(tool) ? "not-card" : "",
                          "table-item",
                        ].join(" ")}
                      >
                        {player.cards.has(tool)
                          ? "✓"
                          : player.notCards.has(tool)
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
                        players.filter((player) => !player.notCards.has(room))
                          .length === 0
                          ? "solution"
                          : players.filter((player) => player.cards.has(room))
                              .length > 0 ||
                            gameElements.rooms
                              .map(
                                (room) =>
                                  players.filter(
                                    (player) => !player.notCards.has(room)
                                  ).length === 0
                              )
                              .some((el) => el)
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
                          player.notCards.has(room) ? "not-card" : "",
                          "table-item",
                        ].join(" ")}
                      >
                        {player.cards.has(room)
                          ? "✓"
                          : player.notCards.has(room)
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
        <div className="row mt-5">
          <p className="start-anew">
            <span
              className="start-anew-text"
              onClick={() => {
                if (window.confirm("Czy na pewno chcesz zacząć od początku?")) {
                  localStorage.removeItem("savedState");
                  setCurrentScreen("TitleScreen");
                  setPlayers([
                    { player: "", cards: new Set(), notCards: new Set() },
                    { player: "", cards: new Set(), notCards: new Set() },
                    { player: "", cards: new Set(), notCards: new Set() },
                  ]);
                  setEnquiries([]);
                }
              }}
            >
              Zacznij od początku
            </span>
          </p>
        </div>
      </div>
      {popup && popups[popupType]}
    </>
  );
}

export default MainScreen;
