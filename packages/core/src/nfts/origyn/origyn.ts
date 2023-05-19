import { ActorSubclass } from "@dfinity/agent"
import { NFTDetails } from "../interfaces/nft"
import { _SERVICE } from "./interfaces"
import { NFT as NFTStandard } from "../../tokens/constants/standards"
import { Account, NFTWrapper } from "../nft-interfaces"

export default class Origyn implements NFTWrapper {
  standard = NFTStandard.origyn
  actor: ActorSubclass<_SERVICE>
  canisterId: string

  constructor({ actor, canisterId }: { actor: ActorSubclass<_SERVICE>, canisterId: string }) {
    // super()
    this.actor = actor
    this.canisterId = canisterId
  }

  async mint(receiver: Account, metadata: any, tokenIndex: bigint) {
  }

  async burn(tokenIndex: bigint) {
    // TODO: ?
  }

  async getUserTokens(user: Account) {
  }

  async transfer(args: { from: Account, to: Account, tokenIndex: bigint }) {
  }

  async getMetadata(tokenIndex: bigint) {
  }

  async collectionDetails() {
  }
}
