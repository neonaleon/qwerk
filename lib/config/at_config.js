AccountsTemplates.configure({
  confirmPassword: false,
  enablePasswordChange: true,
  sendVerificationEmail: false,
  showForgotPasswordLink: false,
  hideSignUpLink: false,
  hideSignInLink: true,
  texts: {
    title: {
      signIn: "",
      signUp: ""
    }
  },
  // onLogoutHook: function () {

  // }
  onSubmitHook: function (error, state) {
    if (!error) {
      // still installing the app
      if (state === 'signUp') {
        if (!Installer.isComplete()) {
          Meteor.call('installer_completeStep');
        }
      }
      if (state === 'signIn') {

      }
    }
  }
});

AccountsTemplates.removeField('email');
AccountsTemplates.removeField('password');
AccountsTemplates.addFields([
  {
    _id: 'firstname',
    type: 'text',
    required: true,
    displayName: 'First Name',
    options: {
      startRow: true
    }
  },
  {
    _id: 'lastname',
    type: 'text',
    required: true,
    displayName: 'Last Name',
    options: {
      endRow: true
    }
  },
  {
    _id: 'email',
    type: 'email',
    required: true,
    re: /.+@(.+){2,}\.(.+){2,}/,
    errStr: 'Invalid Email'
  },
  {
    _id: 'password',
    type: 'password',
    required: true,
    minLength: 6,
    placeholder: {
      signUp: "At least six characters"
    }
  }
]);
