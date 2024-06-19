// import { createServer } from 'node:http'

// const server = createServer((request, response) => {
//     response.write("Teste")
//     return response.end()
// })

// server.listen(3333)

import { fastify } from 'fastify'

const server = fastify({
    logger: true  // Opção para ativar o logger do Fastify
  })

server.get('/', async (request, reply) => {
    return "teste home"
})

server.listen({
    port: 3333
})
