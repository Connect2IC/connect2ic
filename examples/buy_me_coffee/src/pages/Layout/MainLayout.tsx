import { IC } from '@astrox/connection';
import { PermissionsType } from '@astrox/connection/lib/cjs/types';
import {
  IconCode,
  IconHome,
  IconMember,
  IconMoon,
  IconSemiLogo,
  IconSun,
  IconUser,
} from '@douyinfe/semi-icons';
import {
  IllustrationNoContent,
  IllustrationNoContentDark,
} from '@douyinfe/semi-illustrations';
import {
  Avatar,
  Button,
  Empty,
  Form,
  Layout,
  Nav,
  Skeleton,
  Typography,
  useFieldApi,
} from '@douyinfe/semi-ui';
import {
  ReactChild,
  ReactFragment,
  ReactPortal,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ActorSubclass } from '@dfinity/agent';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { Route, Switch, useHistory } from '@modern-js/runtime/router';
import { useModel } from '@modern-js/runtime/model';
import { LoginModal } from '../../components/LoginModal';
import { Register } from '../Register';
import { Dashboard } from '../Dashboard';
import { EmptyPage } from '../Empty';
import { BuyMeCoffee, People, Result } from '@/canisters/buymecoffee/types';
import { idlFactory } from '@/canisters/buymecoffee';
import { appModel } from '@/models/app';
import '../../global.less';

const { Header, Footer, Content } = Layout;
const { Title } = Typography;

export const MainLayout = (children: any) => {
  const { body } = document;
  const [principal, setPrincipal] = useState<string>('unknown');
  const [wallet, setWallet] = useState<string>('unknown');
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [name, setName] = useState<string | undefined>(undefined);
  const [ic, setIC] = useState<IC>((window as any).ic);
  const [isLight, setIsLight] = useState<boolean>(
    !body.hasAttribute('theme-mode'),
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [actor, setActor] = useState<ActorSubclass<BuyMeCoffee> | undefined>(
    undefined,
  );

  const [people, setPeople] = useState<People | undefined>(undefined);
  const history = useHistory();
  const [state, actions] = useModel(appModel);

  const login = async () => {
    await IC.connect({
      useFrame: !(window.innerWidth < 768),
      signerProviderUrl: process.env.isProduction!
        ? 'https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/signer'
        : 'http://localhost:8080/signer',
      walletProviderUrl: process.env.isProduction!
        ? 'https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/transaction'
        : 'http://localhost:8080/transaction', // 'http://localhost:8080/transaction', // "https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/transaction",
      identityProvider: process.env.isProduction!
        ? 'https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/login#authorize'
        : 'http://localhost:8080/login#authorize', // 'http://localhost:8080/login#authorize', // 'https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/login#authorize',
      permissions: [PermissionsType.identity, PermissionsType.wallet],
      onAuthenticated: (icInstance: IC) => {
        const thisIC = window.ic ?? icInstance;
        setPrincipal(thisIC.principal.toText());
        setWallet(thisIC.wallet ?? 'unknown');
        setIsAuth(true);
        actions.setPrincipal(thisIC.principal.toText());
        actions.setWallet(thisIC.wallet ?? 'unknown');
        actions.setIsAuth(true);
        setIC(thisIC);
        const thisActor = icInstance.createActor<BuyMeCoffee>(
          idlFactory,
          process.env.CANISTER_ID!,
        );
        setActor(thisActor);
        actions.setActor(thisActor);
      },
    });
  };
  const logout = async () => {
    await ic.disconnect();
    setDefault();
    history.push('/empty');
  };

  const deleteME = async () => {
    const result = await actor?.delete();
    if ((result as { ok: boolean }).ok) {
      return true;
    } else {
      return false;
    }
  };

  const setDefault = () => {
    setPrincipal('unknown');
    setWallet('unknown');
    setIsAuth(false);
    setName(undefined);
    actions.setPrincipal('unknown');
    actions.setWallet('unknown');
    actions.setName(undefined);
    actions.setIsAuth(false);
    setPeople(undefined);
    setModalVisible(false);
  };

  const switchMode = () => {
    if (body.hasAttribute('theme-mode')) {
      body.removeAttribute('theme-mode');
      setIsLight(true);
    } else {
      body.setAttribute('theme-mode', 'dark');
      setIsLight(false);
    }
  };

  const getPeople = async () => {
    try {
      const result = await actor?.read();
      if (
        result !== undefined &&
        (result as unknown as { ok: People }).ok !== undefined
      ) {
        setPeople((result as unknown as { ok: People }).ok);
        return (result as unknown as { ok: People }).ok;
      } else {
        setPeople(undefined);
        return undefined;
      }
    } catch (error) {
      throw error as Error;
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem('ic-delegation') !== null) {
      (async () => {
        await login();
      })();
    } else {
      history.push('/empty');
    }
  }, []);

  useEffect(() => {
    if (actor !== undefined) {
      if (isAuth) {
        if (!people) {
          (async () => {
            const result = await getPeople();
            if (!result) {
              history.push('/register');
            } else {
              actions.setPrincipal(result.id.toText());
              actions.setWallet(result.wallet);
              actions.setName(result.name);
              setName(result.name);
              history.push('/dashboard');
            }
          })();
        } else {
          actions.setPrincipal(people.id.toText());
          actions.setWallet(people.wallet);
          actions.setName(people.name);
          setName(people.name);
          history.push('/dashboard');
        }
      }
    }
  }, [actor]);

  return (
    <Layout
      style={{
        minHeight: '100%',
        width: '100%',
        padding: 0,
        margin: 0,
        backgroundColor: 'var(--semi-color-bg-0)',
      }}>
      <Header
        style={{
          backgroundColor: 'var(--semi-color-bg-1)',
          width: '100%',
        }}>
        <div>
          <Nav mode="horizontal" defaultSelectedKeys={['Home']}>
            <Nav.Header>
              <IconSemiLogo style={{ fontSize: 36 }} />
            </Nav.Header>
            <Nav.Item
              itemKey="Home"
              text={isAuth ? 'Dashboard' : 'Home'}
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
                  color: 'var(--semi-color-text-2)',
                  marginRight: '12px',
                }}
                onClick={switchMode}
              />
              <Button onClick={isAuth ? () => setModalVisible(true) : login}>
                {isAuth ? (
                  <Avatar
                    color={state.name !== undefined ? 'blue' : 'orange'}
                    size="small">
                    {state.name !== undefined
                      ? state.name.substring(0, 2).toUpperCase()
                      : 'NA'}
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
          padding: '24px',
          backgroundColor: 'var(--semi-color-bg-0)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'flex-start',
          minHeight: window.innerHeight - 60,
        }}>
        <Switch>
          <Route exact={true} path="/">
            <Dashboard />
          </Route>
          <Route path="/empty">
            <EmptyPage login={login} />
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
          wallet={wallet}
        />
      </Content>
      {/* <Footer
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '20px',
          color: 'var(--semi-color-text-2)',
          backgroundColor: 'rgba(var(--semi-grey-0), 1)',
        }}>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
          }}>
          <IconCode size="large" style={{ marginRight: '8px' }} />
          <span>Copyright © 2021 AstroX.Network. All Rights Reserved. </span>
        </span>
        <span>
          <span style={{ marginRight: '24px' }}>Github</span>
          <span>Twitter</span>
        </span>
      </Footer> */}
    </Layout>
  );
};
