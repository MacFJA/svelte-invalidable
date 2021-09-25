import { Selector } from "testcafe"

fixture("Svelte Invalidable")
    .page("http://localhost:5000")

const text = Selector('p'),
    dateButton = Selector('#date-btn'),
    variable = Selector('var'),
    shopCartButton = Selector('#increase-qty'),
    shopCartSubtotal = Selector('#subtotal'),
    shopCartTotal = Selector('#total')

test("Initial state", async t => {
    await t
        .expect(text.textContent).eql("The last time the date was refresh is: Never")
        .expect(variable.textContent).eql('prime number: 2')
        .expect(shopCartSubtotal.textContent).eql('10¤')
        .expect(shopCartTotal.textContent).eql('10¤ (0¤ of discount)')
})

test("Update with promise", async t => {
    let now = new Date();
    await t
        .click(dateButton)
        .expect(text.textContent).contains(now.toISOString().substr(0, 11))
})

test("Update with no promise", async t => {
    let now = new Date();
    await t
        .click(variable)
        .expect(variable.textContent).eql('prime number: 7')
        .click(variable)
        .expect(variable.textContent).eql('prime number: 3')
        .click(variable)
        .expect(variable.textContent).eql('prime number: 5')
        .click(variable)
        .expect(variable.textContent).eql('prime number: 11')
        .click(variable)
        .expect(variable.textContent).eql('prime number: 13')
        .click(variable)
        .expect(variable.textContent).eql('prime number: 2')
        .click(variable)
        .expect(variable.textContent).eql('prime number: 7')
})

test("Invalidate with 'remote' computation", async t => {
    let now = new Date();
    await t
        .click(shopCartButton)
        .expect(shopCartSubtotal.textContent).eql('20¤')
        .expect(shopCartTotal.textContent).eql('20¤ (0¤ of discount)[updating...]')
        .expect(shopCartTotal.textContent).eql('16¤ (4¤ of discount)')
        .click(shopCartButton)
        .expect(shopCartSubtotal.textContent).eql('30¤')
        .expect(shopCartTotal.textContent).eql('30¤ (0¤ of discount)[updating...]')
        .expect(shopCartTotal.textContent).eql('24¤ (6¤ of discount)')
})
