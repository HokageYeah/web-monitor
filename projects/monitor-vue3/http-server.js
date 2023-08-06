import http from "node:http";
import url from "node:url";

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  if (path === "/favicon.ico") {
    // 处理 /favicon.ico 请求
    res.writeHead(204); // 回应一个空响应
    res.end();
  } else {
    console.log("查看请求----", path);
    setHttpHead(res);
    setHttpRequest(req, res, path);
  }
});
server.on("clientError", (err, socket) => {
  socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
});
server.listen(8080, () => {
  // 拼接打印请求地址
  // http://localhost:8080/

  console.log("opened server on请求", server.address());
  console.log(`Server is running at http://localhost:${server.address().port}`);
});

// 设置请求头
function setHttpHead(res) {
  res.writeHead(200, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Content-Type": "application/json;charset=utf-8",
    "Access-Control-Allow-Headers": "Content-Type",
  });
}

// 请求与逻辑
function setHttpRequest(req, res, path) {
  console.log(path);
  switch (path) {
    case "/getList":
      res.end(
        JSON.stringify({
          data: [1, 2, 3],
        })
      );
      break;
    default:
      res.end("你好世界阿斯顿");
      break;
  }
}
