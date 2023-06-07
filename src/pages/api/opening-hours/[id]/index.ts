import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { openingHourValidationSchema } from 'validationSchema/opening-hours';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.opening_hour
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getOpeningHourById();
    case 'PUT':
      return updateOpeningHourById();
    case 'DELETE':
      return deleteOpeningHourById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getOpeningHourById() {
    const data = await prisma.opening_hour.findFirst(convertQueryToPrismaUtil(req.query, 'opening_hour'));
    return res.status(200).json(data);
  }

  async function updateOpeningHourById() {
    await openingHourValidationSchema.validate(req.body);
    const data = await prisma.opening_hour.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteOpeningHourById() {
    const data = await prisma.opening_hour.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
