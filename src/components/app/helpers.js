import Task from 'data.task'
import { Lokka } from 'lokka'
import { Transport } from 'lokka-transport-http'

const client = new Lokka({
  transport: new Transport('https://core-graphql.dev.waldo.photos/pizza')
})

function getPizzaSizes () {
  return new Task((rej, res) => {
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
    .then(res)
    .catch(rej)
  })
}

function getPizzaToppings (size) {
  const SIZE = size.toUpperCase()
  return new Task((rej, res) => {
    client.query(`
        {
          pizzaSizeByName(name: ${SIZE}) {
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
      .then(res)
      .catch(rej)
  })
}

export { getPizzaSizes, getPizzaToppings }
