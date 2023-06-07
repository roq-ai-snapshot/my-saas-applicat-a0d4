import axios from 'axios';
import queryString from 'query-string';
import { ContactInformationInterface } from 'interfaces/contact-information';
import { GetQueryInterface } from '../../interfaces';

export const getContactInformations = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/contact-informations${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createContactInformation = async (contactInformation: ContactInformationInterface) => {
  const response = await axios.post('/api/contact-informations', contactInformation);
  return response.data;
};

export const updateContactInformationById = async (id: string, contactInformation: ContactInformationInterface) => {
  const response = await axios.put(`/api/contact-informations/${id}`, contactInformation);
  return response.data;
};

export const getContactInformationById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/contact-informations/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteContactInformationById = async (id: string) => {
  const response = await axios.delete(`/api/contact-informations/${id}`);
  return response.data;
};
