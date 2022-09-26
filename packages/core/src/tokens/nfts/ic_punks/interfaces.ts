/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/class-name-casing */
/* eslint-disable @typescript-eslint/interface-name-prefix */
import { Principal } from "@dfinity/principal"

export default interface _SERVICE {
  data_of: (token_index: bigint) => Promise<TokenDesc>;
  transfer_to: (to: Principal, tokenIndex: bigint) => Promise<boolean>;
  user_tokens: (user: Principal) => Promise<Array<bigint>>;
}

export interface Property {
  value: string;
  name: string;
}

export interface TokenDesc {
  id: bigint;
  url: string;
  owner: Principal;
  desc: string;
  name: string;
  properties: Array<Property>;
}
