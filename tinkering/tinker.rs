// SPDX-License-Identifier: MIT

pragma solidity 0.6.11;
contract Tinker{
    Sorted Troves{
        * _troveManager.getNominalICR(prevId) -> _troveManager.getNominalICR(prevId, WETH: ENUM)
        * enum collType {
            WETH,
            WBTC,
            WMATIC
        };
        * mapping(collType => Data) dataset;
        * Every function will have an additional enum parameter: collType
        e.g, insert(address _id, uint256 _NICR, address _prevId, address _nextId, enum collType)
    }
    Trove Manager{

    }

    Liquity Base{
        * enum collType
        * struct Data {
            uint public MIN_NET_DEBT,
            uint public LUSD_GAS_COMPENSATION,
            uint public MCR,
            uint public CCR
        }
        * mapping(collType => Data);
        * Every function will have an additional enum parameter: collType
        e.g, getEntireSystemColl(enum collType) -> activePool.getColl(collType), defaultPool.getColl(collType);
             getEntireSystemDebt(enum collType) -> activePool.getLUSDDebt(collType), defaultPool.getLUSDDebt(collType);
             getTCR(price, collType);
    }

    Active Pool {
        
    }



}




