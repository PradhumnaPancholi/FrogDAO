import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer, Contract } from "ethers";

describe("FrogERC20Token", function () {

  let Frog;
  let frogToken: Contract;
  let owner: any;
  let alice: any;

  this.beforeEach(async function () {
    Frog = await ethers.getContractFactory("FrogERC20Token");
    [owner, alice] = await ethers.getSigners();

    frogToken = await Frog.deploy();
  });

  it("can mint an arbirary number of tokens.", async function () {
    const mintTx = await frogToken.mint(owner.address, 1000);

    await mintTx.wait();

    const balance = await frogToken.balanceOf(owner.address);

    expect(balance.toNumber()).to.equal(1000);
  });

  it("can transfer tokens between two accounts", async function () {
    [owner, alice] = await ethers.getSigners();

    // inital mint.
    let Tx = await frogToken.mint(owner.address, 1000);
    await Tx.wait();

    // transfer 50 tokens from deployer to alice.
    Tx = await frogToken.transfer(alice.address, 50);
    await Tx.wait();

    const balance = await frogToken.balanceOf(owner.address);
    const aliceBalance = await frogToken.balanceOf(alice.address);

    expect(balance.toNumber()).to.equal(950);
    expect(aliceBalance.toNumber()).to.equal(50);
  });
  
  it("can burn tokens", async function () {
    [owner] = await ethers.getSigners();

    // inital mint.
    let Tx = await frogToken.mint(owner.address, 1000);
    await Tx.wait();

    // transfer 50 tokens from deployer to alice.
    Tx = await frogToken.burn(500);
    await Tx.wait();

    const balance = await frogToken.balanceOf(owner.address);
    const frogTotalSupply = await frogToken.totalSupply();

    expect(balance.toNumber()).to.equal(500);
    expect(frogTotalSupply.toNumber()).to.equal(500);
  });

  it("a user can't burn more tokens than in the total supply", async function() {
    [owner] = await ethers.getSigners();

    // inital mint.
    let Tx = await frogToken.mint(owner.address, 1000);
    await Tx.wait();

    // Should fail.
    await expect(frogToken.burn(1500)).to.be.revertedWith("ERC20: burn amount exceeds balance");  
  })
})
