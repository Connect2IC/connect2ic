import { IconUserCircle } from '@douyinfe/semi-icons';
import { Button, Input, List, Modal } from '@douyinfe/semi-ui';
import { useState } from 'react';
import { CoffeeIcon } from './CoffeeButton';

interface CheckoutInterface {
  wallet: string;
  amount: string;
}

interface BuyCoffeeModalInterface {
  checkout: ({ wallet, amount }: CheckoutInterface) => Promise<void>;
  setModalVisible: (status: boolean) => void;
  modalVisible: boolean;
  principal: string;
  wallet: string;
  name?: string;
}

export const BuyCoffeeModal = ({
  checkout,
  setModalVisible,
  modalVisible,
  principal,
  wallet,
  name,
}: BuyCoffeeModalInterface) => {
  const [amount, setAmount] = useState<string>('');
  const btnStyle = {
    // width: 240,
    margin: '4px 0px 20px',
    padding: '30px 120px',
    maxWidth: '100%',
  };
  const footer = (
    <div style={{ textAlign: 'center' }}>
      <Button
        type="warning"
        theme="solid"
        disabled={amount === ''}
        icon={<CoffeeIcon />}
        onClick={() => checkout({ wallet, amount })}
        style={btnStyle}>
        Buy Coffee
      </Button>
      <Button
        type="primary"
        theme="borderless"
        onClick={() => {
          setModalVisible(false);
          setAmount('');
        }}
        style={btnStyle}>
        Maybe Not
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
      title: 'Principal ID is',
      content: principal,
    },
  ];
  return (
    <Modal
      header={null}
      visible={modalVisible}
      onOk={() => checkout({ wallet, amount })}
      onCancel={() => {
        setAmount('');
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
        Buy {name ?? 'Unknown Name'} a coffee
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
      <Input
        type="number"
        onChange={val => setAmount(val)}
        placeholder={'between 0.00001 to 10000'}
        required={true}
        addonAfter="ICP"
      />
    </Modal>
  );
};
