Router.route('/inputStream', {where: 'server'})
  .get(function () {
    this.response.end('get request\n');
  })
  .post(function () {
    console.log(this.request.body);
    var passed = "failed";
    Meteor.call('createTransaction', this.request.body, function (err, result) {
      console.log(result.amount);
    });
    this.response.end(passed);
  });

var itemCosts = {"banana": 30, "apple": 20, "orange": 10};

var transactions = {"Test1": ["latte"], "Test2": ["cappucino", "latte"]};

var gateway;

Meteor.startup(function () {
  var braintree = Meteor.npmRequire('braintree');
  gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    publicKey: Meteor.settings.BT_PUBLIC_KEY,
    privateKey: Meteor.settings.BT_PRIVATE_KEY,
    merchantId: Meteor.settings.BT_MERCHANT_ID
  });
});

Meteor.methods({
  getClientToken: function (clientId) {
    var generateToken = Meteor.wrapAsync(gateway.clientToken.generate, gateway.clientToken);
    var options = {};

    if (clientId) {
      options.clientId = clientId;
    }

    var response = generateToken(options);

    return response.clientToken;
  },
  createTransaction: function (data) {
    var transaction = Meteor.wrapAsync(gateway.transaction.sale, gateway.transaction);
    // this is very naive, do not do this in production!
    var totalAmount = 0;
    for (var i = 0; i < data.items.length; i++) {
      totalAmount += itemCosts[data.items[i]];
    }

    totalAmount = totalAmount.toString() + '.00';

    console.log(totalAmount);
    console.log((data.ident).toString());

    var response = transaction({
      customerId: (data.ident).toString(),
      amount: totalAmount,
      options: {
        submitForSettlement: true,
      }
    }, function(err, result) {
    });

    // ...
    // perform a server side action with response
    // ...
    console.log(response);
    return response;
  },
  createCustomer: function (data) {
    var customer = Meteor.wrapAsync(gateway.customer.create, gateway.customer);

    var response = customer({
      firstName: data.firstName,
      lastName: data.lastName,
      paymentMethodNonce: data.nonce
    }, function(err, result) {
      console.log(result.customer.paymentMethods);
    });
  }
});