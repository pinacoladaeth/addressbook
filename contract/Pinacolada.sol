pragma solidity ^0.4.18;

import "./ENS.sol"; 
import "./TemporaryHashRegistrar.sol"; 
import "./PublicResolver.sol"; 
import "./ReverseRegistrar.sol"; 
import "./strings.sol";

contract Pinacolada {
  ENS public registry;
  Registrar public registrar;
  PublicResolver public resolver;
  ReverseRegistrar public reverseRegistrar;
  mapping (address => address[]) public graph;
  event Connection (address from, address to);


//   function Pinacolada (address registryA, address registrarA, address resolverA, address reverseRegistrarA) public{
//     registry = ENS(registryA);
//     registrar = Registrar(registrarA);
//     resolver = PublicResolver(resolverA);
//     reverseRegistrar = ReverseRegistrar(reverseRegistrarA);
//   }
  

    function registerFriend(address _friend) public {
        graph[msg.sender].push(_friend);
        Connection(msg.sender, _friend);
    }
    
    function isMember(address _person) public view returns (bool) {
        return graph[_person].length != 0;
    }
}