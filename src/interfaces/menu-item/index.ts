import { OrderItemInterface } from 'interfaces/order-item';
import { OrganizationInterface } from 'interfaces/organization';

export interface MenuItemInterface {
  id?: string;
  name: string;
  price: number;
  organization_id: string;
  order_item?: OrderItemInterface[];
  organization?: OrganizationInterface;
  _count?: {
    order_item?: number;
  };
}
