import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/orderService';

export const useStoreSettings = () =>
  useQuery({
    queryKey: ['store-settings'],
    queryFn: orderService.settings
  });
