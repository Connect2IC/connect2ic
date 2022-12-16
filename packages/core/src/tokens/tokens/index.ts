import { BalanceResponse } from "./methods"
import * as XTC from "./xtc"
import * as EXT from "./ext"
import * as DIP20 from "./dip20"
import * as ICP from "./ledger"
import * as WICP from "./wicp"
import * as ICRC1 from "./icrc1"
import * as DRC20 from "./drc20"
import { TOKEN } from "../constants/standards"

export const TokenStandards = {
  [TOKEN.xtc]: XTC,
  [TOKEN.ext]: EXT,
  [TOKEN.dip20]: DIP20,
  [TOKEN.drc20]: DRC20,
  [TOKEN.icrc1]: ICRC1,
  [TOKEN.is20]: ICRC1,
  [TOKEN.wicp]: WICP,
  [TOKEN.icp]: ICP,
}

export { TOKEN }

export const parseBalance = (balance: BalanceResponse): string => {
  return (parseInt(balance.value, 10) / 10 ** balance.decimals).toString()
}

export type { SendResponse } from "./methods"
