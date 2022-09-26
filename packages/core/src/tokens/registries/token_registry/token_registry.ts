import { ActorSubclass, HttpAgent } from "@dfinity/agent"
import fetch from "cross-fetch"

import TokenRegistryInterface from "./interfaces"
import IDL from "./token_registry.did"

import Registry from "../standard_registry/standard_registry"
import { generateActor } from "../../dab_utils/actorFactory"
import { formatMetadata, FormattedMetadata } from "../../dab_utils/registry"

import { IC_HOST } from "../../constants/index"
import { createTokenActor } from "../../tokens/index"
import { TOKEN } from "../../constants/standards"
import { Token } from "../../tokens/interfaces/token"

const CANISTER_ID = "b7hhy-tyaaa-aaaah-abbja-cai"

const DEFAULT_AGENT = new HttpAgent({ fetch, host: IC_HOST })

export const TOKEN_STANDARDS = Object.values(TOKEN)

interface GetTokenActorParams {
  canisterId: string;
  standard: string;
  agent: HttpAgent;
}

export const getTokenActor = <T = {}>({ canisterId, agent, standard }: GetTokenActorParams) => {
  if (!TOKEN_STANDARDS.includes(standard)) {
    console.error(`Standard ${standard} is not implemented`)
    throw new Error(`standard is not supported: ${standard}`)
  }
  return createTokenActor<T>(canisterId, agent, standard)
}

export class TokenRegistry extends Registry {
  constructor(agent?: HttpAgent) {
    super(CANISTER_ID, agent)
    this.actor = generateActor({
      agent: agent || DEFAULT_AGENT,
      canisterId: CANISTER_ID,
      IDL,
    })
  }

  public getAll = async (): Promise<FormattedMetadata[]> => {
    const tokenCanistersMetadata = await (this.actor as ActorSubclass<TokenRegistryInterface>).get_all()
    return tokenCanistersMetadata.map(formatMetadata)
  }
}

export const getTokens = async ({ agent = DEFAULT_AGENT } = {}): Promise<Token[]> => {
  const tokenRegistry = new TokenRegistry(agent)
  const tokenCanisters = await tokenRegistry.getAll()
  return tokenCanisters.map(token => ({
    ...token,
    logo: token.thumbnail,
    name: token.name,
    description: token.description,
    website: token.frontend.length ? token.frontend[0] : "",
    principal_id: token.principal_id,
    standard: token.details.standard as string,
    total_supply: [token.details.total_supply as bigint],
    symbol: token.details.symbol as string,
  }))
}

export default {
  getTokenActor,
  getTokens,
  addToken: async ({ agent, tokenInfo }) => new TokenRegistry(agent).add(tokenInfo),
  // editToken: async ({ agent, tokenInfo }) => new TokenRegistry(agent).edit(tokenInfo),
  removeToken: async ({ agent, canisterId }) => new TokenRegistry(agent).remove(canisterId),
}
