import packageJson from '../../../../package.json';

export const environment = {
  appName: 'MotherTongues Dictionary',
  envName: 'PROD',
  production: true,
  test: false,
  i18nPrefix: '.',
  apiBaseURL: 'http://mothertongues.org/',
  dataPath: '../assets/dictionary_data.json',
  versions: {
    app: packageJson.version,
    angular: packageJson.dependencies['@angular/core'],
    ngrx: packageJson.dependencies['@ngrx/store'],
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
