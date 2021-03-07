const path = require('path');
const fs = require('fs');

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
      res.setHeader('content-type', 'text/html');
      res.write(data);
      return res.end();
    });
  }

  if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', chunk => {
      body.push(chunk);
      console.log(chunk);
    });

    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];

      console.log(parsedBody);

      fs.writeFile('message.txt', message, err => {
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }
};

module.exports = requestHandler;
