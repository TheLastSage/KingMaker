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

// Router.map(function() {
// 	this.route('inputStream', {
// 	where: 'server',
// 	action: function () {
// 		console.log(this.request.query);
// 	}
// });
// });
