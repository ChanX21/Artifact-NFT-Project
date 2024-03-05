// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Define a custom error for minting limit
error Mint_Limit();

/**@title A Customized NFT721 Contract
 * @author Chanchal Delson
 * @notice This contract is for creating an erc-721 contract with customized features
 * @dev Counters contract is used for the token count updating 
 * and ReentrancyGuard guard for re-entrancy prevention
 */

contract ArtifactNFT is ERC721, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Define a mapping from user address to number of mints
    mapping (address => uint ) s_userMints;

    event MintCompletionReceipt(address indexed mintedTo,uint indexed tokenNumber,uint indexed totalTokensMintedForUser);
 
    constructor() ERC721("ArtifactNFT", "ARTFCTNFT") {
    }

    // @dev minftNFT() with recipient param will mint the nft to the recipient after checking if he has passed the minting threshold 
    
    function mintNFT(address recipient) external nonReentrant returns (uint256) {
        uint totalMints = s_userMints[recipient];
        if(totalMints > 4){
            revert Mint_Limit();            
        }
        
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        s_userMints[recipient]= totalMints + 1;

        emit MintCompletionReceipt(recipient,newItemId,totalMints+1);

        return newItemId;
    }    


    
    // @dev minftNFT() with sender param will mint the nft to the sender after checking if he has passed the minting threshold

    function mintNFT() external nonReentrant returns (uint256) {
         uint totalMints = s_userMints[msg.sender];
        if(totalMints > 4){
            revert Mint_Limit();
        }
        
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        s_userMints[msg.sender]= totalMints+1;

        emit MintCompletionReceipt(msg.sender,newItemId,totalMints+1);

        return newItemId;
    }
}
