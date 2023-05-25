import { useState, useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import { ethers } from "ethers";
import lottery_abi from "../artifacts/contracts/Lottery.sol/Lottery.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [LTF, setLTFC] = useState(undefined);
  const [userEntered_bool, setUserEntered] = useState(false);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const LotteryABI = lottery_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getLTFcontract();
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const getLTFcontract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const LTFcontract = new ethers.Contract(
      contractAddress,
      LotteryABI,
      signer
    );

    setLTFC(LTFcontract);
  };

  const withdraw = async () => {
    if (LTF) {
      let tx = await LTF.withdrawLotteryFunds();
      await tx.wait();
      return (
        <div>
          <p> Your Account: {account} </p>
          <p> Thank you for showing interest in our Lottery Funding. </p>
          <p> Number of Lottery partictpants: {LTF.Num_entries} </p>
          <p> Your Funding to our project is $ {getfundingAmount} </p>
        </div>
      );
    }
  };

  const getNumEntries = async () => {
    const numEntries = await LTF.Num_entries();
    return numEntries;
  };

  const getfundingAmount = async () => {
    const fundingAmount = await LTF.Entryfunding();
    return fundingAmount;
  };

  const handleConfirm = async () => {
    const CheckUserEntry = await LTF.checkuser();
    //const CheckUserEntry = await LTF.request({ method: "checkuser" });

    setUserEntered(CheckUserEntry);
  };

  const renderConfirmation = async () => {
    const fundingAmountPromise = getfundingAmount();
    const numEntriesPromise = getNumEntries();

    const fundingAmount = await fundingAmountPromise;
    const numEntries = await numEntriesPromise;

    const _html = (
      <div>
        <header>
          <h1> Lottery Funding Campaign </h1>
        </header>
        <div>
          <p> Your account {account} </p>
          <p> You have entered in our Lottery funding </p>
          <p> Number of Lottery participants: {numEntries.toString()} </p>
          <p> Your Entry Fund is {fundingAmount.toString()} </p>
        </div>
      </div>
    );

    const _divconfirm = document.getElementsByClassName("container")[0];
    _divconfirm.innerHTML = ReactDOMServer.renderToString(_html);
  };

  const Confirm_msg = async () => {
    if (LTF) {
      const _fundingAmount = document.querySelector("._fundingAmount").value;
      const _userage = document.querySelector(".userage").value;
      const confirmed = confirm(
        `You will be funding Lottery. Do you want to proceed?`
      );
      if (confirmed) {
        let tx = await LTF.enterLottery(_userage, _fundingAmount);
        await tx.wait();

        await renderConfirmation();
      }
    }
  };

  const statecheck = () => {};

  const initUser = () => {
    // Check to see if user has Metamask
    useEffect(() => {
      getWallet();
    }, []);

    if (!ethWallet) {
      return <p> Please install Metamask in order to use this ATM. </p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <div>
          <h2>What is this Lottery campaign?</h2>
          <p>
            We are running a lottery funding campaign to raise money to conduct
            Lottery. This campaign will help to bring awareness about Web3 among
            the people. Your financial support can make a significant difference
            .
          </p>
          <p>
            As this campaign is at its early stage. We will be only taking the
            registery for people who are interested in funding the campaign. No
            funds will be collected from you at this stage.
          </p>

          <h2>How it Works?</h2>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "Auto",
            }}
          >
            <div style={{ textAlign: "left" }}>
              <ol>
                <li>First you have to connect to your Metamask wallet</li>
                <li>
                  After you connect to your wallet tou will be ask to enter your
                  age and funding amount. Once you have entered it click on Fund
                  Lottery.
                </li>
                <li>
                  After clicking on Fund Lottery you will be directed to your
                  Metamask Wallet. Hit confirm transaction(only for
                  registeration).
                </li>
                <li>
                  You will be directed to knew window showing number of enteries
                  in lottery and amount which you like to fund.
                </li>
              </ol>
            </div>
          </div>

          <button onClick={connectAccount}>
            Please connect your Metamask wallet
          </button>
        </div>
      );
    }

    handleConfirm();

    if (userEntered_bool) {
      renderConfirmation();
    } else {
      return (
        <div>
          <p> Your Account: {account} </p>
          <p> Please fill the following details to enter the Lottery: </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ textAlign: "left" }}>
              <p>
                <span
                  style={{
                    display: "inline-block",
                    width: "200px",
                    textAlign: "left",
                  }}
                >
                  Age:
                </span>
                <input style={{ textAlign: "right" }} className="userage" />
              </p>
              <p>
                <span
                  style={{
                    display: "inline-block",
                    width: "200px",
                    textAlign: "left",
                  }}
                >
                  Amount for lottery funding:
                </span>
                <input
                  style={{ textAlign: "right" }}
                  className="_fundingAmount"
                />
              </p>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button
              style={{
                textAlign: "center",
                marginTop: "20px",
                width: "300px",
                backgroundColor: "blue",
                color: "white",
              }}
              onClick={Confirm_msg}
            >
              Fund Lottery
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <main className="container">
      <header>
        <h1> Lottery Funding Campaign </h1>
      </header>

      <div className="_divinit">{initUser()}</div>

      <style jsx>
        {`
          .container {
            text-align: center;
          }
          .withdraw-button {
            display: none;
          }

          .visible {
            display: inline-block;
          }

          .hidden {
            display: none;
          }
        `}
      </style>
    </main>
  );
}
