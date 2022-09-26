import { HttpAgent } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"

import { NFTDetails } from "../interfaces/nft"

export default abstract class NFT {
  abstract standard: string

  agent: HttpAgent

  canisterId: string

  constructor(canisterId: string, agent: HttpAgent) {
    this.agent = agent
    this.canisterId = canisterId
  }

  abstract getUserTokens(principal: Principal): Promise<NFTDetails[]>;

  abstract transfer(principal: Principal, tokenIndex: number): Promise<void>;

  abstract details(tokenIndex: number): Promise<NFTDetails>;
}
