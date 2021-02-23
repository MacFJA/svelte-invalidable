<script>
    import {invalidate, invalidable, pinvalidable} from "../../src/index"
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

<p>The last time the date was refresh is: {$time}</p>
<button id="date-btn" on:click="{updateTime}">Do it now</button>

<hr />
<var on:click={() => invalidate(data)}>prime number: {$data}</var>

<hr />
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