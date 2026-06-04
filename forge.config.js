module.exports = {
  packagerConfig: {
    name: 'Haxys Hub',
    icon: './assets/icon',
    asar: true,
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'HaxysHub',
        setupIcon: './assets/icon.ico',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'],
    },
  ],
};
