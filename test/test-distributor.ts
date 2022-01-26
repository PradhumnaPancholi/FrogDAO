import { expect } from "chai";
import { ethers } from "hardhat";
import { Signer, Contract, utils } from "ethers";

import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

describe("Frog Token Merkle Dropper", function () {

  let Frog;
  let frogToken: Contract;

  let Distributor;
  let distributor: Contract;

  // TODO: add types to these next set of vars.
  let owner: any;
  let alice: any;
  let bob: any;

  let root: any;
  let proof: any;
  let leaf: any;

  let Txn: any; 

  const users = [
    { address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", amount: 10 },
    { address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", amount: 10 },
    { address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", amount: 10 },
    { address: "0x90F79bf6EB2c4f870365E785982E1f101E93b906", amount: 10 }
  ];

  let elements: string[];
  let merkleTree: MerkleTree;

  this.beforeEach(async function () {
    elements = users.map((x) => utils.solidityKeccak256(
      ["address", "uint256"],
      [x.address, x.amount]
    ));

    merkleTree = new MerkleTree(elements, keccak256, { sort: true });
    root = merkleTree.getHexRoot();

    Frog = await ethers.getContractFactory("FrogERC20Token");
    [owner, alice] = await ethers.getSigners();

    frogToken = await Frog.deploy();
    await frogToken.deployed();

    Distributor = await ethers.getContractFactory("Distributor");
    distributor = await Distributor.deploy(frogToken.address, root);

    Txn = await frogToken.mint(distributor.address, 100);
    await Txn.wait();


  });

  it("should claim successfully for valid proof", async () => {
    leaf = elements[0];
    proof = merkleTree.getHexProof(leaf);

    await expect(
      distributor.claim(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        10,
        proof
      )
    ).to.emit(distributor, "Claimed").withArgs(users[0].address, users[0].amount);
  });

  it("should revert fail with an invalid proof", async () => {
   leaf = elements[1];
   proof = merkleTree.getHexProof(leaf);

    await expect(
      distributor.claim(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        10,
        proof
      )
    ).to.revertedWith("Distributor: Invalid proof.");
  });

  it("users can claim more than once.", async () => {
    leaf = elements[0];
    proof = merkleTree.getHexProof(leaf);

    await expect(
      distributor.claim(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        10,
        proof
      )
    ).to.emit(distributor, "Claimed").withArgs(users[0].address, users[0].amount);

    await expect(
      distributor.claim(
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        10,
        proof
      )
    ).to.revertedWith("Distributor: already claimed.");
  });

})
