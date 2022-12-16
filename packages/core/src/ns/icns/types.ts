import { Principal } from '@dfinity/principal';
import BigNumber from 'bignumber.js';

export namespace Types {
  /**
   * It receives all possible representations of a number. (e.g. integer, float, percentage, bigint)
   */
  export type Number = BigInt | string | number | BigNumber;

  /**
   * It is a string that represents the number that is shown on user interfaces. (e.g. token amount, money amount)
   */
  export type Amount = string;

  /**
   * It is always a integer that represents the decimals allowed on a DIP20 token.
   */
  export type Decimals = number;

  /**
   * Type definition for Host of domains. It is a url or a principal id.
   * @param {string} url
   * @param {Principal} canister
   */
  export type Host = { url: string } | { canister: Principal };

  /**
   * Type definition for params of the record function.
   * @param {RecordParams} Represents record infos
   */
  export type RecordParams = {
    node: string,
    owner: Principal,
    registry: Principal,
    ttl: bigint,
    expiry: bigint,
    sublabel?: string,
  }

  /**
   * Type definition for a user's domains.
   */
  export type DomainList = Array<string>;
}