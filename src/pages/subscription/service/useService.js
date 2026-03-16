/* eslint-disable react-hooks/rules-of-hooks */

import {
  useQuery,
  // useMutation
} from 'react-query';
import axios from 'src/utils/axios';

export default function useCall() {
  const queryKey = ['listSubscription'];
  const queryKeyInv = ['listSubscriptionInvoice'];

  const list = (params) =>
    useQuery({
      queryKey: [...queryKey, params],
      queryFn: async () => {
        const qs = new URLSearchParams(params).toString();
        const { data } = await axios.get(`/subscription?${qs}`);
        return data;
      },
      keepPreviousData: false,
    });

  const listInvoice = (params) =>
    useQuery({
      queryKey: [...queryKeyInv, params],
      queryFn: async () => {
        const qs = new URLSearchParams(params).toString();
        const { data } = await axios.get(`/invoice?${qs}`);
        return data;
      },
      keepPreviousData: false,
    });

  const getById = (id) =>
    useQuery({
      queryKey: [...queryKey, id],
      queryFn: async () => {
        const { data } = await axios.get(`/subscription/${id}`);
        return data;
      },
      enabled: !!id,
    });

  // const activate = useMutation({
  //   mutationFn: async ({ id, payload }) => {
  //     const { data } = await axios.patch(`/subscription/activate/${id}`, payload);
  //     return data;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries(queryKey);
  //   },
  // });

  return {
    list,
    listInvoice,
    getById,
    // activate,
  };
}
