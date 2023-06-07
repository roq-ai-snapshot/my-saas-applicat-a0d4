import * as yup from 'yup';

export const orderItemValidationSchema = yup.object().shape({
  order_id: yup.string().nullable().required(),
  menu_item_id: yup.string().nullable().required(),
});
