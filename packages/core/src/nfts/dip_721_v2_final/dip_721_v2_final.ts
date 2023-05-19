import { ActorSubclass } from "@dfinity/agent"
import { NFTDetails } from "../interfaces/nft"
import { GenericValue, TokenMetadata, _SERVICE } from "./interfaces"
import { NFT as NFTStandard } from "../../tokens/constants/standards"
import { Account, NFTWrapper } from "../nft-interfaces"

interface Property {
  name: string;
  value: string;
}

interface MetadataKeyVal {
  key: string;
  val: GenericValue;
}

interface Metadata {
  [key: string]: { value: MetadataKeyVal; purpose: string } | Array<Property> | string;

  properties: Array<Property>;
}

// TODO: support BigInt (NatContent in metadata)
const extractMetadataValue = (metadata: any) => {
  const metadataKey = Object.keys(metadata)[0]
  const value = metadata[metadataKey]
  return typeof value === "object" ? JSON.stringify(value) : value
}

export default class DIP721v2Final implements NFTWrapper {
  standard = NFTStandard.dip721v2Final

  actor: ActorSubclass<_SERVICE>
  canisterId: string

  constructor({ actor, canisterId }: { actor: ActorSubclass<_SERVICE>, canisterId: string }) {
    // super()
    this.actor = actor
    this.canisterId = canisterId
  }

  async mint(receiver: Account, metadata: any, tokenIndex: bigint) {
    const index = (tokenIndex || tokenIndex === BigInt(0)) ? tokenIndex : BigInt((await this.collectionDetails()).totalSupply)
    const mintResult = await this.actor.dip721_mint(receiver.owner, index, metadata)
    if ("Err" in mintResult) {
      console.error(mintResult.Err)
    }
    if ("Ok" in mintResult) {
      return mintResult
    }
  }

  // TODO: ?
  async burn(tokenIndex: bigint) {
    const burnResult = await this.actor.dip721_burn(tokenIndex)
    if ("Err" in burnResult) {
      console.error(burnResult.Err)
    }
    if ("Ok" in burnResult) {
      return burnResult
    }
  }

  async getUserTokens(user: Account) {
    const userTokensResult = await this.actor.dip721_owner_token_metadata(user.owner)
    const tokens: Array<TokenMetadata> = userTokensResult["Ok"] || []
    return tokens.map(token => {
      const tokenIndex = token.token_identifier
      const formatedMetadata = this.formatMetadata(token)
      const operator = token.operator?.[0]?.toText()

      return this.serializeTokenData(formatedMetadata, tokenIndex, user.owner.toText(), operator)
    })
  }

  async transfer(args: { from: Account, to: Account, tokenIndex: bigint }) {
    const transferResult = await this.actor.dip721_transfer(args.to.owner, args.tokenIndex)
    if ("Err" in transferResult) throw new Error(`${Object.keys(transferResult.Err)[0]}: ${Object.values(transferResult.Err)[0]}`)
  }

  async getMetadata(tokenIndex: bigint) {
    const metadataResult = await this.actor.dip721_token_metadata(BigInt(tokenIndex))

    if ("Err" in metadataResult) throw new Error(`${Object.keys(metadataResult.Err)[0]}: ${Object.values(metadataResult.Err)[0]}`)
    const metadata = metadataResult?.Ok
    const formatedMetadata = this.formatMetadata(metadata)
    const owner = metadata?.owner?.[0]?.toText?.()
    const operator = metadata?.operator?.[0]?.toText?.()

    return this.serializeTokenData(formatedMetadata, tokenIndex, owner, operator)
  }

  async collectionDetails() {
    const [
      result,
      stats,
      // supportedInterfaces,
    ] = await Promise.all([
      this.actor.dip721_metadata(),
      this.actor.dip721_stats(),
      // this.actor.supportedInterfaces(),
    ])
    // TODO: gitCommitHash dfxInfo rustToolchainInfo ??
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

  private serializeTokenData(metadata: any, tokenIndex: bigint, owner: string | undefined, operator: string | undefined): NFTDetails {
    return {
      index: BigInt(tokenIndex),
      canister: this.canisterId,
      metadata,
      owner,
      url: metadata?.location?.value?.TextContent || "",
      standard: this.standard,
      operator,
    }
  }

  private formatMetadata(metadata: TokenMetadata): Metadata {
    const metadataResult = { properties: new Array<Property>() }

    metadata.properties.map(prop => {
      metadataResult[prop[0]] = { value: prop[1] }
      metadataResult.properties = [...metadataResult.properties, {
        name: prop[0],
        value: extractMetadataValue(prop[1]),
      }]
    })

    // Filter out reserved props from the unique traits
    metadataResult.properties = metadataResult.properties.filter(
      ({ name }) => !["location", "thumbnail", "contentHash", "contentType"].includes(name),
    )
    return metadataResult
  }
}
