import { last, camelCase } from "lodash-es";

const plopfile = (plop) => {
  const query = "query",
    mutation = "mutation",
    queryWithPagination = "queryWithPagination",
    queryWithArray = "queryWithArray",
    queryWithoutPagination = "queryWithoutPagination";

  plop.setActionType("openInVscode", openInVscode);
  plop.setGenerator("Api Hook", {
    description: "使用useQuery生成对应Api请求的Hook",
    prompts: [
      {
        type: "list",
        name: "type",
        message: `创建的Hook类型 ${query} 或 ${mutation}`,
        choices: [query, mutation],
        default: query,
      },
      {
        type: "input",
        name: "url",
        message: "Api Url (例如：/api/xxx/yyy/zzz)",
      },
      {
        type: "input",
        name: "name",
        message: "Api名称（小驼峰命名）",
        default: (v) => {
          if (!v.url) throw new Error("url is required");
          const paths = v.url.split("/").filter(Boolean);
          if (v.type === query) {
            const lastPath = last(paths);
            if (lastPath && lastPath.toLowerCase() !== query) {
              paths.push(query);
            }
            return camelCase(paths.slice(-3).join(" "));
          }
          return camelCase(paths.slice(-3).join(" "));
        },
      },
      {
        type: "confirm",
        name: "pagination",
        message: "Api 是否分页？",
        default: false,
        when: (v) => v.type === query,
      },
      {
        type: "confirm",
        name: "array",
        message: "Api 是否返回数组？",
        default: false,
        when: (v) => !v.pagination && v.type === query,
      },
      {
        type: "input",
        name: "description",
        message: "添加 API 描述",
      },
    ],
    actions: (v) => {
      if (!v) throw new Error("type url name is required");
      const templateFileName =
        v.type === query
          ? v.pagination
            ? queryWithPagination
            : v.array
              ? queryWithArray
              : queryWithoutPagination
          : mutation;

      const middlePath = v.url.split("/").filter(Boolean).slice(-2)[0];
      return [
        {
          type: "add",
          path: `src/api/${v.type}/${middlePath}/{{name}}.ts`,
          templateFile: `src/api/templates/${templateFileName}.ts.hbs`,
        },
        {
          type: "append",
          path: `src/api/${v.type}/index.ts`,
          template: `export * from './${middlePath}/{{name}}'`,
        },
        {
          type: "openInVscode",
          path: `src/api/templates/${v.type}/${middlePath}/{{name}}.ts`,
        },
      ];
    },
  });
};

const openInVscode = async (answers, config, api) => {
  process.chdir(api.getPlopfilePath());
  const filepath = api.renderString(config.path, answers);

  if (!filepath) throw "config.path is required";

  try {
    const fs = await import("node:fs");
    if (fs.existsSync(filepath)) {
      const { exec } = await import("node:child_process");
      const util = await import("node:util");
      const execAsync = util.promisify(exec);
      await execAsync(`code ${filepath}`);
      return "Successfully open in VSCode";
    }
  } catch (error) {
    console.error(error);
    throw "Failed to open in VSCode";
  }
};

export default plopfile;
