pragma solidity ^0.5.1;

import "./DappToken.sol";

contract DappTokenSale {
    address admin;
    DappToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokenSold;

    event Sell(address _buyer, uint256 _amount);
    constructor(address _tokenContract, uint256 _tokenPrice) public {
        // Assign an admin
        admin = msg.sender;
        // Token Constract
        tokenContract = DappToken(_tokenContract);
        // Token Price
        tokenPrice = _tokenPrice;
    }

    // multiply
    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    // buy tokens
    function buyTokens(uint256 _numberOfTokens) public payable {
        // require that value is equal to tokens
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        // require that the contract has enough tokens
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        // require that a transfer is successful
        require(tokenContract.transfer(msg.sender, _numberOfTokens));
        // keep track of tokensold
        tokenSold += _numberOfTokens;
        // trigger sell event
        emit Sell(msg.sender, _numberOfTokens);
    }

    // ending token dapptokensale
    function endSale() public {
        // require admin
        require(msg.sender == admin);
        // transfer remaining dapp tokens to admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        // destroy contract
        // address payable adminaddress = address(uint160(admin));
        // selfdestruct(adminaddress);

        // update : let's not destroy the contract here
        // just transfer the balance to the admin
        address payable adminaddress = address(uint160(admin));
        uint contractbalance = address(this).balance;
        adminaddress.transfer(contractbalance);

    }

}