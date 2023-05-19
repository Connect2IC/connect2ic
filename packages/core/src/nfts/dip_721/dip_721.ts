import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent"
import { Principal } from "@dfinity/principal"

import { NFTDetails } from "../interfaces/nft"
import Interface, { MetadataPart, MetadataVal } from "./interfaces"
import { NFT as NFTStandard } from "../../tokens/constants/standards"
import { Account, NFTWrapper } from "../nft-interfaces"

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

export default class DIP721 implements NFTWrapper {
  standard = NFTStandard.dip721

  actor: ActorSubclass<Interface>
  canisterId: string

  constructor({ actor, canisterId }: { actor: ActorSubclass<Interface>, canisterId: string }) {
    // super()
    this.actor = actor
    this.canisterId = canisterId
  }

  public async init() {

  }

  async getUserTokens(user: Account) {
    const userTokensResult = await this.actor.getMetadataForUserDip721(user.owner)
    const tokens = userTokensResult || []
    return tokens.map(token => {
      const tokenIndex = token.token_id
      const formatedMetadata = this.formatMetadata(token.metadata_desc)

      return this.serializeTokenData(formatedMetadata, tokenIndex)
    })
  }

  async mint(receiver: Account, metadata: any) {
    const mintResult = await this.actor.mintDip721(receiver.owner, metadata)
    if ("Err" in mintResult) {
      console.error(mintResult.Err)
    }
    if ("Ok" in mintResult) {
      return mintResult
    }
  }

  async transfer(args: { from: Account, to: Account, tokenIndex: number }) {
    const transferResult = await this.actor.transferFromDip721(args.from.owner, args.to.owner, BigInt(args.tokenIndex))
    if ("Err" in transferResult) throw new Error(`${Object.keys(transferResult.Err)[0]}: ${Object.values(transferResult.Err)[0]}`)
  }

  async getMetadata(tokenIndex: bigint) {
    const metadataResult = await this.actor.getMetadataDip721(BigInt(tokenIndex))

    if ("Err" in metadataResult) throw new Error(`${Object.keys(metadataResult.Err)[0]}: ${Object.values(metadataResult.Err)[0]}`)
    const metadata = metadataResult.Ok
    const formatedMetadata = this.formatMetadata(metadata)

    return this.serializeTokenData(formatedMetadata, tokenIndex)
  }

  async collectionDetails() {
    // TODO: implement
    const [
      result,
      stats,
      // supportedInterfaces,
    ] = await Promise.all([
      this.actor.metadata(),
      this.actor.stats(),
      // this.actor.supportedInterfaces(),
    ])
    return {
      logo: result.logo[0],
      symbol: result.symbol[0],
      name: result.name[0],
      custodians: result.custodians,
      createdAt: Number(result.created_at),
      upgradedAt: result.upgraded_at ? Number(result.upgraded_at) : undefined,
      cycles: Number(stats.cycles),
      totalTransactions: Number(stats.total_transactions),
      totalUniqueHolders: Number(stats.total_unique_holders),
      totalSupply: Number(stats.total_supply),
      // supportedInterfaces,
    }
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
