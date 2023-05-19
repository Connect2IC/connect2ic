import * as EXT from "./ext"
import * as ICPunks from "./ic_punks"
import * as DepartureLabs from "./departure_labs"
import * as DIP721 from "./dip_721"
import * as DIP721v2 from "./dip_721_v2"
import * as DIP721v2Final from "./dip_721_v2_final"
import * as CCC from "./ccc"
import * as Origyn from "./origyn"
import * as ICNaming from "./ic_naming"
import { NFT } from "../tokens/constants/standards"

export { NFT }

export const NFTStandards = {
  [NFT.ext]: EXT,
  [NFT.dip721]: DIP721,
  [NFT.dip721v2]: DIP721v2,
  [NFT.dip721v2Final]: DIP721v2Final,
  [NFT.c3]: CCC,
  [NFT.icpunks]: ICPunks,
  [NFT.departuresLabs]: DepartureLabs,
  [NFT.origyn]: Origyn,
  [NFT.icNaming]: ICNaming,
}
