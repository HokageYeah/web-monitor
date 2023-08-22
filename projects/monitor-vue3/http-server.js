import http from "node:http";
import url from "node:url";

let allMonitorList = [];
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
  setHttpHead(res);
  if (req.method == "OPTIONS") {
    console.log("createServer-----", req.method);
    res.end();
    return;
  } else if (req.method === "GET") {
    handleGetRequest(req, res, path);
  } else if (req.method === "POST") {
    handlePostRequest(req, res, path);
  } else {
    res.statusCode = 405;
    res.writeHead(405, {
      "Content-Type": "text/plain;charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    // res.setHeader("Content-Type", "text/plain");
    res.end("Method Not Allowed");
  }
}
// 处理 GET 请求
function handleGetRequest(req, res, path) {
  switch (path) {
    case "/api/getList":
      res.end(
        JSON.stringify({
          data: [1, 2, 3],
        })
      );
      break;
    case "/api/getAllMonitorList":
      res.end(
        JSON.stringify({
          code: 200,
          data: allMonitorList,
        })
      );
      break;
    default:
      // res.end("你好世界阿斯顿GET");
      // res.statusCode = 404;
      // res.setHeader('Content-Type', 'text/plain');
      res.writeHead(404, {
        "Content-Type": "text/plain;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end("Invalid data format错误了");
      break;
  }
}

// 处理 POST 请求
function handlePostRequest(req, res, path) {
  // if (req.headers["content-type"] !== "application/json") {
  //   res.statusCode = 400;
  //   res.setHeader("Content-Type", "text/plain");
  //   res.end("Invalid data format");
  //   return;
  // }
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      // console.log("查看post请求----", data);
      switch (path) {
        case "/api/reportData":
          console.log("发送消息~~~");
          allMonitorList.push(...data.eventInfo);
          res.end(
            JSON.stringify({
              meaage: "上报成功！",
            })
          );
          break;
        default:
          // res.end("你好世界阿斯顿POST");
          res.writeHead(404, {
            "Content-Type": "text/plain;charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "Content-Type",
          });
          res.end("Invalid data format错误了");
          break;
      }
    } catch (error) {
      // res.statusCode = 400;
      // res.setHeader('Content-Type', 'text/plain');
      // res.end('Invalid data format错误了');
      res.writeHead(404, {
        "Content-Type": "text/plain;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end("Invalid data format错误了");
    }
  });
}
