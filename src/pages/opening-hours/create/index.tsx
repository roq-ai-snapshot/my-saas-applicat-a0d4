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
import { createOpeningHour } from 'apiSdk/opening-hours';
import { Error } from 'components/error';
import { openingHourValidationSchema } from 'validationSchema/opening-hours';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';
import { OpeningHourInterface } from 'interfaces/opening-hour';

function OpeningHourCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: OpeningHourInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createOpeningHour(values);
      resetForm();
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<OpeningHourInterface>({
    initialValues: {
      day_of_week: 0,
      start_time: new Date(new Date().toDateString()),
      end_time: new Date(new Date().toDateString()),
      organization_id: (router.query.organization_id as string) ?? null,
    },
    validationSchema: openingHourValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Opening Hour
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="day_of_week" mb="4" isInvalid={!!formik.errors?.day_of_week}>
            <FormLabel>Day Of Week</FormLabel>
            <NumberInput
              name="day_of_week"
              value={formik.values?.day_of_week}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('day_of_week', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.day_of_week && <FormErrorMessage>{formik.errors?.day_of_week}</FormErrorMessage>}
          </FormControl>
          <FormControl id="start_time" mb="4">
            <FormLabel>Start Time</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.start_time}
              onChange={(value: Date) => formik.setFieldValue('start_time', value)}
            />
          </FormControl>
          <FormControl id="end_time" mb="4">
            <FormLabel>End Time</FormLabel>
            <DatePicker
              dateFormat={'dd/MM/yyyy'}
              selected={formik.values?.end_time}
              onChange={(value: Date) => formik.setFieldValue('end_time', value)}
            />
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
  entity: 'opening_hour',
  operation: AccessOperationEnum.CREATE,
})(OpeningHourCreatePage);
