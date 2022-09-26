/* eslint-disable prefer-template */
/* eslint-disable no-bitwise */
export const to32bits = (num: number): any => {
  const b = new ArrayBuffer(4)
  new DataView(b).setUint32(0, num)
  return Array.from(new Uint8Array(b))
}

export const from32bits = (ba: any): any => {
  let value
  for (let i = 0; i < 4; i += 1) {
    value = (value << 8) | ba[i]
  }
  return value
}
