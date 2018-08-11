pragma solidity ^0.4.21;

contract Pinacoladaeth {
 

    mapping (address=>address[]) graph;
    
    function registerFriend(string ensName, address _friend) public {
        
    }
    
    function isMember(address _person) public view returns (bool) {
        return graph[_person].length != 0;
    }
}
