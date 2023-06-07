import * as yup from 'yup';

export const openingHourValidationSchema = yup.object().shape({
  day_of_week: yup.number().integer().required(),
  start_time: yup.date().required(),
  end_time: yup.date().required(),
  organization_id: yup.string().nullable().required(),
});
