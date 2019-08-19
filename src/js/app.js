var Web3 = require('web3');
// var contract = require('truffle-contract');
var web3;
// var contracts = contract({});

App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',

    init: function() {
        console.log("App initialized...")
        return App.initWeb3();
    },

    initWeb3: function() {
        if(typeof web3 !== 'undefined') {
            // if a web3 instance is already provide by meta mask
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }

        return App.initContracts();
    },

    // // using truffle-contract without API
    // initContracts: function() {
    //     $.getJSON("DappTokenSale.json", function(dappTokenSale) {
    //         contracts.DappTokenSale = TruffleContract(dappTokenSale);
    //         contracts.DappTokenSale.setProvider(App.web3Provider);
    //         contracts.DappTokenSale.deployed().then(function(dappTokenSale) {
    //             console.log("Dapp Token Sale Address:", dappTokenSale.address)
    //         })
    //     })
    // }
    initContracts: function() {
        $.getJSON("DappTokenSale.json", function(dappTokenSale) {
            App.contracts.DappTokenSale = TruffleContract(dappTokenSale);
            App.contracts.DappTokenSale.setProvider(App.web3Provider);
            App.contracts.DappTokenSale.deployed().then(function(dappTokenSale) {
                console.log("Dapp Token Sale Address:", dappTokenSale.address)
            });
        }).done(function(){
            $.getJSON("DappToken.json", function(dappToken) {
                App.contracts.DappToken = TruffleContract(dappToken);
                App.contracts.DappToken.setProvider(App.web3Provider);
                App.contracts.DappToken.deployed().then(function(dappToken) {
                    console.log("Dapp Token Address:" , dappToken.address)
                });
            });
        })
        return App.render();
    },

    render: function() {
        // Load account data
        web3.eth.getCoinbase(function(err, account) {
            if(err === null) {
                console.log("account", account)
                App.account = account;
                $('#accountAddress').html("Your Account: " + account);
            }
        })
    }
}

// App.initWeb3()
// App.initContract()
// console.log(web3)
// console.log(App.web3Provider)
// console.log(contracts)

$(() => {
    $(window).on('load', function(){
        App.init();
    })
});