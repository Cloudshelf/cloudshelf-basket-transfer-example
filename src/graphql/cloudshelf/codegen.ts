import type { CodegenConfig } from '@graphql-codegen/cli';
import * as dotenv from 'dotenv';

dotenv.config();

const config: CodegenConfig = {
    overwrite: true,
    schema: 'https://ingestapi.cloudshelf.ai/graphql',
    generates: {
        'src/graphql/cloudshelf/generated/cloudshelf_types.ts': {
            plugins: ['typescript', 'typescript-document-nodes', 'typescript-operations'],
            config: {
                nameSuffix: 'Document',
            },
        },
        'src/graphql/cloudshelf_schema.json': {
            plugins: ['introspection'],
        },
    },
    documents: [
        './src/graphql/cloudshelf/**/*.ts',
        'src/graphql/cloudshelf/**/*.graphql',
        '!src/graphql/cloudshelf/generated/**/*.ts',
    ],
};

export default config;
