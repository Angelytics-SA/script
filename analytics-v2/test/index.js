// To test the website.
const express = require('express'),
  app = express(),
  port = 3000;

app.use('/', express.static(`${__dirname}`));
// app.get('/', (_, res) => res.sendFile(`${__dirname}/index.html`));

app.listen(port, () => console.log(`Listening on port ${port}`));