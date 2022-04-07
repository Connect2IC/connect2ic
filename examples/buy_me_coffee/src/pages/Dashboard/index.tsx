import { useModel } from "@modern-js/runtime/model"
import { useEffect, useState } from "react"
import { Actor, HttpAgent } from "@dfinity/agent"
import { Space } from "@douyinfe/semi-ui"
import { Principal } from "@dfinity/principal"
import { IC } from "@astrox/connection"
import { appModel } from "@/models/app"
import { idlFactory } from "@/canisters/buymecoffee"
import { BuyMeCoffee, PeopleItem } from "@/canisters/buymecoffee/types"
import { PeopleCard } from "@/components/PeopleCard"
import { BuyCoffeeModal } from "@/components/BuyCoffeeModal"
import { useCanister, useWallet } from "@connect2ic/react"

export const balanceFromString = (balance: string, decimal = 8): bigint => {
  const list = balance.split(".")
  const aboveZero = list[0]
  const aboveZeroBigInt = BigInt(aboveZero) * BigInt(1 * 10 ** decimal)
  let belowZeroBigInt = BigInt(0)
  const belowZero = list[1]
  if (belowZero !== undefined) {
    belowZeroBigInt = BigInt(
      belowZero.substring(0, decimal).padEnd(decimal, "0"),
    )
  }
  return aboveZeroBigInt + belowZeroBigInt
}

export const Dashboard = () => {
  const [state] = useModel(appModel)
  const [peoples, setPeoples] = useState<PeopleItem[] | undefined>(undefined)
  const [myItem, setMyItem] = useState<PeopleItem | undefined>(undefined)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [choosePrincipal, setChoosePrincipal] = useState<string | undefined>(
    undefined,
  )
  const [chooseName, setChooseName] = useState<string | undefined>(undefined)
  const [chooseWallet, setChooseWallet] = useState<string | undefined>(
    undefined,
  )
  const [actor] = useCanister("buymeacoffee")
  const [wallet] = useWallet()

  const { principal } = state

  const getAllPeople = async () => {
    const allPeople = await actor?.allPeople()
    setPeoples(
      allPeople?.sort((a, b) =>
        a.principal === Principal.fromText(principal) ? 0 : -1,
      ),
    )
    return allPeople
  }

  useEffect(() => {
    (async () => {
      await getAllPeople()
    })()
  }, [actor])

  return (
    <div
      style={{
        borderRadius: "10px",
        border: "1px solid var(--semi-color-border)",
        flex: 1,
        padding: "32px",
      }}>
      <Space wrap={true}>
        {peoples?.map((item, idex) => (
          <PeopleCard
            key={item.principal.toText()}
            peopleItem={item}
            onBuyClick={chooseItem => {
              console.log(chooseItem)
              setModalVisible(true)
              setChooseName(chooseItem.people.name)
              setChoosePrincipal(chooseItem.people.id.toText())
              setChooseWallet(chooseItem.people.wallet)
            }}
          />
        ))}
      </Space>
      <BuyCoffeeModal
        checkout={async ({ wallet: receiverAddress, amount }) => {
          const result = await wallet.requestTransfer({
            to: receiverAddress,
            from: wallet.address,
            amount: Number(balanceFromString(amount)),
            sendOpts: {},
          })
          if (result !== undefined) {
            setModalVisible(false)
            setChooseName(undefined)
            setChoosePrincipal(undefined)
            setChooseWallet(undefined)
          }
        }}
        modalVisible={modalVisible}
        setModalVisible={val => {
          setModalVisible(val)
          setChooseName(undefined)
          setChoosePrincipal(undefined)
          setChooseWallet(undefined)
        }}
        principal={choosePrincipal ?? ""}
        wallet={chooseWallet ?? ""}
        name={chooseName}
      />
    </div>
  )
}
