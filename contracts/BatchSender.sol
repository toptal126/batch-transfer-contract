// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";


contract BatchSender  is Ownable{

    event TransferBatch(address indexed sender, address indexed token, address[] receivers, uint256[] values);
    event TransferBatchNFT(address indexed sender, address indexed token, address[] receivers, uint256[] tokenIds);

    function batchTransfer(address token, address[] memory receivers, uint256[] memory values) public {
        require(receivers.length == values.length, "Mismatched array lengths");
        IERC20 _token = IERC20(token);
        for (uint i = 0; i < receivers.length; i++) {
            _token.transferFrom(msg.sender, receivers[i], values[i]);
        }

        emit TransferBatch(msg.sender, token, receivers, values);
    }

    function batchTransferNFT(address token, bool is721, address[] memory receivers, uint256[] memory ids) payable public {
        require(receivers.length == ids.length, "Mismatched array lengths");

        if (is721) {
            // ERC721
            for (uint i = 0; i < ids.length; i++) {
            IERC721(token).safeTransferFrom(msg.sender, receivers[i], ids[i]);
            }
        } else {
            // ERC1155
            for (uint i = 0; i < ids.length; i++) {
                IERC1155(token).safeTransferFrom(msg.sender, receivers[i], ids[i], 1, "");
            }
        }

        emit TransferBatchNFT(msg.sender, token, receivers, ids);
    }
}