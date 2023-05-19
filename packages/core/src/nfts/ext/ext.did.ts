/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
export const idlFactory = ({ IDL }) => {
  const TokenIndex = IDL.Nat32
  const AccountIdentifier = IDL.Text
  const TokenIdentifier = IDL.Text
  const Balance = IDL.Nat
  const Time = IDL.Int
  const SubAccount = IDL.Vec(IDL.Nat8)
  const Memo = IDL.Vec(IDL.Nat8)
  const Listing = IDL.Record({
    locked: IDL.Opt(Time),
    seller: IDL.Principal,
    price: IDL.Nat64,
  })
  const User = IDL.Variant({
    principal: IDL.Principal,
    address: AccountIdentifier,
  })
  const CommonError = IDL.Variant({
    InvalidToken: TokenIdentifier,
    Other: IDL.Text,
  })

  const BalanceRequest = IDL.Record({
    token: TokenIdentifier,
    user: User,
  })
  const BalanceResult = IDL.Variant({ ok: Balance, err: CommonError })

  const DetailsResult = IDL.Variant({
    ok: IDL.Tuple(AccountIdentifier, IDL.Opt(Listing)),
    err: CommonError,
  })

  const TokensResult = IDL.Variant({
    ok: IDL.Vec(TokenIndex),
    err: CommonError,
  })
  const TokenExtResult = IDL.Variant({
    ok: IDL.Vec(IDL.Tuple(TokenIndex, IDL.Opt(Listing), IDL.Opt(IDL.Vec(IDL.Nat8)))),
    err: CommonError,
  })

  const TransferRequest = IDL.Record({
    to: User,
    token: TokenIdentifier,
    notify: IDL.Bool,
    from: User,
    memo: Memo,
    subaccount: IDL.Opt(SubAccount),
    amount: Balance,
    fee: IDL.Nat,
  })
  const TransferResult = IDL.Variant({
    ok: Balance,
    err: IDL.Variant({
      CannotNotify: AccountIdentifier,
      InsufficientBalance: IDL.Null,
      InvalidToken: TokenIdentifier,
      Rejected: IDL.Null,
      Unauthorized: AccountIdentifier,
      Other: IDL.Text,
    }),
  })
  const Metadata = IDL.Variant({
    fungible: IDL.Record({
      decimals: IDL.Nat8,
      metadata: IDL.Opt(IDL.Vec(IDL.Nat8)),
      name: IDL.Text,
      symbol: IDL.Text,
    }),
    nonfungible: IDL.Record({ metadata: IDL.Opt(IDL.Vec(IDL.Nat8)) }),
  })
  const MetadataResult = IDL.Variant({ ok: Metadata, err: CommonError })
  const SupplyResult = IDL.Variant({ ok: Balance, err: CommonError })
  return IDL.Service({
    extensions: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    balance: IDL.Func([BalanceRequest], [BalanceResult], ["query"]),
    details: IDL.Func([TokenIdentifier], [DetailsResult], ["query"]),
    tokens: IDL.Func([AccountIdentifier], [TokensResult], ["query"]),
    tokens_ext: IDL.Func([AccountIdentifier], [TokenExtResult], ["query"]),
    transfer: IDL.Func([TransferRequest], [TransferResult], []),
    metadata: IDL.Func([TokenIdentifier], [MetadataResult], ["query"]),
    supply: IDL.Func([TokenIdentifier], [SupplyResult], ["query"]),
  })
};
export const init = () => {
  return []
}
