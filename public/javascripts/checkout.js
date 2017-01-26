/**
 * Created by Alex.W on 2017/1/26.
 */
Stripe.setPublishableKey('pk_test_m541daRqxnMGrTTZ3QlsGp9m');

var $form = $('#checkoutForm');

$form.submit(function(event) {
    $('#charge-error').addClass('hidden');
    $form.find('button').prop('disabled',true);
    Stripe.card.createToken({
        name:$('#name').val(),
        number: $('#cardNumber').val(),
        cvc: $('#cardCVC').val(),
        exp_month: $('#cardExpireMonth').val(),
        exp_year: $('#cardExpireYear').val()
    }, stripeResponseHandler);
    return false;
});

function stripeResponseHandler(status, response) {
    if (response.error) { // Problem!

        // Show the errors on the form
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('hidden');
        $form.find('button').prop('disabled', false); // Re-enable submission

    } else { // Token was created!

        // Get the token ID:
        var token = response.id;

        // Insert the token into the form so it gets submitted to the server:
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));

        // Submit the form:
        $form.get(0).submit();

    }
}