import * as types from '../types'

import { Lokka } from 'lokka'
import { Transport } from 'lokka-transport-http'

const client = new Lokka({
  transport: new Transport('https://core-graphql.dev.waldo.photos/pizza')
})

// FORM ACTIONS

export const toggleToppings = (payload) => {
  return {
    type: types.TOGGLE_TOPPINGS,
    payload
  }
}

export const updatePizzaSize = (payload) => {
  return {
    type: types.UPDATE_PIZZA_SIZE,
    payload
  }
}

export const resetForm = () => {
  return {
    type: types.RESET_FORM
  }
}

export const removeItemFromCart = (payload) => {
  return {
    type: types.REMOVE_ITEM_FROM_CART,
    payload
  }
}

export const addItemToCart = (payload) => {
  return {
    type: types.ADD_ITEM_TO_CART,
    payload
  }
}

export const getData = payload => {
  return {
    type: types.FETCH_DATA_SUCCESS,
    payload
  }
}

export const getDataFail = payload => {
  return {
    type: types.FETCH_DATA_FAILURE,
    payload
  }
}

// FETCH DATA

export const fetchData = () => dispatch => {
  dispatch({ type: types.FETCH_DATA_REQUEST })
  console.log('fetching data')
  client.query(`
    {
      pizzaSizes {
        name
        maxToppings
        basePrice
        toppings {
          defaultSelected
          topping {
            name
            price
          }
        }
      }
    }
  `)
  .then(data => dispatch(getData(data)))
  .catch(e => dispatch(getDataFail(e))
  )
}
