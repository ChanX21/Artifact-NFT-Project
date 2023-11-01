// Import React and MetaMask SDK
import React, { useState } from 'react';
import { MetaMaskProvider, useSDK } from '@metamask/sdk-react';
import "./App.css"
import { ethers, provider } from "ethers";
import {abi} from "./abi/artifactABI" ;
import { Circles } from 'react-loader-spinner'


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
  const [loader, setLoader] = useState(false);


  
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
        let mintCount = await contractInstance.balanceOf(receipientAddress);
        if(mintCount >= 5){
          alert('Receipient mint count exceeded !')
        }
        let txn = await contractInstance["mintNFT(address)"](receipientAddress)        
        console.log({txn})
        setLoader(true)
        const receipt = await txn.wait();
        console.log({receipt})
        setLoader(false);
        if(receipt){
          alert("Transaction Successful");
        }
      }
      else{
        let mintCountbefore = await contractInstance.balanceOf(account);
        if(mintCountbefore >= 5){
          alert('User mint count exceeded !')
        }
        let txn = await contractInstance.mintNFT();
        console.log({txn})
        setLoader(true)
        const receipt = await txn.wait();{
         alert("Transaction Successful")
        }
        console.log({receipt})
        setLoader(false);
        let mintCount = await contractInstance.balanceOf(account);
        setUserMintCount(ethers.toNumber(mintCount));       
      }

    
    } catch (err) {
      // Handle any errors
      alert("Failed to Mint")
      console.error('Failed to Mint', err);
    }
  };

  // Return the JSX elements for the app
  return (
    <div className="App">
      {/* Show a button to connect to MetaMask */}
      {!connected && (
        <button onClick={connect} className="connect-button">
          Connect to MetaMask
        </button>
      )}
      {connected && (
        <button onClick={disconnect} className="connect-button">
          Disconnect
        </button>
      )}
      <br />
      <h1> Artifact NFT UI</h1>
      <input
        value={receipientAddress}
        onChange={(e) => setReceipientAddress(e.target.value)}
        placeholder="receipient address (optional)"
      ></input>
      <button onClick={mintNFT}>Mint NFT</button> <br /> <br />
      <br />
      <br />
      {loader && <Circles
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
     }
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
