Meteor.methods({
  'sendMessage': function (msg) {
    check(msg, String);
    Chat.insert({
      message: msg
    });
    Meteor.users.update({
      _id: Meteor.userId()
    }, {
      $set: {
        'profile.ping': new Date()
      }
    });
  },
  'ping': function () {
    Meteor.users.update({
      _id: Meteor.userId()
    }, {
      $set: {
        'profile.ping': new Date()
      }
    });
  },
  'updateStatus': function (status) {
    check(status, Match.OneOf('free', 'dnd', 'busy'));
    Meteor.users.update({
      _id: Meteor.userId()
    }, {
      $set: {
        'profile.status': status,
        'profile.ping': new Date()
      }
    });
  }
});
