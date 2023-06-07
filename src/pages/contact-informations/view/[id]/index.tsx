import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getContactInformationById } from 'apiSdk/contact-informations';
import { Error } from 'components/error';
import { ContactInformationInterface } from 'interfaces/contact-information';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function ContactInformationViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ContactInformationInterface>(
    () => (id ? `/contact-informations/${id}` : null),
    () =>
      getContactInformationById(id, {
        relations: ['organization'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Contact Information Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Phone Number:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.phone_number}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Address:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.address}
            </Text>
            <br />
            {hasAccess('organization', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
              <>
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Organization:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  <Link as={NextLink} href={`/organizations/view/${data?.organization?.id}`}>
                    {data?.organization?.name}
                  </Link>
                </Text>
              </>
            )}
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'contact_information',
  operation: AccessOperationEnum.READ,
})(ContactInformationViewPage);
