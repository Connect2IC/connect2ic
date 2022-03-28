/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable node/no-unsupported-features/es-syntax */
import { defineConfig } from '@modern-js/app-tools';
// import type WebpackChain from 'webpack-chain';
import webpack from 'webpack';

export default defineConfig({
  tools: {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:8000/',
          changeOrigin: false,
        },
      },
    },
    terser: opts => {
      opts.terserOptions.compress.drop_console = true;
    },
    webpack: (config, { env, chain }) => {
      const isProduction = env === 'production';
      // config.test = /\.svg$/;
      // config.use = ['@svgr/webpack'];
      // config.plugins.push(
      // new webpack.EnvironmentPlugin({
      //   isProduction,
      //   CANISTER_ID: isProduction
      //     ? require('./canister_ids.json').buymecoffee.ic
      //     : require('./.dfx/local/canister_ids.json').buymecoffee.local,
      // }),
      // );
      chain
        .plugin('environmentPlugin')
        .use(webpack.EnvironmentPlugin, [
          {
            isProduction,
            CANISTER_ID: isProduction
              ? require('./canister_ids.json').buymecoffee.ic
              : require('./.dfx/local/canister_ids.json').buymecoffee.local,
          },
        ])
        .end();
    },
  },
});
