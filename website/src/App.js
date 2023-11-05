import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers";
import {useState, useEffect} from "react";


function App() {
  const [books, setBooks] = useState();
  const [contract, setContract] = useState();
  
  const [newBookTitle, setNewBookTitle] = useState();
  const [bookIndex, setBookIndex] = useState();

  async function accessContract () {
    const contractAddress ="0x0f9997BFc25C9BcD28601F660646aaC58C1b0C5c";
    const contractABI = [
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "_title",
            "type": "string"
          }
        ],
        "name": "addBook",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_id",
            "type": "uint256"
          }
        ],
        "name": "removeBook",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "viewShelf",
        "outputs": [
          {
            "internalType": "string[]",
            "name": "",
            "type": "string[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];
    let signer;

    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        await provider.send("eth_requestAccounts", []);
        signer = await provider.getSigner();  
      } catch (error) {
        alert(error);
        return(<div>please connnect your acccount after reloading the site</div>);
      }
    } else {
      alert(" you don't have a web3 wallet")
      return (
        <div>please install a web3 wallet like metamask</div>
      )
    }
    try {
      setContract(new ethers.Contract(contractAddress, contractABI, signer));
      alert("contract connected successfully")
    } catch (error) {
      alert("error getting contract from blockchain\n make sure you are on the sepolia testnet")
    }
  }

  async function updateShelf() {
    const shelf = (await contract.viewShelf());
    alert(shelf)

    function displayBook(book, index) {
      if (book != "") {
        return <div><span>book name: </span> <span>{book}</span> <span>   ||bookId: {index}</span> </div>
      }
    }

    setBooks(shelf.map(displayBook));
  }

  async function addABook() {
    try {
      const tx = await contract.addBook(newBookTitle);
      await tx.wait();
      updateShelf();
    } catch (error) {
      alert("transaction failed")
    }
  }

  async function removeABook() {
    try {
      const tx = await contract.removeBook(bookIndex);
      await tx.wait();
      updateShelf();
    } catch (error) {
      alert("transaction failed")
    }
  }

  
  return (
    <div className="App">
      <header className="App-header">
        <h3>Asabea's Library</h3>
        <p>have you connected your wallet?</p>
        <button onClick={accessContract}>Connect Wallet</button>
      </header>
      <home>
        <div> All Books </div>
        <button onClick={updateShelf}>refresh the book list</button>
        <books>{books}</books>
        <donations>
          <label>Enter the title of the book here</label>
          <input type="text" value={newBookTitle} onChange={event => (setNewBookTitle(event.target.value))}></input>
          <button onClick={addABook}>Add a Book to the library</button>
        </donations>
        <removals>
          <label>Enter the index of the book here</label>
          <input type="number" value={bookIndex} onChange={event => {setBookIndex(event.target.value)}}></input>
          <button onClick={removeABook}>remove a book from the library</button>
        </removals>
      </home>
    </div>
  );
}

export default App;
