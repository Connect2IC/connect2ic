import React, { PropsWithChildren, useEffect, useState } from "react"
import { useConnect, useDialog, useProviders } from "../hooks"
// import "@fontsource/pt-sans"
import qrIconSrc from "../qr_icon.svg"
import connect2icSrc from "../connect2ic.svg"
import closeIconSrc from "../close_icon.svg"
import backIconSrc from "../back_icon.svg"
import appIconSrc from "../phone_icon.svg"
import browserIconSrc from "../browser_icon.svg"
import "webcomponent-qr-code"
import type { Provider } from "@connect2ic/core/providers"
import AuthClient, { generateNonce } from "@walletconnect/auth-client"
import { Methods } from "@connect2ic/core"

const ua = navigator.userAgent.toLowerCase()
const isAndroid = ua.indexOf("android") > -1
const isApple = ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1
//
// const isMobile = isAndroid || isApple;
//
// const mobileOS = (() => {
//   const ua = navigator.userAgent
//   if (/android/i.test(ua)) {
//     return "Android"
//   } else if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) {
//     return "iOS"
//   }
//   return "Other"
// })()

let isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|webOS)/)

const Spacer = ({ size = 0.8 }) => <div style={{ height: `${size}rem`, width: `${size}rem` }} />

type Props = {
  onClose?: () => void
  dark?: boolean
}

enum screens {
  SELECT_PROVIDER = "SELECT_PROVIDER",
  SELECT_METHOD = "SELECTED_METHOD",
  CONNECTING = "CONNECTING",
  QR_CODE = "QR_CODE",
}

