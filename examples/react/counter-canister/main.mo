import Principal "mo:base/Principal";

actor {
    stable var currentValue: Nat = 0;

    public func increment(): async () {
        currentValue += 1;
    };

    public shared(msg) func decrement(): async () {
        if (Principal.toText(msg.caller) == "k6jaa-yr3je-rx4ge-wwk7y-sysc4-cluwg-y4fuu-lkl5h-uutjg-tcy3q-rae") {
            currentValue -= 1;
        };
    };

    public query func getValue(): async Nat {
        currentValue;
    };
};
