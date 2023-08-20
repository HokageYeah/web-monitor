#!/usr/bin/env sh
# 检查是否传入了私服地址
if [ $# -eq 0 ]; then
  # 没有传入私服地址，则使用公共服务器
  registry=""
  echo "目标npm公共服务器  📢📢📢"
else
  # 使用传入的私服地址
  registry="--registry $1"
  echo "目标npm私服$registry  📢📢📢"
fi

# 获取 packages 目录下的所有文件夹和文件
packages=$(find packages -maxdepth 1 -type d)
# 循环每一个packages目录
for package in $packages
do
    # 进入package目录
    cd $package
    # 判断是否有package.json文件
    if [ -f "package.json" ]; then
        echo "Publishing $package.....  🚀🚀🚀"
        # 发布 package 到 npm
        npm publish --access public $registry
        if [ $? -eq 0 ]; then
            echo "$package published successfully  🎉🎉🎉"
        else
            echo "Failed to publish $package  ❌❌❌"
        fi
    else
        echo ""
    fi
    # 返回上一级目录 -这个命令会切换到先前工作的目录
    cd -
    # 打印两个空行
    echo
    echo
    echo
done


