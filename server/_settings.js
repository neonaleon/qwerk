// Provide defaults for Meteor.settings

if (typeof Meteor.settings === 'undefined'){
  Meteor.settings = {};
}

_.defaults(Meteor.settings, {
});

// Add Facebook configuration entry
// ServiceConfiguration.configurations.update(
//   { "service": "facebook" },
//   {
//     $set: {
//       "appId": Meteor.settings.facebook.appId,
//       "secret": Meteor.settings.facebook.secret,
//       "loginStyle": "redirect"
//     }
//   },
//   { upsert: true }
// );
