const { expect } = require("chai");
const { ethers } = require("ethers");

const { setAddresses } = require("../scripts/setAddresses");

describe("Borrow Operations", function() {
    const [deployer, user1, user2, ...users] = await ethers.getSigners();
    const BorrowerOperations, HintHelpers, SortedTroves;
    beforeEach(async function() {
    // deploy contracts and link addresses
        const contractAddresses = setAddresses();
        BorrowerOperations = await ethers.getContractAt('BorrowerOperations', contractAddresses.borrowerOperations, deployer);
        HintHelpers = await ethers.getContractAt('HintHelpers', contractAddresses.hintHelpers, deployer);
        SortedTroves = await ethers.getContractAt('SortedTroves', contractAddresses.sortedTroves, deployer);
    })

    it("Should open a trove", async () => {
        // adding 1 ETH as collateral and take out 2000 LUSD as debt
        const maxFeePercentage = ethers.utils.parseUnits("0.03"); //3%
        const LUSDAmount = ethers.utils.parseUnits("2000"); 
        let tx = await BorrowerOperations.openTrove(maxFeePercentage, LUSDAmount, address(0), address(0));
        tx = await tx.wait();
        // check if the sorted trove size is greater than 0
        expect(await SortedTroves.getSize()).to.equal(1);
    });

})