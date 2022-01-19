const fs = require('fs');

async function deployContracts() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    const PriceFeed = await ethers.getContractFactory("PriceFeed");
    const priceFeed = await PriceFeed.deploy();
    console.log("priceFeed address:", priceFeed.address);

    const SortedTroves = await ethers.getContractFactory("SortedTroves");
    const sortedTroves = await SortedTroves.deploy();
    console.log("sortedTroves address:", sortedTroves.address);

    const TroveManager = await ethers.getContractFactory("TroveManager");
    const troveManager = await TroveManager.deploy();
    console.log("troveManager address:", troveManager.address);


    const ActivePool = await ethers.getContractFactory("ActivePool");
    const activePool = await ActivePool.deploy();
    console.log("activePool address:", activePool.address);


    const StabilityPool = await ethers.getContractFactory("StabilityPool");
    const stabilityPool = await StabilityPool.deploy();
    console.log("stabilityPool address:", stabilityPool.address);


    const GasPool = await ethers.getContractFactory("GasPool");
    const gasPool = await GasPool.deploy();
    console.log("gasPool address:", gasPool.address);


    const DefaultPool = await ethers.getContractFactory("DefaultPool");
    const defaultPool = await DefaultPool.deploy();
    console.log("defaultPool address:", defaultPool.address);


    const CollSurplusPool = await ethers.getContractFactory("CollSurplusPool");
    const collSurplusPool = await CollSurplusPool.deploy();
    console.log("collSurplusPool address:", collSurplusPool.address);


    const BorrowerOperations = await ethers.getContractFactory("BorrowerOperations");
    const borrowerOperations = await BorrowerOperations.deploy();
    console.log("borrowerOperations address:", borrowerOperations.address);

    const HintHelpers = await ethers.getContractFactory("HintHelpers");
    const hintHelpers = await HintHelpers.deploy();
    console.log("hintHelpers address:", hintHelpers.address);

    const LQTYStaking = await ethers.getContractFactory("LQTYStaking");
    const lQTYStaking = await LQTYStaking.deploy();
    console.log("LQTYStaking address:", lQTYStaking.address);

    const LockupContractFactory = await ethers.getContractFactory("LockupContractFactory");
    const lockupContractFactory = await LockupContractFactory.deploy();
    console.log("lockupContractFactory address:", lockupContractFactory.address);

    const CommunityIssuance = await ethers.getContractFactory("CommunityIssuance");
    const communityIssuance = await CommunityIssuance.deploy();
    console.log("communityIssuance address:", communityIssuance.address);

    const LUSDToken = await ethers.getContractFactory("LUSDToken");
    const lUSDToken = await LUSDToken.deploy(troveManager.address,
                                            stabilityPool.address,
                                             borrowerOperations.address, {gasLimit: 10000000});
    console.log("lUSDToken address:", lUSDToken.address);

    const LQTYToken = await ethers.getContractFactory("LQTYToken");
    const lQTYToken = await LQTYToken.deploy(communityIssuance.address
                                            ,lQTYStaking.address
                                            ,lockupContractFactory.address
                                            ,deployer.address
                                            ,deployer.address
                                            ,deployer.address, {gasLimit: 10000000});
    console.log("LqtyToken address:", lQTYToken.address);

    const Unipool = await ethers.getContractFactory("Unipool");
    const unipool = await Unipool.deploy()
    console.log("Unipool address:", unipool.address);

    // let contractAddresses = {
    //   'unipool': unipool.address,
    //   'priceFeed': priceFeed.address,
    //   'sortedTroves': sortedTroves.address,
    //   'troveManager': troveManager.address,
    //   'activePool' : activePool.address,
    //   'stabilityPool' : stabilityPool.address,
    //   'gasPool': gasPool.address,
    //   'defaultPool': defaultPool.address,
    //   'collSurplusPool': collSurplusPool.address,
    //   'borrowerOperations': borrowerOperations.address,
    //   'hintHelpers': hintHelpers.address,
    //   'lQTYStaking': lQTYStaking.address,
    //   'lockupContractFactory': lockupContractFactory.address,
    //   'communityIssuance': communityIssuance.address,
    //   'lUSDToken': lUSDToken.address,
    //   'lQTYToken': lQTYToken.address,
    // }
    let contractInstances = {
      'unipool': unipool,
      'priceFeed': priceFeed,
      'sortedTroves': sortedTroves,
      'troveManager': troveManager,
      'activePool' : activePool,
      'stabilityPool' : stabilityPool,
      'gasPool': gasPool,
      'defaultPool': defaultPool,
      'collSurplusPool': collSurplusPool,
      'borrowerOperations': borrowerOperations,
      'hintHelpers': hintHelpers,
      'lQTYStaking': lQTYStaking,
      'lockupContractFactory': lockupContractFactory,
      'communityIssuance': communityIssuance,
      'lUSDToken': lUSDToken,
      'lQTYToken': lQTYToken,
    }

    // console.log("Writing the addresses...")
    // contractAddresses = JSON.stringify(contractAddresses, null, 2);
    // fs.writeFileSync('contractAddresses.json',contractAddresses);
    // console.log('Done!')

    return contractInstances;
}

async function main() {
    await deployContracts();
  }
  
// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

module.exports = { deployContracts };
