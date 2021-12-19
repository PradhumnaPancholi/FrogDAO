import { expect } from "chai";
import { ethers } from "hardhat";

describe("FrogERC20Token", function () {
  it("can mint an arbirary number of tokens.", async function () {
    const [deployer, alice, bob] = await ethers.getSigners();

    const Frog = await ethers.getContractFactory("FrogERC20Token");
    const frog = await Frog.deploy();
    await frog.deployed();
    
    const mintTx = await frog.mint(deployer.address, 1000);

    await mintTx.wait();

    const balance = await frog.balanceOf(deployer.address);

    expect(balance.toNumber()).to.equal(1000);
  });

  it("can transfer tokens between two accounts", async function () {
    const [deployer, alice, bob] = await ethers.getSigners();

    const Frog = await ethers.getContractFactory("FrogERC20Token");
    const frog = await Frog.deploy();
    await frog.deployed();
    // inital mint.
    let Tx = await frog.mint(deployer.address, 1000);
    await Tx.wait();

    // transfer 50 tokens from deployer to alice.
    Tx = await frog.transfer(alice.address, 50);
    await Tx.wait();

    const balance = await frog.balanceOf(deployer.address);
    const aliceBalance = await frog.balanceOf(alice.address);

    expect(balance.toNumber()).to.equal(950);
    expect(aliceBalance.toNumber()).to.equal(50);
  });
  
  it("can burn tokens", async function () {
    const [deployer] = await ethers.getSigners();

    const Frog = await ethers.getContractFactory("FrogERC20Token");
    const frog = await Frog.deploy();
    await frog.deployed();
    // inital mint.
    let Tx = await frog.mint(deployer.address, 1000);
    await Tx.wait();

    // transfer 50 tokens from deployer to alice.
    Tx = await frog.burn(500);
    await Tx.wait();

    const balance = await frog.balanceOf(deployer.address);
    const frogTotalSupply = await frog.totalSupply();

    expect(balance.toNumber()).to.equal(500);
    expect(frogTotalSupply.toNumber()).to.equal(500);
  });
})
