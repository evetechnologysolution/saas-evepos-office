/* eslint-disable react-hooks/rules-of-hooks */

import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'src/utils/axios';

export default function useCall() {
  const queryClient = useQueryClient();
  const queryKey = ['listTenant'];

  const list = (params) =>
    useQuery({
      queryKey: [...queryKey, params],
      queryFn: async () => {
        const qs = new URLSearchParams(params).toString();
        const { data } = await axios.get(`/tenant?${qs}`);
        return data;
      },
      keepPreviousData: false,
    });

  const listInvoice = (params) =>
    useQuery({
      queryKey: [...queryKey, params],
      queryFn: async () => {
        const qs = new URLSearchParams(params).toString();
        const { data } = await axios.get(`/invoice?${qs}`);
        return data;
      },
      keepPreviousData: false,
    });

  const create = useMutation({
    mutationFn: async (payload) => {
      const { data } = await axios.post('/tenant', payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, payload }) => {
      const { data } = await axios.patch(`/tenant/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  const getById = (id) =>
    useQuery({
      queryKey: [...queryKey, id],
      queryFn: async () => {
        const { data } = await axios.get(`/tenant/${id}`);
        return data;
      },
      enabled: !!id,
    });

  const remove = useMutation({
    mutationFn: async (id) => {
      const { data } = await axios.delete(`/tenant/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  return {
    list,
    listInvoice,
    getById,
    create,
    update,
    remove,
    queryKey,
  };
}
