module.exports = {
  levels: [
    {
      path: 'test',
      layer: 'common',
      naming: 'react',
      scheme: 'nested',
      schemeOptions: 'react',
    },
  ],
  modules: {
    'bem-tools': {
      plugins: {
        create: {
          templates: {
            css: 'test/templates/css.js',
          },
          techs: [
            'css',
          ],
          levels: {
            'test': { default: true },
          },
        },
      },
    },
  },
};
