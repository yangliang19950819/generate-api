export default {
  root: true,
  extends: ["prettier"],
  parserOptions: {
    project: "./tsconfig.json",
  },
  setting: {
    "import/resolve": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
    },
  },
  rules: {
    "@typescript-eslint/no-unsafe-enum-comparison": "off",
    "@typescript-eslint/await-thenable": "off",
  },
};
