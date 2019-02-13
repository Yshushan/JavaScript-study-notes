### 变量（Variables）

变量以 `$` 开头，分全局变量和局部变量，在嵌套规则内定义的变量为局部变量，只能在该嵌套规则内使用

可以通过添加 `!global` 声明，将局部变量转换成全局变量

```scss
// 全局变量
$color: red;
#main {
  // 局部变量
  $width: 10px;
  width: $width;
  color: $color;
  border: $border;
}

#siderbar {
  // 将局部变量转换成全局变量
  $border: 1px solid blue !global;
  border: $border;
}

#footer {
  border: $border;
}
```

Variable names (and all other Sass identifier) can use hyphens and underscores interchangeably. For example, if you define a variable called `$main-width`, you can access it as `$main_width`, and vice versa.

### 属性嵌套（Nested Properties）

```scss
.para {
  font: {
    family: fantasy;
    size: 30em;
    weight: bold;
  }
}
```
编译成:
```css 
.para {
  font-family: fantasy;
  font-size: 30em;
  font-weight: bold;
}
```
### Placeholder Selector

Sass supports a special type of selector called a "placeholder selector". These look like class and id selector, except the "#" or "." is replaced by "%"

## Data Types

Sass supports seven main data types: 
  - numbers (`1, 2.3, 10px`) 
  - strings of text, with and without quotes (`"foo", 'bar', baz`) 
  - colors (`blue, #aa4bcc, rgba(34, 53, 22, 0.7) `) 
  - booleans (`true,false`) 
  - nulls (`null`) 
  - lists of values, separated by spaces or commas (`1.6em 1em 0.3em` or `Helvetica, Arial, sans-serif`);
  - maps (`(key1: value1, key2: value2)`)
