# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_03_31_033343) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "linked_tokens", force: :cascade do |t|
    t.string "token", null: false
    t.string "entity_type", null: false
    t.bigint "entity_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["entity_type", "entity_id"], name: "index_linked_tokens_on_entity_type_and_entity_id"
    t.index ["token", "entity_type", "entity_id"], name: "index_linked_tokens_on_token_and_entity_type_and_entity_id"
    t.index ["token"], name: "index_linked_tokens_on_token", unique: true
  end

  create_table "providers", force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name"
    t.string "role", null: false
    t.string "facility", null: false
    t.string "neighborhood"
    t.string "city", null: false
    t.string "state", null: false
    t.string "email", null: false
    t.jsonb "requests", default: [], null: false
    t.text "description", null: false
    t.boolean "active", default: true, null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "ip"
    t.string "country", default: "United States", null: false
    t.string "address"
    t.decimal "latitude"
    t.decimal "longitude"
    t.index ["latitude", "longitude"], name: "index_providers_on_latitude_and_longitude"
  end

  create_table "responses", force: :cascade do |t|
    t.bigint "provider_id", null: false
    t.bigint "volunteer_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "requests", null: false, array: true
    t.text "description"
    t.string "availabilities", null: false, array: true
    t.string "phone"
    t.string "social"
    t.boolean "over_18", null: false
    t.index ["provider_id"], name: "index_responses_on_provider_id"
    t.index ["volunteer_id"], name: "index_responses_on_volunteer_id"
  end

  create_table "volunteers", force: :cascade do |t|
    t.string "email", null: false
    t.string "neighborhood"
    t.string "city", null: false
    t.string "state", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "ip"
    t.string "country", default: "United States", null: false
    t.string "address"
    t.decimal "latitude"
    t.decimal "longitude"
    t.index ["latitude", "longitude"], name: "index_volunteers_on_latitude_and_longitude"
  end

  add_foreign_key "responses", "providers"
  add_foreign_key "responses", "volunteers"
end
