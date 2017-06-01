import React from 'react'

export default function App (props) {
  return (
    <div>
      <select value={props.currentPizzaSize} onChange={props.handleUpdatePizzaSize}>
        {props.pizzaSizes.map((p, i) => {
          return <option value={p.name} key={`pizzaSizeIndex-${i}`}>{p.name[0].toUpperCase() + p.name.slice(1)}</option>
        })}
      </select>
      <div>
        {Object.keys(props.toppingsForSize).map((t, i) => {
          return (
            <div key={t + i}>
              <label>
                {t}
                <input
                  name={t}
                  type='checkbox'
                  disabled={props.isMaxedForSize[props.currentPizzaSize] && !props.toppingsForSize[t].isChecked}
                  checked={props.toppingsForSize[t].isChecked}
                  onChange={props.handleUpdateTopping} />
              </label>
            </div>
          )
        })}
      </div>
      <div>
        Total Cost:
        ${props.totalCost.toFixed(2)}
      </div>
      <div>
        <button onClick={props.handleAddPizza}>Add To Cart</button>
      </div>
      <div>
        Subtotal Cart Cost: ${props.cart.totalCost.toFixed(2)}
      </div>
      <div>
        {props.cart.items.map((p, i) => {
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
