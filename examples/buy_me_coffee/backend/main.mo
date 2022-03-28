import Map "mo:base/HashMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat64 "mo:base/Nat64";
import Nat8 "mo:base/Nat8";
import Nat32 "mo:base/Nat32";
import Error "mo:base/Error";
import List "mo:base/List";
import Option "mo:base/Option";
import Trie "mo:base/Trie";
import Result "mo:base/Result";
import Array "mo:base/Array";


actor class BuyMeCoffee() =
  this {

  /**
   * Types
   */

   type Error = {
        #NotFound;
        #AlreadyExists;
        #NotAuthorized;
        #WrongCaller;
    };

  // The type of a people identifier.
  public type PeopleId = Nat32;
  public type ID = Principal;
  public type Wallet = Text;

  // The type of a people.
  public type People = {
    name : Text;
    id : ID;
    wallet: Wallet;
  };

  public type PeopleUpdate = {
    name : Text;
    wallet: Wallet;
  };

  public type PeopleItem = {
     people: People;
     principal: ID;
  };
  /**
   * Application State
   */

  // The people data store.
  private stable var peoples : Trie.Trie<Principal, People> = Trie.empty();

  /**
   * High-Level API
   */

  // Create a people.
  public shared(msg) func create(people : PeopleUpdate) : async Result.Result<People, Error> {

    let callerId = msg.caller;

    // if(Principal.isAnonymous(who)) {
    //     return #err(#NotAuthorized);
    // };
    if(Principal.toText(callerId) == "2vxsx-fae") {
        return #err(#NotAuthorized);
    };


    // Associate user profile with their principal
    let thisGuy: People = {
        name = people.name;
        wallet = people.wallet;
        id = callerId;
    };

    let (newPeoples, existing) = Trie.put(
        peoples,           // Target trie
        key(callerId),      // Key
        Principal.equal,    // Equality checker
        thisGuy
    );

    // If there is an original value, do not update
    switch(existing) {
        // If there are no matches, update profiles
        case null {
            peoples := newPeoples;
            #ok(thisGuy);
        };
        // Matches pattern of type - opt Profile
        case (? v) {
            #err(#AlreadyExists);
        };
    };
  };

  // Read people
  public query (msg) func read () : async Result.Result<People, Error> {
      // Get caller principal
      let callerId = msg.caller;

      // Reject AnonymousIdentity
      if(Principal.toText(callerId) == "2vxsx-fae") {
          return #err(#NotAuthorized);
      };

      let result = Trie.find(
          peoples,           //Target Trie
          key(callerId),      // Key
          Principal.equal     // Equality Checker
      );
      return Result.fromOption(result, #NotFound);
  };

  // Update profile
  public shared(msg) func update (people : PeopleUpdate) : async Result.Result<People, Error> {
      // Get caller principal
      let callerId = msg.caller;

      // Reject AnonymousIdentity
      if(Principal.toText(callerId) == "2vxsx-fae") {
          return #err(#NotAuthorized);
      };

      // Associate user profile with their principal
      let thisGuy: People = {
          name = people.name;
          wallet = people.wallet;
          id = callerId;
      };

      let result = Trie.find(
          peoples,           //Target Trie
          key(callerId),     // Key
          Principal.equal           // Equality Checker
      );

      switch (result){
          // Do not allow updates to profiles that haven't been created yet
          case null {
              #err(#NotFound)
          };
          case (? v) {
              peoples := Trie.replace(
                  peoples,           // Target trie
                  key(callerId),      // Key
                  Principal.equal,    // Equality checker
                  ?thisGuy
              ).0;
              #ok(thisGuy);
          };
      };
  };

  // Delete profile
  public shared(msg) func delete () : async Result.Result<Bool, Error> {
      // Get caller principal
      let callerId = msg.caller;

      // Reject AnonymousIdentity
      if(Principal.toText(callerId) == "2vxsx-fae") {
          return #err(#NotAuthorized);
      };

      let result = Trie.find(
          peoples,           //Target Trie
          key(callerId),      // Key
          Principal.equal     // Equality Checker
      );

      switch (result){
          // Do not try to delete a profile that hasn't been created yet
          case null {
              #err(#NotFound);
          };
          case (? v) {
              peoples := Trie.replace(
                  peoples,           // Target trie
                  key(callerId),     // Key
                  Principal.equal,          // Equality checker
                  null
              ).0;
              #ok(true);
          };
      };
  };

    public query func allPeople() : async [PeopleItem]{
       Trie.toArray(
                    peoples,
                    func(k:Principal, v:People) : PeopleItem {
                        {
                            principal=k;
                            people=v;
                        }
                    });
    };

  private func key(x : Principal) : Trie.Key<Principal> {
      return { key = x; hash = Principal.hash(x) };
  };



};
