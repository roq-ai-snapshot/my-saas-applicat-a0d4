import * as yup from 'yup';

export const contactInformationValidationSchema = yup.object().shape({
  phone_number: yup.string().required(),
  address: yup.string().required(),
  organization_id: yup.string().nullable().required(),
});
