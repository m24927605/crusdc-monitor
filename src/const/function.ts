export enum crUSDCFuncName {
  BorrowRatePerBlock = 'borrowRatePerBlock',
  SupplyRatePerBlock = 'supplyRatePerBlock'
}

export enum funcImplementation {
  BorrowRatePerBlock = 'function borrowRatePerBlock() external view returns (uint)',
  SupplyRatePerBlock = 'function supplyRatePerBlock() external view returns (uint)'
}