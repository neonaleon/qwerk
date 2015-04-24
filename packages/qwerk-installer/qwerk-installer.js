Installer = {};

var collection = Installer.collection = new Mongo.Collection('qwerk_installer');
var callbacks = Installer.callbacks = {
  'step1': function () {
    Roles.addUsersToRoles(Meteor.userId(), ['admin']);
  },
  'step2': function () {
    console.log('step 2 completed!');
  },
  'step3': function () {
    console.log('step 3 completed!');
  }
};

// Installer API
Installer.isComplete = function () {
  var installation = collection.findOne({});
  return installation && installation.complete;
};

var completeStep = function () {
  var installation = collection.findOne({});
  if (installation.type === 'ordered') {
    var activeStep = _.findWhere(installation.steps, { status: 'active' });
    var nextStep = installation.steps[installation.steps.indexOf(activeStep) + 1];
    if (!nextStep) {
      activeStep.status = 'complete';
      installation.complete = true;
    } else {
      activeStep.status = 'complete';
      nextStep.status = 'active';
    }
    collection.update({
      _id: installation._id
    },
    installation);
    callbacks[activeStep.callback]();
  }
};

Meteor.methods({
  'installer_completeStep': function () {
    completeStep();
  }
});

Installer.middleware = function (options) {
  return function (path, next) {
    var installation = collection.findOne({});
    var atSetup = (path === '/admin/install');
    var isInstalled = (installation && installation.complete);
    if (!atSetup && !isInstalled) {
      FlowRouter.go('/admin/install');
    } else {
      next();
    }
  }
};

// startup the database with an installation document
Meteor.startup(function () {
  var installation = collection.findOne({});
  if (!installation) {
    collection.insert({
      // unordered version can store steps as object
      type: "ordered",
      steps: [
        {
          title: "Create Admin account",
          description: "This account gives you superpowers.",
          status: "active",
          template: "installStep1",
          callback: "step1"
        },
        {
          title: "Add Information",
          description: "Tell people about your space!",
          status: "disabled",
          template: "installStep2",
          callback: "step2"
        },
        {
          title: "Done",
          description: "That's it!",
          status: "disabled",
          template: "installStep3",
          callback: "step3"
        }
      ],
      complete: false
    });
  }
});

// template helpers
if (Meteor.isClient) {
  Template.installer.helpers({
    complete: function () {
      return Installer.collection.findOne().complete;
    },
    steps: function () {
      return Installer.collection.findOne().steps;
    },
    activeStep: function () {
      return _.findWhere(Installer.collection.findOne().steps, { status: "active" });
    }
  });

  Template.installer.events({
    'click #completeInstall': function () {
      Meteor.call('installer_completeStep');
      FlowRouter.go('/');
    }
  });
}
