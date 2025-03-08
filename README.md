### api接口生成步骤

1. 执行yarn generate-api
2. 选择生成api hook的类型
3. 输入url地址
4. 输入api描述
5. 在生成的api 文件中加入yapi.d.ts中类型params 和 data的类型

### yapi-to-typescript

1. 执行yarn ytt
2. 生成/types/api/yapi.d.ts
3. 根据yapi的接口文档生成的interface可能会因为接口文档的某些字段没有加类型会默认string，也没有按接口分类生成多个文件，所以建议还是和之前一样分类建好文件写好namespace后，可以直接复制/types/api/yapi.d.ts文件里面有用的类型来节省开发时间。
