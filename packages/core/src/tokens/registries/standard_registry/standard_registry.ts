import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"
import { IC_HOST } from "../../constants"
import RegistryStandardIDL from "./registry_standard.did"
import RegistryStandard, { Metadata } from "./interfaces"
import { formatMetadata } from "../../dab_utils/registry"
import fetch from "cross-fetch"

const DEFAULT_AGENT = new HttpAgent({ fetch, host: IC_HOST })

class Registry {
  protected actor: ActorSubclass<RegistryStandard> // Set as protected so that subclasses can override it
  public canisterId: string

  constructor(canisterId, agent = DEFAULT_AGENT) {
    this.actor = Actor.createActor<RegistryStandard>(RegistryStandardIDL, {
      agent: agent,
      canisterId,
    })
    this.canisterId = canisterId
  }

  public name = async () => {
    return this.actor.name()
  }

  public add = async (metadata: Metadata) => {
    return this.actor.add(metadata ?? [])
  }

  public get = async (principalId: string) => {
    const data = await this.actor.get(Principal.fromText(principalId))
    if (data.length === 0) return undefined
    return formatMetadata(data[0])
  }

  public remove = async (principalId: string) => {
    return this.actor.remove(Principal.fromText(principalId))
  }
}

export default Registry
