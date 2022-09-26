/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */

export default ({ IDL }) => {
  const DABCollection = IDL.Record({
    icon: IDL.Text,
    name: IDL.Text,
    description: IDL.Text,
    principal_id: IDL.Principal,
    standard: IDL.Text,
  })
  const OperationError = IDL.Variant({
    NotAuthorized: IDL.Null,
    BadParameters: IDL.Null,
    NonExistentItem: IDL.Null,
    ParamatersNotPassed: IDL.Null,
  })
  const OperationResponse = IDL.Variant({
    Ok: IDL.Bool,
    Err: OperationError,
  })
  const NFTCanister = IDL.Record({
    icon: IDL.Text,
    name: IDL.Text,
    description: IDL.Text,
    timestamp: IDL.Nat64,
    principal_id: IDL.Principal,
    standard: IDL.Text,
  })
  return IDL.Service({
    add: IDL.Func([DABCollection], [OperationResponse], []),
    edit: IDL.Func([IDL.Text, IDL.Opt(IDL.Principal), IDL.Opt(IDL.Text), IDL.Opt(IDL.Text), IDL.Opt(IDL.Text)], [OperationResponse], []),
    get_all: IDL.Func([], [IDL.Vec(NFTCanister)], []),
    get_canister: IDL.Func([IDL.Text], [IDL.Opt(NFTCanister)], ["query"]),
    name: IDL.Func([], [IDL.Text], ["query"]),
    remove: IDL.Func([IDL.Text], [OperationResponse], []),
  })
};
export const init = () => {
  return []
}
