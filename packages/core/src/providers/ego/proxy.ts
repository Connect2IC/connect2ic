import { IDL } from "@dfinity/candid"
import { Actor, ActorMethod, ActorSubclass, CallConfig } from "@dfinity/agent"
import { _SERVICE as walletService } from "./wallet_canister"
import { Principal } from "@dfinity/principal"
import { strategy } from "@dfinity/agent/lib/cjs/polling"

export function hasOwnProperty<
  X extends Record<string, unknown>,
  Y extends PropertyKey,
>(obj: Record<string, unknown>, prop: Y): obj is X & Record<Y, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

function decodeReturnValue(types: IDL.Type[], msg: ArrayBuffer) {
  const returnValues = IDL.decode(types, Buffer.from(msg))
  switch (returnValues.length) {
    case 0:
      return undefined
    case 1:
      return returnValues[0]
    default:
      return returnValues
  }
}

function _createActorMethod(
  wallet_call: ActorSubclass<walletService>,
  canister: Principal,
  method_name: string,
  func: IDL.FuncClass,
): ActorMethod {
  const caller = async (_: CallConfig, ...args: any[]) => {
    const updateAnnotations = []
    const newFunc = new IDL.FuncClass(
      func.argTypes,
      func.retTypes,
      updateAnnotations,
    )

    const arg = IDL.encode(newFunc.argTypes, args)
    const response = await wallet_call.proxy_call({
      args: Array.from(new Uint8Array(arg)),
      cycles: BigInt(0),
      method_name,
      canister,
    })
    if (hasOwnProperty(response, "Ok")) {
      const responseBytes = response.Ok.return
      return decodeReturnValue(newFunc.retTypes, new Uint8Array(responseBytes))
    } else {
      throw new Error(response.Err)
    }
  }
  const handler = (...args: unknown[]) => caller({}, ...args)
  handler.withOptions =
    (options: CallConfig) =>
      (...args: unknown[]) =>
        caller(options, ...args)
  return handler as ActorMethod
}

export class ProxyActor extends Actor {
  [x: string]: ActorMethod;

  constructor(
    wallet_call: ActorSubclass<walletService>,
    canister: string,
    idl: IDL.InterfaceFactory,
  ) {
    const service = idl({ IDL })
    super({
      config: {
        pollingStrategyFactory: strategy.defaultStrategy,
        canisterId: canister,
      },
      service,
    })

    for (const [methodName, func] of service._fields) {
      this[methodName] = _createActorMethod(
        wallet_call,
        canister !== ""
          ? Principal.fromText(canister)
          : Principal.fromHex(""),
        methodName,
        func,
      )
    }
  }
}

// export function createProxyActor<T = Record<string, ActorMethod>>(
//   wallet_call: ActorSubclass<walletService>,
//   canister: string,
//   interfaceFactory: IDL.InterfaceFactory,
// ): ActorSubclass<T> {
//   return new (_createProxyActor(wallet_call, canister, interfaceFactory))({
//     canisterId: canister,
//   }) as unknown as ActorSubclass<T>
// }

