import { OrganizationInterface } from 'interfaces/organization';

export interface ContactInformationInterface {
  id?: string;
  phone_number: string;
  address: string;
  organization_id: string;

  organization?: OrganizationInterface;
  _count?: {};
}
