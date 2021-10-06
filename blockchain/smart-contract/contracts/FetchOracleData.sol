// SPDX-License-Identifier: MIT

pragma solidity >=0.8.6;

contract FetchOracleData {
    address public owner;

    constructor() {
        owner = msg.sender;
    }
}
