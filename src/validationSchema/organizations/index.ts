import * as yup from 'yup';
import { contactInformationValidationSchema } from 'validationSchema/contact-informations';
import { menuItemValidationSchema } from 'validationSchema/menu-items';
import { openingHourValidationSchema } from 'validationSchema/opening-hours';
import { orderValidationSchema } from 'validationSchema/orders';

export const organizationValidationSchema = yup.object().shape({
  name: yup.string().required(),
  user_id: yup.string().nullable().required(),
  contact_information: yup.array().of(contactInformationValidationSchema),
  menu_item: yup.array().of(menuItemValidationSchema),
  opening_hour: yup.array().of(openingHourValidationSchema),
  order: yup.array().of(orderValidationSchema),
});
