Session.set('paymentFormStatus', null);
var isBraintreeInitialized = false;

// note: it is highly recommended to _not_
// do things this way and instead use one of the many
// meteor libraries
// TODO: do this better
function serializeForm ($form) {
  var $inputs = $form.find('input, select, textarea');

  return _.reduce($inputs, function (data, input) {
    var name = input.name;

    if (name) {
      data[name] = input.value;
    }

    return data;
  }, {});
}

function initializeBraintree (clientToken) {
  if (isBraintreeInitialized) return;

  braintree.setup(clientToken, 'dropin', {
    container: 'dropin',
    paymentMethodNonceReceived: function (event, nonce) {
      Session.set('paymentFormStatus', true);

      // we've received a payment nonce from braintree
      // we need to send it to the server, along with any relevant form data
      // to make a transaction
      var data = serializeForm($('#checkout'));
      data.nonce = nonce;

      Meteor.call('createCustomer', data, function (err, result) {
        Session.set('paymentFormStatus', null);
        Router.go('confirmation');
      });
    }
  });

  isBraintreeInitialized = true;
}

Template.home.events = {
  'click input': function() {
    Meteor.call('getTransactions', function(err, response) {
      Session.set('transactions', response);
    });
  }
};

Template.home.result = function() {
  return Session.get('transactions') || '';
}

Template.home.helpers({
  paymentFormStatusClass: function () {
    return Session.get('paymentFormStatus') ? 'payment-form__is-submitting' : '';
  },
  getCurrentTransactions: function () {
    return Meteor.call('getTransactions');
  }
});

Template.home.rendered = function () {
  Meteor.call('getClientToken', function (err, clientToken) {
    if (err) {
      console.log('There was an error', err);
      return;
    }

    initializeBraintree(clientToken);
  });
};

$('#transactionid').ready(function(){
  console.log('temp.trans.render')
  var stuff = Meteor.call('renderTransactions', function (err, result){
    if (err) console.log(err);
    if (result || stuff) {
      console.log("result");
      console.log(result);
      console.log(stuff);
      $( '#tha-list' ).html( $( '#tha-list' ).html() + result);
      // document.getElementById("tha-list").innerHtml += result;
    }
  });
});

setInterval( function(){  // updates every one second
  console.log('temp.trans.render')
  var stuff = Meteor.call('renderTransactions', function (err, result){
    if (err) console.log(err);
    if (result || stuff) {
      console.log("result");
      console.log(result);
      console.log(stuff);
      $( '#tha-list' ).html( result);
      // document.getElementById("tha-list").innerHtml += result;
    }
  });
}, 1000);