const { expect } = require("chai");
const { setAddresses } = require("../scripts/setAddresses");

describe("Borrow Operations", function() {
    let deployer, user1, user2, users;
    let BorrowerOperations, HintHelpers, SortedTroves;
    beforeEach(async function() {
    // deploy contracts and link addresses
        [deployer, user1, user2, ...users] = await ethers.getSigners();
        const contractAddresses = await setAddresses();
        BorrowerOperations = await ethers.getContractAt('BorrowerOperations', contractAddresses.borrowerOperations, deployer);
        HintHelpers = await ethers.getContractAt('HintHelpers', contractAddresses.hintHelpers, deployer);
        SortedTroves = await ethers.getContractAt('SortedTroves', contractAddresses.sortedTroves, deployer);
    });

    it("Should open a trove", async () => {
        // adding 1 ETH as collateral and take out 2000 LUSD as debt
        const maxFeePercentage = ethers.utils.parseUnits("0.03"); //3%
        const LUSDAmount = ethers.utils.parseUnits("2500"); 
        const ETHColl = ethers.utils.parseUnits("10");
        const NICR = ethers.utils.parseUnits("0.0005");
        const [prevID, nextID] = await SortedTroves.findInsertPosition(NICR, "0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000");
        let tx = await BorrowerOperations.openTrove(maxFeePercentage, LUSDAmount, prevID, nextID, {value: ETHColl });
        tx = await tx.wait();
        // check if the sorted trove size is greater than 0
        expect(await SortedTroves.getSize()).to.equal(1);
    });

    it("Add collateral", async () => {
        
    });



});