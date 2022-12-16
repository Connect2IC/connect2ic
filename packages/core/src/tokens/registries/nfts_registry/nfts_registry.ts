import axios from "axios"
import { ActorSubclass, HttpAgent } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"
import fetch from "cross-fetch"
import localAllNFTs from "../nft.json"

import NFTRegistryInterface from "./interfaces"
import { NFTCollection, NFTStandards } from "../../../nfts/interfaces/nft"
import { DABCollection } from "../../../nfts/interfaces/dab_nfts"

import EXT from "../../../nfts/ext/ext"
import ICPunks from "../../../nfts/ic_punks/ic_punks"
import DepartureLabs from "../../../nfts/departure_labs/departure_labs"
import NFT from "../../../nfts/default/default"
import DIP721 from "../../../nfts/dip_721/dip_721"
import DIP721v2 from "../../../nfts/dip_721_v2/dip_721_v2"

import { NFT as NFTStandard } from "../../constants/standards"
import { IC_HOST, KYASSHU_URL } from "../../constants/index"

import IDL from "./nft_registry.did"
import Registry from "../standard_registry/standard_registry"
import { generateActor } from "../../dab_utils/actorFactory"
import { formatMetadata, FormattedMetadata } from "../../dab_utils/registry"
import CCC from "../../../nfts/ccc/ccc"

const CANISTER_ID = "ctqxp-yyaaa-aaaah-abbda-cai"
const BATCH_AMOUNT = 5

// TODO: Why??
// @ts-ignore
const NFT_STANDARDS: { [key: string]: NFTStandards } = {
  [NFTStandard.ext]: EXT,
  [NFTStandard.icpunks]: ICPunks,
  [NFTStandard.departuresLabs]: DepartureLabs,
  [NFTStandard.erc721]: DIP721,
  [NFTStandard.dip721]: DIP721,
  [NFTStandard.dip721v2]: DIP721v2,
  [NFTStandard.c3]: CCC,
}

interface GetBatchedNFTsParams {
  principal: Principal;
  callback?: (collection: NFTCollection) => void;
  batchSize?: number;
  onFinish?: (collections: NFTCollection[]) => void;
  agent?: HttpAgent;
}

export interface GetNFTActorParams {
  canisterId: string;
  standard: string;
  agent: HttpAgent;
}

interface GetNFTInfoParams {
  nftCanisterId: string;
  agent?: HttpAgent;
}

export interface GetAllUserNFTsParams {
  user: string | Principal;
  agent?: HttpAgent;
}

const DEFAULT_AGENT = new HttpAgent({ fetch, host: IC_HOST })

export class NFTRegistry extends Registry {
  constructor(agent?: HttpAgent) {
    super(CANISTER_ID, agent)
    this.actor = generateActor({ agent: agent || DEFAULT_AGENT, canisterId: CANISTER_ID, IDL })
  }

  public getAll = async (): Promise<FormattedMetadata[]> => {
    // TODO: use local info?
    const canistersMetadata = await (this.actor as ActorSubclass<NFTRegistryInterface>).get_all()
    return canistersMetadata.map(formatMetadata)
  }
}

export const getUserCollectionTokens = async (
  collection: DABCollection,
  user: Principal,
  agent: HttpAgent = DEFAULT_AGENT,
  callback: (val?: any) => void = () => {
  },
): Promise<NFTCollection> => {
  try {
    const NFTActor = getNFTActor({
      canisterId: collection.principal_id.toString(),
      agent,
      standard: collection.standard,
    })
    const details = await NFTActor.getUserTokens(user)
    const collectionDetails = {
      name: collection.name,
      canisterId: collection.principal_id.toString(),
      standard: collection.standard,
      description: collection.description,
      icon: collection.icon,
      tokens: details.map(detail => ({
        ...detail,
        collection: collection.name,
      })),
    }
    if (callback) {
      await callback?.(collectionDetails)
    }
    return collectionDetails
  } catch (e) {
    console.error(e)
    return {
      name: collection.name,
      canisterId: collection.principal_id.toString(),
      standard: collection.standard,
      tokens: [],
    }
  }
}

export const getNFTActor = ({ canisterId, agent, standard }: GetNFTActorParams): NFT => {
  if (!(standard in NFT_STANDARDS)) {
    console.error(`Standard ${standard} is not implemented`)
    throw new Error(`standard is not supported: ${standard}`)
  }
  // @ts-ignore
  return new NFT_STANDARDS[standard](canisterId, agent)
}

export const getNFTInfo = async ({
                                   nftCanisterId,
                                   agent = DEFAULT_AGENT,
                                 }: GetNFTInfoParams): Promise<DABCollection | undefined> => {
  const registry = new NFTRegistry(agent)
  const result = await registry.get(nftCanisterId)
  if (!result) return result
  // @ts-ignore
  return { ...result, icon: result.thumbnail, standard: result.details.standard as string }
}

export const getAllNFTS = async ({ agent = DEFAULT_AGENT }: { agent?: HttpAgent } = {}): Promise<DABCollection[]> => {
  const registry = new NFTRegistry(agent)
  // const allNFTs1 = await registry.getAll();
  const allNFTs = localAllNFTs.map(nft => ({
    ...nft,
    principal_id: Principal.fromUint8Array(new Uint8Array(Object.values(nft.principal_id._arr))),
  }))
  //@ts-ignore
  return allNFTs.map(nft => ({ ...nft, icon: nft.thumbnail, standard: nft.details.standard as string }))
}

export const getAllUserNFTs = async ({
                                       user,
                                       agent = DEFAULT_AGENT,
                                     }: GetAllUserNFTsParams): Promise<NFTCollection[]> => {
  const NFTCollections = await getAllNFTS({ agent })
  const userPrincipal = user instanceof Principal ? user : Principal.fromText(user)

  const result = await Promise.all(NFTCollections.map(collection => getUserCollectionTokens(collection, userPrincipal, agent)))
  return result.filter(element => element.tokens.length)
}

export const getBatchedNFTs = async ({
                                       principal,
                                       callback,
                                       batchSize = BATCH_AMOUNT,
                                       onFinish,
                                       agent = DEFAULT_AGENT,
                                     }: GetBatchedNFTsParams) => {
  const NFTCollections = await getAllNFTS({ agent })
  let result: NFTCollection[] = []

  for (let i = 0; i < NFTCollections.length; i += batchSize) {
    const batch = NFTCollections.slice(i, i + batchSize)
    const batchResult = await Promise.all(batch.map(collection => getUserCollectionTokens(collection, principal, agent, callback)))
    result = [...result, ...batchResult]
  }
  if (onFinish) {
    await onFinish?.(result)
  }
  return result.filter(element => element?.tokens?.length)
}

export const getCachedUserNFTs = async ({
                                          userPID,
                                          refresh,
                                        }: { userPID: string; refresh?: boolean }): Promise<NFTCollection[]> => {
  const url = `${KYASSHU_URL}/dab/user/nfts/${userPID}${refresh ? "?refresh=true" : ""}`
  const result = await axios.get<NFTCollection[]>(url)
  if (!refresh) axios.get(`${url}?refresh=true`).catch(console.warn)

  return result.data
}
