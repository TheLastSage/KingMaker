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
			<li class="{this.props.item.name}">
				<div className="item">
					<p className="itemName">
						{this.props.item.text}
					</p>
				</div>
			</li>
		);
	}
})