import { IconMoneyExchangeStroked, IconUserCircle } from '@douyinfe/semi-icons';
import { Button, List, Modal } from '@douyinfe/semi-ui';

interface LoginModalInterface {
  logout: () => Promise<void>;
  deleteME: () => Promise<boolean>;
  setModalVisible: (status: boolean) => void;
  modalVisible: boolean;
  principal: string;
  wallet: string;
  name?: string;
}

export const LoginModal = ({
  logout,
  deleteME,
  setModalVisible,
  modalVisible,
  principal,
  wallet,
  name,
}: LoginModalInterface) => {
  const btnStyle = {
    // width: 240,
    margin: '4px 0px 20px',
    padding: '30px 120px',
  };
  const footer = (
    <div style={{ textAlign: 'center' }}>
      <Button
        type="primary"
        theme="solid"
        onClick={() => setModalVisible(false)}
        style={btnStyle}>
        Next time
      </Button>
      <Button
        type="warning"
        theme="borderless"
        onClick={logout}
        style={btnStyle}>
        Logging out
      </Button>
      <Button
        type="danger"
        theme="borderless"
        onClick={() =>
          Modal.error({
            title: 'You really wanna delete yourselve?',
            content: 'There is no turning back!!!',
            onOk: async () => {
              const deleteResult = await deleteME();
              if (deleteResult) {
                await logout();
              }
            },
          })
        }
        style={btnStyle}>
        DELETE ME
      </Button>
    </div>
  );

  const data = [
    {
      icon: (
        <IconUserCircle
          style={{ fontSize: 48, color: 'var(--semi-color-text-1)' }}
        />
      ),
      title: 'You Principal ID is :',
      content: principal,
    },

    {
      icon: (
        <IconMoneyExchangeStroked
          style={{ fontSize: 48, color: 'var(--semi-color-text-1)' }}
        />
      ),
      title: 'Your Wallet Address is ',
      content: wallet,
    },
  ];
  return (
    <Modal
      header={null}
      visible={modalVisible}
      onOk={logout}
      onCancel={() => {
        setModalVisible(false);
      }}
      footer={footer}
      style={{ width: '100%', padding: '0 20px', maxWidth: 440 }}>
      <h3
        style={{
          textAlign: 'center',
          fontSize: 24,
          margin: 40,
          color: 'var(--semi-color-text-1)',
        }}>
        {name ?? 'Unknown Name'}
      </h3>
      <List
        dataSource={data}
        split={false}
        renderItem={item => (
          <List.Item
            header={item.icon}
            main={
              <div>
                <h6
                  style={{
                    margin: 0,
                    fontSize: 16,
                    color: 'var(--semi-color-text-1)',
                  }}>
                  {item.title}
                </h6>
                <p
                  style={{
                    marginTop: 4,
                    color: 'var(--semi-color-text-1)',
                    wordBreak: 'break-all',
                  }}>
                  {item.content}
                </p>
              </div>
            }
          />
        )}
      />
    </Modal>
  );
};
