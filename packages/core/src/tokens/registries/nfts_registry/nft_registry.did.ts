export default ({ IDL }) => {
  const detail_value = IDL.Rec()
  detail_value.fill(
    IDL.Variant({
      I64: IDL.Int64,
      U64: IDL.Nat64,
      Vec: IDL.Vec(detail_value),
      Slice: IDL.Vec(IDL.Nat8),
      Text: IDL.Text,
      True: IDL.Null,
      False: IDL.Null,
      Float: IDL.Float64,
      Principal: IDL.Principal,
    }),
  )
  const nft_canister = IDL.Record({
    thumbnail: IDL.Text,
    name: IDL.Text,
    frontend: IDL.Opt(IDL.Text),
    description: IDL.Text,
    details: IDL.Vec(IDL.Tuple(IDL.Text, detail_value)),
    principal_id: IDL.Principal,
  })
  const operation_error = IDL.Variant({
    NotAuthorized: IDL.Null,
    BadParameters: IDL.Null,
    Unknown: IDL.Text,
    NonExistentItem: IDL.Null,
  })
  const operation_response = IDL.Variant({
    Ok: IDL.Opt(IDL.Text),
    Err: operation_error,
  })
  return IDL.Service({
    add: IDL.Func([nft_canister], [operation_response], []),
    get: IDL.Func([IDL.Principal], [IDL.Opt(nft_canister)], ["query"]),
    get_all: IDL.Func([], [IDL.Vec(nft_canister)], ["query"]),
    name: IDL.Func([], [IDL.Text], ["query"]),
    remove: IDL.Func([IDL.Principal], [operation_response], []),
    set_controller: IDL.Func([IDL.Principal], [operation_response], []),
  })
};
export const init = () => {
  return []
}
