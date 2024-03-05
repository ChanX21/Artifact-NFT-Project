## ArtifactNFT: A Customizable ERC721 Contract 

This is an NFT Project which I made as part of the project of company called Artifact, The Artifact NFT smart contract implements the ERC721 standard to create a unique, non-fungible token (NFT). 

## Deployment 

![image](https://github.com/ChanX21/Artifact-NFT-Project/assets/47290661/75508744-7324-4e49-a8f2-524504e6cad8)


## Architecture 

<a href="https://imgbb.com/"><img src="https://i.ibb.co/ZMMbbnz/Untitled.png" alt="Untitled" border="0" width="50%"></a>

**Authors:**

* Chanchal Delson

**Features:**

* Implements the ERC721 standard from OpenZeppelin Contracts
* Enforces a per-user minting limit of 5 NFTs (configurable)
* Uses `ReentrancyGuard` to prevent re-entrancy attacks

**Contract Breakdown:**

* **License:** The contract uses the MIT license (see SPDX license identifier).
* **Solidity Version:** The contract is compatible with Solidity versions greater than or equal to 0.8.0.
* **Dependencies:**
    * `@openzeppelin/contracts/token/ERC721/ERC721.sol`: Provides the ERC721 standard implementation.
    * `@openzeppelin/contracts/utils/Counters.sol`: Provides a counter for tracking minted tokens.
    * `@openzeppelin/contracts/security/ReentrancyGuard.sol`: Protects against re-entrancy attacks.
* **Custom Error:** The contract defines a `Mint_Limit()` error to revert transactions exceeding the minting limit.
* **`ArtifactNFT` Contract:**
    * Inherits from `ERC721` and `ReentrancyGuard` contracts.
    * Uses `Counters.Counter` to track minted tokens.
    * Maintains a mapping (`s_userMints`) to store the number of mints per user address.
    * Defines a `MintCompletionReceipt` event emitted after successful minting.
    * Constructor:
        * Sets the ERC721 token name and symbol ("ArtifactNFT" and "ARTFCTNFT").
    * `mintNFT(address recipient)` function:
        * Checks if the recipient has already minted the maximum number of NFTs (configurable to 5).
        * Increments the token counter and mints a new NFT to the provided `recipient` address.
        * Updates the user's minting count in the `s_userMints` mapping.
        * Emits the `MintCompletionReceipt` event with details about the minted NFT and user's total mints.
        * Returns the minted NFT's token ID.
    * `mintNFT()` function (without arguments):
        * Similar to `mintNFT(address recipient)`, but mints the NFT to the transaction sender (`msg.sender`).

**Deployment and Usage:**

1. Deploy the `ArtifactNFT` contract to your preferred blockchain network.
2. Users can interact with the contract using web3 wallets or tools that support interacting with ERC721 contracts.
3. The `mintNFT` function (with or without recipient address) allows users to mint NFTs as long as they haven't reached the minting limit.

**Additional Notes:**

* This is a basic example of a customizable ERC721 contract. 
* You can modify the contract to suit your specific needs, such as changing the minting limit, adding token URI functionality, or implementing additional features.
* Refer to the OpenZeppelin documentation for detailed information about the used functionalities.

**Important!** 

* This is an unaudited code and a work in progress. Use with caution! ⚠️
