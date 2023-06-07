import { OrderItemInterface } from 'interfaces/order-item';
import { UserInterface } from 'interfaces/user';
import { OrganizationInterface } from 'interfaces/organization';

export interface OrderInterface {
  id?: string;
  customer_id: string;
  organization_id: string;
  status: string;
  order_item?: OrderItemInterface[];
  user?: UserInterface;
  organization?: OrganizationInterface;
  _count?: {
    order_item?: number;
  };
}
