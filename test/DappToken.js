// var DappToken = artifacts.require("DappToken")

// contract('DAppToken', function(accounts) {
//   var tokenInstance;
//   it('iniitalize the contract with the correct values', function() {
//     return DappToken.deployed().then(function(instance) {
//       tokenInstance = instance;
//       return tokenInstance.name();
//     }).then(function(name) {
//       assert.equal(name, 'DApp Token', 'has the correct name');
//       return tokenInstance.symbol();
//     }).then(function(symbol) {
//       assert.equal(symbol, 'DAPP', 'has the correct symbol');
//       return tokenInstance.standard();
//     }).then(function(standard) {
//       assert.equal(standard, 'DApp Token v1.0', 'has the correct standard')
//     })
//   })

//   it('allocates the initialsets the total supply upon deployment', function() {
//     return DappToken.deployed().then(function(instance) {
//       tokenInstance = instance;
//       return tokenInstance.totalSupply();
//     }).then(function(totalSupply) {
//       assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000')
//       return tokenInstance.balanceOf(accounts[0]);
//     }).then(function(adminBalance) {
//       assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to the admin')
//     })
//   });

//   it('transfers token ownership' , function() {
//     return DappToken.deployed().then(function(instance) {
//       tokenInstance = instance;
//       return tokenInstance.transfer.call(accounts[1], 9999999999); //using call() doesn't create actual transaction
//     }).then(assert.fail).catch(function(error) {
//       assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
//       return tokenInstance.transfer.call(accounts[1], 250000, {from: accounts[0]});
//     }).then(function(success) {
//       assert.equal(success, true, 'it returns true')
//       return tokenInstance.transfer(accounts[1],250000, {from: accounts[0]});  // withou call() cereate actual transaction
//     }).then(function(receipt) {
//       assert.equal(receipt.logs.length, 1, 'triggers one event');
//       assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Trsanfer" event');
//       assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transferred from');
//       assert.equal(receipt.logs[0].args._to, accounts[1],'logs the account the tokens are trnsferred to');
//       assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
//       return tokenInstance.balanceOf(accounts[1]);
//     }).then(function(balance) {
//       assert.equal(balance.toNumber(), 250000, 'adds the amount to the receiving account');
//       return tokenInstance.balanceOf(accounts[0]);
//     }).then(function(balance) {
//       assert.equal(balance.toNumber(), 750000, 'deducts the amout from the sending account')
//     })
//   })

//   it('approves tokens for delegated transfer', function() {
//     return DappToken.deployed().then(function(instance) {
//       tokenInstance = instance;
//       return tokenInstance.approve.call(accounts[1], 100);  // not actual transaction; without running blockchain
//     }).then(function(success) {
//       assert.equal(success, true, 'it returns true');
//       return tokenInstance.approve(accounts[1], 100, {from: accounts[0]});  // crate actual transaction
//     }).then(function(receipt) {
//       assert.equal(receipt.logs.length, 1, 'triggers one event');
//       assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
//       assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
//       assert.equal(receipt.logs[0].args._spender, accounts[1],'logs the account the tokens are authorized to');
//       assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');      
//       return tokenInstance.allowance(accounts[0], accounts[1]);
//     }).then(function(allowance) {
//       assert.equal(allowance.toNumber(), 100, 'stores teh allwoance for delegated tranfer');
//     })
//   })

//   it('handles delegated token transfers', function() {
//     return DappToken.deployed().then(function(instance) {
//       tokenInstance = instance;
//       fromAccount = accounts[2];
//       toAccount = accounts[3];
//       spendingAccount = accounts[4];
//       // transfer some tokens to fromAccount
//       return tokenInstance.transfer(fromAccount, 100, {from: accounts[0]});
//     }).then(function(receipt) {
//       // approve spendingAccount to spend 10 tokens from fromAccount
//       return tokenInstance.approve(spendingAccount, 10, {from: fromAccount});
//     }).then(function(receipt) {
//       // try transferrring something larger than the sender's balance
//       return tokenInstance.transferFrom(fromAccount, toAccount, 9999, {from: spendingAccount});
//     }).then(assert.fail).catch(function(error) {
//       assert(error.message.indexOf('revert') >= 0, 'can not transfer value larger than balance');
//       // try trsanferring something large than approved amount
//       return tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount});
//     }).then(assert.fail).catch(function(error) {
//       assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved amount');
//       return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from: spendingAccount})
//     }).then((success) => {
//       assert.equal(success, true);
//       return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount});
//     }).then(function(receipt) {
//       assert.equal(receipt.logs.length, 1, 'triggers one event');
//       assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Trsanfer" event');
//       assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transferred from');
//       assert.equal(receipt.logs[0].args._to, toAccount,'logs the account the tokens are trnsferred to');
//       assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
//       return tokenInstance.balanceOf(fromAccount);
//     }).then((balance) => {
//       assert.equal(balance.toNumber(), 90, 'deducts the amount from the spending account')
//       return tokenInstance.balanceOf(toAccount);
//     }).then((balance) => {
//       assert.equal(balance.toNumber(), 10, 'adds the amount from the receiving account');
//       return tokenInstance.allowance(fromAccount, spendingAccount);
//     }).then(function(allowance) {
//       assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance')
//     })
//   })

// })


// // var DAppToken = artifacts.require("DAppToken");

// // contract("DAppToken", function(accounts) {
// //   it("should assert true", function(done) {
// //     var d_app_token = DAppToken.deployed();
// //     assert.isTrue(true);
// //     done();
// //   });
// // });
