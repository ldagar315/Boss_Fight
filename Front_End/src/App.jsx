import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import SelectCharacter from './Components/SelectCharacter';
import './App.css';
import { CONTACT_ADDRESS,transformCharacterData } from './constant.jsx';
import MyEpicGame from './utils/epic.json';
import { ethers } from 'ethers';
import Arena from './Components/Arena';
import LoadingIndicator from './Components/LoadingIndicator';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask");
        setIsLoading(false);
        return;
      }
      else {
        console.log("We have a etereum object", ethereum);
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('We found an Authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('NO authrized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!!!');
        return;
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const checkNetwork = async() => {
    try {
      if (window.ethereum.networkVersion !== '4'){
        alert('Please connect to Rinkeyby !!')
      }
    } catch (error){
      console.log(error)
    }
    
  }
  useEffect(() => {
    checkNetwork();
  }, []);
  useEffect(() => {
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);
  useEffect(() => {
    const fetchNFTmetadata = async() => {
      console.log('checking for character NFT on address',currentAccount);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTACT_ADDRESS,
        MyEpicGame.abi,
        signer
      );
      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log('User has chrachter NFT');
        setCharacterNFT(transformCharacterData(txn));
        
      }else {
        console.log('No Character NFT data found !!');
      }
      setIsLoading(false);
    };
    if (currentAccount){
      console.log('CurrentAccount:',currentAccount);
      fetchNFTmetadata();
    }
  }, [currentAccount]);
  // Render Methods
  

  const renderContent = () => {

    if (isLoading) {
    return <LoadingIndicator />;
  }

    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
            alt="Monty Python Gif"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWalletAction}
          >
            Connect Wallet To Get Started
        </button>
        </div>
      );

    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    }
    else if (currentAccount && characterNFT){
      return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT}/>;
    }
  };



  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Demon Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          {renderContent()}
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
          </div>
      </div>
    </div>
  );
};

export default App;
