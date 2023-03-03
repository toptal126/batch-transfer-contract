// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract NFTAave {

    // Enum representing Pool status
    enum PoolType {
        Changeable,
        Inchangeable
    }

    // Enum representing Pool status
    enum PoolStatus {
        Pending,
        Ready,
        Disabled
    }
    // Enum representing interest type
    enum InterestType  {
        Manual,
        Dynamic
    }

    // pools:: array of pools
    struct Pool {
        // owner:: Pool creator
        address owner;
        // status:: Pool status
        PoolStatus status;
        // depositedAmount:: Inital pool size in wei
        uint256 depositedAmount;
        // borrowedAmount:: Total borrowed amount
        uint256 borrowedAmount;
        // availableAmount:: Available amount
        uint256 availableAmount;
        // usableAmount:: Usable amount
        uint256 usableAmount;
        // nftLocked:: Number of locked NFTs
        uint256 nftLocked;
        // totalLiquidations:: Accumulated amount of liquidations
        uint256 totalLiquidations;
        // totalLoans:: Accumulated amount of loans
        uint256 totalLoans;
        // totalInterest:: Accumulated amount of interest
        uint256 totalInterest;
        // depositedAt:: Deposited timestamp
        uint256 depositedAt;
        // createdAt:: Created timestamp
        uint256 createdAt;
        // updatedAt:: Updated timestamp
        uint256 updatedAt;
        // lastLoanAt:: Last loan timestamp
        uint256 lastLoanAt;
        

        // Properties used to create a pool

        // loanToValue:: Loan to value of the NFT you want to give, in percentage, ex: 30
        uint256 loanToValue;
        // maxAmount:: May amount per loan you want to do, default should be pool size
        uint256 maxAmount;
        // interestType:: Dynamic will use our own model, if set to manual, you have to provide fees per day to pay
        InterestType interestType;
        // interestRate:: If interestType set to manual, provide interest rate per day, in %
        uint256 interestRate;
        // maxDuration:: max duration of a loan
        uint256 maxDuration;
        // compound:: if set to true, reinvest profit in pool, otherwise they are sent to your wallet
        bool compound;
        address[] collections;
    }
    mapping (address => Pool) private pools;
    mapping (uint256 => address) public poolOwners;
    uint256 public totalPools;

    /// @notice Create a new pool with provided information
    function createPool(
        uint256 _loanToValue,
        uint256 _maxAmount,
        InterestType _interestType,
        uint256 _interestRate,
        uint256 _maxDuration,
        bool _compound,
        address[] memory _collections
    ) external payable {
        Pool storage newPool = pools[msg.sender];
        newPool.loanToValue = _loanToValue;
        newPool.maxAmount = _maxAmount;
        newPool.interestType = _interestType;
        newPool.interestRate = _interestRate;
        newPool.maxDuration = _maxDuration;
        newPool.compound = _compound;
        newPool.collections = _collections;

        poolOwners[totalPools] = msg.sender;
        totalPools ++;
    }

    function getPoolByOwner (address _owner) public view returns(Pool memory){
        return pools[_owner];
    }
    
    function getPoolById (uint256 _poolId) public view returns (Pool memory) {
        return pools[poolOwners[_poolId]];
    }
}