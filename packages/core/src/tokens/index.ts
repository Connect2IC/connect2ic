import { HttpAgent } from "@dfinity/agent"
import { getTokenActor } from "./registries/token_registry/token_registry"
import type { GetNFTActorParams } from "./registries/nfts_registry/nfts_registry"
import type { Token } from "./tokens/interfaces/token"
import * as STANDARDS from "./constants/standards"
import { CCC, DepartureLabs, DIP721, DIP721v2, EXT, ICPunks } from "./nfts"
import { Principal } from "@dfinity/principal"
import type { DABCollection, NFTCollection, NFTStandards } from "./nfts/interfaces/nft"
import type { default as NFT } from "./nfts/default/default"
import { err, ok, Result } from "neverthrow"
import localAllNFTs from "./nft_local.json"

const NFT_STANDARDS: { [key: string]: NFTStandards } = {
  [STANDARDS.NFT.ext]: EXT.Wrapper.default,
  [STANDARDS.NFT.icpunks]: ICPunks.Wrapper.default,
  [STANDARDS.NFT.departuresLabs]: DepartureLabs.Wrapper.default,
  [STANDARDS.NFT.erc721]: DIP721.Wrapper.default,
  [STANDARDS.NFT.dip721]: DIP721.Wrapper.default,
  [STANDARDS.NFT.dip721v2]: DIP721v2.Wrapper.default,
  [STANDARDS.NFT.c3]: CCC.Wrapper.default,
}

const index = [
  {
    description:
      "A cycles token by Dank that allows users & developers to hold cycles and develop with them with just a Principal ID. No need for a Cycles Wallet.",
    details: {
      decimals: BigInt(12),
      fee: 0.002,
      standard: "XTC",
      symbol: "XTC",
      total_supply: BigInt(0),
      verified: true,
    },
    frontend: ["https://dank.ooo/xtc/"],
    logo: "https://storageapi.fleek.co/fleek-team-bucket/Dank/XTC-DAB.png",
    name: "Cycles",
    principal_id:
      process.env.NODE_ENV === "production" ? Principal.from("aanaa-xaaaa-aaaah-aaeiq-cai") : Principal.from("txssk-maaaa-aaaaa-aaanq-cai"),
    standard: "XTC",
    symbol: "XTC",
    thumbnail: "https://storageapi.fleek.co/fleek-team-bucket/Dank/XTC-DAB.png",
    total_supply: [BigInt(0)],
    website: "https://dank.ooo/xtc/",
  },
  {
    description: "Wrapped version of the Internet Computer’s native ICP token that can be held by Principal IDs",
    details: {
      decimals: BigInt(8),
      fee: 0,
      standard: "WICP",
      symbol: "WICP",
      total_supply: BigInt(0),
      verified: true,
    },
    frontend: ["https://dank.ooo/wicp/"],
    logo: "https://storageapi.fleek.co/fleek-team-bucket/logos/wicp-logo.png",
    name: "WICP",
    principal_id:
      process.env.NODE_ENV === "production" ? Principal.from("utozz-siaaa-aaaam-qaaxq-cai") : Principal.from("qvhpv-4qaaa-aaaaa-aaagq-cai"),
    standard: "WICP",
    symbol: "WICP",
    thumbnail: "https://storageapi.fleek.co/fleek-team-bucket/logos/wicp-logo.png",
    total_supply: [BigInt(0)],
    website: "https://dank.ooo/wicp/",
  },
  {
    description:
      "ORIGYN is a Swiss Nonprofit Foundation. At ORIGYN Foundation, we combine intelligent technologies and decentralized computing to identify, authenticate and unlock the powers of ownership for the world’s most valuable objects. ORIGYN brings NFTs to life with biometric data and unique ownership experiences to power brands, creators, artists, marketplaces, consumers and industries with guaranteed certificates of authenticity.",
    details: {
      decimals: BigInt(8),
      fee: 0.002,
      standard: "ICP",
      symbol: "OGY",
      total_supply: BigInt(10200000000),
      verified: true,
    },
    frontend: ["https://origyn.ch"],
    logo: "https://storageapi.fleek.co/fleek-team-bucket/logos/ogy.png",
    name: "ORIGYN Foundation",
    // prod
    principal_id:
      process.env.NODE_ENV === "production" ? Principal.from("jwcfb-hyaaa-aaaaj-aac4q-cai") : Principal.from("qvhpv-4qaaa-aaaaa-aaagq-cai"),
    standard: "ICP",
    symbol: "OGY",
    thumbnail: "https://storageapi.fleek.co/fleek-team-bucket/logos/ogy.png",
    total_supply: [BigInt(10200000000)],
    website: "https://origyn.ch",
  },
]

