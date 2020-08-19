import esbuild from 'rollup-plugin-esbuild'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'esm',
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
    },
  ],
  plugins: [
    esbuild({
      // All options are optional
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      watch: process.argv.includes('--watch'),
      sourceMap: false, // default
      minify: true,
      tsconfig: 'tsconfig.json',
    }),
  ],
  external: ['react', 'three', 'react-three-fiber', 'yoga-layout'],
}
