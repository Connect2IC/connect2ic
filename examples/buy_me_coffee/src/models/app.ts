import { ActorSubclass } from '@dfinity/agent';
import { model } from '@modern-js/runtime/model';
import { BuyMeCoffee } from '@/canisters/buymecoffee/types';

interface AppModelState {
  actor: ActorSubclass<BuyMeCoffee> | undefined;
  principal: string;
  wallet: string;
  name?: string;
  isAuth: boolean;
}

export const appModel = model('appModel').define<{ state: AppModelState }>({
  state: {
    actor: undefined,
    principal: 'unknown',
    wallet: 'unknown',
    name: undefined,
    isAuth: false,
  },
});
