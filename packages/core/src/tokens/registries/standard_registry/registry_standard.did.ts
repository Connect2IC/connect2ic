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
  const metadata = IDL.Record({
    thumbnail: IDL.Text,
    name: IDL.Text,
    frontend: IDL.Opt(IDL.Text),
    description: IDL.Text,
    principal_id: IDL.Principal,
    details: IDL.Vec(IDL.Tuple(IDL.Text, detail_value)),
  })
  const error = IDL.Variant({
    NotAuthorized: IDL.Null,
    BadParameters: IDL.Null,
    Unknown: IDL.Text,
    NonExistantCanister: IDL.Null,
  })
  const response = IDL.Variant({ Ok: IDL.Opt(IDL.Text), Err: error })
  return IDL.Service({
    add: IDL.Func([metadata], [response], []),
    get: IDL.Func([IDL.Principal], [IDL.Opt(metadata)], ["query"]),
    name: IDL.Func([], [IDL.Text], ["query"]),
    remove: IDL.Func([IDL.Principal], [response], []),
  })
};
export const init = () => {
  return []
}
