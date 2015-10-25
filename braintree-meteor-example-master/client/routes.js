Router.route('/', function () {
  this.render('home');
},{
  name: 'home'
});

Router.route('/confirmation', function () {
  this.render('confirmation');
},{
  name: 'confirmation'
});

Router.route('/transactions', function () {
  this.render('transactions');
},{
  name: 'transactions'
});

// Router.map(function() {
// 	this.route('inputStream', {
// 	where: 'server',
// 	action: function () {
// 		console.log(this.request.query);
// 	}
// });
// });
