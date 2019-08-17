pragma solidity ^0.5.1;

contract DappToken {
    string public name = "DApp Token";
    string public symbol = "DAPP";
    string public standard = "DApp Token v1.0";
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    // Constructor
    // constructor() public {
    //     totalSupply = 1000000;
    // }
    constructor(uint256 _initialSupply) public {
        totalSupply = _initialSupply;
        // allocate the initial supply
        balanceOf[msg.sender] = _initialSupply;
    }

    // Set the total number of tokens
    // Read the total number of tokens
}