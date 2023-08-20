import { execSync, spawn } from "child_process";
const privateM = "./scripts/publish-npm.sh";
const publicM = "./scripts/publish-npm.sh";
const argv = process.argv[2];
if (argv) {
  spawn("bash", [privateM, "http://localhost:4873/"], {
    stdio: "inherit", // 将标准输入重定向到 /dev/null
  });
} else {
  spawn("bash", [publicM], {
    stdio: "inherit", // 将标准输入重定向到 /dev/null
  });
}
console.log(process.argv);
