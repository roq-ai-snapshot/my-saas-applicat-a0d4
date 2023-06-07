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
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useFormik, FormikHelpers } from 'formik';
import { getOpeningHourById, updateOpeningHourById } from 'apiSdk/opening-hours';
import { Error } from 'components/error';
import { openingHourValidationSchema } from 'validationSchema/opening-hours';
import { OpeningHourInterface } from 'interfaces/opening-hour';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';

function OpeningHourEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<OpeningHourInterface>(
    () => (id ? `/opening-hours/${id}` : null),
    () => getOpeningHourById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: OpeningHourInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateOpeningHourById(id, values);
      mutate(updated);
      resetForm();
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<OpeningHourInterface>({
    initialValues: data,
    validationSchema: openingHourValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Edit Opening Hour
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {formError && <Error error={formError} />}
        {isLoading || (!formik.values && !error) ? (
          <Spinner />
        ) : (
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'opening_hour',
  operation: AccessOperationEnum.UPDATE,
})(OpeningHourEditPage);
