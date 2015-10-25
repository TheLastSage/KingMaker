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

Router.route('/inputStream')
  .get(function () {
	console.log("got correctly");
  })
  .post(function () {
  	res.writeHead(200);
    // this.response.end('input stream\n');
	console.log(this.response);
	console.log("got posted");
	// handleNewInput(this.response.query);
  })