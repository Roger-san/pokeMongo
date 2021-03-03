const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const Pokemon = require("./models/Pokemon")
const URL = "mongodb://localhost/Pokemons"

const api = express()

//api config
api.use(bodyParser.json())
api.use(bodyParser.urlencoded({extended: true}))
api.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*") // authorized headers for preflight requests
  // https://developer.mozilla.org/en-US/docs/Glossary/preflight_request
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
  api.options("*", (req, res) => {
    // allowed XHR methods
    res.header("Access-Control-Allow-Methods", "GET, PATCH, PUT, POST, DELETE, OPTIONS")
    res.send()
  })
})
//mongoose config
const opts = {useNewUrlParser: true, useUnifiedTopology: true}
mongoose.connect(URL, opts, (err, res) => {
  if (err) console.error(err, opts, "fallo en la base de datos")
  else console.log("base de datos conectada")
})

api.get("/api/pokemon", (req, res) => {
  Pokemon.find((err, data) => {
    if (err) console.error(err)
    else res.send(data)
  })
})

api.get("/api/pokemons/:id", (req, res) => {
  Pokemon.findById(req.params.id, (err, pokemon) => {
    if (err) console.error(err)
    else res.send(pokemon)
  })
})

api.get("/api/pokemons/:id/locations/:locationId", (req, res) => {
  Pokemon.findById(req.params.id, (err, poke) => {
    if (err) console.error(err)
    else poke.findOne({"locations.id": req.params.locationId})
  })
})

api.get("/api/pageoffset/pokemons/", (request, response) => {
  fs.readFile(database, (error, data) => {
    if (error) throw error
    const allPokemons = JSON.parse(data)
    const n1 = Number.parseInt(request.query.offset) - 1
    const n2 = Number.parseInt(request.query.limit)

    const list = allPokemons.slice(n1, n1 + n2)
    response.status(200).send({
      success: true,
      url: "/api/pokemons/pageoffset/",
      method: "get",
      message: list,
    })
  })
})

api.delete("/api/pokemons", (req, res) => {
  Pokemon.exists({_id: req.body.id}).then((boolean) => {
    if (!boolean) res.send("pokemon no existe")
    else
      Pokemon.findByIdAndDelete(req.body.id, (err, data) => {
        if (err) console.error(err)
        res.send("pokemon borrado correctamente")
      })
  })
})

api.post("/api/pokemons", (req, res) => {
  if (!req.body.name || !req.body.type || !req.body.locations) {
    res.send("more data is needed")
  } else {
    Pokemon.create(
      {
        name: req.body.name,
        type: req.body.type,
        locations: req.body.locations,
      },
      (err, data) => {
        if (err) res.send(err)
        else res.send(data)
      }
    )
  }
})

api.put("/api/pokemons/:id", (req, res) => {
  Pokemon.exists({_id: req.params.id}).then((boolean) => {
    if (!boolean) res.send("pokemon no existe")
    else if (!req.body.name || !req.body.type || !req.body.locations) {
      res.send("more data is needed")
    } else {
      const newPokemon = {
        name: req.body.name,
        type: req.body.type,
        locations: req.body.locations,
      }
      const opts = {
        new: true,
        runValidators: false,
        useFindAndModify: false,
      }
      Pokemon.findByIdAndUpdate(req.params.id, newPokemon, opts, (err, data) => {
        if (err) res.send(err)
        res.send(data) //problema con el id de locations
      })
    }
  })
})

// api.get("/api/pokemons/page/:pag", (request, response) => {
//   fs.readFile(database, (error, data) => {
//     if (error) {
//       response.status(400).send({
//         success: false,
//         url: "/api/pokemons/page",
//         method: "get",
//         message: "fallo",
//       })
//     } else {
//       const datos = JSON.parse(data)
//       let number = (request.params.pag - 1) * 5

//       if (number > datos.length) {
//         number = datos.length - (datos.length % 5)
//       }
//       const pokemons = datos.slice(number, number + 5)
//       response.status(200).send({
//         success: true,
//         url: "/api/pokemons/page",
//         method: "get",
//         Pokemons: pokemons,
//         page: Math.floor((datos.length - 1) / 5),
//       })
//     }
//   })
// })

api.listen(1013, () => console.log("server corriendo en localhost:1013"))
