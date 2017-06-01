import assocPath from 'ramda/src/assocPath'
import { combineReducers } from 'redux'
import * as types from '../types'
import { normalizeForm } from './helpers'


function cart (state = [], action) {
  switch (action.type) {
    case types.ADD_ITEM_TO_CART: {
      return state.concat(action.payload)
    }
    case types.REMOVE_ITEM_FROM_CART: {
      return state.filter((v, i) => { return i !== action.payload })
    }
    default: {
      return state
    }
  }
}

function form (state = { ORIG: {}, WIP: {}, error: {} }, action) {
  switch (action.type) {
    case types.FETCH_DATA_SUCCESS: {
      const data = normalizeForm(action.payload.pizzaSizes)
      return Object.assign({}, { ORIG: data, WIP: data })
    }
    case types.UPDATE_PIZZA_SIZE: {
      return assocPath(['WIP', 'currentPizzaSize'], action.payload, state)
    }
    case types.TOGGLE_TOPPINGS: {
      const { payload } = action
      const { size, topping, value } = payload
      return assocPath(['WIP', size, 'toppings', topping, 'isChecked'], value, state)
    }
    case types.RESET_FORM: {
      return assocPath(['WIP'], state.ORIG, state)
    }
    default: {
      return state
    }
  }
}

export default combineReducers({
  cart,
  form
})


