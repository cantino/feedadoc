module Types
  class Provider < Types::BaseObject
    field :id, ID, null: false
    field :first_name, String, null: false
    field :role, String, null: false
    field :facility, String, null: false
    field :neighborhood, String, null: true
    field :city, String, null: false
    field :state, String, null: false
    field :description, String, null: false
    field :requests, [Types::Request], null: false
    field :responses, Types::Connections::ResponseConnection, connection: true, null: true
    field :active, Boolean, null: false
    field :updated_at, String, null: false
  end

  class ProviderFilter < Types::BaseInputObject
    argument :id, ID, required: false
    argument :state, String, required: false
    argument :city, String, required: false
    argument :active, Boolean, required: false
    argument :role, String, required: false
    argument :updated_within_days, Int, required: false
    argument :active_requests, Boolean, required: false
  end

  class ProviderSort < Types::BaseEnum
    value("ID", "The Provider's ID", value: :id)
    value("STATE", "The Provider's state", value: :state)
    value("CITY", "The Provider's city", value: :city)
  end

  class ProviderOrder < Types::BaseInputObject
    argument :sort, Types::ProviderSort, required: false
    argument :direction, Types::Enums::SortOrder, required: false
  end
end
