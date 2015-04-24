Package.describe({
  name: 'qwerk-installer',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

var both = ['client', 'server'];

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use([
    'templating',
    'mongo'
  ], both);

  api.use([
    'meteorhacks:flow-router'
  ], both);

  api.addFiles('qwerk-installer-templates.html');
  api.addFiles('qwerk-installer.js');

  api.export('Installer');
});
