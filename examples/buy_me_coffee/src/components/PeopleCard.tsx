import { Button, Card, Icon } from '@douyinfe/semi-ui';
import Meta from '@douyinfe/semi-ui/lib/es/card/meta';
import { CoffeeIcon } from './CoffeeButton';
import { PeopleItem } from '@/canisters/buymecoffee/types';

interface PeopleCardInterface {
  peopleItem: PeopleItem;
  onBuyClick: (peopleItem: PeopleItem) => void;
}
export const PeopleCard = ({ peopleItem, onBuyClick }: PeopleCardInterface) => (
  <Card
    style={{ maxWidth: 300 }}
    actions={[
      // eslint-disable-next-line react/jsx-key
      <Button
        size="large"
        type="primary"
        icon={<CoffeeIcon />}
        onClick={() => onBuyClick(peopleItem)}>
        Buy Coffee
      </Button>,
    ]}
    headerLine={false}
    cover={
      <img
        alt="example"
        src="https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/card-cover-docs-demo.jpeg"
      />
    }>
    <Meta
      title={peopleItem.people.name}
      description={peopleItem.principal.toText()}
    />
  </Card>
);
