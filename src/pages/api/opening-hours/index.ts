import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { openingHourValidationSchema } from 'validationSchema/opening-hours';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getOpeningHours();
    case 'POST':
      return createOpeningHour();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getOpeningHours() {
    const data = await prisma.opening_hour
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'opening_hour'));
    return res.status(200).json(data);
  }

  async function createOpeningHour() {
    await openingHourValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.opening_hour.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
