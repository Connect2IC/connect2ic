import React, { useEffect } from "react"
import { useDialog } from "./hooks/useDialog"
import { useProviders } from "./hooks/useProviders"
import { useConnect } from "./hooks/useConnect"
import { AstroXButton, IIButton, InfinityButton, PlugButton, StoicButton } from "./index"

const Dialog = (props) => {
  const {
    onClose = () => {
      dialog.close()
    },
      children,
      dark,
  } = props

  const onClickInside = (e) => {
    e.stopPropagation()
  }

  const providerButtons = {
    ii: IIButton,
    stoic: StoicButton,
    plug: PlugButton,
    astrox: AstroXButton,
    infinity: InfinityButton,
  }

  const [dialog] = useDialog()
  const [providers] = useProviders()

  // TODO: provider.connect instead?
  const { connect, disconnect, status } = useConnect()

  useEffect(() => {
    if (status === "connected") {
      dialog.close()
    }
  }, [status])

  return dialog.isOpen ? (
    <div onClick={onClose} className={`dialog-styles ${dark ? "dark" : "light"}`}>
      <div onClick={onClickInside} className="dialog-container">
        {providers.map((provider) => {
          const ProviderButton = providerButtons[provider.id]
          return (
            <ProviderButton key={provider.id} onClick={() => connect(provider.id)} dark={dark} />
          )
        })}
      </div>
    </div>
  ) : null
}

export default Dialog