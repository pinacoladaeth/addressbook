pragma solidity ^0.4.18;

import "./ENS.sol";
import "./TemporaryHashRegistrar.sol";
import "./PublicResolver.sol";
import "./ReverseRegistrar.sol";

contract Pinacolada {
  ENS public registry;
  Registrar public registrar;
  PublicResolver public resolver;
  ReverseRegistrar public reverseRegistrar;

  mapping (address => address[]) public addrGraph;
  mapping (address => string) public profile;
  event Connection (address from, address to);



  function Pinacolada (address registryA, address registrarA, address resolverA, address reverseRegistrarA) public{
    registry = ENS(registryA);
    registrar = Registrar(registrarA);
    resolver = PublicResolver(resolverA);
    reverseRegistrar = ReverseRegistrar(reverseRegistrarA);
  }


    function registerFriend( bytes32 _friendNameHash, address _friendAddr) public {
        address friendAddr = resolver.addr(_friendNameHash);
        if(friendAddr!=_friendAddr) revert();
        addrGraph[msg.sender].push(_friendAddr);
        Connection(msg.sender, _friendAddr);
    }

    function updateProfile (bytes32 _nameHash, string _ipfsContentHash) public {
        address myAddr = resolver.addr(_nameHash);
        if(myAddr != msg.sender) revert();

        profile[msg.sender] = _ipfsContentHash;
    }

    function getProfile (address _addr) public view returns (string){
        return profile[_addr];
    }

    function isMember(address _person) public view returns (bool) {
        return addrGraph[_person].length != 0;
    }
}
