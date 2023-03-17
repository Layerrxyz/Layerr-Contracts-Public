// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface ILayerrVariables {
  function viewWithdraw() view external returns(address);
  function viewSigner() view external returns(address);
  function viewFee(address _address) view external returns(uint);
  function viewFlatFee(address _address) view external returns(uint);
}