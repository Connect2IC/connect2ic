export default ({ IDL }) => {
  const TxError = IDL.Variant({
    InsufficientAllowance: IDL.Null,
    InsufficientBalance: IDL.Null,
    ErrorOperationStyle: IDL.Null,
    Unauthorized: IDL.Null,
    LedgerTrap: IDL.Null,
    ErrorTo: IDL.Null,
    Other: IDL.Null,
    BlockUsed: IDL.Null,
    AmountTooSmall: IDL.Null,
  })
  const TxReceipt = IDL.Variant({ Ok: IDL.Nat, Err: TxError })
  const Metadata = IDL.Record({
    fee: IDL.Nat,
    decimals: IDL.Nat8,
    owner: IDL.Principal,
    logo: IDL.Text,
    name: IDL.Text,
    totalSupply: IDL.Nat,
    symbol: IDL.Text,
  })
  const TokenInfo = IDL.Record({
    holderNumber: IDL.Nat64,
    deployTime: IDL.Nat64,
    metadata: Metadata,
    historySize: IDL.Nat64,
    cycles: IDL.Nat64,
    feeTo: IDL.Principal,
  })
  return IDL.Service({
    allowance: IDL.Func([IDL.Principal, IDL.Principal], [IDL.Nat], ["query"]),
    approve: IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    balanceOf: IDL.Func([IDL.Principal], [IDL.Nat], ["query"]),
    decimals: IDL.Func([], [IDL.Nat8], ["query"]),
    getAllowanceSize: IDL.Func([], [IDL.Nat64], ["query"]),
    getHolders: IDL.Func([IDL.Nat64, IDL.Nat64], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))], ["query"]),
    getLogo: IDL.Func([], [IDL.Text], ["query"]),
    getMetadata: IDL.Func([], [Metadata], ["query"]),
    getTokenInfo: IDL.Func([], [TokenInfo], ["query"]),
    getUserApprovals: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat))], ["query"]),
    historySize: IDL.Func([], [IDL.Nat64], ["query"]),
    mint: IDL.Func([IDL.Opt(IDL.Vec(IDL.Nat8)), IDL.Nat64], [TxReceipt], []),
    name: IDL.Func([], [IDL.Text], ["query"]),
    owner: IDL.Func([], [IDL.Principal], ["query"]),
    setFee: IDL.Func([IDL.Nat], [], []),
    setFeeTo: IDL.Func([IDL.Principal], [], []),
    setLogo: IDL.Func([IDL.Text], [], []),
    setName: IDL.Func([IDL.Text], [], []),
    setOwner: IDL.Func([IDL.Principal], [], []),
    symbol: IDL.Func([], [IDL.Text], ["query"]),
    totalSupply: IDL.Func([], [IDL.Nat], ["query"]),
    transfer: IDL.Func([IDL.Principal, IDL.Nat], [TxReceipt], []),
    transferFrom: IDL.Func([IDL.Principal, IDL.Principal, IDL.Nat], [TxReceipt], []),
    withdraw: IDL.Func([IDL.Nat64, IDL.Text], [TxReceipt], []),
  })
};
export const init = ({ IDL }) => {
  return [IDL.Text, IDL.Text, IDL.Text, IDL.Nat8, IDL.Nat, IDL.Principal, IDL.Nat, IDL.Principal, IDL.Principal]
}
