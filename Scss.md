### 变量 $
变量以 `$` 开头，分全局变量和局部变量，在嵌套规则内定义的变量为局部变量，只能在该嵌套规则内使用

可以通过添加 `!global` 声明，将局部变量转换成全局变量
``` scss
// 全局变量
$color: red

#main {
    // 局部变量
    $width: 10px;
    width: $width;
    color: $color;
    border: $border
}

#siderbar {
    // 将局部变量转换成全局变量
    $border: 1px solid blue !global;
    border: $border;
}
```