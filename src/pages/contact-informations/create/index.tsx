import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createContactInformation } from 'apiSdk/contact-informations';
import { Error } from 'components/error';
import { contactInformationValidationSchema } from 'validationSchema/contact-informations';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';
import { ContactInformationInterface } from 'interfaces/contact-information';

function ContactInformationCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ContactInformationInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createContactInformation(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ContactInformationInterface>({
    initialValues: {
      phone_number: '',
      address: '',
      organization_id: (router.query.organization_id as string) ?? null,
    },
    validationSchema: contactInformationValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Contact Information
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="phone_number" mb="4" isInvalid={!!formik.errors?.phone_number}>
            <FormLabel>Phone Number</FormLabel>
            <Input type="text" name="phone_number" value={formik.values?.phone_number} onChange={formik.handleChange} />
            {formik.errors.phone_number && <FormErrorMessage>{formik.errors?.phone_number}</FormErrorMessage>}
          </FormControl>
          <FormControl id="address" mb="4" isInvalid={!!formik.errors?.address}>
            <FormLabel>Address</FormLabel>
            <Input type="text" name="address" value={formik.values?.address} onChange={formik.handleChange} />
            {formik.errors.address && <FormErrorMessage>{formik.errors?.address}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<OrganizationInterface>
            formik={formik}
            name={'organization_id'}
            label={'Select Organization'}
            placeholder={'Select Organization'}
            fetcher={getOrganizations}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.name}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'contact_information',
  operation: AccessOperationEnum.CREATE,
})(ContactInformationCreatePage);
