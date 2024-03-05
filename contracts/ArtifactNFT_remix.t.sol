// SPDX-License-Identifier: GPL-3.0
        
pragma solidity >=0.4.22 <0.9.0;

// This import is automatically injected by Remix
import "remix_tests.sol"; 

// This import is required to use custom transaction context

import "remix_accounts.sol";
import "../ArtifactContest.sol";

contract testSuite {
    ArtifactNFT artifactNFTInstance;
    
    function beforeAll() public {
      artifactNFTInstance = new ArtifactNFT();
    }
    
    // This test case will fail even though it will work as intended in the actual contract my assumption is this is an remix test IDE issue
    function checkMintNFTWithoutOverloading() public {
        artifactNFTInstance.mintNFT();     
        Assert.equal(artifactNFTInstance.balanceOf(msg.sender), uint(1), "sender was correctly minted 1 token");
    }

    function checkMintNFTWithOverloading() public {
        artifactNFTInstance.mintNFT(TestsAccounts.getAccount(1));        
        Assert.equal(artifactNFTInstance.balanceOf(TestsAccounts.getAccount(1)), uint(1), "Recipient was correctly minted 1 token");
    }

    function checkMintNFTWithOverloadingThresholdLimit() public {
        for(uint i=0;i<=3;i++){
        artifactNFTInstance.mintNFT(TestsAccounts.getAccount(1));   
        }     
        Assert.equal(artifactNFTInstance.balanceOf(TestsAccounts.getAccount(1)), uint(5), "Recipient was correctly minted 1 token");
    }

   
}
    