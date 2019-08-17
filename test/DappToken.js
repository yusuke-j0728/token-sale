var DappToken = artifacts.require("DappToken")

contract('DAppToken', function(accounts) {
  it('sets the total supply upon deployment', function() {
    return DappToken.deployed().then(function(instance) {
      tokenInstance = instance;
      return tokenInstance.totalSupply();
    }).then(function(totalSupply) {
      assert.equal(totalSupply.toNumber(), 1000000, 'sets the total supply to 1,000,000')
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
