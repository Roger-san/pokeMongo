const mongoose = require("mongoose")

const Schema = mongoose.Schema

const pokemonSchema = new Schema(
  {
    name: String,
    type: String,
    locations: [{_id: String, alt: Number, long: Number}],
  },
  {versionKey: false}
  // versionKey: false elimina la creacion de un parametro
  // adicional que es inecesario
)

module.exports = mongoose.model("Pokemon", pokemonSchema)
