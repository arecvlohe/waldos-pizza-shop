import React from 'react'

import pathOr from 'ramda/src/pathOr'

export default function App (props) {
  return (
    <div>
      <select value={props.currentPizzaSize} onChange={props.handleUpdatePizzaSize}>
        {pathOr([], ['form', 'WIP', 'pizzaSizes'], props).map((p, i) => {
          return <option value={p} key={`pizzaSizeIndex-${i}`}>{p[0].toUpperCase() + p.slice(1)}</option>
        })}
      </select>
      <div>
        {Object.keys(props.currentToppings).map((t, i) => {
          return (
            <div key={t + i}>
              <label>
                {t}
                <input
                  name={t}
                  type='checkbox'
                  disabled={props.hasReachedMaxToppings && !props.currentToppings[t].isChecked}
                  checked={props.currentToppings[t].isChecked}
                  onChange={props.handleUpdateTopping} />
              </label>
            </div>
          )
        })}
      </div>
      <div>
        Total Cost: ${props.currentPizzaTotal.toFixed(2)}
      </div>
      <div>
        <button onClick={props.handleAddPizza}>Add To Cart</button>
      </div>
      <div>
        Subtotal Cart Cost: ${props.currentCartTotal.toFixed(2)}
      </div>
      <div>
        {props.cart.map((p, i) => {
          return (
            <div key={'pizzaOrder' + i}>
              <div>
                COST: <br />
                ${p.cost.toFixed(2)}
              </div>
              <div>
                SIZE: <br />
                {p.size}
              </div>
              <div>
                TOPPINGS: <br />
                {p.toppings.map((t, j) => {
                  return <div key={'pizzaOrder' + j + t + i}>{t}</div>
                })}
              </div>
              <div style={{textDecoration: 'underline'}} onClick={() => props.removeItemFromCart(i)}>Remove</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
