import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'mtd-mobile-ui',
  webDir: '../../dist/packages/mtd-mobile-ui',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
};

export default config;
