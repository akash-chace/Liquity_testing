// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;

import './Interfaces/IActivePool.sol';
import './Dependencies/IERC20.sol';
import "./Dependencies/SafeMath.sol";
import "./Dependencies/Ownable.sol";
import "./Dependencies/CheckContract.sol";
import "./Dependencies/console.sol";

/*
 * The Active Pool holds the ETH collateral and LUSD debt (but not LUSD tokens) for all active troves.
 *
 * When a trove is liquidated, it's ETH and LUSD debt are transferred from the Active Pool, to either the
 * Stability Pool, the Default Pool, or both, depending on the liquidation conditions.
 *
 */
contract ActivePool is Ownable, CheckContract, IActivePool{
    using SafeMath for uint256;

    string constant public NAME = "ActivePool";

    address public borrowerOperationsAddress;
    address public troveManagerAddress;
    address public stabilityPoolAddress;
    address public defaultPoolAddress;
    uint256 internal WETH;  // deposited ether tracker
    uint256 internal LUSDDebt;
    mapping(string => uint256) internal collTracker;
    mapping(string => uint256) internal debtTracker;

    // --- Events ---

    event BorrowerOperationsAddressChanged(address _newBorrowerOperationsAddress);
    event TroveManagerAddressChanged(address _newTroveManagerAddress);
    event ActivePoolLUSDDebtUpdated(uint _LUSDDebt);
    event ActivePoolWETHBalanceUpdated(uint _WETH);

    // --- Contract setters ---

    function setAddresses(
        address _borrowerOperationsAddress,
        address _troveManagerAddress,
        address _stabilityPoolAddress,
        address _defaultPoolAddress
    )
        external
        onlyOwner
    {
        checkContract(_borrowerOperationsAddress);
        checkContract(_troveManagerAddress);
        checkContract(_stabilityPoolAddress);
        checkContract(_defaultPoolAddress);

        borrowerOperationsAddress = _borrowerOperationsAddress;
        troveManagerAddress = _troveManagerAddress;
        stabilityPoolAddress = _stabilityPoolAddress;
        defaultPoolAddress = _defaultPoolAddress;

        emit BorrowerOperationsAddressChanged(_borrowerOperationsAddress);
        emit TroveManagerAddressChanged(_troveManagerAddress);
        emit StabilityPoolAddressChanged(_stabilityPoolAddress);
        emit DefaultPoolAddressChanged(_defaultPoolAddress);
    }

    // --- Getters for public variables. Required by IPool interface ---

    /*
    * Returns the ETH state variable.
    *
    *Not necessarily equal to the the contract's raw ETH balance - ether can be forcibly sent to contracts.
    */
    function getColl(string memory _collType) external view returns (uint) {
        return collTracker[_collType];
    }

    function getDebt(string memory _collType) external view returns (uint) {
        return debtTracker[_collType];
    }

    // --- Pool functionality ---

    // function addCollToPool(uint _collValue, address _tokenAddress, address _sender) external override {
    //     _requireCallerIsBorrowerOperationsOrDefaultPool();
    //     WETH = WETH.add(_collValue);
    //     bool success = IERC20(_tokenAddress).transferFrom(_sender, address(this), _collValue);
    //     require(success, "ActivePool: WETH transfer failed");
    //     emit ActivePoolWETHBalanceUpdated(WETH);
    // }

    function addWETHToPool(uint _collValue, address _tokenAddress, address _sender) external override {
        _addCollToPool("WETH", _collValue, _tokenAddress, _sender);
    }

    function addWBTCToPool(uint _collValue, address _tokenAddress, address _sender) external override {
        _addCollToPool("WBTC", _collValue, _tokenAddress, _sender);
    }

    function addWMATICToPool(uint _collValue, address _tokenAddress, address _sender) external override {
        _addCollToPool("WMATIC", _collValue, _tokenAddress, _sender);
    }

    function _addCollToPool(string memory collType, uint256 _collValue, address _tokenAddress, address _sender) internal {
        _requireCallerIsBorrowerOperationsOrDefaultPool();
        collTracker[collType] = collTracker[collType].add(_collValue);
        bool success = IERC20(_tokenAddress).transferFrom(_sender, address(this), _collValue);
        require(success, "ActivePool: WETH transfer failed");
        emit ActivePoolWETHBalanceUpdated(WETH);
    }

    function sendWETH(address _account, uint _amount) external override {
        _requireCallerIsBOorTroveMorSP();
        WETH = WETH.sub(_amount);
        emit ActivePoolWETHBalanceUpdated(WETH);
        emit EtherSent(_account, _amount);

        (bool success, ) = _account.call{ value: _amount }("");
        require(success, "ActivePool: sending ETH failed");
    }

    function increaseLUSDDebt(uint _amount) external override {
        _requireCallerIsBOorTroveM();
        LUSDDebt  = LUSDDebt.add(_amount);
        ActivePoolLUSDDebtUpdated(LUSDDebt);
    }

    function decreaseLUSDDebt(uint _amount) external override {
        _requireCallerIsBOorTroveMorSP();
        LUSDDebt = LUSDDebt.sub(_amount);
        ActivePoolLUSDDebtUpdated(LUSDDebt);
    }

    // --- 'require' functions ---

    function _requireCallerIsBorrowerOperationsOrDefaultPool() internal view {
        require(
            msg.sender == borrowerOperationsAddress ||
            msg.sender == defaultPoolAddress,
            "ActivePool: Caller is neither BO nor Default Pool");
    }

    function _requireCallerIsBOorTroveMorSP() internal view {
        require(
            msg.sender == borrowerOperationsAddress ||
            msg.sender == troveManagerAddress ||
            msg.sender == stabilityPoolAddress,
            "ActivePool: Caller is neither BorrowerOperations nor TroveManager nor StabilityPool");
    }

    function _requireCallerIsBOorTroveM() internal view {
        require(
            msg.sender == borrowerOperationsAddress ||
            msg.sender == troveManagerAddress,
            "ActivePool: Caller is neither BorrowerOperations nor TroveManager");
    }

    // --- Fallback function ---

    // receive() external payable {
    //     _requireCallerIsBorrowerOperationsOrDefaultPool();
    //     ETH = ETH.add(msg.value);
    //     emit ActivePoolETHBalanceUpdated(ETH);
    // }
}