const ConnectDialog: React.FC<PropsWithChildren<Props>> = (props) => {
  const {
    onClose = () => {
      // TODO: fires on mount on mobile
      dialog.close()
      setScreen(screens.SELECT_PROVIDER)
    },
    children,
    dark,
  } = props

  const dialog = useDialog()
  const providers = useProviders()

  const mobileProviders = providers.filter((provider) => provider.meta.methods.includes(Methods.APP) || provider.meta.methods.includes(Methods.BROWSER))

  const { connect, isConnected } = useConnect()

  useEffect(() => {
    if (isConnected) {
      dialog.close()
    }
  }, [isConnected])

  useEffect(() => {
    if (dialog.isOpen) {
      document.body.style.overflow = "hidden"
    }
    if (!dialog.isOpen) {
      document.body.style.overflow = "unset"
    }
  }, [dialog.isOpen])

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        dialog.close()
      }
    }
    window.addEventListener("keydown", handleEsc)

    return () => {
      window.removeEventListener("keydown", handleEsc)
    }
  }, [])

  const onClickInside = (e) => {
    e.stopPropagation()
  }

  const [screen, setScreen] = useState(screens.SELECT_PROVIDER)
  const [selectedProvider, setSelectedProvider] = useState<Provider>()
  const desktopMethods = selectedProvider?.meta.methods.filter((method) => method !== Methods.APP)
  const mobileMethods = selectedProvider?.meta.methods.filter((method) => method !== Methods.EXTENSION)
  const availableMethods = isMobile ? mobileMethods : desktopMethods
  const shouldShowMethods = availableMethods?.length > 1

  const [client, setClient] = useState<typeof AuthClient>()

  useEffect(() => {
    ;(async () => {
      const authClient = await AuthClient.init({
        // TODO:
        projectId: "809a380ab4c414631cbc45bbca4b641a",
        metadata: {
          name: "eight.icp",
          description: "A dapp using WalletConnect AuthClient",
          url: window.location.origin,
          icons: ["https://my-auth-dapp.com/icons/logo.png"],
        },
      })
      authClient.on("auth_response", ({ params }) => {
        if (Boolean(params.result?.s)) {
          // Response contained a valid signature -> user is authenticated.

        } else {
          // Handle error or invalid signature case
          console.error(params.message)
        }
      })
      setClient(authClient)
      // TODO: client not ready always
      const { uri: result } = await authClient.request({
        aud: window.location.href,
        domain: window.location.hostname.split(".").slice(-2).join("."),
        chainId: "eip155:1",
        // type: "eip4361",
        nonce: generateNonce(),
        statement: "Sign in with wallet.",
      })
      setUri(result)
    })()
  }, [AuthClient])

  const [uri, setUri] = useState<string>()
  const showQRCode = async () => {
    setScreen(screens.QR_CODE)
  }

  const showMethods = (provider) => {
    setSelectedProvider(provider)
    setScreen(screens.SELECT_METHOD)
  }

  // TODO: rename
  const showConnecting = async (provider) => {
    setSelectedProvider(provider)
    setScreen(screens.CONNECTING)
    try {
      await connect(provider.meta.id)
    } catch (e) {
      // TODO:
    }
  }

  // TODO: clean up
  const methods = {
    [Methods.BROWSER]: {
      icon: browserIconSrc,
      description: "In browser",
      action: showConnecting,
    },
    [Methods.EXTENSION]: {
      icon: browserIconSrc,
      description: "With extension",
      action: showConnecting,
    },
    // [Methods.QR_CODE]: {
    //   icon: appIconSrc,
    // },
    [Methods.APP]: {
      icon: appIconSrc,
      // TODO: move to provider
      description: `In ${selectedProvider?.meta.name} app`,
      // TODO: deeplink
      action: () => {
        // const url = "intent://APP_HOST/#Intent;scheme=APP_NAME;package=APP_PACKAGE;end";
        if (isAndroid) {
          window.location.replace(selectedProvider?.meta.deepLinks.android)
        } else if (isApple) {
          window.location.replace(selectedProvider?.meta.deepLinks.ios)
          setTimeout(() => {
            // TODO: app store link
            window.location.replace("https://apps.apple.com/us/app/instagram/id389801252")
          }, 10000)
        } else {
          // mobileOS === "Other"
        }
      },
    },
  }
  const onSelectProvider = (provider) => {
    const desktopMethods = provider.meta.methods.filter((method) => method !== Methods.APP)
    const mobileMethods = provider.meta.methods.filter((method) => method !== Methods.EXTENSION)
    const availableMethods = isMobile ? mobileMethods : desktopMethods
    const shouldShowMethods = availableMethods.length > 1
    if (shouldShowMethods) {
      showMethods(provider)
    } else {
      setSelectedProvider(provider)
      methods[availableMethods[0]].action(provider)
    }
  }

  return dialog.isOpen ? (
    <>
      <div className={`dialog-styles ${dark ? "dark" : "light"}`} onClick={onClose}>
        <div onClick={onClickInside} className="dialog-container">

          {screen === screens.SELECT_PROVIDER ? (
            <>
              <div className="dialog-top">
                <h3 className="dialog-title">Connect a wallet</h3>
                <img className="dialog-top-right-icon" onClick={onClose} src={closeIconSrc} />
              </div>
              <div className="dialog-content-container">
                <div className="dialog-content">
                  {(isMobile ? mobileProviders : providers).map((provider) => (
                    <React.Fragment key={provider.meta.id}>
                      <button
                        onClick={() => onSelectProvider(provider)}
                        className={`button-styles ${provider.meta.id}-styles`} {...props}>
                        <div className="img-container">
                          <img className={"img-styles"}
                               src={dark ? provider.meta.icon.dark : provider.meta.icon.light} />
                        </div>
                        <div className="button-text">
                          <h3 className="button-label">{provider.meta.name}</h3>
                          <span className="button-description">{provider.meta.description}</span>
                        </div>
                      </button>
                      <Spacer size={0.8} />
                    </React.Fragment>
                  ))}
                  <button onClick={showQRCode}
                          className={`button-styles`} {...props}>
                    <div className="img-container">
                      <img className="img-styles" src={qrIconSrc} alt="" />
                    </div>
                    <div className="button-text">
                      <h3 className="button-label">QR Code</h3>
                      <span className="button-description">Scan OR code with a Connect2IC compatible wallet.</span>
                    </div>
                  </button>
                </div>
              </div>
              <div className="dialog-bottom">
                <span>Powered by&nbsp;</span>
                <img className="dialog-bottom-icon" src={connect2icSrc} />
                <span>&nbsp;Connect2IC</span>
              </div>
            </>
          ) : null}

          {screen === screens.QR_CODE ? (
            <>
              <div className="dialog-top">
                <img className="dialog-top-left-icon" onClick={() => setScreen(screens.SELECT_PROVIDER)}
                     src={backIconSrc} />
                <h3 className="dialog-title">Scan QR Code</h3>
              </div>
              <div className="qr-container">
                <div className="qr-bg">
                  {uri ? (
                    <qr-code data={uri} />
                  ) : null}
                </div>
              </div>
              <div className="dialog-bottom">
                <span>Scan QR code with a Connect2IC compatible wallet</span>
              </div>
            </>
          ) : null}

          {screen === screens.SELECT_METHOD ? (
            <>
              <div className="dialog-top">
                <img className="dialog-top-left-icon" onClick={() => setScreen(screens.SELECT_PROVIDER)}
                     src={backIconSrc} />
                <h3 className="dialog-title">How do you want to login with ME?</h3>
              </div>
              <div className="method-container">
                {availableMethods.map((method) => (
                  <React.Fragment key={method}>
                    <button className="method-button" onClick={
                      methods[method].action
                    }
                            {...props}>
                      <img src={methods[method].icon} alt="" />
                      <h3 className="button-label">{methods[method].description}</h3>
                    </button>
                    <Spacer />
                  </React.Fragment>
                ))}
              </div>
              <div className="dialog-bottom">
              </div>
            </>
          ) : null}

          {screen === screens.CONNECTING ? (
            <>
              <div className="dialog-top">
                <img className="dialog-top-left-icon" onClick={() => setScreen(screens.SELECT_PROVIDER)}
                     src={backIconSrc} />
                <h3 className="dialog-title">Connecting...</h3>
              </div>

              <div className="loading-container">
                <img className="loading-img"
                     src={dark ? selectedProvider!.meta.icon.dark : selectedProvider!.meta.icon.light} />
              </div>

              <div className="dialog-bottom">
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  ) : null
}

export default ConnectDialog