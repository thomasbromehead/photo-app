Rails.application.routes.draw do
  resources :images
  #Look at our own registration controller before hitting Devise's
  devise_for :users, :controllers => {:registrations => 'registrations'}
  root 'welcome#index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
