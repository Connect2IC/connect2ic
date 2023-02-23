import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"

import NFT_ICPUNKS, { TokenDesc } from "./interfaces"
import IDL from "./icpunks.did"
import { NFTDetails } from "../interfaces/nft"
import { NFT_CANISTERS } from "../../tokens/constants/canisters"
import { NFT as NFTStandard } from "../../tokens/constants/standards"
import { Account, NFTWrapper } from "../nft-interfaces"

const getICPBunnyCanisterId = index => NFT_CANISTERS.ICP_BUNNY_STORAGE[index % 10]

const imageUrl = (canisterId: string, index: number, tokenDataUrl: string) =>
  ({
    [NFT_CANISTERS.ICP_BUNNY_MAIN]: `https://${getICPBunnyCanisterId(index)}.raw.ic0.app/Token/${index}`,
  }[canisterId] || `https://${canisterId}.raw.ic0.app${tokenDataUrl}`)
export default class ICPunks implements NFTWrapper {
  standard = NFTStandard.icpunks

  actor: ActorSubclass<NFT_ICPUNKS>
  canisterId: string

  constructor(actor: ActorSubclass<NFT_ICPUNKS>, canisterId: string) {
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

  async getUserTokens(principal: Principal): Promise<NFTDetails[]> {
    const tokensIndexes = await this.actor.user_tokens(principal)

    const tokensData = await Promise.all(tokensIndexes.map(tokenIndex => this.actor.data_of(tokenIndex)))

    return tokensData.map(token => this.serializeTokenData(token))
  }

  async transfer(args: { from: Principal, to: Principal, tokenIndex: number }): Promise<void> {
    const success = await this.actor.transfer_to(args.to, BigInt(args.tokenIndex))
    if (!success) {
      throw new Error("Error transfering token")
    }
  }

  async details(tokenIndex: number): Promise<NFTDetails> {
    const tokenData = await this.actor.data_of(BigInt(tokenIndex))

    return this.serializeTokenData(tokenData)
  }

  private serializeTokenData = (tokenData: TokenDesc): NFTDetails => ({
    index: BigInt(tokenData.id),
    canister: this.canisterId,
    url: imageUrl(this.canisterId, Number.parseInt(tokenData.id.toString(), 10), tokenData.url),
    name: tokenData.name,
    metadata: tokenData,
    standard: this.standard,
  })
}
