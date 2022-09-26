import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"

import NFT_DEPARTURE_LABS, { Metadata } from "./interfaces"
import IDL from "./departure_labs.did"
import NFT from "../default"
import { NFTDetails } from "../interfaces/nft"
import { NFT as NFTStandard } from "../../constants/standards"

export default class DepartureLabs extends NFT {
  standard = NFTStandard.departuresLabs

  actor: ActorSubclass<NFT_DEPARTURE_LABS>

  constructor(canisterId: string, agent: HttpAgent) {
    super(canisterId, agent)

    this.actor = Actor.createActor(IDL, {
      agent,
      canisterId,
    })
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

  async transfer(to: Principal, tokenIndex: number): Promise<void> {
    const transferResult = await this.actor.transfer(to, tokenIndex.toString(10))
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
