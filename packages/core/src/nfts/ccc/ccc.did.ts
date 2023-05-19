export const idlFactory = ({ IDL }) => {
  const TokenIndex__1 = IDL.Nat
  const TokenIndex = IDL.Nat
  const TransferResponse = IDL.Variant({
    ok: TokenIndex,
    err: IDL.Variant({
      ListOnMarketPlace: IDL.Null,
      NotAllowTransferToSelf: IDL.Null,
      NotOwnerOrNotApprove: IDL.Null,
      Other: IDL.Null,
    }),
  })

  const TokenDetails = IDL.Record({
    id: IDL.Nat,
    rarityScore: IDL.Float64,
  })

  const GetTokenResponse = IDL.Variant({
    ok: TokenDetails,
    err: IDL.Variant({ NotFoundIndex: IDL.Null }),
  })
  const C2NFT = IDL.Service({
    getAllNFT: IDL.Func([IDL.Principal], [IDL.Vec(IDL.Tuple(TokenIndex__1, IDL.Principal))], ["query"]),
    getNftStoreCIDByIndex: IDL.Func([TokenIndex__1], [IDL.Principal], ["query"]),
    getTokenById: IDL.Func([IDL.Nat], [GetTokenResponse], ["query"]),
    transferFrom: IDL.Func([IDL.Principal, IDL.Principal, TokenIndex__1], [TransferResponse], []),
  })
  return C2NFT
};
export const init = ({ IDL }) => {
  return [IDL.Principal, IDL.Principal, IDL.Principal]
}
