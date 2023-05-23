import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";
import { Component } from "react";
import "./Lottery.css"; 

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "WAITING on transaction success..." });
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });
    this.setState({ message: "You have been entered" });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "WAITING on transaction success..." });
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });
    this.setState({ message: "Winner has been picked!" });
  };

  render() {
    return (
      <div className="lottery-container">
        <h2 className="lottery-heading">Lottery Contract</h2>
        <p className="lottery-info">
          This contract is managed by {this.state.manager}. There are currently{" "}
          {this.state.players.length} people entered into the lottery competing
          to win {web3.utils.fromWei(this.state.balance, "ether")} ether!
        </p>
        <hr />

        <form onSubmit={this.onSubmit}>
          <h4 className="lottery-subheading">Want to try your luck?</h4>
          <div className="form-group">
            <label className="input-label">Amount of ether to enter</label>
            <input
              className="input-field"
              value={this.state.value}
              onChange={(e) => this.setState({ value: e.target.value })}
            />
          </div>
          <button className="enter-button">Enter</button>
        </form>

        <h4 className="pick-winner-heading">Ready to pick a winner?</h4>
        <button className="pick-winner-button" onClick={this.onClick}>
          Pick a winner!
        </button>
        <hr />
        <h1 className="message">{this.state.message}</h1>
      </div>
    );
  }}

export default App;
