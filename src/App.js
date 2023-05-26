import { ConnectWallet, useAddress, useUser } from "@thirdweb-dev/react";
import Web3 from "web3";

// styling
import "./styles/Home.css";
import abi from "./ABI/staking.json";
import nftabi from "./ABI/nft.json";
import tokenabi from "./ABI/token.json";

import logo from "./images/steakd_32.png";

import { useEffect, useState } from "react";

export default function Home() {
  const contractAddress = "0X9F1FF7D34666F2182BCF0E14898889BDEDACFD87";
  const contractAddressNFT = "0x6489265Bf18185cA693017E7448bD77E8F80A524";
  const contractAddressToken = "0x510AeB87665D3fCE5395a62045C5B7aE8990bf35";
  const address = useAddress();
  const { signer } = useUser();

  const web3 = new Web3();
  web3.setProvider("https://bsc-dataseed1.binance.org/");

  // here comes the usestate hell
  const [totalSupply, setTotalSupply] = useState("");
  const [stakingActive, setStakingActive] = useState("");
  const [earlyWithdrawPenalty, setEarlyWithdrawPenalty] = useState("");
  const [bonusThreshold, setBonusThreshold] = useState("");
  const [lockPeriods, setLockPeriods] = useState("");
  const [viewUnpaidDividends, setViewUnpaidDividends] = useState(0);
  const [lockAPRs, setlockAPRs] = useState("");
  const [lockAPRsFront, setLockAPRsFront] = useState(0);
  const [balanceOf, setBalanceOf] = useState("");
  const [balanceOfToken, setBalanceOfToken] = useState("");
  const [selectedValue, setSelectedValue] = useState("6");
  const [userLock, setUserLock] = useState("0");
  const [amount, setAmount] = useState(0);

  const contract = new web3.eth.Contract(abi, contractAddress);
  const contractNFT = new web3.eth.Contract(nftabi, contractAddressNFT);
  const contractToken = new web3.eth.Contract(tokenabi, contractAddressToken);

  async function getTotalStaked() {
    // const totalSupply = await contract.methods.totalStaked().call();
    // setTotalSupply(totalSupply);
  }

  async function getUserLock() {
    const userLock = await contract.methods.userLock(address).call();
    console.log()
    setUserLock(userLock);
  }

  async function getLockPeriods() {
    // const lockPeriods = await contract.methods.lockPeriods(address).call();
    // setLockPeriods(lockPeriods);
  }

  async function getBonusThreshold() {
    // const bonusThreshold = await contract.methods.bonusThreshold().call();
    // setBonusThreshold(bonusThreshold);
  }

  async function getEarlyWithdrawPenalty() {
    const earlyWithdrawPenalty = await contract.methods
      .earlyWithdrawPenalty()
      .call();
    setEarlyWithdrawPenalty(earlyWithdrawPenalty);
  }

  async function getViewUnpaidDividends() {
    // const viewUnpaidDividends = await contract.methods
    //   .viewUnpaidDividends(address)
    //   .call();
    // setViewUnpaidDividends(viewUnpaidDividends);
  }

  async function getStakingActive() {
    let stakingActive = await contract.methods.stakingActive().call();
    if (stakingActive == false) {
      stakingActive = "Offline";
    } else {
      stakingActive = "Active";
    }
    setStakingActive(stakingActive);
  }

  //NFT contract functions

  async function getBalanceOf() {
    const balanceOf = await contractNFT.methods.balanceOf(address).call();
    setBalanceOf(balanceOf);
  }

  // token contract functions
  async function getBalanceOfToken() {
    const balanceOfToken = await contractToken.methods
      .balanceOf(address)
      .call();
    setBalanceOfToken(balanceOfToken);
  }

  async function getlockAPRs() {
    const lockAPRs6 = await contract.methods.lockAPRs(6).call();
    const lockAPRs12 = await contract.methods.lockAPRs(12).call();

    let combine = [];
    let lockAPR = [];

    combine = combine.concat(lockAPRs6, lockAPRs12);

    if (balanceOf == 0) {
      lockAPR.push(combine[0]["noNFT"]);
      lockAPR.push(combine[1]["noNFT"]);
    }

    setlockAPRs(lockAPR);
  }

  const handleSelectChange = (event) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    if (selectedValue == 6) {
      setLockAPRsFront(lockAPRs[0]);
    }
    if (selectedValue == 12) {
      setLockAPRsFront(lockAPRs[1]);
    }
  };

  const handleMaxAmountClick = () => {
    console.log(balanceOfToken)
    setAmount(balanceOfToken);
  };

  const handleInputChange = (event) => {
    const newValue = parseInt(event.target.value);
    setAmount(newValue);
  };

  async function stakeToken() {
    try {
      console.log(address);
      const stakeToken = await contract.methods
        .stakeTokens(amount, lockAPRsFront)
        .send({ from: address });
      console.log(signer);
    } catch (error) {
      console.log(error);

      console.log("fafdsa");
    }
  }

  useEffect(() => {
    getTotalStaked();
    getEarlyWithdrawPenalty();
    getStakingActive();
    getBonusThreshold();
    getLockPeriods();
    getViewUnpaidDividends();
    getlockAPRs();
    getBalanceOf();
    getBalanceOfToken();
    getUserLock();
    if (selectedValue === "6") {
      setLockAPRsFront(lockAPRs[0]);
    }
    if (selectedValue === "12") {
      setLockAPRsFront(lockAPRs[1]);
    }
  }, [selectedValue]);
  return (
    <div className="sm:container px-4 sm:px-0 mx-auto mt-12">
      <div className="flex flex-col md:flex-row justify-between text-black items-center w-11/12 mx-auto">
        <div className="mb-4 md:mb-0">
          <p>
            Status: <span>{stakingActive}</span>
          </p>
        </div>
        <div className="">
          <ConnectWallet theme="white" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between space-y-8 md:space-y-0 md:space-x-8 mt-12 mx-auto">
        <div id="card" className="w-0/12 sm:w-2/12"></div>
        <div
          id="card"
          className="border-4 rounded-xl border-blue w-full md:w-8/12 bg-gray-100"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-x-4 p-6">
            <div className="text-black text-center">
              <p className="text-3xl font-bold">Staking period: </p>
              <span className="text-[#ff742e] text-3xl font-bold">
                {selectedValue} months
              </span>
            </div>
            <div className="text-green-400 px-6 text-2xl rounded-xl font-bold border-2 border-green-400 text-center">
              <span>
                {lockAPRsFront !== undefined && lockAPRsFront !== 0
                  ? lockAPRsFront / Math.pow(10, 18)
                  : 0}
                %
              </span>
              <p className="">APR</p>
              <div></div>
            </div>
          </div>
          <div className="px-6">
            <div className="text-black  w-full border-2 rounded-xl border-gray-400 bg-white p-4">
              <p className="text-center text-2xl font-bold">
                STAKE OR WITHDRAW
              </p>
              <div className="mt-2">
                <div className="flex flex-col">
                  <div className="relative flex items-stretch w-full mb-4">
                    <input
                      type="number"
                      className="border border-gray-300 px-3 py-2  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={amount / Math.pow(10, 18)}
                      onChange={handleInputChange}
                    />
                    <button onClick={handleMaxAmountClick} className="px-4 py-2 rounded-r-lg absolute right-0 top-0 bottom-0 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      Max
                    </button>
                  </div>
                  <div>
                    <select
                      id="lockedperiod"
                      value={selectedValue}
                      onChange={handleSelectChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                      <option value="6">6 months</option>
                      <option value="12">12 months</option>
                    </select>
                  </div>
                  <div className="flex mt-4 text-white font-bold text-2xl flex-col sm:flex-row items-center justify-between space-x-0 space-y-4 sm:space-y-4 sm:space-x-4">
                    <button className=" bg-[#ff742e] w-full p-2 px-4  rounded-xl">
                      Stake
                    </button>
                    <button className="bg-green-400 w-full p-2 px-4 rounded-xl">
                      Withdraw
                    </button>
                  </div>
                </div>
                {/* <div className="flex flex-row items-center space-x-4">
                  <p>
                    Steakd pending:
                    <span>
                      {" "}
                      {viewUnpaidDividends !== undefined &&
                      viewUnpaidDividends !== 0
                        ? viewUnpaidDividends
                        : 0}{" "}
                      STKD{" "}
                    </span>
                  </p>
                  <img className="w-8 h-8 rounded-full" src={logo} alt="" />
                </div> */}
              </div>
            </div>
          </div>
          <div className="px-6  mt-8">
            <div className="text-black px-4 border-2 border-gray-400 rounded-xl p-4">
              <p className="text-center text-2xl font-semibold">
                Pending rewards:
              </p>
              <div className="my-2">
                <div className="flex justify-center flex-row items-center space-x-4 p-4 border-2 rounded-xl border-gray-400">
                  <p className="text-xl font-semibold">
                    <span className="mr-2">
                      {userLock["userDividends"] !== undefined &&
                      userLock["userDividends"] !== 0
                        ? userLock["userDividends"]
                        : 0}
                    </span>
                    SDX TOKENS
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="px-6  mt-8 mb-6">
            <div className="text-black px-4 border-2 border-gray-400 rounded-xl p-4">
              <p className="text-center text-xl font-bold text-green-600">
                TOTAL REWARDS ACCUMULATED
              </p>
              <div className="my-2">
                <div className="flex flex-col sm:flex-row justify-between items-center sm:space-x-4 space-x-0 space-y-4 sm:space-y-0">
                  <img className="h-16 w-16" src={logo} alt="" />

                  <div className="flex w-full justify-center flex-row items-center space-x-4 p-4 border-2 rounded-xl border-gray-400">
                    <p className=" font-semibold">
                      {userLock['userDividends'] / Math.pow(10, 18)} SDX TOKENS
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="card" className="w-0/12 sm:w-2/12"></div>
      </div>
    </div>
  );
}
