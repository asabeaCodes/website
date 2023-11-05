// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract Library {
    string[] books;

    function addBook(string memory _title) public {
        books.push(_title);
    }

    function removeBook(uint _id) public {
        delete books[_id];
    }

    function viewShelf() public  view returns (string[] memory) {
        return books;
    }
}cl