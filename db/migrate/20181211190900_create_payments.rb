class CreatePayments < ActiveRecord::Migration[5.2]
  def change
    create_table :payments do |t|
      t.string :email
      t.string :token
      t.references :user, foreign_key: true

      t.timestamps
    end
  end
end
