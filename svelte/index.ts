import Connect from "./Connect.svelte"
import createPlug from "./stores/Plug.store"
import createConnect2IC from "./stores/Connect2IC.store"
import PlugConnect from "./PlugConnect.svelte"
import createII from "./stores/II.store"
import IIConnect from "./IIConnect.svelte"
import createStoic from "./stores/Stoic.store"
import StoicConnect from "./StoicConnect.svelte"
import MetamaskConnect from "./MetamaskConnect.svelte"
import createMetamask from "./stores/Metamask.store"
import Dialog from "./Dialog.svelte"

const contextKey = "connect2ic"

export {
  Connect,
  Dialog,
  createPlug,
  PlugConnect,
  createII,
  IIConnect,
  MetamaskConnect,
  createMetamask,
  createStoic,
  StoicConnect,
  createConnect2IC,
  contextKey,
}