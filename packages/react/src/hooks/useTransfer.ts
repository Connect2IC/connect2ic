import { useState } from "react"
import { useConnect } from "./useConnect"
import { useWallet } from "./useWallet"
import { IConnector, IWalletConnector, TransferError } from "@connect2ic/core"
import { err } from "neverthrow"

type Props = {
  amount: number,
  to: string,
  from?: string,
}

export const useTransfer = ({ amount, to, from = undefined }: Props) => {
  // TODO: check if supported or not
  const wallet = useWallet()
  const { activeProvider } = useConnect()
  const [loading, setLoading] = useState<boolean>(false)
  const [payload, setPayload] = useState<{ height: number }>()
  const [error, setError] = useState<{ kind: TransferError }>()

  const transfer = async () => {
    if (!wallet || !activeProvider) {
      return err({ kind: TransferError.NotConnected })
    }
    setLoading(true)
    const result = await (activeProvider as IConnector & IWalletConnector).requestTransfer({
      amount,
      to,
    })
    result.match(
      (payload) => {
        // TODO: ?
        setPayload(payload)
      },
      (error) => {
        setError(error)
      },
    )
    setLoading(false)
    return result
  }

  return [transfer, { loading, error }] as const
}