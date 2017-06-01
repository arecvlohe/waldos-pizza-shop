import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { bindActionCreators } from 'redux'
import assocPath from 'ramda/src/assocPath'

import { getPizzaSizes } from './helpers'
import { removeItemFromCart, addItemToCart, fetchData } from '../../store/actions'

const getDataAndMapProps = WrappedComponent => class extends Component {
  constructor (props) {
    super(props)
    this.state = {
      pizzaSizes: [],
      currentPizzaSize: 'small',
      toppingsForSize: {},
      totalCost: 0,
      isMaxedForSize: {
        small: false,
        medium: false,
        large: false
      },
      pizzas: {}
    }
    this.handleUpdatePizzaSize = this.handleUpdatePizzaSize.bind(this)
    this.handleUpdateTopping = this.handleUpdateTopping.bind(this)
    this.handleAddPizza = this.handleAddPizza.bind(this)
  }

  componentWillMount () {
    getPizzaSizes()
      .fork(
        e => { console.error(e) },
        d => {
          const toppingsForSize = d.pizzaSizes.reduce((acc, curr, arr) => {
            const currentToppings = curr.toppings.reduce((acc, curr, idx) => {
              acc[`${curr.topping.name}`] = {
                defaultSelected: curr.defaultSelected,
                isChecked: curr.defaultSelected,
                name: curr.topping.name,
                price: curr.topping.price
              }
              return acc
            }, {})
            acc[`${curr.name}`] = currentToppings
            return acc
          }, {})
          const totalCost = d.pizzaSizes.reduce((acc, curr, idx) => {
            if (curr.name === 'small') {
              acc += curr.basePrice
              curr.toppings.forEach(t => {
                if (t.defaultSelected) {
                  acc += t.topping.price
                }
              })
            }
            return acc
          }, 0)
          const pizzas = d.pizzaSizes.reduce((acc, curr) => {
            acc[`${curr.name}`] = {...curr}
            return acc
          }, {})
          this.setState({ pizzas, pizzaSizes: d.pizzaSizes, toppingsForSize, totalCost })
        }
      )
  }

  handleUpdatePizzaSize (e) {
    const pizzaCost = this.state.pizzaSizes.filter(v => v.name === this.state.currentPizzaSize)[0].basePrice
    const toppings = this.state.toppingsForSize[e.target.value]
    const toppingsCost = Object.keys(toppings).reduce((acc, curr) => {
      if (toppings[curr].isChecked) {
        acc += toppings[curr].price
      }
      return acc
    }, 0)
    const totalCost = pizzaCost + toppingsCost
    this.setState({ currentPizzaSize: e.target.value, totalCost })
  }

  handleUpdateTopping (e) {
    this.setState(assocPath(['toppingsForSize', this.state.currentPizzaSize, e.target.name, 'isChecked'], e.target.checked), () => {
      const { toppingsForSize, currentPizzaSize } = this.state
      const tops = toppingsForSize[currentPizzaSize]
      const toppings = Object.keys(tops).reduce((acc, curr) => {
        if (tops[curr].isChecked) {
          acc.cost += tops[curr].price
          acc.amount++
        }
        return acc
      }, {amount: 0, cost: 0})
      const pizzaCost = this.state.pizzaSizes.filter(v => v.name === this.state.currentPizzaSize)[0].basePrice
      const totalCost = pizzaCost + toppings.cost
      this.setState({totalCost, isMaxedForSize: {[this.state.currentPizzaSize]: (this.state.pizzas[currentPizzaSize].maxToppings || Infinity) < toppings.amount + 1}})
    })
  }

  handleAddPizza () {
    const size = this.state.currentPizzaSize
    const tops = this.state.toppingsForSize[this.state.currentPizzaSize]
    const toppings = Object.keys(tops).reduce((acc, curr) => {
      if (tops[curr].isChecked) {
        acc.push(tops[curr].name)
      }
      return acc
    }, [])
    const cost = this.state.totalCost
    const order = { size, toppings, cost }
    this.props.addItemToCart(order)
    this.setState({ currentPizzaSize: 'small' })
  }

  render () {
    return (
      <WrappedComponent
        {...this.props}
        currentPizzaSize={this.state.currentPizzaSize}
        handleAddPizza={this.handleAddPizza}
        handleUpdatePizzaSize={this.handleUpdatePizzaSize}
        handleUpdateTopping={this.handleUpdateTopping}
        pizzaSizes={this.state.pizzaSizes}
        toppingsForSize={(this.state.toppingsForSize[this.state.currentPizzaSize] || {})}
        totalCost={this.state.totalCost}
        pizzas={this.state.pizzas}
        isMaxedForSize={this.state.isMaxedForSize}
      />
    )
  }
}

const mapStateToProps = state => ({...state})


const mapDispatchToProps = dispatch => {
  return bindActionCreators({ removeItemFromCart, addItemToCart, fetchData }, dispatch)
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  getDataAndMapProps
)
