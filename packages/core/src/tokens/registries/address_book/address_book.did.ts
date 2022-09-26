const addressBookIDL = ({ IDL }) => {
  const valueType = IDL.Variant({
    PrincipalId: IDL.Principal,
    AccountId: IDL.Text,
    Icns: IDL.Text,
  })

  const address = IDL.Record({
    name: IDL.Text,
    description: IDL.Opt(IDL.Text),
    emoji: IDL.Opt(IDL.Text),
    value: valueType,
  })
  const operation_error = IDL.Variant({
    NotAuthorized: IDL.Null,
    BadParameters: IDL.Null,
    Unknown: IDL.Text,
    NonExistentItem: IDL.Null,
  })
  const operation_response = IDL.Variant({
    Ok: IDL.Null,
    Err: operation_error,
  })
  return IDL.Service({
    add: IDL.Func([address], [operation_response], []),
    get_all: IDL.Func([], [IDL.Vec(address)], []),
    name: IDL.Func([], [IDL.Text], ["query"]),
    remove: IDL.Func([IDL.Text], [operation_response], []),
  })
}

export default addressBookIDL
