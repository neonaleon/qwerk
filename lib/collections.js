Chat = new Mongo.Collection('qwerk_chat');
Chat.attachSchema(new SimpleSchema({
  message: {
    type: String
  }
}));
Chat.attachBehaviour('timestampable', {});

/**
 * checkin time - when the user checked in
 * heartbeat - a heartbeat for as long as user is connected
 * status - status of user, Busy or Free to chat
 */
Meteor.users.helpers({
  name: function () {
    return this.profile.firstname + ' ' + this.profile.lastname;
  },
  image: function () {
    return this.profile.image;
  },
  status: function () {
    var now = new Date();
    var fifteenSecondsAgo = new Date().setSeconds(now.getSeconds() - 15);
    var isOffline = this.profile.ping < fifteenSecondsAgo;
    return isOffline ? 'offline' : this.profile.status;
  }
});
// new user default
Meteor.users.before.insert(function (userId, doc) {
  doc.status = 'free';
});

Images = new FS.Collection("images", {
  stores: [new FS.Store.GridFS("images", {})]
});
Images.allow({
  download: function (userId) {
    return true;
  },
  insert: function (userId, doc) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  update: function (userId, doc) {
    return Roles.userIsInRole(userId, ['admin']);
  }
});

BusinessInfo = new Mongo.Collection('qwerk_businessInfo');
BusinessInfo.allow({
  insert: function (userId, doc) {
    return Roles.userIsInRole(userId, ['admin']);
  },
  update: function (userId, doc) {
    return Roles.userIsInRole(userId, ['admin']);
  }
});
BusinessInfo.attachSchema(new SimpleSchema({
  info: {
    type: String,
    label: 'Edit Information (supports Markdown)'
  },
  logo: {
    type: String,
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
        collection: 'Images'
      }
    },
    label: 'Choose Logo'
  }
}));
BusinessInfo.after.insert(function (userId, doc) {
  if (Meteor.isServer) {
    // completeStep when businessInfo is set
    Meteor.call('installer_completeStep');
  }
});
