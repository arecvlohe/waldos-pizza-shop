import { createSelector } from 'reselect'
import identity from 'ramda/src/identity'
import pathOr from 'ramda/src/pathOr'

const WIP = state => pathOr({}, ['form', 'WIP'], state)
const currentSize = state => pathOr('small', ['form', 'WIP', 'currentPizzaSize'], state)
const currentCart = state => pathOr([], ['cart'], state)

export const currentPizzaSize = createSelector(
  [currentSize],
  identity
)

export const currentToppings = createSelector(
  [currentSize, WIP],
  (size, WIP) => (WIP[size] && WIP[size].toppings) || {}
)

export const currentPizzaTotal = createSelector(
  [currentSize, WIP],
  (size, WIP) => {
    const toppings = (WIP[size] && WIP[size].toppings) || {}
    const toppingsCost = Object.keys(toppings).reduce((acc, curr) => {
      if (toppings[curr].isChecked) {
        acc += toppings[curr].price
      }
      return acc
    }, 0)
    const sizeCost = (WIP[size] && WIP[size].basePrice) || 0.00
    return toppingsCost + sizeCost
  }
)

export const hasReachedMaxToppings = createSelector(
  [currentSize, WIP],
  (size, WIP) => {
    const maxToppings = (WIP[size] && WIP[size].maxToppings) || Infinity
    const toppings = (WIP[size] && WIP[size].toppings) || {}
    const countToppings = Object.keys(toppings).reduce((acc, curr) => {
      if (toppings[curr].isChecked) {
        acc++
      }
      return acc
    }, 0)
    return countToppings >= maxToppings
  }
)

export const currentCartTotal = createSelector(
  [currentCart],
  cart => cart.reduce((acc, curr) => {
    acc += curr.cost
    return acc
  }, 0)
)

export const currentOrder = createSelector(
  [currentSize, WIP],
  (size, WIP) => {
    const toppings = (WIP[size] && WIP[size].toppings) || {}
    const sizeCost = (WIP[size] && WIP[size].basePrice) || 0.00
    const order = Object.keys(toppings).reduce((acc, curr) => {
      if (toppings[curr].isChecked) {
        acc.toppings.push(toppings[curr].name)
        acc.cost += toppings[curr].price
      }
      return acc
    }, { size: 'small', toppings: [], cost: 0.00 })
    order.size = size
    order.cost += sizeCost
    return order
  }
)
