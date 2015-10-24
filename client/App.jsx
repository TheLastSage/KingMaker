// App component - represents the whole app
App = React.createClass({

  mixins: [ReactMeteorData],

  // getTasks() {
  //   return [
  //     { _id: 1, text: "This is task 1" },
  //     { _id: 2, text: "This is task 2" },
  //     { _id: 3, text: "This is task 3" }
  //   ];
  // },
  getItems() {    // Temporary
    return [
      { _id: 1, text: "Bag of food", cost: 54},
      { _id: 2, text: "Rice", cost: 14 }
    ];
  },

  getMeteorData() {
    return {
      items: Items.find({}).fetch(),
      currentUser: Meteor.user(),
    };
  },

  renderItems() {
    return this.getItems().map((item) => {
      return <Item key={item._id} item={item} />;
    });
  },
 
  // renderTasks() {
  //   return this.getTasks().map((task) => {
  //     return <Task key={task._id} task={task} />;
  //   });
  // },
 
  render() {
    return (
      <div className="container">
          <header>
            <h1>Todo List</h1>
            <AccountsUIWrapper />
          </header>
   
        <div className="container-inner">
          <h1>Hello {Meteor.user().name}</h1>

          <div class="item-wrapper">
            <ul class="item-ul">
              {this.renderItems()}
            </ul>
          </div>
        </div>
      </div>
      );
  }
});