import React, { useState } from 'react';
import { MetaMaskProvider, useSDK } from '@metamask/sdk-react';
import { ethers } from "ethers";
import { abi } from "./abi/artifactABI";
import { Circles } from 'react-loader-spinner';
import './App.css';
import metamaskLogo from './MetaMask_Fox.svg.png';

const App = () => {
    const { sdk, connected } = useSDK();
    const [account, setAccount] = useState("");
    const [contractAddress, setContractAddress] = useState("");
    const [contractInstance, setContractInstance] = useState();
    const [chainId, setChainId] = useState();
    const [provider, setProvider] = useState();
    const [userMintCount, setUserMintCount] = useState();
    const [receipientAddress, setReceipientAddress] = useState("");
    const [loader, setLoader] = useState(false);

    const connect = async () => {
      try {
        const accounts = await sdk?.connect();
        const contractAddress = "0xa3199EBC0F809dddfF6eB9a0f38AD8071B11656a";
    
        // Explicitly check for Sepolia chain ID
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== 11155111) {
          throw new Error("Please switch to Sepolia network in your wallet");
        }
    
        const metamaskProvider = sdk.getProvider();
        const provider = new ethers.BrowserProvider(metamaskProvider);
    
        setProvider(provider);
        setChainId(parseInt(chainId, 16));
        setContractAddress(contractAddress);
        setAccount(accounts?.[0]);
    
        const signer = await provider.getSigner();
        const instance = new ethers.Contract(contractAddress, abi, signer);
    
        setContractInstance(instance);
        const mintCount = await instance.balanceOf(accounts[0]);
        setUserMintCount(ethers.toNumber(mintCount));
      } catch (err) {
        console.error('Failed to connect to MetaMask', err);
      }
    };
    

    const disconnect = async () => {
        try {
            await sdk?.disconnect();
        } catch (err) {
            console.error('Failed to connect to MetaMask', err);
        }
    };

    const mintNFT = async () => {
        try {
            if (receipientAddress.length > 0) {
                let mintCount = await contractInstance.balanceOf(receipientAddress);
                if (mintCount >= 5) {
                    alert('Recipient mint count exceeded !');
                }
                let txn = await contractInstance["mintNFT(address)"](receipientAddress);
                setLoader(true);
                const receipt = await txn.wait();
                setLoader(false);
                if (receipt) {
                    alert("Transaction Successful");
                }
            } else {
                let mintCountbefore = await contractInstance.balanceOf(account);
                if (mintCountbefore >= 5) {
                    alert('User mint count exceeded !');
                }
                let txn = await contractInstance.mintNFT();
                setLoader(true);
                const receipt = await txn.wait();
                setLoader(false);
                if (receipt) {
                    alert("Transaction Successful");
                }
                let mintCount = await contractInstance.balanceOf(account);
                setUserMintCount(ethers.toNumber(mintCount));
            }
        } catch (err) {
            alert("Failed to Mint");
            console.error('Failed to Mint', err);
        }
    };

    return (
        <div className="container dark-theme">
            {!connected ? (
                <button onClick={connect} className="connect-button">
                    <img src={metamaskLogo} alt="MetaMask Logo" className="metamask-logo" />
                    Connect to MetaMask
                </button>
            ) : (
                <button onClick={disconnect} className="connect-button">
                    Disconnect
                </button>
            )}
            <h1>Artifact NFT UI</h1>
            <input
                value={receipientAddress}
                onChange={(e) => setReceipientAddress(e.target.value)}
                placeholder="Recipient address (optional)"
            />
            <button onClick={mintNFT}>Mint NFT</button>
            {loader && (
                <div className="loader">
                    <Circles
                        height={80}
                        width={80}
                        color="#4fa94d"
                        ariaLabel="circles-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />
                </div>
            )}
            {connected && (
                <div className="info">
                    <p>Connected account: {account}</p>
                    <p>Connected chain: {chainId}</p>
                    <p>Connected Contract: {contractAddress}</p>
                    <p>User Mint Count: {userMintCount}</p>
                </div>
            )}
        </div>
    );
};

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

export default Root;
