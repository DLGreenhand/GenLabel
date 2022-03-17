import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

export default {
    input: 'main.js',
    output: {
        name: "dataset-utils",
        file: 'build/dataset-utils.js',
        format: 'cjs'
    },
    plugins: [
        nodeResolve(),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production'),
            preventAssignment: true,
        }),
    ],
};