Meteor.publish('chat', function () {
  return Chat.find({});
});

Meteor.publish('businessInfo', function () {
  return BusinessInfo.find({});
});

Meteor.publish('images', function () {
  return Images.find({});
});

Meteor.publish('userData', function () {
  return Meteor.users.find({
    _id: this.userId
  }, {
    fields: {
      profile: 1
    }
  });
});

Meteor.publish('allUserData', function () {
  return Meteor.users.find({}, {
    fields: {
      'profile.firstname': 1,
      'profile.lastname': 1,
      'profile.status': 1,
      'profile.ping': 1
    }
  });
});
