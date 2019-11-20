const server = require("./server.js")

const PORT = process.env.port || 4000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`)
})