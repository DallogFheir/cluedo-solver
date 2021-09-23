function MainScreen({ players, gameElements }) {
  return (
    <div className="container fade-in">
      <div className="row">
        <div className="col-lg-6 col-12">
          <table className="table text-light">
            <thead>
              <tr>
                <th></th>
                {players.map((player) => (
                  <th>{player.player}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr colspan="3 text-center">Pomieszczenia</tr>
              {gameElements.rooms.map((room) => (
                <tr>
                  <td>{room}</td>
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
