import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { contactInformationValidationSchema } from 'validationSchema/contact-informations';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getContactInformations();
    case 'POST':
      return createContactInformation();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getContactInformations() {
    const data = await prisma.contact_information
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'contact_information'));
    return res.status(200).json(data);
  }

  async function createContactInformation() {
    await contactInformationValidationSchema.validate(req.body);
    const body = { ...req.body };

    const data = await prisma.contact_information.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
