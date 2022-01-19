// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;

import "./IPool.sol";


interface IActivePool is IPool {
    // --- Events ---
    event BorrowerOperationsAddressChanged(address _newBorrowerOperationsAddress);
    event TroveManagerAddressChanged(address _newTroveManagerAddress);
    event ActivePoolLUSDDebtUpdated(uint _LUSDDebt);
    event ActivePoolWETHBalanceUpdated(uint _ETH);

    // --- Functions ---
    function sendWETH(address _account, uint _amount) external;
    function addCollToPool(uint _collValue, address _collTokenAddress, address _sender) external;
    function addWETHToPool(uint _collValue, address _collTokenAddress, address _sender) external;
    function addWBTCToPool(uint _collValue, address _collTokenAddress, address _sender) external;
    function addWMATICToPool(uint _collValue, address _collTokenAddress, address _sender) external;
}
