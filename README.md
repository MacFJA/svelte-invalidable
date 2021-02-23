# Svelte Invalidable store

A Svelte that can be requested to update itself

## Installation

```
npm install @macfja/svelte-invalidable
```

## Goal

The idea behind this store is to provide a way to make a store to refresh it's base on an external event.

For example your store contains data that are dependent on an external API. Instead of creating a logic outside your store to update it, this store to just say "your data is not up-to-date, go get the new data"

## Usage

```javascript
import { invalidable } from "@macfja/svelte-invalidable"
import { writable } from "svelte/store"

let name = invalidable(writable("John"), () => {
    // your custom logic here
    return "the new value that you compute just before"
})

name.invalidate()
```

```javascript
import { pinvalidable } from "@macfja/svelte-invalidable"
import { writable } from "svelte/store"

let name = pinvalidable(writable("John"), () => {
    // your custom logic here
    // your should return a Promise (for example from a fetch)
    // The store will only be updated when the promise is revolved
    return new Promise(resolve => {resolve("Doe")})
})

name.invalidate()
```

## Example

```html
<script>
    import {invalidate, invalidable, pinvalidable} from "@macfja/svelte-invalidable"
    import { writable, derived } from "svelte/store"

    let time = pinvalidable(writable("Never"), () => {
        return fetch('http://worldtimeapi.org/api/timezone/Etc/UTC')
            .then(r => r.json())
            .then(r => r.datetime)
    })

    const updateTime = () => {
        time.invalidate()
    }

    const values = [2, 7, 3, 5, 11, 13]
    let position = 0
    let data = invalidable(writable(2), () => values[(++position)%6])
</script>

<p>The last time the date was refresh is: {$time}</p>
<button id="date-btn" on:click="{updateTime}">Do it now</button>

<hr />
<var on:click={() => invalidate(data)}>prime number: {$data}</var>
```
([REPL](https://svelte.dev/repl/6bb1981c0d1b413dbc32286fd04e37f8?version=3.32.3))

----

```html
<script>
    import {pinvalidable} from "@macfja/svelte-invalidable"
    import { writable, derived } from "svelte/store"

    let quantity = 1
    let price = pinvalidable(writable(10), () => {
        // Simulate long calculation + network access
        return new Promise(r => setTimeout(() => r(Math.round(quantity * 10 * 0.8)), 1000))
    })
    let discount = derived([price], ([finalPrice]) => {
        return (10 * quantity) - finalPrice
    })
    const increase = () => {
        quantity++
        $price = quantity * 10
        // Indicate that the price should be recalculated
        price.invalidate()
    }
</script>
<h2>Shopping cart</h2>
<ul>
    <li>
        <ul>
            <li>Product #1553879</li>
            <li>Unit Price: 10¤</li>
            <li>Quantity {quantity} <button id="increase-qty" on:click={increase}>+</button></li>
        </ul>
    </li>
</ul>
<dl>
    <dt>Subtotal</dt>
    <dd id="subtotal">{10 * quantity}¤</dd>
    <dt>Total</dt>
    <dd id="total">{$price}¤ ({$discount}¤ of discount)</dd>
</dl>
```
([REPL](https://svelte.dev/repl/05179797adcf4de5a2c1a78de61bbca3?version=3))

## Contributing

Contributions are welcome. Please open up an issue or create PR if you would like to help out.

Read more in the [Contributing file](CONTRIBUTING.md)

## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.