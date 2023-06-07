import { ContactInformationInterface } from 'interfaces/contact-information';
import { MenuItemInterface } from 'interfaces/menu-item';
import { OpeningHourInterface } from 'interfaces/opening-hour';
import { OrderInterface } from 'interfaces/order';
import { UserInterface } from 'interfaces/user';

export interface OrganizationInterface {
  id?: string;
  name: string;
  user_id: string;
  contact_information?: ContactInformationInterface[];
  menu_item?: MenuItemInterface[];
  opening_hour?: OpeningHourInterface[];
  order?: OrderInterface[];
  user?: UserInterface;
  _count?: {
    contact_information?: number;
    menu_item?: number;
    opening_hour?: number;
    order?: number;
  };
}
