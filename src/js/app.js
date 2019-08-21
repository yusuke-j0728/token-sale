var Web3 = require('web3');
// var contract0 = require('truffle-contract'); // I use truffle-contract.min.js, then I don't need to user require function
var web3;
// var contract1 = contract0({});

App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 1000000000000000,
    tokensSold: 0,
    tokensAvailable: 750000,

    init: function() {
        console.log("App initialized...")
        return App.initWeb3();
    },

    initWeb3: function() {
        // // Dapp university Tutorial
        // if(typeof web3 !== 'undefined') {
        //     // if a web3 instance is already provide by meta mask
        //     App.web3Provider = web3.currentProvider;
        //     web3 = new Web3(web3.currentProvider);
        // } else {
        //     App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        //     web3 = new Web3(App.web3Provider);
        // }

        //  detect the user of a web3 browser and set web3
        if ((typeof window.ethereum !== 'undefined') || (typeof window.web3 !== 'undefined')) {
            App.web3Provider = window['ethereum'] || window.web3.currentProvider
            web3 = new Web3(window.ethereum);
        }
        console.log("window.ethereum", window.ethereum);
        console.log("window.web3", window.web3);
        console.log("App.web3Provider", App.web3Provider);
        // return App.initContract();
        return App.initContracts();
    },

    // // using truffle-contract without API
    // initContract: function() {
    //     $.getJSON("DappTokenSale.json", function(dappTokenSale) {
    //         // contracts.DappTokenSale = TruffleContract(dappTokenSale);
    //         console.log(contract1);
    //         contract1.setProvider(App.web3Provider);
    //         contract1.deployed().then(function(dappTokenSale) {
    //             console.log(dappTokenSale)
    //             console.log("Dapp Token Sale Address:", dappTokenSale.address)
    //         })
    //     })
    // },

    initContracts: function() {
        $.getJSON("DappTokenSale.json", function(dappTokenSale) {
            App.contracts.DappTokenSale = TruffleContract(dappTokenSale);
            console.log("getJson_dappTokenSale", dappTokenSale);
            // console.log(App.contracts.dappTokenSale);
            // console.log(App.contracts.DappTokenSale);
            App.contracts.DappTokenSale.setProvider(App.web3Provider);
            console.log("App.contracts: ", App.contracts)
            // console.log("App.contracts.DappTokenSale: ", App.contracts.dappTokenSale);
            App.contracts.DappTokenSale.deployed().then(function(dappTokenSale) {
                // console.log("App.contracts.dappTokenSale.deployed()", App.contracts.dappTokenSale.deployed);
                console.log("deployed_dappTokenSale", dappTokenSale)
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
            // App.listenForEvents();
            return App.render();
        })
        
    },

    // Listen for events emitted from the contract
    listenForEvents: function() {
        App.contracts.DappTokenSale.deployed().then(function(instance) {
            // web3.eth.Contractf // myContract.getPastEvents(event[,options][,callback])
            let event = instance.getPastEvents('Sell', {
                fromBlock: 0,
                toBlock: 'latest'
            })
            console.log("event triggerd: ", event);
            return App.render();
            // dapp universtity tutorial
            // instance.Sell({}, {
            //     fromBlock: 0,
            //     toBlock: 'latest',
            // }).then(function(event) {
            //     console.log("event triggered", event);
            //     App.render();
            // })
        })
    },

    render: function() {
        if(App.loading) {
            return;
        }
        App.loading = true;

        var loader = $('#loader');
        var content = $('#content');

        loader.show();
        content.hide();
        // Load account data
        // web3.eth.getCoinbase(function(err, account) {
        // // web3.eth.getAccounts(function(err, account) {
        //     if(err === null) {
        //         console.log("account", account)
        //         App.account = account;
        //         $('#accountAddress').html("Your Account: " + account);
        //     }
        // });

        // dut to ganache, it doesn't work yet.
        web3.eth.getAccounts(function(error, accounts) {
            if(error) {
                console.log(error);
            }
            if(App.account !== accounts[0]) {
                App.account = accounts[0];
                console.log("App.account: ", App.account);
                console.log("accounts: ", accounts);
                $('#accountAddress').html("Your Account: " + App.account);
            }
        });

        // // metamask logging in
        // const accounts = await ethereum.enable();
        // App.account = accounts[0];
        // console.log("accounts: ", accounts);
        // console.log("account: ", App.account);
        // $('#accountAddress').html("Your Account: " + App.account);

        

        // load token sale contract
        // console.log("App.contracts_2: ", App.contracts)
        App.contracts.DappTokenSale.deployed().then(function(instance) {
            dappTokenSaleInstance = instance;
            console.log("instance:", instance)
            return dappTokenSaleInstance.tokenPrice();
        }).then((tokenPrice) => {
            console.log("tokenPrice: ", tokenPrice.toNumber());
            App.tokenPrice = tokenPrice;
            $('.token-price').html(web3.utils.fromWei(App.tokenPrice, 'ether').toString()); // note that toNumber() doesn't work.
            return dappTokenSaleInstance.tokenSold();
        }).then((tokenSold) => {
            App.tokensSold = tokenSold.toNumber();
            // App.tokensSold = 37500;
            $('.tokens-sold').html(App.tokensSold);
            $('.tokens-available').html(App.tokensAvailable);

            var progressPercent = (App.tokensSold / App.tokensAvailable) * 100;
            console.log("progressPercent: ", progressPercent)
            $('#progress').css('width', progressPercent + '%');

            // Load token contract
            App.contracts.DappToken.deployed().then(function(instance) {
                dappTokenInstance = instance;
                return dappTokenInstance.balanceOf(App.account);
            }).then(function(balance) {
                $('.dapp-balance').html(balance.toNumber());
                App.loading = false;
                loader.hide();
                content.show();
            })
        });
    },

    buyTokens: function() {
        console.log("App.account: " ,App.account)
        const account = App.account
        $('#content').hide();
        $('#loader').show();
        var numberOfTokens = $('#numberOfTokens').val();
        console.log("numberOfTokens1: " ,numberOfTokens)
        numberOfTokens = Number(numberOfTokens);
        console.log("numberOfTokens2: " ,numberOfTokens);
        // console.log(App.contracts)
        App.contracts.DappTokenSale.deployed().then(function(instance) {
            dappTokenSaleInstance = instance;
            // console.log(dappTokenSaleInstance)
            console.log("App.account: ", App.accuont)
            console.log("account: " ,account)
            console.log("App.tokenPrice: " ,App.tokenPrice)
            var tokenPrice = App.tokenPrice.toNumber()
            console.log("tokenPrice: ", tokenPrice)
        //     return dappTokenSaleInstance.buyTokens(1, {from: '0xdAE9E015e1C32603F3e287239C45a5EfDc28055F', value: 1000000000000000})
        // }).then((receipt) => {
            return dappTokenSaleInstance.buyTokens(numberOfTokens, {
                from: App.account,
                // from: account,
                value: numberOfTokens * tokenPrice,
                // value: 1000000000000000,
                gas: 500000})
        }).then((receipt) => {
                console.log("receipt: ", receipt)
                console.log("Tokens bought...")
                App.listenForEvents();
                // $('form').trigger('reset') // reset number of tokens in form
                // // Wait for Sell event
                // $('#loader').hide();
                // $('#content').show();

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