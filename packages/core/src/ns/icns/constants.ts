/**
 * @internal
 * ICNSConstants values used on ICNS-js library.
 */
export const ICNSConstants = {
  // URL used for communicating with IC
  host: process.env.HOST || "https://ic0.app",

  // ICNS Canister Id
  canisterIds: {
    registrar: process.env.REGISTRAR_CANISTER_ID ||
      'e2lt7-uaaaa-aaaan-qabaa-cai',
    registry: process.env.REGISTRY_CANISTER_ID ||
      'e5kvl-zyaaa-aaaan-qabaq-cai',
    WICP: process.env.WICP_CANISTER_ID ||
      'utozz-siaaa-aaaam-qaaxq-cai',
    resolver: process.env.RESOLVER_CANISTER_ID ||
      'euj6x-pqaaa-aaaan-qabba-cai',
    reverse_registrar: process.env.REVERSE_TRGISTRAR_CANISTER_ID ||
      'etiyd-ciaaa-aaaan-qabbq-cai',
    favorite: process.env.FAVORITE_CANISTER_ID ||
      'pe5bb-piaaa-aaaan-qaa7q-cai',
  },
  wicpDecimal: 8
};