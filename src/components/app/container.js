import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { bindActionCreators } from 'redux'

import * as selectors from '../../store/selectors'
import {
  addItemToCart,
  fetchData,
  removeItemFromCart,
  resetForm,
  toggleToppings,
  updatePizzaSize
} from '../../store/actions'

const formHandlers = WrappedComponent => class extends Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.handleUpdatePizzaSize = this.handleUpdatePizzaSize.bind(this)
    this.handleUpdateTopping = this.handleUpdateTopping.bind(this)
    this.handleAddPizza = this.handleAddPizza.bind(this)
  }

  componentWillMount () {
    this.props.fetchData()
  }

  handleUpdatePizzaSize (e) {
    this.props.updatePizzaSize(e.target.value)
  }

  handleUpdateTopping (e) {
    this.props.toggleToppings({
      size: this.props.currentPizzaSize,
      topping: e.target.name,
      value: e.target.checked
    })
  }

  handleAddPizza () {
    this.props.addItemToCart(this.props.currentOrder)
    this.props.resetForm()
  }

  render () {
    return (
      <WrappedComponent
        {...this.props}
        handleAddPizza={this.handleAddPizza}
        handleUpdatePizzaSize={this.handleUpdatePizzaSize}
        handleUpdateTopping={this.handleUpdateTopping}
      />
    )
  }
}

const mapStateToProps = state => ({
  currentCartTotal: selectors.currentCartTotal(state),
  currentOrder: selectors.currentOrder(state),
  currentPizzaSize: selectors.currentPizzaSize(state),
  currentPizzaTotal: selectors.currentPizzaTotal(state),
  currentToppings: selectors.currentToppings(state) || {},
  hasReachedMaxToppings: selectors.hasReachedMaxToppings(state),
  ...state
})


const mapDispatchToProps = dispatch => {
  return bindActionCreators({ removeItemFromCart, addItemToCart, fetchData, updatePizzaSize, toggleToppings, resetForm }, dispatch)
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  formHandlers
)
