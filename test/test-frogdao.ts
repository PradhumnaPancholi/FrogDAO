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
  let bob: any;

  this.beforeEach(async function () {
    FrogDAO = await ethers.getContractFactory("FrogDAO");
    FrogToken = await ethers.getContractFactory("FrogERC20Token");
    FrogController = await ethers.getContractFactory("FrogTimelockController");
    

    [owner, alice, bob] = await ethers.getSigners();

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
      const transferData = frogTokenInstance.interface.encodeFunctionData("transfer", [alice.address, 50]);
      let Tx = await frogDaoInstance.propose([frogTokenInstance.address],[0], [transferData], "transfer 50 tokens to alice");
      await Tx.wait();

      expect(Tx).to.emit(frogDaoInstance, "ProposalCreated");
    });

    it("a address can cast a vote", async function () {
      // get transferData for proposalId
      const transferData = frogTokenInstance.interface.encodeFunctionData("transfer", [alice.address, 50]);

      let Tx = await frogDaoInstance.propose([frogTokenInstance.address],[0], [transferData], "transfer 50 tokens to alice");
      await Tx.wait();

      // TODO: need to advnace time until proposal is active for vote.
      const delay = await frogDaoInstance.votingDelay(); // this is in blocks.
      let i = 0;
      while (i < delay) {
        await ethers.provider.send("evm_mine", []);
        i++;
      }

      // description hash.
      const descriptionHash = ethers.utils.id('transfer 50 tokens to alice');

      // create proposalId
      const proposalHash = await frogDaoInstance.hashProposal([frogTokenInstance.address],[0], [transferData], descriptionHash);

      Tx = await frogDaoInstance.castVote(proposalHash, 0);
      await Tx.wait();

      expect(Tx).to.emit(frogDaoInstance, "VoteCast");
    });

    // TODO: revisit. I am unsure if the hash is correct.
    it("can check to see if an address has voted", async function () {
      const transferData = frogTokenInstance.interface.encodeFunctionData("transfer", [alice.address, 50]);
      const descriptionHash = ethers.utils.id('transfer 50 tokens to alice');
      const proposalHash = await frogDaoInstance.hashProposal([frogTokenInstance.address],[0], [transferData], descriptionHash);
      const voted = await frogDaoInstance.hasVoted(proposalHash, owner.address);
      expect(voted).to.equal(false);      
    });
  });
})