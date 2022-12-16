import { Principal } from "@dfinity/principal"

import { NFTDetails } from "../interfaces/nft"
import { ActorSubclass } from "@dfinity/agent"

export default abstract class NFT {
  abstract standard: string

  constructor() {}

  abstract getUserTokens(principal: Principal): Promise<NFTDetails[]>;

  abstract transfer(args: {
                      to: Principal,
                      from: Principal,
                      tokenIndex: number,
                    }): Promise<void>;

  abstract details(tokenIndex: number): Promise<NFTDetails>;
}
