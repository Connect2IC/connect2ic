export const idlFactory = ({ IDL }) => {
  const ID = IDL.Principal;
  const Wallet = IDL.Text;
  const People = IDL.Record({
    id: ID,
    name: IDL.Text,
    wallet: Wallet,
  });
  const PeopleItem = IDL.Record({ principal: ID, people: People });
  const PeopleUpdate = IDL.Record({ name: IDL.Text, wallet: Wallet });
  const Error = IDL.Variant({
    WrongCaller: IDL.Null,
    NotFound: IDL.Null,
    NotAuthorized: IDL.Null,
    AlreadyExists: IDL.Null,
  });
  const Result = IDL.Variant({ ok: People, err: Error });
  const Result_1 = IDL.Variant({ ok: IDL.Bool, err: Error });
  const BuyMeCoffee = IDL.Service({
    allPeople: IDL.Func([], [IDL.Vec(PeopleItem)], ['query']),
    create: IDL.Func([PeopleUpdate], [Result], []),
    delete: IDL.Func([], [Result_1], []),
    read: IDL.Func([], [Result], ['query']),
    update: IDL.Func([PeopleUpdate], [Result], []),
  });
  return BuyMeCoffee;
};
export const init = ({ IDL }) => [];
