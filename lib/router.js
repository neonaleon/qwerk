// Set up a global subscription for Dictionary
FlowRouter.subscriptions = function() {
  this.register('businessInfo', Meteor.subscribe('businessInfo'));
  this.register('images', Meteor.subscribe('images'));
  this.register('userData', Meteor.subscribe('userData'));
  this.register('allUserData', Meteor.subscribe('allUserData'));
};

FlowRouter.route('/', {
  middlewares: [
    Installer.middleware()
  ],
  subscriptions: function (params) {
    this.register('chat', Meteor.subscribe('chat'));
  },
  action: function (params) {
    if (Meteor.isCordova) {
      FlowLayout.render('mobileLayout', {
        middle: 'middleColumn'
      });
    } else {
      FlowLayout.render('mainLayout', {
        left: 'leftColumn',
        middle: 'middleColumn',
        right: 'rightColumn'
      });
    }
  }
});

var adminRoutes = FlowRouter.group({
  prefix: '/admin',
  middlewares: [
    Installer.middleware(),
    function isAdmin (path, next) {
      // bypass for installation
      if (!Installer.isComplete()) {
        return next();
      }
      if (!Roles.userIsInRole(Meteor.userId(), ['admin'])) {
        if (path !== '/admin/unauthorized') {
          FlowRouter.go('/admin/unauthorized');
        }
      }
      return next();
    }
  ]
});

adminRoutes.route('/', {
  action: function () {
    FlowLayout.render('adminLayout', {
      middle: 'adminMain'
    });
  }
});

adminRoutes.route('/dashboard', {
  action: function () {
    // TODO: number of check ins, unique checkins,
  }
});

adminRoutes.route('/install', {
  action: function () {
    // TODO: add the first user!
    FlowLayout.render('adminLayout', {
      middle: 'adminSetup'
    });
  }
});

adminRoutes.route('/login', {
  action: function () {
    FlowLayout.render('adminLayout', {
      middle: 'adminLogin'
    });
  }
});

adminRoutes.route('/unauthorized', {
  action: function () {
    FlowLayout.render('adminLayout', {
      middle: 'adminNotAuthorized'
    });
  }
});

// AccountsTemplates.configureRoute('forgotPwd');
