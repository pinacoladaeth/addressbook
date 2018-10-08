pragma solidity ^0.4.22;

import "./ENS.sol";
import "./ReverseRegistrar.sol";
import "./PublicResolver.sol";

// contract Resolver {
//     function supportsInterface(bytes4 interfaceID) public pure returns (bool);
//     function addr(bytes32 node) public view returns (address);
//     function setAddr(bytes32 node, address addr) public;
//     function setName(bytes32 node, string name) public;
// }

/**
 * @dev Provides a default implementation of a resolver for reverse records,
 * which permits only the owner to update it.
 */
contract DefaultReverseResolver is PublicResolver {
    // namehash('addr.reverse')
    bytes32 constant ADDR_REVERSE_NODE = 0x91d1777781884d03a6757a803996e38de2a42967fb37eeaca72729271025a9e2;

    ENS public ens;
    mapping (bytes32 => string) public name;

    /**
     * @dev Only permits calls by the reverse registrar.
     * @param node The node permission is required for.
     */
    modifier owner_only(bytes32 node) {
        require(msg.sender == ens.owner(node));
        _;
    }

    /**
     * @dev Constructor
     * @param ensAddr The address of the ENS registry.
     */
    constructor (ENS ensAddr) public {
        ens = ensAddr;

        // Assign ownership of the reverse record to our deployer
        ReverseRegistrar registrar = ReverseRegistrar(ens.owner(ADDR_REVERSE_NODE));
        if (address(registrar) != 0) {
            registrar.claim(msg.sender);
        }
    }

    /**
     * @dev Sets the name for a node.
     * @param node The node to update.
     * @param _name The name to set.
     */
    function setName(bytes32 node, string _name) public owner_only(node) {
        name[node] = _name;
    }
}
