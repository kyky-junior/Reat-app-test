import { useState, useEffect } from 'react';
import React from 'react';
import { ethers } from 'ethers';
import './App.css';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const abi = [
  "event Withdrawal(uint amount, uint when)",
  "function withdraw() public"
];

function App() {
  const [unlockTime, setUnlockTime] = useState(1);
  const [balance, setBalance] = useState(null);
  const [currentTime, setCurrentTime] = useState(Math.round(Date.now() / 1000));

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = new provider();
        const contract = new ethers.Contract(contractAddress, abi, signer)
        const balance = await provider.getBalance(contractAddress);
        const WithdrawunlockTime = await contract.UnlockTime();
        
        setUnlockTime(parseInt(WithdrawunlockTime));
        setBalance(ethers.utils.formatEther(balance));

        contract.on("Withdrawal", (amount, unlockTime) => {
          console.log(`Withdrawal event emitted: amount=${ethers.utils.formatEther(amount)}, unlocktime=${unlockTime} `);
          setBalance(0);
        });
      }
    };

    init();

  },[]);

  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentTime(Math.floor(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  async function makewithdraw() {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner;
      const contract = new ethers.Contract(contractAddress, abi, signer)

      try {
        const MW = await contract.Withdrawal();
        await MW.deployed();
        console.log('withdrawal successful');
      } catch(error) {
        console.log('error pending withdrawal', error);
      }
    }
  };

  return (
    <div className="App">
      <header className="App-header">
       <h1>Lock Contract Data</h1>
       <p>Unlock Time: {new Date(unlockTime * 1000).toLocaleString()}</p>
       <p>Current Time: {new Date(currentTime * 1000).toLocaleString()}</p>
       <p>{currentTime >= unlockTime ? "You can withdraw now!" : "You can't withdraw yet."}</p>
       <p>Contract Balance: {balance} ETH</p>
       {currentTime >= unlockTime && (
          <button onClick={makewithdraw}>Withdraw</button>
        )}
       </header>
    </div>
  );
}

export default App;
