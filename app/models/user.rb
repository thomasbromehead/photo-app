class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :confirmable, 
         :recoverable, :rememberable, :validatable

  has_one :payment 
  #User accepts nested attributes for payments, as we are doing it all in one go.
  accepts_nested_attributes_for :payment     
end
