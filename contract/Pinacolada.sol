pragma solidity ^0.4.24;

import "./ENS.sol"; 
import "./TemporaryHashRegistrar.sol"; 
import "./PublicResolver.sol"; 
import "./ReverseRegistrar.sol"; 

contract ESENSFactory {
  ENS public registry;
  Registrar public registrar;
  PublicResolver public resolver;
  ReverseRegistrar public reverseRegistrar;

  uint public network_id;
  
  constructor (address registryA, address registrarA, address resolverA, address reverseRegistrarA) public{
    registry = ENS(registryA);
    registrar = Registrar(registrarA);
    resolver = PublicResolver(resolverA);
    reverseRegistrar = ReverseRegistrar(reverseRegistrarA);
  }
}