// const IC_HOST = 'https://ic0.app';
const IC_HOST = window.location.origin
const DEFAULT_AGENT = new HttpAgent({ host: IC_HOST })

const getUserBalance = async (collection: Token, user: Principal): Promise<Result<{ value: string, decimals: number }, { kind: Errors }>> => {
  try {
    const tokenActor = await getTokenActor({
      canisterId: collection.principal_id.toString(),
      agent: DEFAULT_AGENT,
      standard: collection.standard,
    })
    const result = await tokenActor.getBalance(Principal.from(user))
    if (result.value === "Error") {
      // TODO: return err()
      return err({ kind: Errors.FetchFailed })
    }
    // TODO: decimals on value
    return ok({ value: result.value, decimals: result.decimals })
  } catch (e) {
    // TODO: figure out why origyn errors?
    return err({ kind: Errors.FetchFailed, message: e })
  }
}

export type UserToken = {
  standard: string;
  symbol: string;
  thumbnail: string;
  website: string;
  balance?: {
    value: string;
    decimals: number;
  };
  total_supply: bigint[];
  name: string;
  description: string;
  logo: string;
  principal_id: Principal;
  frontend: Array<string>;
  details: {
    standard: string;
    symbol: string;
    total_supply: bigint;
    decimals: bigint;
    fee: number;
    verified: boolean;
  };
};

export const getAllUserTokens = async ({ user }): Promise<Result<Array<Result<UserToken, { kind: Errors, token: UserToken }>>, { kind: Errors }>> => {
  try {
    const results = await Promise.all(
      index.map(async token => {
        const balanceResult = await getUserBalance(token, user)
        return balanceResult.map(
          balance => ({
            ...token,
            balance,
          })).mapErr(
          e => ({
            kind: Errors.FetchFailed,
            message: e,
            token,
          }),
        )
      }),
    )
    return ok(results)
  } catch (e) {
    // TODO: more Error kinds
    return err({ kind: Errors.FetchFailed, message: e })
  }
}

export const getAddressFormat = standard => {
  switch (standard) {
    case "ICP":
      return { principal: true, accountId: true }
    case "WICP":
      return { principal: true, accountId: false }
    case "XTC":
      return { principal: true, accountId: false }
    case "IS20":
      return { principal: true, accountId: false }
    case "DIP20":
      return { principal: true, accountId: false }
  }
  return { principal: true, accountId: false }
}

export const getNFTActor = ({ canisterId, agent, standard }: GetNFTActorParams): NFT => {
  if (!(standard in NFT_STANDARDS)) {
    console.error(`Standard ${standard} is not implemented`)
    throw new Error(`standard is not supported: ${standard}`)
  }
  return new NFT_STANDARDS[standard](canisterId, agent)
}

export const getUserCollectionTokens = async (
  collection: DABCollection,
  user: Principal,
  agent: HttpAgent = DEFAULT_AGENT,
  callback: (val?: any) => void = () => {
  },
): Promise<Result<NFTCollection, { kind: Errors }>> => {
  try {
    const NFTActor = getNFTActor({
      canisterId: collection.principal_id.toString(),
      agent,
      standard: collection.standard,
    })
    const details = await NFTActor.getUserTokens(user)
    // const details = await NFTActor.getUserTokens(Principal.from('bae2w-sdp72-nosvs-mfttw-sqz5n-oudb5-34zvm-3tjqg-wfi2c-xesru-lqe'));
    const collectionDetails = {
      name: collection.name,
      canisterId: collection.principal_id.toString(),
      standard: collection.standard,
      description: collection.description,
      icon: collection.icon,
      tokens: details.map(detail => ({
        ...detail,
        collection: collection.name,
      })),
    }
    if (callback) {
      await callback?.(collectionDetails)
    }
    return ok(collectionDetails)
  } catch (e) {
    return err({
      kind: Errors.FetchFailed,
      // TODO:??
      name: collection.name,
      canisterId: collection.principal_id.toString(),
      standard: collection.standard,
      tokens: [],
    })
  }
}

