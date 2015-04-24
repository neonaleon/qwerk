T9n.setLanguage('ja');

if (Meteor.isClient) {

  TAPi18n.setLanguage('ja');

  Tracker.autorun(function (c) {
    if (Meteor.userId()) {
      console.log('user logged in');
      Meteor.call('ping');
      Meteor.setInterval(function () {
        Meteor.call('ping');
      }, 5000);

      $('.checkin.modal').modal('hide');
    }
  });

  Template.checkInButton.events({
    'click .button': function () {
      $('.checkin.modal').modal('show');
    }
  });

  Template.chatInput.events({
    'keyup': function (evt, tmpl) {
      if (evt.which === KeyCodes.ENTER) {
        // TODO: add multiline chat input support
        // if (evt.shiftKey) {
        //   var $textarea = $('#chatInput textarea')
        //   $textarea.attr('rows', $textarea.attr('rows') + 1);
        //   return;
        // }

        var msg = tmpl.find('input').value;
        if (!_.isEmpty(msg)){
          Meteor.call('sendMessage', msg);
          tmpl.find('input').value = '';
        }
      }
    }
  });

  Template.chatMessage.onRendered(function () {
    var scrollToBottom = function () {
      $main = $('#main');
      $chatFeed = $('#chatFeed');
      $chatFeed.css('padding-top', Math.max($main.height() - $chatFeed.height(), 0));
      $main.scrollTop($chatFeed.height());
    }
    var emoji = this.find('img');
    if (emoji) {
      $(emoji).load(scrollToBottom);
    } else {
      scrollToBottom();
    }
  });

  Template.chatFeed.onRendered(function () {
    $('#chatFeed')[0]._uihooks = {
      insertElement: function (node, next) {
        $(node).addClass('out').insertBefore(next);

        Tracker.afterFlush(function () {
          $(node).removeClass('out');
        });
      },
      // moveElement: function (node, next) {

      // },
      // removeElement: function (node, next) {
      //   var finishEvent = 'webkitTransitionEnd oTransitionEnd transitionEnd msTransitionEnd transitionend';
      //   $(node).on(finishEvent, function () {
      //     $(node).removeClass('out');
      //   });
      // }
    };
  });

  Template.chatFeed.helpers({
    messages: function () {
      return Chat.find({}, { sort: { createdAt: 1 }, limit: 100 });
    }
  });

  Template.mainLayout.onRendered(function () {
    var layout = function () {
      var $main = $('#main');
      var $chatFeed = $('#chatFeed');
      var $chatInput = $('#chatInput');
      // 20px padding on chatInput
      $main.height($('body').height() - $chatInput.height() - 20);
      $chatFeed.css('padding-top', Math.max($main.height() - $chatFeed.height(), 0));
      $main.scrollTop($chatFeed.height());
    }
    layout();
    $(window).resize(layout);
  });

  Template.mobileLayout.onRendered(function () {
    var layout = function () {
      var $main = $('#main');
      var $chatFeed = $('#chatFeed');
      var $chatInput = $('#chatInput');
      $main.height($('body').height() - $chatInput.height() - 20);
      $chatFeed.css('padding-top', Math.max($main.height() - $chatFeed.height(), 0));
      $main.scrollTop($chatFeed.height());
    }
    layout();
  });

  Template.businessInformation.helpers({
    data: function () {
      var data = BusinessInfo.findOne({});
      data.logo = Images.findOne({ _id: data.logo });
      return data;
    }
  });

  Template.currentUserActionButtons.events({
    'click .ui.button': function (evt, tmpl) {
      Meteor.call('updateStatus', $(evt.currentTarget).attr('id'));
    }
  });

  Template.userList.helpers({
    users: function () {
      // exclude the current user
      var users = Meteor.users.find({
        _id: {
          $ne: Meteor.userId()
        }
      }).fetch();

      return users.sort(function (a, b) {
        var aStatus = a.status();
        var bStatus = b.status();
        if (aStatus === bStatus) return 0;
        if (aStatus === 'free' && (bStatus === 'busy' || bStatus === 'dnd')) return -1;
        if (aStatus === 'busy' && (bStatus === 'dnd')) return -1;
        if (bStatus === 'offline') return -1;
        return 1;
      });
    }
  });

  Template.registerHelper('statusColor', function (status) {
    status = status || 'free';
    switch (status){
      case 'free':
        return 'green';
      case 'busy':
        return 'yellow';
      case 'dnd':
        return 'red';
      case 'offline':
      default:
        return 'black';
    }
  });

  Template.registerHelper('formatChatUser', function (userId) {
    return Meteor.users.findOne({ _id: userId }).name();
  });

  Template.registerHelper('formatChatTimestamp', function (date) {
    return moment(date).format('hh:mm a');
  });

  Template.registerHelper('formatChatMessage', function (msg) {
    // regex for finding properly formatted urls
    var regex = /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/g;

    var url = null;
    var output = msg; // escape the user message first??
    while (url = regex.exec(msg)) {
      // replace urls with <a> tags
      output = msg.replace(url[0], '<a target="_blank" href="' + url[0] + '">' + url[0] + '</a>');
    }

    // emoji support
    output = Emoji.convert(output);

    return output;
  });

  Template.registerHelper('isAdmin', function () {
    return Roles.userIsInRole(Meteor.userId(), ['admin']);
  });

  Template.atNavButton.onRendered(function () {
    $(this.firstNode).css('padding-top', 10);
    $(this.find('#at-nav-button')).removeClass('ui button');
    $(this.find('#at-nav-button')).addClass('ui fluid button');
  });
}
