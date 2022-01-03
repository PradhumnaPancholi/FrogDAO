import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer, Contract } from "ethers";

describe("Frog Token Contract", function () {

  let Frog;
  let frogToken: Contract;
  let owner: any;
  let alice: any;
  let bob: any;

  this.beforeEach(async function () {
    Frog = await ethers.getContractFactory("FrogERC20Token");
    [owner, alice] = await ethers.getSigners();

    frogToken = await Frog.deploy();
  });

  describe("Deployment", function () {    
      it("should deploy the contract", async function () {
        expect(frogToken.address).to.exist;
      });

      it("can mint an arbirary number of tokens.", async function () {
        const mintTx = await frogToken.mint(owner.address, 1000);
    
        await mintTx.wait();
    
        const balance = await frogToken.balanceOf(owner.address);
    
        expect(balance.toNumber()).to.equal(1000);
      });
   });

  describe("Transactions", function () {

  
    it("can transfer tokens between two accounts", async function () {
      [owner, alice, bob] = await ethers.getSigners();
  
      // inital mint.
      let Tx = await frogToken.mint(owner.address, 1000);
      await Tx.wait();
  
      // transfer 50 tokens from deployer to alice.
      Tx = await frogToken.transfer(alice.address, 50);
      await Tx.wait();
  
      await frogToken.connect(alice).transfer(bob.address, 25);

      const balance = await frogToken.balanceOf(owner.address);
      const aliceBalance = await frogToken.balanceOf(alice.address);
      const bobBalance = await frogToken.balanceOf(bob.address);
  
      expect(balance.toNumber()).to.equal(950);
      expect(aliceBalance.toNumber()).to.equal(25);
      expect(bobBalance.toNumber()).to.equal(25);
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

    it("will revert if an address tries to burn more tokens then allowed", async function () {
      [owner, alice] = await ethers.getSigners();

      let Tx = await frogToken.mint(owner.address, 1000);
      await Tx.wait();

      Tx = await frogToken.mint(alice.address, 1000);
      await Tx.wait();

      await expect(frogToken.burnFrom(alice.address, 500)).to.be.revertedWith("ERC20: burn amount exceeds allowance");    
    });

    // TODO: come back to this.
    // this should fail. didn't because allowance hasn't been set.
    xit("will revert if an address tries to burn more tokens then allowed", async function () {
      [owner, alice] = await ethers.getSigners();

      let Tx = await frogToken.mint(owner.address, 1000);
      await Tx.wait();

      Tx = await frogToken.transfer(alice.address, 500);
      await Tx.wait();

      const aliceBalance = await frogToken.balanceOf(alice.address);

      expect(aliceBalance.toNumber()).to.equal(500);

      Tx = await frogToken.increaseAllowance(alice.address, 500);
      await Tx.wait();

      // alice should now have an allowance of 500.
      const aliceAllowance = await frogToken.allowance(owner.address, alice.address);

      expect(aliceAllowance.toNumber()).to.equal(500);

      // alice should now be able to burn 500 tokens.
      Tx = await frogToken.burnFrom(alice.address, 200);
      await Tx.wait();

      const totalSupply = await frogToken.totalSupply();

      // is it because I'm actually the owner? not alice?
      expect(totalSupply.toNumber()).to.equal(800);
    });
    
    it("will let an address approve another address to use an arbitrary amount of tokens", async function () {
      [owner, alice] = await ethers.getSigners();
  
      let Tx = await frogToken.mint(owner.address, 1000);
      await Tx.wait();
  
      Tx = await frogToken.approve(alice.address, 500);
      Tx.wait();

      const aliceAllowance = await frogToken.allowance(owner.address, alice.address);
      
      expect(aliceAllowance.toNumber()).to.equal(500);
    })

  }); // end of Transactions
})
