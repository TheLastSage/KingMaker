var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "wy2tykb3kwm4bfdr",
  publicKey: "2fb3nhng3rdyzw4c",
  privateKey: "dc576e0dd1b659ee09e74d10d4b5bdf7"
});

    // app.get("/client_token", function (req, res) {
    //   gateway.clientToken.generate({}, function (err, response) {
    //     res.send(response.clientToken);
    //   });
    // });

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {

  });


}
