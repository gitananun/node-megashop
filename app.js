const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  res.write("<h1>Hi Node</h1>");

  if (req.url == "/") {
    res.write(`<i>You are on the route: ${req.url}</i>`);
    res.write(
      "<form action='/message' method='POST'><input type='text' name='message'><button type='submit'>Send</button></form>"
    );
    return res.end();
  }
  if (req.url == "/message" && req.method == "POST") {
    const body = [];

    req.on("data", (chunk) => body.push(chunk));

    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      fs.writeFileSync("message.txt", parsedBody.split("=")[1]);
    });

    res.setHeader("Location", "/");
    res.statusCode = 302;
    return res.end();
  }
});

server.listen(3000);
