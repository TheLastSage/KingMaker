// App component - represents the whole app
App = React.createClass({

  mixins: [ReactMeteorData],

  getInitialState() {
    return {
      totalCost:0
    }
  },

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
      this.state.totalCost += item.cost;
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
            <div className="nav">
              <div className="nav-inner">
                <div className="inline">
                  <h2>TeamName</h2>
                </div>
                <div className="inline right">
                  <AccountsUIWrapper />
                </div>
              </div>
            </div>
          </header>
   
        <div className="container-inner">
          <h1>Hello</h1>

          <div className="camera">
            <div className="camera-inner-message">
              <p>Camera stuff goes here</p>
            </div>
          </div>

          <div className="item-wrapper">
            <ul className="item-ul">
              {this.renderItems()}
              <li class="{this.props.item.name} item-li">
              <div className="item">
                <div className="item-left item-elem bold">
                  <p className="itemName">
                    Total Cost:
                  </p>
                </div>
                <div className="item-right item-elem bold">
                  <p className="itemCost" id="totalCost">
                    ${this.state.totalCost}
                  </p>
                </div>
              </div>
            </li>
            </ul>
          </div>
        </div>
      </div>
      );
  }
});