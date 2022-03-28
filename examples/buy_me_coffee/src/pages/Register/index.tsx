import { ActorSubclass } from '@dfinity/agent';
import { Button, Form, Modal, Typography } from '@douyinfe/semi-ui';
import { useEffect, useState } from 'react';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { useModel } from '@modern-js/runtime/model';
import { useHistory } from '@modern-js/runtime/router';
import {
  BuyMeCoffee,
  People,
  Error as CoffeeError,
} from '@/canisters/buymecoffee/types';
import { appModel } from '@/models/app';

export const Register = () => {
  const [state, actions] = useModel(appModel);
  const { actor, wallet, principal, name } = state;
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  const registerPeople = async (values: Record<string, any>) => {
    setLoading(true);
    const result = await actor?.create({
      name: values.name,
      wallet: values.wallet,
    });

    setLoading(false);
    if ((result as { ok: People }).ok !== undefined) {
      const res = (result as { ok: People }).ok;
      actions.setName(res.name);
      actions.setPrincipal(res.id.toText());
      actions.setWallet(res.wallet);
      history.push('/');
    } else {
      Modal.error({
        title: 'Unfortunately, there is an error',
        content:
          result !== undefined
            ? JSON.stringify((result as { err: CoffeeError }).err)
            : 'Error Unknown',
      });
    }
  };

  const [walletFormApi, setWalletFormApi] = useState<FormApi | undefined>(
    undefined,
  );

  return (
    <>
      <Typography.Title>Name Yourself</Typography.Title>
      <Form
        onSubmit={values => registerPeople(values)}
        initValues={{ wallet, principal }}
        style={{ width: '100%' }}
        getFormApi={formApi => {
          setWalletFormApi(formApi);
        }}>
        {({ formState, values, formApi }) => (
          <>
            <Form.Input
              field="name"
              label="Name"
              style={{ width: '100%', maxWidth: 400 }}
              disabled={loading}
              required={true}
              placeholder="Enter your name"
            />
            <Form.Input
              field="principal"
              label="Principal ID"
              style={{ width: '100%', maxWidth: 400 }}
              disabled={true}
              placeholder="Your Principal ID"
            />
            <Form.Input
              field="wallet"
              label="Wallet"
              style={{ width: '100%', maxWidth: 400 }}
              disabled={true}
              placeholder="Your Wallet Address"
            />

            <Form.Checkbox field="agree" noLabel={true}>
              I have read and agree to the terms of service
            </Form.Checkbox>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Button
                loading={loading}
                disabled={!values.agree}
                htmlType="submit"
                type="tertiary">
                Sign Me Up
              </Button>
            </div>
          </>
        )}
      </Form>
    </>
  );
};
