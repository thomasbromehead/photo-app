Rails.configuration.stripe = {
  :publishable => Rails.application.credentials.stripe[:SECRET_PUB_KEY],
  :secret_key => Rails.application.credentials.stripe[:SECRET_TEST_KEY],
}

Stripe.api_key = Rails.configuration.stripe[:secret_key]

