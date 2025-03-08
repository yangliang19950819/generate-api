import fetcher from "@/utils/fetcher";
import { useMutation } from "@tanstack/react-query";
import type { DefaultError } from "@tanstack/react-query";
import type { UseMutationParameters } from '@/api/templates/type'

export const desktopUserGetUserInfoApi = '/api/qjc/desktop/user/getUserInfo'

export type DesktopUserGetUserInfoParams = Record<string, unknown>;
  
export type DesktopUserGetUserInfoData = null;

export interface UseDesktopUserGetUserInfoParams<Context = unknown>{
    mutation?: UseMutationParameters<
        DesktopUserGetUserInfoData,
        DefaultError,
        DesktopUserGetUserInfoParams,
        Context
    > | undefined    
};

/**
* 获取用户信息
*/

export function useDesktopUserGetUserInfo<Context = unknown>(
  parameters: UseDesktopUserGetUserInfoParams<Context> = {}
) {
  const { mutation } = parameters;
  const { mutate, mutateAsync, ...result } = useMutation({
    ...mutation,
    mutationKey: [desktopUserGetUserInfoApi],
    mutationFn(variables){
        return fetcher(desktopUserGetUserInfoApi, {
            body: variables
        })
    }
  });

  return {
    ...result,
    desktopUserGetUserInfo: mutate,
    desktopUserGetUserInfoAsync: mutateAsync
  }
}