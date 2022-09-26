import { ActorSubclass, HttpAgent } from "@dfinity/agent"
import fetch from "cross-fetch"

import CanisterRegistryInterface from "./interfaces"
import IDL from "./canister_registry.did"
import { IC_HOST } from "../../constants/index"
import Registry from "../standard_registry/standard_registry"
import { generateActor } from "../../dab_utils/actorFactory"
import { formatMetadata, FormattedMetadata } from "../../dab_utils/registry"
import { Principal } from "@dfinity/principal"

const CANISTER_ID = "curr3-vaaaa-aaaah-abbdq-cai"
const DEFAULT_AGENT = new HttpAgent({ fetch, host: IC_HOST })

interface CanisterMetadata {
  url: string;
  name: string;
  description: string;
  version: number;
  logo_url: string;
}

const formatBackwardsCompatible = (metadata?: FormattedMetadata): CanisterMetadata | undefined => {
  if (!metadata) {
    return metadata
  }
  const { thumbnail, name, description, frontend, details } = metadata
  return { url: frontend?.[0] || "", name, description, version: Number(details.version), logo_url: thumbnail }
}

export class CanisterRegistry extends Registry {
  constructor(agent?: HttpAgent) {
    super(CANISTER_ID, agent)
    this.actor = generateActor({ agent: agent || DEFAULT_AGENT, canisterId: CANISTER_ID, IDL })
  }

  public getAll = async (): Promise<FormattedMetadata[]> => {
    const canistersMetadata = await (this.actor as ActorSubclass<CanisterRegistryInterface>).get_all()
    return canistersMetadata.map(formatMetadata)
  }
}

export const getCanisterInfo = async ({
                                        canisterId,
                                        agent = DEFAULT_AGENT,
                                      }: {
  canisterId: Principal | string;
  agent?: HttpAgent;
}): Promise<CanisterMetadata | undefined> => {
  const canisterRegistry = new CanisterRegistry(agent)
  const canister = await canisterRegistry.get(Principal.from(canisterId).toString())
  return formatBackwardsCompatible(canister)
}

export const getMultipleCanisterInfo = async ({
                                                canisterIds,
                                                agent = DEFAULT_AGENT,
                                              }: {
  canisterIds: (string | Principal)[];
  agent?: HttpAgent;
}): Promise<CanisterMetadata[] | undefined> => {
  const canistersMetadata = await Promise.all(canisterIds.map(canisterId => getCanisterInfo({ canisterId, agent })))
  if (canistersMetadata.length === 0) return []
  return canistersMetadata.filter(canister => !!canister) as CanisterMetadata[]
}

export const getAll = async (agent?: HttpAgent): Promise<CanisterMetadata[]> => {
  const allCanisters = await new CanisterRegistry(agent).getAll()
  return allCanisters.map(formatBackwardsCompatible) as CanisterMetadata[]
}

export default {
  getCanisterInfo,
  getMultipleCanisterInfo,
  getAll: (agent: HttpAgent) => new CanisterRegistry(agent).getAll,
}
