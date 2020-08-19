import esbuild from 'rollup-plugin-esbuild'

export default {
  plugins: [
    esbuild({
      // All options are optional
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      watch: process.argv.includes('--watch'),
      sourceMap: false, // default
      minify: process.env.NODE_ENV === 'production',
      target: 'es2018', // default, or 'es20XX', 'esnext'
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      // Like @rollup/plugin-replace
    }),
  ],
}
