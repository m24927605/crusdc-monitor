export enum WsEventName {
  NewBlock = 'block',
  Error = 'error'
}

export enum crUSDCEventName {
  Mint = 'Mint',
  Redeem = 'Redeem',
  Borrow = 'Borrow',
  RepayBorrow = 'RepayBorrow'
}

export enum eventImplementation {
  Mint = 'event Mint(address minter, uint mintAmount, uint mintTokens)',
  Redeem = 'event Redeem(address redeemer, uint redeemAmount, uint redeemTokens)',
  Borrow = 'event Borrow(address borrower, uint borrowAmount, uint accountBorrows, uint totalBorrows)',
  RepayBorrow = 'event RepayBorrow(address payer, address borrower, uint repayAmount, uint accountBorrows, uint totalBorrows)'
}