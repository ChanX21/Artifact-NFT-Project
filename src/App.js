// Import React and MetaMask SDK
import React, { useState } from 'react';
import { MetaMaskProvider, useSDK } from '@metamask/sdk-react';
import "./App.css"
import { ethers, provider } from "ethers";
import {abi} from "./abi/artifactABI" ;


// User Account connected - done
// Number of NFT minted 
// Contract address

// Define the App component
const App = () => {
  // Use the SDK hook to get the sdk object and other values
  const { sdk, connected } = useSDK();
  // Use a state hook to store the user's account
  const [account, setAccount] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const [contractInstance,setContractInstance] = useState();
  const [chainId,setChainId] = useState();
  const [provider,setProvider]=  useState();
  const [userMintCount,setUserMintCount]=  useState();
  const [receipientAddress, setReceipientAddress] = useState("");


  
  // Define a function to connect to MetaMask
  const connect = async () => {
    try {
      // Request the user's accounts from MetaMask
      const accounts = await sdk?.connect();
      console.log({accounts})
      const contractAddress = "0xa3199EBC0F809dddfF6eB9a0f38AD8071B11656a";    
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      let metamaskProvider = sdk.getProvider();
      let provider = new ethers.BrowserProvider(metamaskProvider)
      setProvider(provider);
      setChainId(parseInt(chainId, 16));
      setContractAddress(contractAddress);
      setAccount(accounts?.[0]);
      localStorage.setItem('provider'.JSON.stringify(provider));
      let signer = await provider.getSigner();      
      let instance = new ethers.Contract(contractAddress,abi,signer)
      setContractInstance(instance);     
      let mintCount = await instance.balanceOf(accounts[0]);
      setUserMintCount(ethers.toNumber(mintCount));
    } catch (err) {
      // Handle any errors
      console.error('Failed to connect to MetaMask', err);
    }
  };

  const disconnect = async () => {
    try {
      await sdk?.disconnect();
    } catch (err) {
      // Handle any errors
      console.error('Failed to connect to MetaMask', err);
    }
  };

  const mintNFT = async () => {
    try {
      if(receipientAddress.length>0){
        let txn = await contractInstance["mintNFT(address)"](receipientAddress)
        console.log({txn})
      }
      else{
        let txn = await contractInstance.mintNFT();
        console.log({txn})
      }

    
    } catch (err) {
      // Handle any errors
      console.error('Failed to connect to MetaMask', err);
    }
  };

  // Return the JSX elements for the app
  return (
    <div className="App">
      {/* Show a button to connect to MetaMask */}
      <button onClick={connect}>Connect to MetaMask</button>
      <button onClick={disconnect}>Disconnect</button>
      <input value={receipientAddress} onChange={(e) => setReceipientAddress(e.target.value)} placeholder='receipient address (optional)'></input>
      <button onClick={mintNFT}>Mint NFT</button>

      {/* Show the user's account and chain if connected */}
      {connected && (
        <div>
          <p>Connected account: {account}</p>
          <p>Connected chain: {chainId}</p>
          <p>Connected Contract: {contractAddress}</p>
          <p>User Mint Count : {userMintCount}</p>

        </div>
      )}
    </div>
  );
};

// Wrap the App component with MetaMaskProvider
const Root = () => {
  return (
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        logging: {
          developerMode: false,
        },
        checkInstallationImmediately: false,
        dappMetadata: {
          name: 'Artifact UI React App',
          url: window.location.host,
        },
      }}
    >
      <App />
    </MetaMaskProvider>
  );
};

// Export the Root component as default
export default Root;
