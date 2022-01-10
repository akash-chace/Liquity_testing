const fs = require('fs');
const { ethers } = require('hardhat');
const { deployContracts } = require('./deploy');
// Read the contract addresses from the json file

// let rawData = fs.readFileSync('../contractAddresses.json');
// const contractAddresses = JSON.parse(rawData);


async function setAddresses() {

    const [deployer, user1, user2] = await ethers.getSigners();
    const contractAddresses = await deployContracts(deployer, user1, user2);

    const SortedTroves = await ethers.getContractAt('SortedTroves', '0x63098176c9EA140BF853D7066ae4587e87fddE3C', deployer);
    await SortedTroves.setParams(30, contractAddresses.troveManager, contractAddresses.borrowerOperations);

    const TroveManager = await ethers.getContractAt('TroveManager', contractAddresses.troveManager, deployer);
    await TroveManager.setAddresses(contractAddresses.borrowerOperations,
                                    contractAddresses.activePool,
                                    contractAddresses.defaultPool,
                                    contractAddresses.stabilityPool,
                                    contractAddresses.gasPool,
                                    contractAddresses.collSurplusPool,
                                    contractAddresses.priceFeed,
                                    contractAddresses.lUSDToken,
                                    contractAddresses.sortedTroves,
                                    contractAddresses.lQTYToken,
                                    contractAddresses.lQTYStaking);
    
    const BorrowerOperations = await ethers.getContractAt('BorrowerOperations', contractAddresses.borrowerOperations, deployer);
    await BorrowerOperations.setAddresses(contractAddresses.troveManager,
        contractAddresses.activePool,
        contractAddresses.defaultPool,
        contractAddresses.stabilityPool,
        contractAddresses.gasPool,
        contractAddresses.collSurplusPool,
        contractAddresses.priceFeed,
        contractAddresses.sortedTroves,
        contractAddresses.lUSDToken,
        contractAddresses.lQTYStaking);

    const ActivePool = await ethers.getContractAt('ActivePool', contractAddresses.activePool, deployer);
    await ActivePool.setAddresses(contractAddresses.borrowerOperations,
        contractAddresses.troveManager,
        contractAddresses.stabilityPool,
        contractAddresses.defaultPool);
    
    const StabilityPool = await ethers.getContractAt('StabilityPool', contractAddresses.stabilityPool, deployer);
    await StabilityPool.setAddresses(contractAddresses.borrowerOperations,
        contractAddresses.troveManager,
        contractAddresses.activePool,
        contractAddresses.lUSDToken,
        contractAddresses.sortedTroves,
        contractAddresses.priceFeed,
        contractAddresses.communityIssuance);
    
    const DefaultPool = await ethers.getContractAt('DefaultPool', contractAddresses.defaultPool, deployer);
    await DefaultPool.setAddresses(contractAddresses.troveManager,
        contractAddresses.activePool);
    
    const CollSurplusPool = await ethers.getContractAt('CollSurplusPool', contractAddresses.collSurplusPool, deployer);
    await CollSurplusPool.setAddresses(contractAddresses.borrowerOperations,
        contractAddresses.troveManager,
        contractAddresses.activePool);

    const HintHelpers = await ethers.getContractAt('HintHelpers', contractAddresses.hintHelpers, deployer);
    await HintHelpers.setAddresses(contractAddresses.sortedTroves,
        contractAddresses.troveManager);

    const LQTYStaking = await ethers.getContractAt('LQTYStaking', contractAddresses.lQTYStaking, deployer);
    await LQTYStaking.setAddresses(contractAddresses.lQTYToken,
        contractAddresses.lUSDToken,
        contractAddresses.troveManager,
        contractAddresses.borrowerOperations,
        contractAddresses.activePool);

    console.log('All linking done!')
    
    return contractAddresses;
}


async function main() {
    await setAddresses();
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });

module.exports = { setAddresses }