

App = React.createClass({

  mixins: [ReactMeteorData],

  getInitialState() {
    return {
      totalCost:0
    }
  },

  // There are pages: homepage, signuppage, 
  // signinpage, receipt/confirm page, mainpage

  getItems() {    // Temporary
    return [
      { _id: 1, text: "JOHN CENA", cost: 999},
      { _id: 2, text: "Bag of food", cost: 54},
      { _id: 3, text: "Bag of food", cost: 54},
      { _id: 4, text: "Bag of food", cost: 54},
      { _id: 5, text: "Bag of food", cost: 54},
      { _id: 6, text: "Bag of food", cost: 54},
      { _id: 7, text: "Bag of food", cost: 54},
      { _id: 8, text: "Bag of food", cost: 54},
      { _id: 9, text: "Bag of food", cost: 54},
      { _id: 10, text: "Rice", cost: 14 }
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

  renderNavBar() {
    return ( 
     <header>
          <div className="nav">
            <div className="nav-inner">
              <div className="inline">
                <h2>TeamName</h2>
              </div>
              <div className="inline">
                <AccountsUIWrapper />
              </div>
            </div>
          </div>
        </header>
      );
  },

  renderMainPage() {
    return(
   <div className="container-inner">
          <div className="camera-wrapper">
            <div className="item" id="camera-header">
                <div className="item-elem bold">
                  <h2 className="itemName">
                    Camera Feed
                  </h2>
                </div>
              </div>
            <div className="camera inline">
              <div className="camera-inner-message">
                <p>Camera stuff goes here</p>
              </div>
            </div>
          </div>

          <div className="item-wrapper inline">
             <div className="item" id="items-header">
                <div className="item-elem bold">
                  <h2 className="itemName">
                    Items
                  </h2>
                </div>
              </div>
            <ul className="item-ul">
              {this.renderItems()}
              {/* Calculates the total cost */}
              <li className="item-li">
              
            </li>
            </ul>

          </div>
            <div className="item" id="total">
                <div className="item-left item-elem bold">
                  <p className="itemName">
                    Total Cost:
                  </p>
                </div>
                <div className="item-right item-elem bold">
                  <p className="totalCost" id="totalCost">
                    ${this.state.totalCost / 2}
                  </p>
                </div>
              </div>
              <div className="item" id="payform">
                <div className="item-elem bold">
                  <p className="itemName">
                    Pay
                  </p>
                </div>
              </div>
        </div>
    );
  },
 
  render() {
      var route = window.location.pathname
      if (route === "/home") {
        return (
          <div className="container">
            {this.renderNavBar()}
            {this.renderMainPage()}
           </div>
        );
      }
      else if (route === "/") {
        return (
          <div className="container">
          </div>
        )
      }
     
  }
});