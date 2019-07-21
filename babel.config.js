'use strict';

module.exports = {
  presets: [require('@babel/preset-typescript')],
  plugins: [
    require('@babel/plugin-proposal-class-properties'),
    require('@babel/plugin-proposal-object-rest-spread'),
    require('@babel/plugin-transform-modules-commonjs'),
  ],
};
