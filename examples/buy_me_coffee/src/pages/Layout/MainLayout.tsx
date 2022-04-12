import {
  IconCode,
  IconHome,
  IconMember,
  IconMoon,
  IconSemiLogo,
  IconSun,
  IconUser,
} from "@douyinfe/semi-icons"
import {
  Avatar,
  Button,
  Layout,
  Nav,
  Typography,
} from "@douyinfe/semi-ui"
import {
  useEffect,
  useState,
} from "react"
import "@connect2ic/core/style.css"
import { useConnect, useCanister, useWallet } from "@connect2ic/react"
import { Route, Switch, useHistory } from "@modern-js/runtime/router"
import { useModel } from "@modern-js/runtime/model"
import { LoginModal } from "../../components/LoginModal"
import { Register } from "../Register"
import { Dashboard } from "../Dashboard"
import { EmptyPage } from "../Empty"
import { BuyMeCoffee, People, Result } from "@/canisters/buymecoffee/types"
import { appModel } from "@/models/app"
import "../../global.less"

const { Header, Footer, Content } = Layout
const { Title } = Typography

export const MainLayout = (children: any) => {
  const { body } = document
  const [name, setName] = useState<string | undefined>(undefined)
  const [isLight, setIsLight] = useState<boolean>(
    !body.hasAttribute("theme-mode"),
  )
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [actor] = useCanister("buymeacoffee")

  const [people, setPeople] = useState<People | undefined>(undefined)
  const history = useHistory()
  const [state, actions] = useModel(appModel)

  const { status, principal, disconnect } = useConnect({
    onDisconnect: () => {
      setDefault()
      history.push("/empty")
    }
  })
  const [wallet] = useWallet()
  const walletAddress = wallet?.address || "unknown"
  const isAuth = status === "connected"

  const deleteME = async () => {
    const result = await actor?.delete()
    if ((result as { ok: boolean }).ok) {
      return true
    } else {
      return false
    }
  }

  const login = () => {}
  const logout = () => {
    disconnect()
  }

  const setDefault = () => {
    setName(undefined)
    actions.setPrincipal("unknown")
    actions.setName(undefined)
    actions.setIsAuth(false)
    setPeople(undefined)
    setModalVisible(false)
  }

  const switchMode = () => {
    if (body.hasAttribute("theme-mode")) {
      body.removeAttribute("theme-mode")
      setIsLight(true)
    } else {
      body.setAttribute("theme-mode", "dark")
      setIsLight(false)
    }
  }

  const getPeople = async () => {
    try {
      const result = await actor?.read()
      if (
        result !== undefined &&
        (result as unknown as { ok: People }).ok !== undefined
      ) {
        setPeople((result as unknown as { ok: People }).ok)
        return (result as unknown as { ok: People }).ok
      } else {
        setPeople(undefined)
        return undefined
      }
    } catch (error) {
      throw error as Error
    }
  }

  // useEffect(() => {
  //   if (sessionStorage.getItem("ic-delegation") !== null) {
  //     (async () => {
  //       await login()
  //     })()
  //   } else {
  //     history.push("/empty")
  //   }
  // }, [])

  useEffect(() => {
    if (actor !== undefined) {
      if (isAuth) {
        if (!people) {
          (async () => {
            const result = await getPeople()
            if (!result) {
              history.push("/register")
            } else {
              actions.setPrincipal(result.id.toText())
              actions.setWallet(result.wallet)
              actions.setName(result.name)
              setName(result.name)
              history.push("/dashboard")
            }
          })()
        } else {
          actions.setPrincipal(people.id.toText())
          actions.setWallet(people.wallet)
          actions.setName(people.name)
          setName(people.name)
          history.push("/dashboard")
        }
      }
    }
  }, [actor, isAuth])

  return (
    <Layout
      style={{
        minHeight: "100%",
        width: "100%",
        padding: 0,
        margin: 0,
        backgroundColor: "var(--semi-color-bg-0)",
      }}>
      <Header
        style={{
          backgroundColor: "var(--semi-color-bg-1)",
          width: "100%",
        }}>
        <div>
          <Nav mode="horizontal" defaultSelectedKeys={["Home"]}>
            <Nav.Header>
              <IconSemiLogo style={{ fontSize: 36 }} />
            </Nav.Header>
            <Nav.Item
              itemKey="Home"
              text={isAuth ? "Dashboard" : "Home"}
              icon={
                isAuth ? <IconMember size="large" /> : <IconHome size="large" />
              }
              link="/"
            />
            <Nav.Footer>
              <Button
                theme="borderless"
                icon={
                  isLight ? <IconSun size="large" /> : <IconMoon size="large" />
                }
                style={{
                  color: "var(--semi-color-text-2)",
                  marginRight: "12px",
                }}
                onClick={switchMode}
              />
              <Button onClick={isAuth ? () => setModalVisible(true) : login}>
                {isAuth ? (
                  <Avatar
                    color={state.name !== undefined ? "blue" : "orange"}
                    size="small">
                    {state.name !== undefined
                      ? state.name.substring(0, 2).toUpperCase()
                      : "NA"}
                  </Avatar>
                ) : (
                  <IconUser size="small" />
                )}
              </Button>
            </Nav.Footer>
          </Nav>
        </div>
      </Header>
      <Content
        style={{
          padding: "24px",
          backgroundColor: "var(--semi-color-bg-0)",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
          minHeight: window.innerHeight - 60,
        }}>
        <Switch>
          <Route exact={true} path="/">
            <Dashboard />
          </Route>
          <Route path="/empty">
            <EmptyPage dark={!isLight} />
          </Route>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="*">
            <div>404</div>
          </Route>
        </Switch>
        <LoginModal
          logout={logout}
          deleteME={deleteME}
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          name={name}
          principal={principal}
          wallet={walletAddress}
        />
      </Content>
    </Layout>
  )
}
