import { OrderInterface } from 'interfaces/order';
import { MenuItemInterface } from 'interfaces/menu-item';

export interface OrderItemInterface {
  id?: string;
  order_id: string;
  menu_item_id: string;

  order?: OrderInterface;
  menu_item?: MenuItemInterface;
  _count?: {};
}
