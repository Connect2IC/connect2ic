import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"

import { NFTDetails } from "../interfaces/nft"
import Interface, { MetadataPart, MetadataVal } from "./interfaces"
import IDL from "./dip_721.did"
import NFT from "../default"
import { NFT as NFTStandard } from "../../constants/standards"

interface Property {
  name: string;
  value: string;
}

interface Metadata {
  [key: string]: { value: MetadataVal; purpose: string } | Array<Property>;

  properties: Array<Property>;
}

const extractMetadataValue = (metadata: any) => {
  const metadataKey = Object.keys(metadata)[0]
  const value = metadata[metadataKey]
  return typeof value === "object" ? JSON.stringify(value) : value
}

export default class ERC721 extends NFT {
  standard = NFTStandard.dip721

  actor: ActorSubclass<Interface>
  canisterId: string

  constructor(actor: ActorSubclass<Interface>, canisterId: string) {
    super()

    this.actor = actor
    this.canisterId = canisterId
  }

  async getUserTokens(principal: Principal): Promise<NFTDetails[]> {
    const userTokensResult = await this.actor.getMetadataForUserDip721(principal)
    const tokens = userTokensResult || []
    return tokens.map(token => {
      const tokenIndex = token.token_id
      const formatedMetadata = this.formatMetadata(token.metadata_desc)

      return this.serializeTokenData(formatedMetadata, tokenIndex)
    })
  }

  async transfer(args: { from: Principal, to: Principal, tokenIndex: number }): Promise<void> {
    const transferResult = await this.actor.transferFromDip721(args.from, args.to, BigInt(args.tokenIndex))
    if ("Err" in transferResult) throw new Error(`${Object.keys(transferResult.Err)[0]}: ${Object.values(transferResult.Err)[0]}`)
  }

  async details(tokenIndex: number): Promise<NFTDetails> {
    const metadataResult = await this.actor.getMetadataDip721(BigInt(tokenIndex))

    if ("Err" in metadataResult) throw new Error(`${Object.keys(metadataResult.Err)[0]}: ${Object.values(metadataResult.Err)[0]}`)
    const metadata = metadataResult.Ok
    const formatedMetadata = this.formatMetadata(metadata)

    return this.serializeTokenData(formatedMetadata, tokenIndex)
  }

  private serializeTokenData(metadata: any, tokenIndex: number | bigint): NFTDetails {
    return {
      index: BigInt(tokenIndex),
      canister: this.canisterId,
      metadata,
      url: metadata?.location?.value?.TextContent || "",
      standard: this.standard,
    }
  }

  private formatMetadata(metadata: Array<MetadataPart>): Metadata {
    const metadataResult: Metadata = { properties: [] }
    for (const part of metadata) {
      const purpose = Object.keys(part.purpose)[0]
      part.key_val_data.forEach(({ key, val }) => {
        metadataResult[key] = { value: val, purpose }
        metadataResult.properties = [...metadataResult.properties, { name: key, value: extractMetadataValue(val) }]
      })
    }
    metadataResult.properties = metadataResult.properties.filter(({ name }) => name !== "location")
    return metadataResult
  }
}
