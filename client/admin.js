Template.editBusinessInfo.helpers({
  data: function () {
    return BusinessInfo.findOne({});
  },
  loading: function () {
    return Session.get('editBusinessInfo_loading');
  }
});

Template.qwerk_atPwdForm.replaces('atPwdForm');

// https://github.com/aldeed/meteor-template-extension
Template.qwerk_atGroupFields.inheritsHelpersFrom("atPwdForm");

Template.qwerk_atGroupFields.helpers({
  collectFields: function (field) {
    var instance = Template.instance(),
        current_row = instance.current_row;

    if (field.options && field.options.startRow) {
      instance.current_row = [field];
    }
    else if (field.options && field.options.endRow) {
      delete instance.current_row;

      current_row.push(field);
      return current_row;
    }
    else if (current_row) {
      current_row.push(field);
    }
    else {
      return field;
    }
  },

  numberToWord: function (number) {
    return number_words[number];
  },

  isArray: _.isArray
});


var number_words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen"];
