import packageJson from '../../../../package.json';

export const environment = {
  appName: 'MotherTongues Dictionary',
  envName: 'TEST',
  production: false,
  test: true,
  apiBaseURL: 'http://localhost:4200',
  dataPath: '../assets/dictionary_data.json',
  versions: {
    app: packageJson.version,
    angular: packageJson.dependencies['@angular/core'],
    material: packageJson.dependencies['@angular/material'],
    bootstrap: packageJson.dependencies.bootstrap,
    rxjs: packageJson.dependencies.rxjs,
    ngxtranslate: packageJson.dependencies['@ngx-translate/core'],
    fontAwesome: packageJson.dependencies['@fortawesome/fontawesome-svg-core'],
    angularCli: packageJson.devDependencies['@angular/cli'],
    typescript: packageJson.devDependencies['typescript'],
    cypress: packageJson.devDependencies['cypress']
  }
};
