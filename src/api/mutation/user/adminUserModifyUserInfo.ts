import fetcher from "@/utils/fetcher";
import { useMutation } from "@tanstack/react-query";
import type { DefaultError } from "@tanstack/react-query";
import type { UseMutationParameters } from '@/api/templates/type'

export const adminUserModifyUserInfoApi = '/api/qjc/admin/user/modifyUserInfo'

export type AdminUserModifyUserInfoParams = Record<string, unknown>;
  
export type AdminUserModifyUserInfoData = null;

export interface UseAdminUserModifyUserInfoParams<Context = unknown>{
    mutation?: UseMutationParameters<
        AdminUserModifyUserInfoData,
        DefaultError,
        AdminUserModifyUserInfoParams,
        Context
    > | undefined    
};

/**
* 修改用户信息
*/

export function useAdminUserModifyUserInfo<Context = unknown>(
  parameters: UseAdminUserModifyUserInfoParams<Context> = {}
) {
  const { mutation } = parameters;
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    mutationKey: [adminUserModifyUserInfoApi],
    mutationFn(variables){
        return fetcher(adminUserModifyUserInfoApi, {
            body: variables
        })
    }
  });

  return {
    ...result,
    adminUserModifyUserInfo: mutate,
    adminUserModifyUserInfoAsync: mutateAsync
  }
}