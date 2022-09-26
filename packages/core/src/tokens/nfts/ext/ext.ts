import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"

import { NFTDetails } from "../interfaces/nft"
import NTF_EXT from "./interfaces"
import IDL from "./ext.did"
import NFT from "../default"
import { getAccountId } from "../../dab_utils/account"
import { to32bits } from "../../dab_utils/number"
import { NFT_CANISTERS } from "../../constants/canisters"
import { NFT as NFTStandard } from "../../constants/standards"

const getTokenIdentifier = (canister: string, index: number): string => {
  const padding = Buffer.from("\x0Atid")
  const array = new Uint8Array([...padding, ...Principal.fromText(canister).toUint8Array(), ...to32bits(index)])
  return Principal.fromUint8Array(array).toText()
}

const extImageUrl = (canisterId, index, tokenIdentifier) =>
  ({
    [NFT_CANISTERS.WRAPPED_PUNKS]: `https://${NFT_CANISTERS.IC_PUNKS}.raw.ic0.app/Token/${index}`,
    [NFT_CANISTERS.WRAPPED_DRIP]: `https://${NFT_CANISTERS.IC_DRIP}.raw.ic0.app?tokenId=${index}`,
  }[canisterId] || `https://${canisterId}.raw.ic0.app/?type=thumbnail&tokenid=${tokenIdentifier}`)

export default class EXT extends NFT {
  standard = NFTStandard.ext

  actor: ActorSubclass<NTF_EXT>

  constructor(canisterId: string, agent: HttpAgent) {
    super(canisterId, agent)

    this.actor = Actor.createActor(IDL, {
      agent,
      canisterId,
    })
  }

  async getUserTokens(principal: Principal): Promise<NFTDetails[]> {
    const accountId = getAccountId(principal)
    const userTokensResult = await this.actor.tokens_ext(accountId)
    if ("err" in userTokensResult) throw new Error(`${Object.keys(userTokensResult.err)[0]}: ${Object.values(userTokensResult.err)[0]}`)

    const tokens = userTokensResult.ok || []

    return tokens.map(token => {
      const metadata = token[2]
      const tokenIndex = token[0]

      return this.serializeTokenData(metadata, getTokenIdentifier(this.canisterId, tokenIndex), tokenIndex)
    })
  }

  async transfer(to: Principal, tokenIndex: number): Promise<void> {
    const tokenIdentifier = getTokenIdentifier(this.canisterId, tokenIndex)
    const from = await this.agent.getPrincipal()
    const dummyMemmo = new Array(32).fill(0)

    const transferResult = await this.actor.transfer({
      to: { principal: to },
      from: { principal: from },
      token: tokenIdentifier,
      amount: BigInt(1),
      memo: dummyMemmo,
      notify: false,
      subaccount: [],
      fee: BigInt(0),
    })
    if ("err" in transferResult) throw new Error(`${Object.keys(transferResult.err)[0]}: ${Object.values(transferResult.err)[0]}`)
  }

  async details(tokenIndex: number): Promise<NFTDetails> {
    const tokenIdentifier = getTokenIdentifier(this.canisterId, tokenIndex)
    const metadataResult = await this.actor.metadata(tokenIdentifier)

    if ("err" in metadataResult) throw new Error(`${Object.keys(metadataResult.err)[0]}: ${Object.values(metadataResult.err)[0]}`)

    const { metadata = {} } = "nonfungible" in metadataResult.ok ? metadataResult.ok.nonfungible : {}

    return this.serializeTokenData(metadata, tokenIdentifier, tokenIndex)
  }

  private serializeTokenData(metadata: any, tokenIdentifier: string, tokenIndex: number): NFTDetails {
    return {
      id: tokenIdentifier,
      index: BigInt(tokenIndex),
      canister: this.canisterId,
      metadata: metadata.length ? metadata[0] : undefined,
      url: extImageUrl(this.canisterId, tokenIndex, tokenIdentifier),
      standard: this.standard,
    }
  }
}
