Router.route('/inputStream', {where: 'server'})
  .get(function () {
    this.response.end('get request\n');
  })
  .post(function () {
    var data = this.request.body;
    data.time = new Date();
    recentPersonData.push(data);
    this.response.end('send more\n');
  });

var itemCosts = {"latte": 5.50, "banana": 1, "water bottle": 2, "cappucino": 3.75, "mocha": 4.20};
var itemList = ["latte", "cappucino", "mocha"];
var tempIDs = {"vignesh": 20681010, "yixin": 87630990, "rishi": 40802030};

// var transactions = {"Test1": ["latte"], "Test2": ["cappucino", "latte"]};

var gateway;

var transactions = [

  // {
  //   'person':'Joe',
  //   'itemPurchases':['banana', 'water bottle']
  // },
  // {
  //   'person':'',
  //   'itemPurchases':['banana', 'water bottle']
  // }

];

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

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
    if (!(curr in counts)) {
      counts[curr] = 0;
    }
    counts[curr] += 1;
    if (counts[curr] > maxCount) {
      max = curr;
      maxCount = counts[curr];
    }
  } 
  var newUser = max;

  console.log("The new user: " + newUser);
  console.log("The curr user: " + currUser);
  if (newUser == null) {
    currUser = newUser;
  } else if (currUser!=newUser && maxCount > 3) {
    currUser = newUser;
    if (currUser != null && typeof newUser != 'undefined') {
      var newTransaction = {
        time: new Date(), 
        person: currUser,
        itemPurchases: [itemList[getRandomInt(0, 2)], itemList[getRandomInt(0, 2)]]
      };
      transactions.push(newTransaction);

      var data = {};
      data["ident"] = tempIDs[currUser];
      data["items"] = newTransaction.itemPurchases;

      console.log(data.ident);
      console.log(data.items);

      Meteor.call("createTransaction", data, function (err, result) {
        console.log(err);
      });
    }
  }
}, 1000);

Meteor.methods({
  getTransactions: function () {
    return transactions;
  },

  renderTransactions: function(){
    var output = '';
    console.log("fdsf");
    for (i=transactions.length-1; i>=0; i--){
      currCost = 0;
      output += '<li className="item-li"><div class="item"><div class="item-left item-elem"><p class="itemName">';
      output+=transactions[i]['person']; 
      output+='</p></div><div class="item-right item-elem"><p class="itemCost" id="currCost">';
      output+='+ $';
      for (j=0; j<transactions[i]['itemPurchases'].length; j++) {
        currCost = currCost + itemCosts[transactions[i]['itemPurchases'][j]];
      }
      output+=currCost.toString();
      output+='</p></div><div class="item-right item-elem"><p class="itemCost">';
      output+=transactions[i]['itemPurchases'];
      output+='</p></div></div></li>';
      // document.getElementById("tha-list").innerHTML+=output;
    };
    console.log("renderTransactions");
    console.log(output);
    return output;

  },
  // VINCET
  renderATransaction: function(transaction){
    var output = '';
    output += '<li class="item-li"><div class="item"><div class="item-left item-elem"><p class="itemName">';
    output+=transaction["ident"]; 
    output+='</p></div><div class="item-right item-elem"><p class="itemCost">';
    output+=transaction["items"];
    output+='</p></div></div></li>';
    console.log(output);
    return output;
    // document.getElementById("tha-list").innerHTML+=output;
  },


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

    totalAmount = totalAmount.toString();

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

// AYYLMAO = Meteor.call("renderATransaction", {'ident':'Vincent', 'items':'Dog'}, function(err, result){
//       if (err) console.log(err);
// });