export const getAllNFTS = async (): Promise<DABCollection[]> => {
  // // DAB
  // const registry = new NFTRegistry(DEFAULT_AGENT);
  // const allNFTs = await registry.getAll();
  const allNFTs = localAllNFTs.map(nft => ({
    ...nft,
    principal_id: Principal.from(nft.principal_id),
  }))
  return allNFTs.map(nft => ({ ...nft, icon: nft.thumbnail, standard: nft.details.standard as string }))
}

type UserNFTsResponse = {
  nftList: {
    simpalNftInstanceList: Array<{
      canisterId: string;
      imageUrlTemplate: string;
      inListing: boolean;
      isIframe: boolean;
      latestPrice: number;
      listingPrice: number;
      name: string;
      nri: number;
      owner: string;
      s3Url: string;
      tokenIdentifier: string;
      token_id: number;
    }>;
  };
};

const mockNFTList = {
  "total": 5, "nftList": {
    "simpalNftInstanceList": [{
      "canisterId": "ah2fs-fqaaa-aaaak-aalya-cai",
      "name": "POD",
      "token_id": 1970,
      "tokenIdentifier": "lrfpv-4qkor-uwiaa-aaaaa-cqac6-aaqca-aaa6y-q",
      "imageUrlTemplate": "https://ah2fs-fqaaa-aaaak-aalya-cai.raw.ic0.app/?type=thumbnail\u0026tokenid={tokenIdentifier}",
      "s3Url": "https://ah2fs-fqaaa-aaaak-aalya-cai.raw.ic0.app/?type=thumbnail\u0026tokenid=lrfpv-4qkor-uwiaa-aaaaa-cqac6-aaqca-aaa6y-q",
      "isIframe": false,
      "nri": 0,
      "owner": "1b9a7400abb7b284b53ab9142472dc2f56c30226bda24545ae31701f7f5c1b67",
      "listingPrice": 0,
      "inListing": false,
      "latestPrice": 0,
    }, {
      "canisterId": "vlhm2-4iaaa-aaaam-qaatq-cai",
      "name": "Cap Crowns",
      "token_id": 1475,
      "tokenIdentifier": "5ay7h-3ykor-uwiaa-aaaaa-deaae-4aqca-aaaxb-q",
      "imageUrlTemplate": "https://vqcq7-gqaaa-aaaam-qaara-cai.raw.ic0.app/thumbnails/{tokenId}.png",
      "s3Url": "https://vzb3d-qyaaa-aaaam-qaaqq-cai.raw.ic0.app/thumbnails/1475.png",
      "isIframe": false,
      "nri": 0,
      "owner": "1b9a7400abb7b284b53ab9142472dc2f56c30226bda24545ae31701f7f5c1b67",
      "listingPrice": 9900000000,
      "inListing": true,
      "latestPrice": 0,
    }, {
      "canisterId": "vlhm2-4iaaa-aaaam-qaatq-cai",
      "name": "Cap Crowns",
      "token_id": 1929,
      "tokenIdentifier": "jqhdt-yykor-uwiaa-aaaaa-deaae-4aqca-aaa6e-q",
      "imageUrlTemplate": "https://vqcq7-gqaaa-aaaam-qaara-cai.raw.ic0.app/thumbnails/{tokenId}.png",
      "s3Url": "https://vzb3d-qyaaa-aaaam-qaaqq-cai.raw.ic0.app/thumbnails/1929.png",
      "isIframe": false,
      "nri": 0,
      "owner": "1b9a7400abb7b284b53ab9142472dc2f56c30226bda24545ae31701f7f5c1b67",
      "listingPrice": 2000000000,
      "inListing": true,
      "latestPrice": 0,
    }, {
      "canisterId": "vlhm2-4iaaa-aaaam-qaatq-cai",
      "name": "Cap Crowns",
      "token_id": 5420,
      "tokenIdentifier": "sjdb4-vykor-uwiaa-aaaaa-deaae-4aqca-aacuw-a",
      "imageUrlTemplate": "https://vqcq7-gqaaa-aaaam-qaara-cai.raw.ic0.app/thumbnails/{tokenId}.png",
      "s3Url": "https://vqcq7-gqaaa-aaaam-qaara-cai.raw.ic0.app/thumbnails/5420.png",
      "isIframe": false,
      "nri": 0,
      "owner": "1b9a7400abb7b284b53ab9142472dc2f56c30226bda24545ae31701f7f5c1b67",
      "listingPrice": 2000000000,
      "inListing": true,
      "latestPrice": 0,
    }, {
      "canisterId": "vlhm2-4iaaa-aaaam-qaatq-cai",
      "name": "Cap Crowns",
      "token_id": 5251,
      "tokenIdentifier": "zu2jc-3ykor-uwiaa-aaaaa-deaae-4aqca-aacsb-q",
      "imageUrlTemplate": "https://vqcq7-gqaaa-aaaam-qaara-cai.raw.ic0.app/thumbnails/{tokenId}.png",
      "s3Url": "https://vqcq7-gqaaa-aaaam-qaara-cai.raw.ic0.app/thumbnails/5251.png",
      "isIframe": false,
      "nri": 0,
      "owner": "1b9a7400abb7b284b53ab9142472dc2f56c30226bda24545ae31701f7f5c1b67",
      "listingPrice": 0,
      "inListing": false,
      "latestPrice": 850000000,
    }],
  },
}
const mockNFTClassByAccount = {
  "Collections": [{
    "Name": "POD",
    "Canister": "ah2fs-fqaaa-aaaak-aalya-cai",
  }, { "Name": "Cap Crowns", "Canister": "vlhm2-4iaaa-aaaam-qaatq-cai" }],
}

