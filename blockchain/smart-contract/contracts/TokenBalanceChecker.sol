// SPDX-License-Identifier: MIT

pragma solidity >=0.8.6;

// address = 0x0 when get eth

// ==============================
// Test case :
// 1. Call temp account : 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48
// 2. Set token address to non smart contract address
// 3. Set token address to non ERC20 smart contract address
// ==============================

abstract contract Token {
    function balanceOf(address) public view virtual returns (uint256);
}

contract TokenBalanceChecker {
    // prevent someone paying to this contract
    fallback() external payable {
        revert("BalanceChecker does not accept payments");
    }

    receive() external payable {
        revert("BalanceChecker does not accept payments");
    }

    function getTokenBalance(address userAddr, address tokenAddr)
        public
        view
        returns (uint256)
    {
        uint256 tokenCodeSize;

        // check whether address is smart contract
        // if 0 : normal address
        // if > 0 : smart contract
        assembly {
            tokenCodeSize := extcodesize(tokenAddr)
        }

        //0x70a08231 : signature of balanceOf function
        // if (tokenCodeSize > 0 && tokenAddr.call(bytes4(0x70a08231), userAddr)) {
        if (tokenCodeSize > 0) {
            // smart contract
            return Token(tokenAddr).balanceOf(userAddr);
        } else {
            return 0;
        }
    }

    // calldata :
    function balance(address userAddr, address[] memory tokenAddrs)
        external
        view
        returns (uint256[] memory)
    {
        uint256[] memory addressBalance = new uint256[](tokenAddrs.length);

        for (uint256 i = 0; i < tokenAddrs.length; i++) {
            if (tokenAddrs[i] == address(0x0)) {
                // is eth
                addressBalance[i] = userAddr.balance;
            } else {
                addressBalance[i] = getTokenBalance(userAddr, tokenAddrs[i]);
            }
        }

        return addressBalance;
    }
}
