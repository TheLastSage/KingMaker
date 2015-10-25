var transactions = {"Test1": ["latte"], "Test2": ["cappucino", "latte"]};

Template.transactions.rendered = function(){
  Meteor.call('renderTransactions', function(err, result){
    if (err) console.log(err);
  });
}