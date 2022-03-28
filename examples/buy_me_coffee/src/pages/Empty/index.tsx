import {
  IllustrationNoContent,
  IllustrationNoContentDark,
} from '@douyinfe/semi-illustrations';
import { Button, Empty, Typography } from '@douyinfe/semi-ui';

interface EmptyPageProps {
  login: () => Promise<void>;
}

export const EmptyPage = ({ login }: EmptyPageProps) => (
  <Empty
    image={<IllustrationNoContent style={{ width: 150, height: 150 }} />}
    style={{ marginTop: 64 }}
    darkModeImage={
      <IllustrationNoContentDark style={{ width: 150, height: 150 }} />
    }
    title="A TECHNICAL DEMO for Developers"
    description="Probably nothing">
    <p>
      If you <b>ARE NOT</b> a developer, or do not understand what it is, just
      leave it here, nothing harms or affects your assets
    </p>
    <p>
      If you <b>ARE</b> a developer, we simply show you what we can do with ME.
      eg: login and make transactions, without extension
    </p>
    <div style={{ textAlign: 'center' }}>
      <Button
        style={{
          marginTop: 32,
          padding: '32px 80px',
          fontSize: 20,
          borderRadius: 32,
        }}
        theme="solid"
        size="large"
        type="primary"
        onClick={login}>
        Login With ME
      </Button>
    </div>
  </Empty>
);
