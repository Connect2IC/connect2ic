import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"

import { NFTDetails } from "../interfaces/nft"
import NTF_EXT from "./interfaces"
import { getAccountId } from "../../tokens/dab_utils/account"
import { to32bits } from "../../tokens/dab_utils/number"
import { NFT_CANISTERS } from "../../tokens/constants/canisters"
import { NFT as NFTStandard } from "../../tokens/constants/standards"
import { Account, NFTWrapper } from "../nft-interfaces"

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

export default class EXT implements NFTWrapper {
  standard = NFTStandard.ext

  actor: ActorSubclass<NTF_EXT>
  canisterId: string

  constructor({ actor, canisterId }: { actor: ActorSubclass<NTF_EXT>, canisterId: string }) {
    // super()
    this.actor = actor
    this.canisterId = canisterId
  }

  async mint(receiver: Account, metadata: any, tokenIndex: bigint) {
    // TODO:
    // const index = (tokenIndex || tokenIndex === 0n) ? tokenIndex : BigInt((await this.collectionDetails()).totalSupply)
    // const mintResult = await this.actor.mint(receiver.owner, index, metadata)
    // if ("Err" in mintResult) {
    //   console.error(mintResult.Err)
    // }
    // if ("Ok" in mintResult) {
    //   return mintResult
    // }
  }

  async getUserTokens(user): Promise<NFTDetails[]> {
    const userTokensResult = await this.actor.ext_tokens_of(user.owner)
    if ("Err" in userTokensResult) {
      // throw new Error(`${Object.keys(userTokensResult.err)[0]}: ${Object.values(userTokensResult.err)[0]}`)
      return []
    }

    const tokens = userTokensResult.Ok ? Array.from(userTokensResult.Ok) : []

    // TODO: remove metadata from getUserTokens??
    const result = await Promise.all(tokens.map(async (tokenIndex: number) => {
      const tokenIdentifier = getTokenIdentifier(this.canisterId, tokenIndex)
      const metadata = await this.getMetadata(tokenIndex)
      const serialized = this.serializeTokenData(metadata, tokenIdentifier, tokenIndex)
      return serialized
    }))
    return result
  }

  async transfer(args: { from: Account, to: Account, tokenIndex: bigint }) {
    const tokenIdentifier = getTokenIdentifier(this.canisterId, Number(args.tokenIndex))
    const dummyMemmo = new Array(32).fill(0)

    const transferResult = await this.actor.ext_transfer({
      to: { principal: args.to.owner },
      from: { principal: args.from.owner },
      token: tokenIdentifier,
      amount: BigInt(1),
      memo: dummyMemmo,
      notify: false,
      subaccount: [],
    })
    if ("Err" in transferResult) {
      throw new Error(`${Object.keys(transferResult.Err)[0]}: ${Object.values(transferResult.Err)[0]}`)
    }
  }

  async getMetadata(tokenIndex): Promise<NFTDetails> {
    const tokenIdentifier = getTokenIdentifier(this.canisterId, Number(tokenIndex))
    const metadataResult = await this.actor.metadata(tokenIdentifier)

    if ("Err" in metadataResult) {
      throw new Error(`${Object.keys(metadataResult.Err)[0]}: ${Object.values(metadataResult.Err)[0]}`)
    }

    const { metadata = {} } = "nonfungible" in metadataResult.Ok ? metadataResult.Ok.nonfungible : {}

    return this.serializeTokenData(metadata?.metadata, tokenIdentifier, tokenIndex)
  }

  async collectionDetails() {
    // this.actor.get_all_details()
    // TODO: implement
  }

  private serializeTokenData(metadata: any, tokenIdentifier: string, tokenIndex: number): NFTDetails {
    return {
      id: tokenIdentifier,
      index: BigInt(tokenIndex),
      canister: this.canisterId,
      metadata,
      url: extImageUrl(this.canisterId, tokenIndex, tokenIdentifier),
      standard: this.standard,
    }
  }
}