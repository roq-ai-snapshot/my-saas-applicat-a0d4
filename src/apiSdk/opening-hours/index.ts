import axios from 'axios';
import queryString from 'query-string';
import { OpeningHourInterface } from 'interfaces/opening-hour';
import { GetQueryInterface } from '../../interfaces';

export const getOpeningHours = async (query?: GetQueryInterface) => {
  const response = await axios.get(`/api/opening-hours${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createOpeningHour = async (openingHour: OpeningHourInterface) => {
  const response = await axios.post('/api/opening-hours', openingHour);
  return response.data;
};

export const updateOpeningHourById = async (id: string, openingHour: OpeningHourInterface) => {
  const response = await axios.put(`/api/opening-hours/${id}`, openingHour);
  return response.data;
};

export const getOpeningHourById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/opening-hours/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteOpeningHourById = async (id: string) => {
  const response = await axios.delete(`/api/opening-hours/${id}`);
  return response.data;
};
