Router.route('/inputStream', {where: 'server'})
  .get(function () {
    this.response.end('get request\n');
  })
  .post(function () {
    var data = this.request.body;
    data.time = new Date();
    recentPersonData.push(data);
  });

var itemCosts = {"banana": 30, "apple": 20, "orange": 10};

var gateway;

var transactions = [];

var recentPersonData = [];

Meteor.startup(function () {
  var braintree = Meteor.npmRequire('braintree');
  gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    publicKey: Meteor.settings.BT_PUBLIC_KEY,
    privateKey: Meteor.settings.BT_PRIVATE_KEY,
    merchantId: Meteor.settings.BT_MERCHANT_ID
  });
});

var currUser = null;

Meteor.setInterval(function(){
  var time = new Date();
  recentPersonData = recentPersonData.filter(function(x) {
    return ((time - x.time)/1000 < 10);
  });

  var counts = {};
  var max = null;
  var maxCount = 0;
  for (var i=0; i<recentPersonData.length; i++) {
    var curr = recentPersonData[i].person;
    if !(curr in counts):
      counts[curr] = 0;
    counts[curr] += 1;
    if counts[curr] > maxCount {
      max = curr;
      maxCount = counts[curr];
    }
  } 
  var newUser = max;
  if (currUser!=newUser) {
    currUser = newUser;
    var newTransaction = {
      time: new Date(), 
      person: currUser,
      itemPurchases = []
    };
    transaction.push(newTransaction);
  }
}), 1000;

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