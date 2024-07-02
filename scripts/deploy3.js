import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import LockArtifact from "./contracts/Lock.json";
import contractAddress from "./contracts/contract-address.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [lock, setLock] = useState(null);
  const [unlockTime, setUnlockTime] = useState(0 );
  const [currentTime, setCurrentTime] = useState(Math.round(Date.now() / 1000));

  useEffect(() => {
    const init = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const signer = provider.getSigner();
      setSigner(signer);

      const lock = new ethers.Contract(
        contractAddress.Lock,
        LockArtifact.abi,
        signer
      );
      setLock(lock);

      const unlockTime = await lock.unlockTime();
      setUnlockTime(unlockTime.toNumber());
    };

    init();

    const interval = setInterval(() => {
      setCurrentTime(Math.round(Date.now() / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleWithdraw = async () => {
    await lock.withdraw();
  };

  return (
    <div>
      <h1>Lock Contract</h1>
      <div>Unlock Time: {new Date(unlockTime * 1000).toString()}</div>
      <div>Current Time: {new Date(currentTime * 1000).toString()}</div>
      {currentTime >= unlockTime ? (
        <button onClick={handleWithdraw}>Withdraw</button>
      ) : (
        <div>Cannot withdraw yet</div>
      )}
    </div>
  );
}

export default App;
