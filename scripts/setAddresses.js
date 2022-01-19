const fs = require('fs');
const { ethers } = require('hardhat');
const { deployContracts } = require('./deploy');
// Read the contract addresses from the json file

// let rawData = fs.readFileSync('../json');
// const contractAddresses = JSON.parse(rawData);


async function setAddresses() {

    const [deployer] = await ethers.getSigners();
    const {priceFeed, unipool, sortedTroves, troveManager, activePool, stabilityPool, gasPool, defaultPool, collSurplusPool, borrowerOperations, hintHelpers, lQTYStaking, lockupContractFactory, communityIssuance, lUSDToken, lQTYToken} = await deployContracts(deployer);
    // let troveManageraddress = '0x8a8dC3ED04EE528f2E3EDF4D1e59770CAE7799B5';
    // let stabilityPooladdress = '0x991413617419022F4dacD6919Fd5AdF59130801D';
    // let borrowerOperationsaddress = '0x206b7dffBf1b1AC66763B07f5E7850F563CE4A1b'
    // let communityIssuanceaddress = '0x928253780954aD0450F5e54dBd9C9FEeE6C3b2e6'
    // let lQTYStakingaddress = '0x8121364cf8A05eC996b3FF8B0E1fbB9B3ea1d230'
    // let lockupContractFactoryaddress = '0xA5f210A102fe8b2Ab60c1e806931FBDC0226C473'
    // let priceFeedaddress = '0xE1b49EC4fc7a11267a7565DE70Dad691D8eD7d4D'
    // let sortedTrovesaddress = '0x75429E9bF1638A61dF62C737358BEb3C153f18F6'
    // let activePooladdress = '0x2057E3Bd93f788E924CcDACeC0f6D73A8867b43f'
    // let gasPooladdress = '0xB0DBb2C4c220b21F5ca3Da62314e489a583B5A23'
    // let defaultPooladdress = '0x8a74cdE97D3448D04E692eC783fF466168793e46'
    // let collSurplusPooladdress = '0x18D5461B6beAd1F2DA97797f7252719Ef00782DC'
    // let hintHelpersaddress = '0x78531b8CcD6561491Fa691BaF4534443a9D7823a'
    // let unipooladdress = '0x8E82E905DCF4220dfa431712893Fc943F6FEcA93'
    // let lUSDTokenaddress = '0x4Af19091C9AbB1c169bbc5af34a806b08956B52C';
    // let lQTYTokenaddress = '0x3cFa2553a96d9ea51aacfa1c86347A5Bf7C85516'



    const priceFeed = await ethers.getContractAt("PriceFeed", priceFeed.address, deployer);
    await priceFeed.setAddresses('0x0715A7794a1dc8e42615F059dD6e406A6594651A', {gasLimit: 10000000, gasPrice: ethers.utils.parseUnits('5', 'gwei')});


    const sortedTroves = await ethers.getContractAt('SortedTroves', sortedTroves.address, deployer);
    await sortedTroves.setParams(30, troveManager.address, borrowerOperations.address,{gasLimit: 10000000});

    const troveManager = await ethers.getContractAt('TroveManager', troveManager.address, deployer);
    await troveManager.setAddresses(borrowerOperations.address,
                                    activePool.address,
                                    defaultPool.address,
                                    stabilityPool.address,
                                    gasPool.address,
                                    collSurplusPool.address,
                                    priceFeed.address,
                                    lUSDToken.address,
                                    sortedTroves.address,
                                    lQTYToken.address,
                                    lQTYStaking.address,{gasLimit: 10000000});
    
    const borrowerOperations = await ethers.getContractAt('BorrowerOperations', borrowerOperations.address, deployer);
    await borrowerOperations.setAddresses(troveManager.address,
        activePool.address,
        defaultPool.address,
        stabilityPool.address,
        gasPool.address,
        collSurplusPool.address,
        priceFeed.address,
        sortedTroves.address,
        lUSDToken.address,
        lQTYStaking.address,{gasLimit: 10000000});

    const activePool = await ethers.getContractAt('ActivePool', activePool.address, deployer);
    await activePool.setAddresses(borrowerOperations.address,
        troveManager.address,
        stabilityPool.address,
        defaultPool.address,{gasLimit: 10000000});
    
    const stabilityPool = await ethers.getContractAt('StabilityPool', stabilityPool.address, deployer);
    await stabilityPool.setAddresses(borrowerOperations.address,
        troveManager.address,
        activePool.address,
        lUSDToken.address,
        sortedTroves.address,
        priceFeed.address,
        communityIssuance.address,{gasLimit: 10000000});
    
    const defaultPool = await ethers.getContractAt('DefaultPool', defaultPool.address, deployer);
    await defaultPool.setAddresses(troveManager.address,
        activePool.address,{gasLimit: 10000000});
    
    const collSurplusPool = await ethers.getContractAt('CollSurplusPool', collSurplusPool.address, deployer);
    await collSurplusPool.setAddresses(borrowerOperations.address,
        troveManager.address,
        activePool.address,{gasLimit: 10000000});

    const hintHelpers = await ethers.getContractAt('HintHelpers', hintHelpers.address, deployer);
    await hintHelpers.setAddresses(sortedTroves.address,
        troveManager.address,{gasLimit: 10000000});

    const lQTYStaking = await ethers.getContractAt('LQTYStaking', lQTYStaking.address, deployer);
    await lQTYStaking.setAddresses(lQTYToken.address,
        lUSDToken.address,
        troveManager.address,
        borrowerOperations.address,
        activePool.address, {gasLimit: 10000000});

    console.log('All linking done!')

    return;
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