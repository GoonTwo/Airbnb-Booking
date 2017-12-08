const express = require('express');
const app = express(); 

const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('HELLO WORLD');
})

app.listen(PORT, () => console.log(`server listening on PORT ${PORT}`))

module.exports = app;