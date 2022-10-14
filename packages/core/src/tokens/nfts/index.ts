import * as EXT from "./ext"
import * as ICPunks from "./ic_punks"
import * as DepartureLabs from "./departure_labs"
import * as DIP721 from "./dip_721"
import * as DIP721v2 from "./dip_721_v2"
import * as CCC from "./ccc"
import { NFT } from "../constants/standards"

export const NFTStandards = {
  [NFT.ext]: EXT,
  [NFT.dip721]: DIP721,
  [NFT.dip721v2]: DIP721v2,
  [NFT.c3]: CCC,
  [NFT.icpunks]: ICPunks,
  [NFT.departuresLabs]: DepartureLabs,
}
