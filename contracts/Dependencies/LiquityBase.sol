// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;

import "./BaseMath.sol";
import "./LiquityMath.sol";
import "../Interfaces/IActivePool.sol";
import "../Interfaces/IDefaultPool.sol";
import "../Interfaces/IPriceFeed.sol";
import "../Interfaces/ILiquityBase.sol";

/* 
* Base contract for TroveManager, BorrowerOperations and StabilityPool. Contains global system constants and
* common functions. 
*/
contract LiquityBase is BaseMath, ILiquityBase {
    using SafeMath for uint;

    uint constant public _100pct = 1000000000000000000; // 1e18 == 100%

    // Minimum collateral ratio for individual troves
    // uint constant public MCR = 1100000000000000000; // 110%
    uint public MCR;

    // Critical system collateral ratio. If the system's total collateral ratio (TCR) falls below the CCR, Recovery Mode is triggered.
    // uint constant public CCR = 1500000000000000000; // 150%
    uint public CCR;

    // Amount of LUSD to be locked in gas pool on opening troves
    uint public LUSD_GAS_COMPENSATION;
    // uint constant public LUSD_GAS_COMPENSATION = 200e18;

    // Minimum amount of net LUSD debt a trove must have
    uint public MIN_NET_DEBT;
    // uint constant public MIN_NET_DEBT = 1800e18;
    // uint constant public MIN_NET_DEBT = 0; 

    uint constant public PERCENT_DIVISOR = 200; // dividing by 200 yields 0.5%

    // uint constant public BORROWING_FEE_FLOOR = DECIMAL_PRECISION / 1000 * 5; // 0.5%
    uint public BORROWING_FEE_FLOOR;

    address owner;

    IActivePool public activePool;

    IDefaultPool public defaultPool;

    IPriceFeed public override priceFeed;

    constructor() public {
        owner = msg.sender;
        MCR = 1100000000000000000; // 110%
        CCR = 1500000000000000000; // 150%
        MIN_NET_DEBT = 1800e18;
        LUSD_GAS_COMPENSATION = 200e18;
        BORROWING_FEE_FLOOR = DECIMAL_PRECISION / 1000 * 5; // 0.5%
    }
    // --- Gas compensation functions ---

    // Returns the composite debt (drawn debt + gas compensation) of a trove, for the purpose of ICR calculation
    function _getCompositeDebt(uint _debt) internal view returns (uint) {
        return _debt.add(LUSD_GAS_COMPENSATION);
    }

    function _getNetDebt(uint _debt) internal view returns (uint) {
        return _debt.sub(LUSD_GAS_COMPENSATION);
    }

    // admin functions
    function changeMCR(uint _MCR) external{
        _requireCallerIsOwner();
        MCR = _MCR;
    }

    function changeCCR(uint _CCR) external {
        _requireCallerIsOwner();
        CCR = _CCR;
    }

    function changeMinNetDebt(uint _MIN_NET_DEBT) external {
        _requireCallerIsOwner();
        MIN_NET_DEBT = _MIN_NET_DEBT;
    }

    function changeBorrowFeeFloor(uint _BORROWING_FEE_FLOOR) external {
        _requireCallerIsOwner();
        BORROWING_FEE_FLOOR = _BORROWING_FEE_FLOOR;
    }

    function changeLusdGasCompensation(uint _LUSD_GAS_COMPENSATION) external {
        _requireCallerIsOwner();
        LUSD_GAS_COMPENSATION = _LUSD_GAS_COMPENSATION;
    }

    // Return the amount of ETH to be drawn from a trove's collateral and sent as gas compensation.
    function _getCollGasCompensation(uint _entireColl) internal pure returns (uint) {
        return _entireColl / PERCENT_DIVISOR;
    }

    function getEntireSystemColl() public view returns (uint entireSystemColl) {
        uint activeColl = activePool.getETH();
        uint liquidatedColl = defaultPool.getETH();

        return activeColl.add(liquidatedColl);
    }

    function getEntireSystemDebt() public view returns (uint entireSystemDebt) {
        uint activeDebt = activePool.getLUSDDebt();
        uint closedDebt = defaultPool.getLUSDDebt();

        return activeDebt.add(closedDebt);
    }

    function _getTCR(uint _price) internal view returns (uint TCR) {
        uint entireSystemColl = getEntireSystemColl();
        uint entireSystemDebt = getEntireSystemDebt();

        TCR = LiquityMath._computeCR(entireSystemColl, entireSystemDebt, _price);

        return TCR;
    }

    function _checkRecoveryMode(uint _price) internal view returns (bool) {
        uint TCR = _getTCR(_price);

        return TCR < CCR;
    }

    function _requireUserAcceptsFee(uint _fee, uint _amount, uint _maxFeePercentage) internal pure {
        uint feePercentage = _fee.mul(DECIMAL_PRECISION).div(_amount);
        require(feePercentage <= _maxFeePercentage, "Fee exceeded provided maximum");
    }

    function _requireCallerIsOwner() internal view {
        require(msg.sender == owner, "LiquityBase: Caller not owner");
    }
}
