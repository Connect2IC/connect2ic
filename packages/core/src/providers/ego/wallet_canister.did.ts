export const idlFactory = ({ IDL }) => {
  const ExpiryUser = IDL.Record({
    'user' : IDL.Principal,
    'expiry_timestamp' : IDL.Nat64,
    'timestamp' : IDL.Nat64,
  });
  const Result = IDL.Variant({ 'Ok' : IDL.Nat, 'Err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'Ok' : IDL.Null, 'Err' : IDL.Text });
  const CallCanisterArgs = IDL.Record({
    'args' : IDL.Vec(IDL.Nat8),
    'cycles' : IDL.Nat,
    'method_name' : IDL.Text,
    'canister' : IDL.Principal,
  });
  const CallResult = IDL.Record({ 'return' : IDL.Vec(IDL.Nat8) });
  const Result_2 = IDL.Variant({ 'Ok' : CallResult, 'Err' : IDL.Text });
  return IDL.Service({
    'add_expiry_user' : IDL.Func(
        [IDL.Principal, IDL.Opt(IDL.Nat64)],
        [ExpiryUser],
        [],
      ),
    'balance_get' : IDL.Func([], [Result], ['query']),
    'ego_canister_add' : IDL.Func([IDL.Text, IDL.Principal], [Result_1], []),
    'ego_controller_add' : IDL.Func([IDL.Principal], [Result_1], []),
    'ego_controller_remove' : IDL.Func([IDL.Principal], [Result_1], []),
    'ego_controller_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_1], []),
    'ego_op_add' : IDL.Func([IDL.Principal], [Result_1], []),
    'ego_owner_add' : IDL.Func([IDL.Principal], [Result_1], []),
    'ego_owner_remove' : IDL.Func([IDL.Principal], [Result_1], []),
    'ego_owner_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_1], []),
    'ego_user_add' : IDL.Func([IDL.Principal], [Result_1], []),
    'ego_user_remove' : IDL.Func([IDL.Principal], [Result_1], []),
    'ego_user_set' : IDL.Func([IDL.Vec(IDL.Principal)], [Result_1], []),
    'proxy_call' : IDL.Func([CallCanisterArgs], [Result_2], []),
    'set_expiry_period' : IDL.Func([IDL.Nat64], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
