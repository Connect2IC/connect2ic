import { IDL } from "@dfinity/candid"
import { ActorSubclass } from "@dfinity/agent"
import { Client } from "./client"

export class Canister {
  // this._service.subscribe((state) => {})

  public canisterId: string
  public idlFactory: IDL.InterfaceFactory
  public anonymousActor: ActorSubclass<any>
  public providerActor: ActorSubclass<any>

  constructor({ canisterId, idlFactory, client }) {
    this.canisterId = canisterId
    this.idlFactory = idlFactory
    this.client = client
    client.createAnonymousActor(canisterId, idlFactory).then(actor => {
      this.anonymousActor = actor
    })
  }

// TODO: how to handle different networks?
  public get(fn, options = {}) {
    // TODO: network?
    const { mode = "auto", network = "local" } = options
    let unsub1
    let unsub2
    if (mode === "auto" || mode === "anonymous") {
      fn(anonymousActor)
    }
    client._service.subscribe((state) => {
      if (mode === "authenticated" || mode === "auto") {
        // TODO: no this. client
        unsub1 = client._emitter.on("connect", async () => {
          const actor = await client.createActor(canisterId, idlFactory)
          fn(actor)
        })
      }
      if (mode === "auto" || mode === "anonymous") {
        unsub2 = client._emitter.on("disconnect", () => {
          fn(anonymousActor)
        })
      }
      return () => {
        // check if unsub possible
        unsub1?.()
        unsub2?.()
      }
    })
  }
}
