import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";

const MetaMask = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [connect, setConnect] = useState(false);
  const [lightColor, setLightColor] = useState("red");
  console.log("currentAccount: ", currentAccount);

  // get window path
  const router = useRouter();
  const { id } = router.query;
  const idFromPath = router.asPath.split("/")[2];

  const failMessage = "😥 Connect to Metamask using the top right button.";
  const successMessage = "🎉 You're connected to Metamask!";

  const INFURA_ID = "ccefb0c2bf974a7c94270140807be9f3";

  const provider = new ethers.providers.JsonRpcProvider(
    `https://mainnet.infura.io/v3/${INFURA_ID}`
  );

  // access all accounts in metamask
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return;

    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    console.log("accounts: ", accounts);

    const Name = await window.ethereum.request({ method: "eth_chainId" });
    console.log("Name: ", Name);

    // if there is an account in metamask, set the first account to currentAccount
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
      setConnect(true);
      setLightColor("green"); // update the light color to green
    } else {
      console.log("No accounts found");
    }

    const address = "0xe688b84b23f322a994A53dbF8E15FA82CDB71127";
    const balance = await provider.getBalance(address);
    const showBalance = `${ethers.utils.formatEther(balance)} ETH`;
    console.log("balance: ", showBalance);
  };

  // user connects to metamask
  const ConnectWallet = async () => {
    if (!window.ethereum) return console.log(failMessage);

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setCurrentAccount(accounts[0]);
    setConnect(true);
    setLightColor("green"); // update the light color to green
  };

  useEffect(() => {
    async function saveId() {
      if (currentAccount) {
        const res = await fetch("/api/saveId", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idFromPath,
            metamaskWalletAddress: currentAccount,
          }),
        });
        if (!res.ok) {
          console.error("Error saving idFromPath:", res.statusText);
        }
      }
    }

    saveId();
  }, [currentAccount]);

  //---------------------------------------------
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const disconnectWallet = () => {
    if (!window.ethereum) return;

    if (typeof window.ethereum.disconnect !== "function") {
      console.error("disconnect function not available");
      return;
    }

    window.ethereum.disconnect();
    setCurrentAccount("");
    setConnect(false);
  };

  return (
    <div className="metamask">
      <div className="light" style={{ backgroundColor: lightColor }}></div>

      <div>
        <img
          className="metamaskIcon"
          src="https://i.postimg.cc/D0wQSjPy/metamask-icon.png"
          alt="metamask"
        />
      </div>
      {!currentAccount && !connect ? (
        <button onClick={() => ConnectWallet()}>Connect Wallet</button>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexDirection: "column",
            }}
          >
            <label>Wallet Address:</label>
            <p
              className="walletAddress"
              style={{ fontWeight: "normal", fontSize: "12px" }}
            >
              {currentAccount}
            </p>
          </div>
          <div>
            <button className="metaButton" onClick={() => disconnectWallet()}>
              Disconnect Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetaMask;
