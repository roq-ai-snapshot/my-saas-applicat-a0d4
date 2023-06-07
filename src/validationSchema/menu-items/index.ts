import * as yup from 'yup';
import { orderItemValidationSchema } from 'validationSchema/order-items';

export const menuItemValidationSchema = yup.object().shape({
  name: yup.string().required(),
  price: yup.number().integer().required(),
  organization_id: yup.string().nullable().required(),
  order_item: yup.array().of(orderItemValidationSchema),
});
