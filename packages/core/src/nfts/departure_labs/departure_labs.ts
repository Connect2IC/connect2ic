import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"

import NFT_DEPARTURE_LABS, { Metadata } from "./interfaces"
import IDL from "./departure_labs.did"
import { NFTDetails } from "../interfaces/nft"
import { NFT as NFTStandard } from "../../tokens/constants/standards"
import { Account, NFTWrapper } from "../nft-interfaces"

export default class DepartureLabs implements NFTWrapper {
  standard = NFTStandard.departuresLabs

  actor: ActorSubclass<NFT_DEPARTURE_LABS>
  canisterId: string

  constructor(actor: ActorSubclass<NFT_DEPARTURE_LABS>, canisterId: string) {
    // super()
    this.actor = actor
    this.canisterId = canisterId
  }

  async getUserTokens(principal: Principal): Promise<NFTDetails[]> {
    const tokensIndexes = await this.actor.balanceOf(principal)
    const tokensData = await Promise.all(
      tokensIndexes.map(async tokenIndex => {
        const userTokensResult = await this.actor.tokenMetadataByIndex(tokenIndex)
        if ("err" in userTokensResult) throw new Error(Object.keys(userTokensResult.err)[0])

        return userTokensResult.ok
      }),
    )

    return tokensData.map(token => this.serializeTokenData(token))
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

  async transfer(args: { from: Principal, to: Principal, tokenIndex: number }): Promise<void> {
    const transferResult = await this.actor.transfer(args.to, args.tokenIndex.toString(10))
    if ("err" in transferResult) throw new Error(Object.keys(transferResult.err)[0])
  }

  async details(tokenIndex: number): Promise<NFTDetails> {
    const tokenData = await this.actor.tokenMetadataByIndex(tokenIndex.toString(10))

    if ("err" in tokenData) throw new Error(Object.keys(tokenData.err)[0])

    return this.serializeTokenData(tokenData.ok)
  }

  private serializeTokenData = (tokenData: Metadata): NFTDetails => ({
    index: BigInt(tokenData.id),
    canister: this.canisterId,
    url: `https://${this.canisterId}.raw.ic0.app/nft/${tokenData.id}`,
    metadata: tokenData,
    standard: this.standard,
  })
}
