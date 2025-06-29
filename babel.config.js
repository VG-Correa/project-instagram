module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/pages': './src/pages',
            '@/core': './src/core',
            '@/contexts': './src/contexts',
          },
        },
      ],
    ],
  };
}; 