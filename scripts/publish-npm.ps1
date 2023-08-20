#!/usr/bin/env pwsh

# 检查是否传入了私服地址
if ($args.Count -eq 0) {
    # 没有传入私服地址，则使用公共服务器
    $registry = ""
    Write-Output "--------------Public NPM-------------- "
}
else {
    # 使用传入的私服地址
    $registry = $args[0]
    Write-Output "--------------Private NPM $args !--------------"
}

# 获取 packages 目录下的所有文件夹和文件
$folders = Get-ChildItem -Path "packages" -Directory

foreach ($folder in $folders) {
    $folderName = $folder.Name
    Write-Output "Publishing $folderName ............"

    # # 进入 package 目录
    Set-Location $folder.FullName

    echo  $registry
    
    npm publish --access public --registry $registry

    if ($LASTEXITCODE -eq 0) {
        Write-Output "--------------$folderName published successfully!--------------"
    } else {
        Write-Output "--------------Failed to publish $folderName!---------------"
    }

    # # 打印空行
    Write-Output "`n`n"
}