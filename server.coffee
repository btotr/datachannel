express = require 'express'
app = express()

app.use express.static './public'

app.get '/offerer', (req, res) ->
    res.render 'index.jade'

app.get '/answerer', (req, res) ->
    res.render 'answerer.jade'

server =  app.listen 2626