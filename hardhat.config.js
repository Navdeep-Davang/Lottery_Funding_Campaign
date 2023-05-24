require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.18",
    contracts: {
        Lottery: { path: "../Lottery.sol" },
        Lottery_Entry: { path: "../Lottery_Entry.sol" }
    }
}