const mockCollectionInfo = {
  "ah2fs-fqaaa-aaaak-aalya-cai": {
    canisterId: "ah2fs-fqaaa-aaaak-aalya-cai",
    collection_market_url: "https://entrepot.app/marketplace/pod",
    description: "The distrikt PODs collection is made up of 10,000 vessels that will traverse the IC ecosystem. Your POD contains multitudes and shelters unlimited potential. When you hold a distrikt POD you hold the key to unlock experience in multiple dimensions, available only to the initiated.",
    discord: "https://discord.com/cVxhQeE7",
    firstTokenIdentifier: "3bvn7-oikor-uwiaa-aaaaa-cqac6-aaqca-aaaaa-q",
    firstTxsTime: 1650296140076384000,
    floorPrice: 1600000000,
    floorPriceChangePercent: 0,
    holderAmount: 1829,
    holderChangePercent: -0.003269754768392419,
    image_url_template: "https://ah2fs-fqaaa-aaaak-aalya-cai.raw.ic0.app/?type=thumbnail&tokenid={tokenIdentifier}",
    instance_market_url_template: "https://entrepot.app/marketplace/asset/{tokenIdentifier}",
    isIframe: false,
    listedAmount: 341,
    marketCap: 1362615691152,
    marketCapChangePercent: 0,
    medium: "https://medium.com/distrikt",
    name: "POD",
    s3Url: "https://ah2fs-fqaaa-aaaak-aalya-cai.raw.ic0.app/?type=thumbnail&tokenid=3bvn7-oikor-uwiaa-aaaaa-cqac6-aaqca-aaaaa-q",
    standard: "EXT",
    totalMintTxs: 0,
    totalMinted: 0,
    totalSupply: 10000,
    transactionAmount: 1010,
    transactionAmountChangePercent: 0,
    twitter: "https://twitter.com/DistriktApp",
    volume: 1651296750143,
    volumeChangePercent: 0,
  },
  "vlhm2-4iaaa-aaaam-qaatq-cai": {
    canisterId: "vlhm2-4iaaa-aaaam-qaatq-cai",
    collection_market_url: "https://jelly.xyz/",
    description: "Crowns are a collection of 10,000 procedurally generated traditional & psychedelic 3D crowns on the Internet Computer, backed by asset provenance from CAP.",
    discord: "https://discord.com/invite/yVEcEzmrgm",
    firstTokenIdentifier: "4awki-nqkor-uwiaa-aaaaa-deaae-4aqca-aaaaa-q",
    firstTxsTime: 1655152749823000000,
    floorPrice: 790000000,
    floorPriceChangePercent: 0,
    holderAmount: 6890,
    holderChangePercent: 0.00029036004645766056,
    image_url_template: "https://vqcq7-gqaaa-aaaam-qaara-cai.raw.ic0.app/thumbnails/{tokenId}.png",
    instance_market_url_template: "https://jelly.xyz/nft/{tokenId}",
    isIframe: false,
    listedAmount: 1623,
    marketCap: 2584447144997,
    marketCapChangePercent: 0.002353416491044147,
    medium: "",
    name: "Cap Crowns",
    s3Url: "https://vzb3d-qyaaa-aaaam-qaaqq-cai.raw.ic0.app/thumbnails/0001.png",
    standard: "DIP721",
    totalMintTxs: 10000,
    totalMinted: 10000,
    totalSupply: 10000,
    transactionAmount: 2491,
    transactionAmountChangePercent: -0.7777777777777778,
    twitter: "https://twitter.com/cap_ois",
    volume: 2908649646007,
    volumeChangePercent: -0.7810274427879593,
  },
}

