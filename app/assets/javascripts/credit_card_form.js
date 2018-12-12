document.addEventListener('DOMContentLoaded', () => {
  // Create a Stripe client.
  // const key = {{}}
  const run = document.querySelector('.cc_form');
  if (run) {

    var stripe = Stripe('pk_test_lDQ04AisZAG3XihNQTo142aR');
    // index

    function registerElements(elements, paymentName) {
      var formClass = '.' + paymentName;
      var payment = document.querySelector(formClass);

      var form = payment.querySelector('form');
      var error = form.querySelector('.error');
      var errorMessage = error.querySelector('.message');

      function enableInputs() {
        Array.prototype.forEach.call(
          form.querySelectorAll(
            "input[type='text'], input[type='email'], input[type='tel']"
          ),
          function(input) {
            input.removeAttribute('disabled');
          }
        );
      }

      function disableInputs() {
        Array.prototype.forEach.call(
          form.querySelectorAll(
            "input[type='text'], input[type='email'], input[type='tel']"
          ),
          function(input) {
            input.setAttribute('disabled', 'true');
          }
        );
      }

      function triggerBrowserValidation() {
        // The only way to trigger HTML5 form validation UI is to fake a user submit
        // event.
        var submit = document.createElement('input');
        submit.type = 'submit';
        submit.style.display = 'none';
        form.appendChild(submit);
        submit.click();
        submit.remove();
      }

      // Listen for errors from each Element, and show error messages in the UI.
      var savedErrors = {};
      elements.forEach(function(element, idx) {
        element.on('change', function(event) {
          if (event.error) {
            error.classList.add('visible');
            savedErrors[idx] = event.error.message;
            errorMessage.innerText = event.error.message;
          } else {
            savedErrors[idx] = null;

            // Loop over the saved errors and find the first one, if any.
            var nextError = Object.keys(savedErrors)
              .sort()
              .reduce(function(maybeFoundError, key) {
                return maybeFoundError || savedErrors[key];
              }, null);

            if (nextError) {
              // Now that they've fixed the current error, show another one.
              errorMessage.innerText = nextError;
            } else {
              // The user fixed the last error; no more errors.
              error.classList.remove('visible');
            }
          }
        });
      });

      // Listen on the form's 'submit' handler...
      form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Trigger HTML5 validation UI on the form if any of the inputs fail
        // validation.
        var plainInputsValid = true;
        Array.prototype.forEach.call(form.querySelectorAll('input'), function(
          input
        ) {
          if (input.checkValidity && !input.checkValidity()) {
            plainInputsValid = false;
            return;
          }
        });
        if (!plainInputsValid) {
          triggerBrowserValidation();
          return;
        }

        // Show a loading screen...
        payment.classList.add('submitting');

        // Disable all inputs.
        disableInputs();

        // Gather additional customer data we may have collected in our form.
        var name = form.querySelector('#' + paymentName + '-name');
        var address1 = form.querySelector('#' + paymentName + '-address');
        var city = form.querySelector('#' + paymentName + '-city');
        var state = form.querySelector('#' + paymentName + '-state');
        var zip = form.querySelector('#' + paymentName + '-zip');
        var additionalData = {
          name: name ? name.value : undefined,
          address_line1: address1 ? address1.value : undefined,
          address_city: city ? city.value : undefined,
          address_state: state ? state.value : undefined,
          address_zip: zip ? zip.value : undefined,
        };

        // Use Stripe.js to create a token. We only need to pass in one Element
        // from the Element group in order to create a token. We can also pass
        // in the additional customer data we collected in our form.
        stripe.createToken(elements[0], additionalData).then(function(result) {
          // Stop loading!
          payment.classList.remove('submitting');
          payment.classList.add('submitted');

          if (result.token) {
            let hiddenInput = document.createElement('input');
            hiddenInput.setAttribute('type', 'hidden');
            hiddenInput.setAttribute('name', 'stripeToken');
            hiddenInput.setAttribute('value', result.token.id);
            form.appendChild(hiddenInput);

            // Submit the form
            form.submit();
          } else {
            // Otherwise, un-disable inputs.
            enableInputs();
          }
        });
      });
    }

    // Create an instance of Elements.
    var elements = stripe.elements();

    var elementStyles = {
      base: {
        color: '#3c3c3c',
        fontWeight: 500,
        fontSize: '16px',
        fontSmoothing: 'antialiased',

        '::placeholder': {
          color: '#CFD7DF',
        },
        ':-webkit-autofill': {
          color: '#e7388c',
        },
      },
      invalid: {
        color: '#e7388c',

        '::placeholder': {
          color: '#e7388c',
        },
      },
    };

    // Floating labels
    var inputs = document.querySelectorAll('.cell.payment.payment2 .input');
    Array.prototype.forEach.call(inputs, function(input) {
      input.addEventListener('focus', function() {
        input.classList.add('focused');
      });
      input.addEventListener('blur', function() {
        input.classList.remove('focused');
      });
      input.addEventListener('keyup', function() {
        if (input.value.length === 0) {
          input.classList.add('empty');
        } else {
          input.classList.remove('empty');
        }
      });
    });

    var elementClasses = {
      focus: 'focused',
      empty: 'empty',
      invalid: 'invalid',
    };

    var cardNumber = elements.create('cardNumber', {
      style: elementStyles,
      classes: elementClasses,
    });
    cardNumber.mount('#payment2-card-number');

    var cardExpiry = elements.create('cardExpiry', {
      style: elementStyles,
      classes: elementClasses,
    });
    cardExpiry.mount('#payment2-card-expiry');

    var cardCvc = elements.create('cardCvc', {
      style: elementStyles,
      classes: elementClasses,
    });
    cardCvc.mount('#payment2-card-cvc');

    registerElements([cardNumber, cardExpiry, cardCvc], 'payment2');
  }
});
