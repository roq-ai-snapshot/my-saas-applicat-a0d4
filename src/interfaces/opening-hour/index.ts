import { OrganizationInterface } from 'interfaces/organization';

export interface OpeningHourInterface {
  id?: string;
  day_of_week: number;
  start_time: Date;
  end_time: Date;
  organization_id: string;

  organization?: OrganizationInterface;
  _count?: {};
}
