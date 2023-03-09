// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "operator-filter-registry/src/DefaultOperatorFilterer.sol";

interface ILayerrVariables {
  function viewWithdraw() view external returns(address);
  function viewFee(address _address) view external returns(uint);
  function viewFlatFee(address _address) view external returns(uint);
}

contract Layerr721 is DefaultOperatorFilterer, Initializable, ERC721, ERC2981 {
  mapping(uint => string) public URIs;
  mapping(uint => uint) public tokenPrices;
  mapping(uint => uint) public tokenSaleStarts;
  mapping(uint => uint) public tokenSaleEnds;
  mapping(uint => bool) public isAuction;


  address public owner;
  address public LayerrXYZ;

  string public name;
  string public contractURI_;
  string public symbol;

  modifier onlyOwner() {
    require(msg.sender == owner, "ERROR");
    _;
  }

  function mintFixedPrice(uint _id) public payable {
    require(block.timestamp >= tokenSaleStarts[_id], "Sale has not started");
    require(block.timestamp <= tokenSaleEnds[_id], "Sale has ended");
    require(tokenPrices[_id] + viewFlatFee() <= msg.value, "Incorrect amount sent");
    
    payable(owner).transfer(tokenPrices[_id] * (100 - viewFee()) / 100);

    _mint(msg.sender, _id);
  }

  /*
  * OWNER FUNCTIONS
  */
  function setContractURI(string memory _contractURI) public onlyOwner {
    contractURI_ = _contractURI;
  }

  function initialize (
    string memory _name,
    string memory _symbol,
    string memory _contractURI,
    uint96 pct,
    address royaltyReciever,
    address _LayerrXYZ,
    bool subscribeOpensea
  ) public initializer {
    owner = tx.origin;
    name = _name;
    symbol = _symbol;
    contractURI_ = _contractURI;
    _setDefaultRoyalty(royaltyReciever, pct);
    LayerrXYZ = _LayerrXYZ;

    if (subscribeOpensea) {
      OperatorFilterer.OPERATOR_FILTER_REGISTRY.registerAndSubscribe(address(this), address(0x3cc6CddA760b79bAfa08dF41ECFA224f810dCeB6));
    }
  }

  function addToken(
    uint _id,
    string memory _uri,
    uint _price,
    uint _saleStart,
    uint _saleEnd
  ) public onlyOwner {
    URIs[_id] = _uri;
    tokenPrices[_id] = _price;
    tokenSaleStarts[_id] = _saleStart;
    tokenSaleEnds[_id] = _saleEnd;
  }

  function modifySalePeriod(uint _id, uint _saleStart, uint _saleEnd) public onlyOwner {
    tokenSaleStarts[_id] = _saleStart;
    tokenSaleEnds[_id] = _saleEnd;
  }


  /** OWNER FUNCTIONS */
  function editContract (address receiver, uint96 feeNumerator, string memory _name, string memory _symbol) external onlyOwner {
    _setDefaultRoyalty(receiver, feeNumerator);
    name = _name;
    symbol = _symbol;
  }

  function viewWithdraw() public view returns (address) {
    address returnWallet = ILayerrVariables(LayerrXYZ).viewWithdraw();
    return returnWallet;
  }

  function viewFee() public view returns (uint) {
    uint returnFee = ILayerrVariables(LayerrXYZ).viewFee(address(this));
    return returnFee;
  }

  function viewFlatFee() public view returns (uint) {
    uint returnFee = ILayerrVariables(LayerrXYZ).viewFlatFee(address(this));
    return returnFee;
  }

  function withdraw() public {
    require(msg.sender == owner || msg.sender == viewWithdraw(), "Not owner or Layerr");
    require(msg.sender == tx.origin, "Cannot withdraw from a contract");
    uint256 contractBalance = address(this).balance;

    payable(viewWithdraw()).transfer(address(this).balance);
  }

  /** METADATA FUNCTIONS */
  function contractURI() public view returns (string memory) {
    return contractURI_;
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    require(_ownerOf[tokenId] != address(0), "NOT_MINTED");
    return URIs[tokenId];
  }

  /** OPENSEA OVERRIDES */
  function setApprovalForAll(address operator, bool approved) public override onlyAllowedOperatorApproval(operator) {
      super.setApprovalForAll(operator, approved);
  }

  function approve(address operator, uint256 tokenId) public override onlyAllowedOperatorApproval(operator) {
      super.approve(operator, tokenId);
  }

  function transferFrom(address from, address to, uint256 tokenId) public override onlyAllowedOperator(from) {
      super.transferFrom(from, to, tokenId);
  }

  function safeTransferFrom(address from, address to, uint256 tokenId) public override onlyAllowedOperator(from) {
      super.safeTransferFrom(from, to, tokenId);
  }

  function safeTransferFrom(address from, address to, uint256 tokenId, bytes calldata data) public override onlyAllowedOperator(from) {
      super.safeTransferFrom(from, to, tokenId, data);
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC2981) returns (bool) {
    return 
      ERC721.supportsInterface(interfaceId) ||
      ERC2981.supportsInterface(interfaceId);
  }
}
