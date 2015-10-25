// Item collection
Items = new Mongo.Collection("items");


Router.route('/restful', {where: 'server'})
  .get(function () {
  	console.log('get');
    this.response.end('get request\n');
  })
  .post(function () {
  	console.log('post');
  	// console.log('this.params.name' + this.params.name+ '\n');
  	console.log(this.request.body);
    this.response.end('post request\n');
  });


if (Meteor.isClient) {
  // This code is executed on the client only

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  Meteor.startup(function () {
    // Use Meteor.startup to render the component after the page is ready
    React.render(<App />, document.getElementById("render-target"));
  });
}