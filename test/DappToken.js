var DappToken = artifacts.require("DappToken")

contract('DAppToken', function(accounts) {
  var tokenInstance;
  it('iniitalize the contract with the correct values', function() {
    return DappToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.name();
    }).then(function(name) {
      assert.equal(name, 'DApp Token', 'has the correct name');
      return tokenInstance.symbol();
    }).then(function(symbol) {
      assert.equal(symbol, 'DAPP', 'has the correct symbol');
      return tokenInstance.standard();
    }).then(function(standard) {
      assert.equal(standard, 'DApp Token v1.0', 'has the correct standard')
    })
  })

  it('allocates the initialsets the total supply upon deployment', function() {
    return DappToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then(function(totalSupply) {
      assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000')
      return tokenInstance.balanceOf(accounts[0]);
    }).then(function(adminBalance) {
      assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the initial supply to the admin')
    })
  });
})


// var DAppToken = artifacts.require("DAppToken");

// contract("DAppToken", function(accounts) {
//   it("should assert true", function(done) {
//     var d_app_token = DAppToken.deployed();
//     assert.isTrue(true);
//     done();
//   });
// });