export enum Errors {
  FetchFailed
}

export const getAllUserNFTsICScan = async (accountId: string): Promise<Result<Array<Result<NFTCollection, { kind: Errors }>>, { kind: Errors }>> => {
  try {
    const response = mockNFTList
    // const response = await fetch('https://icscan.io/api/nft/account/NFTList', {
    //   method: 'POST',
    //   credentials: 'include',
    //   mode: 'cors',
    //   // headers: {
    //   //   'Content-Type': 'application/json',
    //   // },
    //   body: JSON.stringify({
    //     canister: [],
    //     id: accountId,
    //     page: 0,
    //     size: 15,
    //   }),
    // });
    // const { Collections: fetchedCollections } = await (
    //   await fetch(`https://icscan.io/api/nft/account/NFTClassByAccount?account=${accountId}`, {
    //     credentials: 'include',
    //     mode: 'cors',
    //   })
    // ).json();
    const { Collections: fetchedCollections } = mockNFTClassByAccount
    // const {
    //   nftList: { simpalNftInstanceList: fetchedUserNFTs },
    // } = (await response.json()) as UserNFTsResponse;
    const {
      nftList: { simpalNftInstanceList: fetchedUserNFTs },
    } = response as UserNFTsResponse
    // console.log({ userNFTs });
    const userCollections = await Promise.all(
      fetchedCollections.map(async collection => {
        try {
          // const result = await fetch(`https://icscan.io/api/nft/collection/info?id=${collection.Canister}`, {
          //   credentials: 'include',
          //   mode: 'cors',
          // });
          // const fetchedCollection = await result.json();
          const fetchedCollection = mockCollectionInfo[collection.Canister]
          return ok({
            icon: fetchedCollection.s3Url,
            name: fetchedCollection.name,
            standard: fetchedCollection.standard,
            canisterId: fetchedCollection.canisterId,
            description: fetchedCollection.description,
            tokens: fetchedUserNFTs
              .filter(nft => nft.canisterId === fetchedCollection.canisterId)
              .map(nft => ({
                index: BigInt(nft.token_id),
                canister: fetchedCollection.canisterId,
                name: fetchedCollection.name,
                // result.marketUrlTemplate ??
                url: fetchedCollection.s3Url,
                // TODO: request from ICScan?
                metadata: {},
                standard: fetchedCollection.standard,
                // TODO: check?
                collection: fetchedCollection.canisterId,
                owner: nft.owner,
                // TODO: need or not?
                operator: "",
              })),
          })
        } catch (e) {
          return err({ kind: Errors.FetchFailed, message: e })
        }
      }),
    )
    return ok(userCollections)
  } catch (e) {
    // TODO:
    return err({ kind: Errors.FetchFailed, message: e })
  }
  // const NFTCollections = await getAllNFTS();
  // const userPrincipal = user instanceof Principal ? user : Principal.fromText(user);
  //
  // const result = await Promise.all(NFTCollections.map(collection => getUserCollectionTokens(collection, userPrincipal)));
  // return result.filter(element => element.tokens.length);
}

export const getAllUserNFTs = async (user: string): Promise<Result<Array<Result<NFTCollection, { kind: Errors }>>, Error>> => {
  const NFTCollections = await getAllNFTS()
  const userPrincipal = Principal.fromText(user)

  const result = await Promise.all(NFTCollections.map(collection => getUserCollectionTokens(collection, userPrincipal)))
  return ok(result)
}
