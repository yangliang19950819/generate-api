import { defineConfig } from "yapi-to-typescript";

export default defineConfig([
  {
    serverUrl: "http://183.146.28.170:3000",
    typesOnly: true,
    target: "typescript",
    reactHooks: {
      enabled: false,
    },
    prodEnvName: "test",
    outputFilePath: "src/api/types/yapi.d.ts",
    dataKey: "data",
    projects: [
      {
        token:
          "0fcdef8718f89d6d8f26b34e9c7e29d31fff2f293fade354480e60ff4a157cb8",
        categories: [
          {
            id: 0,
            getRequestFunctionName(interfaceInfo, changeCase) {
              return changeCase.camelCase(interfaceInfo.path);
            },
          },
        ],
      },
    ],
  },
]);
