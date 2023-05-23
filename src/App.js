import React, { useState, useEffect } from "react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";
import "./Lottery.css";

function App() {
  const [manager, setManager] = useState("");
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState("");

  async function fetchData() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    setManager(manager);
    setPlayers(players);
    setBalance(balance);
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function onSubmit(event) {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transaction success...");

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });

    setMessage("You have been entered!");
    fetchData()
  }

  async function onClick() {
    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting on transaction success...");

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    setMessage("A winner has been picked!");
  }

  return (
    <div className="lottery-container">
      <h2 className="lottery-heading">Lottery Contract</h2>
      <p className="lottery-info">
        This contract is managed by {manager}. There are currently{" "}
        {players.length} people entered into the lottery competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether!
      </p>
      <hr />

      <form onSubmit={onSubmit}>
        <h4 className="lottery-subheading">Want to try your luck?</h4>
        <div className="form-group">
          <label className="input-label">Amount of ether to enter</label>
          <input
            className="input-field"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button className="enter-button">Enter</button>
      </form>

      <h4 className="pick-winner-heading">Ready to pick a winner?</h4>
      <button className="pick-winner-button" onClick={onClick}>
        Pick a winner!
      </button>
      <hr />
      <h1 className="message">{message}</h1>
    </div>
  );
}

export default App;
