// Item component - represents a single item
Item = React.createClass( {
	propTypes: {
		item: React.PropTypes.object.isRequired
	},

	deleteThisItem() {
		Items.remove( this.props.item._id );
	},

	render() {

		const itemName = this.props.item.text

		return (
			<li class="{this.props.item.name} item-li">
				<div className="item">
					<div className="item-left item-elem">
						<p className="itemName">
							{this.props.item.text}
						</p>
					</div>
					<div className="item-right item-elem">
						<p className="itemCost">
							${this.props.item.cost}
						</p>
					</div>
				</div>
			</li>
		);
	}
})