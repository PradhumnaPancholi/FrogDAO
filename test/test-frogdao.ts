import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer, Contract } from "ethers";


describe("Frog DAO contract", function () {
  let FrogDAO;
  let FrogToken;
  let FrogController;
  let frogDaoInstance: Contract;
  let frogTokenInstance: Contract;
  let frogControllerInstance: Contract;
  let owner: any;
  let alice: any;

  this.beforeEach(async function () {
    FrogDAO = await ethers.getContractFactory("FrogDAO");
    FrogToken = await ethers.getContractFactory("FrogERC20Token");
    FrogController = await ethers.getContractFactory("FrogTimelockController");
    

    [owner, alice] = await ethers.getSigners();

    frogTokenInstance = await FrogToken.deploy();
    frogControllerInstance = await FrogController.deploy(240, [], []);
    frogDaoInstance = await FrogDAO.deploy(frogTokenInstance.address, frogControllerInstance.address);
  })

  // TODO: come back to this, figure out time lock controller first.
  describe("Deployment", function() {
    it("should deploy the contract", async function () {
      expect(frogDaoInstance.address).to.exist;
    });
  });

  describe("Transactions", function() {
    it("can create new proposals", async function () {
      [owner] = await ethers.getSigners();
      const transferData = frogTokenInstance.interface.encodeFunctionData("transfer", [alice.address, 50]);
      let Tx = await frogDaoInstance.propose([owner.address],[0], [transferData], "transfer 50 tokens to alice");
      await Tx.wait();

      expect(Tx).to.emit(frogDaoInstance, "ProposalCreated");
    });
  });
})