import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer, Contract } from "ethers";


describe("Frog DAO contract", function () {
  let FrogDAO;
  let FrogToken;
  let TimelockController;
  let frogDaoInstance: Contract;
  let frogTokenInstance: Contract;
  let timelockControllerInstance: Contract;
  let owner: any;
  let alice: any;

  this.beforeEach(async function () {
    FrogDAO = await ethers.getContractFactory("FrogDAO");
    FrogToken = await ethers.getContractFactory("FrogERC20Token");
    // Include a timelock controller.
    // TimelockController = await ethers.getContractFactory("TimelockController");

    [owner, alice] = await ethers.getSigners();

    frogTokenInstance = await FrogToken.deploy();
    // timelockControllerInstance = await TimelockController.deploy();
    // frogDaoInstance = await FrogDAO.deploy(frogDaoInstance.address, );
  })

  // TODO: come back to this, figure out time lock controller first.
  // describe("Deployment", function() {

  // });

  // describe("Transactions", function() {
    
  // });
})