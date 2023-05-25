// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Lottery_Entry {

    address[] Entry_address;
    uint ticketPrice = 50;
    uint maxEntries = 100;
    bool public entryClosed = false;
    uint public Num_entries;
    uint public Entryfunding;
    uint public userage;
    bool public UserEntryCheck = false;

    mapping(address => bool) public entryExists;
    mapping(address => uint)  entryFund;
    mapping(address => uint)  Userfund;
    
    function enterLottery(uint age, uint ticket_price_USDC) public payable {
        assert(msg.sender.balance > ticketPrice);
        require(age >= 18, "You must be at least 18 years old to enter the lottery");
        userage = age;
        uint ticket_price_wei= ticket_price_USDC;
        require(ticket_price_wei >= ticketPrice, "You must send atleast 50 USDC to enter the lottery");

          if (Entry_address.length == maxEntries) 
        {
            revert ("Lottery entry is closed");
        }
        require(!entryExists[msg.sender], "You have already entered the lottery");
       
        Entry_address.push(msg.sender);
        entryExists[msg.sender] = true;
        UserEntryCheck = entryExists[msg.sender];
        entryFund[msg.sender] = ticket_price_USDC;
        Entryfunding = entryFund[msg.sender];
        Num_entries= Entry_address.length;
       
    }
}
