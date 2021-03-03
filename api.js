const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const fs = require("fs")

const database = "./db/database.json"
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

api.post("/api/pokemons", (req, res) => {
  if (!request.body.name || !request.body.type || !request.body.locations) {
    response.status(400).send({
      success: false,
      url: "/api/pokemons",
      method: "post",
      message: "fallo faltan mas datos",
    })
  } else {
    fs.readFile(database, (error, data) => {
      if (error) throw error

      const allPokemons = JSON.parse(data)
      const newPokemon = {
        id: allPokemons.length + 1,
        name: request.body.name,
        type: request.body.type,
      }
      allPokemons.push(newPokemon)

      fs.writeFile(database, JSON.stringify(allPokemons), (error) => {
        if (error) {
          response.status(400).send({
            success: false,
            url: "/api/pokemons",
            method: "post",
            message: "fallo",
          })
        } else {
          response.status(200).send({
            success: true,
            url: "/api/pokemons",
            method: "post",
            message: newPokemon,
          })
        }
      })
    })
  }
})

// api.delete("/api/pokemons", (request, response) => {
//   if (!request.body.name) {
//     response.status(400).send({
//       success: false,
//       url: "/api/pokemons",
//       method: "delete",
//       message: "hace falta el nombre",
//     })
//   } else {
//     fs.readFile(database, (error, data) => {
//       if (error) throw error

//       const allPokemons = JSON.parse(data)
//       const newPokemons = allPokemons.filter((x) => !(x.name === request.body.name))
//       fs.writeFile(database, JSON.stringify(newPokemons), (error) => {
//         if (error) {
//           response.status(400).send({
//             success: false,
//             url: "/api/pokemons",
//             method: "delete",
//             message: "fallo",
//           })
//         } else {
//           response.status(200).send({
//             success: true,
//             url: "/api/pokemons",
//             method: "delete",
//             Pokemons: allPokemons[0],
//           })
//         }
//       })
//     })
//   }
// })

// api.put("/api/pokemons/:id", (request, response) => {
//   fs.readFile(database, (error, data) => {
//     const allPokemons = JSON.parse(data)

//     const pokemons = allPokemons.map((x) => {
//       if (x.id === request.params.id) {
//         return (x = {
//           id: x.id,
//           name: request.body.name || x.name,
//           type: request.body.type || x.type,
//         })
//       } else {
//         return x
//       }
//     })

//     fs.writeFile(database, JSON.stringify(pokemons), (error) => {
//       if (error) {
//         response.status(400).send({
//           success: false,
//           url: "/api/pokemons",
//           method: "put",
//           message: "fallo",
//         })
//       } else {
//         response.status(200).send({
//           success: true,
//           url: "/api/pokemons",
//           method: "put",
//           Pokemons: pokemons,
//         })
//       }
//     })
//   })
// })

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

// api.get("/api/pageoffset/pokemons/", (request, response) => {
//   fs.readFile(database, (error, data) => {
//     if (error) throw error
//     const allPokemons = JSON.parse(data)
//     const n1 = Number.parseInt(request.query.offset) - 1
//     const n2 = Number.parseInt(request.query.limit)

//     const list = allPokemons.slice(n1, n1 + n2)
//     response.status(200).send({
//       success: true,
//       url: "/api/pokemons/pageoffset/",
//       method: "get",
//       message: list,
//     })
//   })
// })

// api.get("/api/pokemons/:id/locations/:locationId", (request, response) => {
//   fs.readFile(database, (error, data) => {
//     if (error) throw error
//     const {id, locationId} = request.params
//     const allPokemons = JSON.parse(data)
//     const pokemonLoc = allPokemons.filter((x) => x.id === id)
//     const location = pokemonLoc[0].locations.filter((x) => x.id === locationId)
//     console.log(pokemonLoc)
//     response.status(200).send({
//       success: true,
//       url: "/api/pokemons/{id}/locations/{locationId}",
//       method: "get",
//       pokemon: pokemonLoc[0].name,
//       location: location[0],
//     })
//   })
// })

// api.get("/api/pokemons", (request, response) => {
//   fs.readFile(database, (error, data) => {
//     if (error) throw error

//     const allPokemons = JSON.parse(data)

//     response.status(200).send({
//       success: true,
//       url: "/api/pokemons",
//       method: "get",
//       pokemons: allPokemons,
//     })
//   })
// })

// api.get("/api/pokemons/:id", (request, response) => {
//   fs.readFile(database, (error, data) => {
//     const allPokemons = JSON.parse(data)
//     const pokemon = allPokemons.filter((x) => x.id === request.params.id)
//     response.status(200).send({
//       success: true,
//       url: "/api/pokemons/",
//       method: "get",
//       pokemon: pokemon[0],
//     })
//   })
// })

api.listen(1013, () => {
  console.log("api funcionando en el localhost:1013")
})
