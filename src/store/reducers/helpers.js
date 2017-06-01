export const normalizeForm = (data) => {
  const form = data.reduce((acc, curr) => {
    const toppings = curr.toppings.reduce((a, c) => {
      a[`${c.topping.name}`] = {...c.topping, isChecked: c.defaultSelected}
      return a
    }, {})
    curr.toppings = toppings
    acc[`${curr.name}`] = {...curr}
    return acc
  }, {})
  form.currentPizzaSize = 'small'
  form.pizzaSizes = data.map(p => p.name)
  return form
}
