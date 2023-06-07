import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import { Text, Box, Spinner, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Button, Link } from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { getOpeningHourById } from 'apiSdk/opening-hours';
import { Error } from 'components/error';
import { OpeningHourInterface } from 'interfaces/opening-hour';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function OpeningHourViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<OpeningHourInterface>(
    () => (id ? `/opening-hours/${id}` : null),
    () =>
      getOpeningHourById(id, {
        relations: ['organization'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Opening Hour Detail View
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <Text fontSize="lg" fontWeight="bold" as="span">
              Day Of Week:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.day_of_week}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              Start Time:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.start_time as unknown as string}
            </Text>
            <br />
            <Text fontSize="lg" fontWeight="bold" as="span">
              End Time:
            </Text>
            <Text fontSize="md" as="span" ml={3}>
              {data?.end_time as unknown as string}
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
  entity: 'opening_hour',
  operation: AccessOperationEnum.READ,
})(OpeningHourViewPage);
