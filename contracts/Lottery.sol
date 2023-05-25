// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Lottery_Entry.sol";

contract Lottery is Lottery_Entry {

    uint public Userfunding;

     function checkuser() public returns (bool) {
        return entryExists[msg.sender];
    }
    
    function withdrawLotteryFunds() public {
        require(entryExists[msg.sender], "You have not entered the lottery");
        require(entryFund[msg.sender] > 0, "You have already withdrawn your funds");
        Userfund[msg.sender] = entryFund[msg.sender] - ticketPrice;
        Userfunding = Userfund[msg.sender];
        entryFund[msg.sender] = 0;
        Entryfunding= entryFund[msg.sender];
        Num_entries= (Entry_address.length - 1);
    }
}
