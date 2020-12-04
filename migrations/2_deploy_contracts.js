const ArtistManagement = artifacts.require("./ArtistManagement.sol");

module.exports = function(deployer) {
  deployer.deploy(ArtistManagement);
};