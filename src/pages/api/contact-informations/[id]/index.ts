import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { contactInformationValidationSchema } from 'validationSchema/contact-informations';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.contact_information
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getContactInformationById();
    case 'PUT':
      return updateContactInformationById();
    case 'DELETE':
      return deleteContactInformationById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getContactInformationById() {
    const data = await prisma.contact_information.findFirst(convertQueryToPrismaUtil(req.query, 'contact_information'));
    return res.status(200).json(data);
  }

  async function updateContactInformationById() {
    await contactInformationValidationSchema.validate(req.body);
    const data = await prisma.contact_information.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });
    return res.status(200).json(data);
  }
  async function deleteContactInformationById() {
    const data = await prisma.contact_information.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
