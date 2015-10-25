App = React.createClass( {

	mixins: [ ReactMeteorData],

	getInitialState() {
		return {
			// Store initial values of anything you want
		}
	},

	getItems() {
		return [
			{ name: 'Banana', price: 1 },
			{ name: 'Water bottle', price: 5 },
			{ name: 'Coca-Cola', price: 2 }
		]
	},
	getTransactions() {
		return [
			{ _id:1, text: "This is a test transaction"},
			{ _id:2, text: "This is a test transaction"},
			{ _id:3, text: "This is a test transaction"},
			{ _id:4, text: "This is a test transaction"},
			{ _id:5, text: "This is a test transaction"},
		],
	},

	getMeteorData() {
		// Used to query db, later return all transactions, users, etc
	},


	renderTransactions() {
		// Get transactions
		return this.data.transactions.map(transaction) => {
			return <Transaction key={transaction._id} transaction={transaction } />
		}
	},

	render() {
	
		return (
			<div className="container">
				<header>
					<h1>Current Transactions</h1>
				</header>

				<ul>
					{this.renderTasks()}
				</ul>
			</div>
		)
	}
})