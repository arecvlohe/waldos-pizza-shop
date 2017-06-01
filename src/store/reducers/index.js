import { combineReducers } from 'redux'
import * as types from '../types'

function cart (state = {totalCost: 0, items: []}, action) {
  switch (action.type) {
    case types.ADD_ITEM_TO_CART: {
      return Object.assign(
        {},
        state,
        { items: state.items.concat(action.payload) },
        { totalCost: state.totalCost + action.payload.cost }
      )
    }
    case types.REMOVE_ITEM_FROM_CART: {
      return Object.assign(
        {},
        state,
        { totalCost: state.totalCost - state.items[action.payload].cost },
        { items: state.items.filter((v, i) => { return i !== action.payload }) }
      )
    }
    default: {
      return state
    }
  }
}

function data (state = { data: {}, error: {} }, action) {
  switch (action.type) {
    case types.FETCH_DATA_SUCCESS: {
      return Object.assign({}, { data: action.payload })
    }
    case types.FETCH_DATA_FAILURE: {
      return Object.assign({}, { error: action.payload })
    }
    default: {
      return state
    }
  }
}

export default combineReducers({
  cart
})


