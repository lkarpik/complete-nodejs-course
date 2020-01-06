var stripe = Stripe('pk_test_3tVrWbuxMwXDupwKzbJi07MW');

var style = {
    base: {
        // Add your base input styles here. For example:
        fontSize: '24px',
        color: "#32325d",
    }
};

var elements = stripe.elements();
// Create an instance of the card Element.
var cardNumber = elements.create('cardNumber', {
    style: style
});
var cardExpiry = elements.create('cardExpiry', {
    style: style
});
var cardCvc = elements.create('cardCvc', {
    style: style
});

// Add an instance of the card Element into the `card-element` <div>.
cardNumber.mount('#card-element');
cardExpiry.mount('#card-exp');
cardCvc.mount('#card-cvc');

// Create a token or display an error when the form is submitted.
var form = document.getElementById('payment-form');
form.addEventListener('submit', function (event) {
    event.preventDefault();

    stripe.createToken(cardNumber).then(function (result) {
        if (result.error) {
            // Inform the customer that there was an error.
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
        } else {
            // Send the token to your server.
            stripeTokenHandler(result.token);
        }
    });
});

function stripeTokenHandler(token) {
    // Insert the token ID into the form so it gets submitted to the server
    var form = document.getElementById('payment-form');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);

    // Submit the form
    form.submit();
}