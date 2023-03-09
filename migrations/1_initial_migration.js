var Layerr1155 = artifacts.require("./Layerr1155.sol");
var LayerrFactory = artifacts.require("./LayerrFactory.sol");
var Layerr721 = artifacts.require("./Layerr721.sol");
var LayerrVariables = artifacts.require("./LayerrVariables.sol");

module.exports = function (deployer) {
  deployer.deploy(Layerr1155);
  deployer.deploy(LayerrFactory);
  deployer.deploy(Layerr721);
  deployer.deploy(LayerrVariables);
};
