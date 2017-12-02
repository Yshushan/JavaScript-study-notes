/*字符串*/
String.fromCharCode();
String.fromCodePoint(); //es6
//实例方法
let string="yangshushan";
string.indexOf(searchingString, position);
string.includes(str, [option]pos); //es6 字符串是否包含str，pos指定搜索的起始位置
string.startsWith(str,[option]pos);//es6 字符串是否以str开头，pos指定搜索的起始位置
string.endsWith(str,[option]len); //es6 字符串是否以str结尾，len表示搜索的长度，从第一个字符开始
string.padStart(length,str);//es6 在字符串的前端用str将字符串补全到指定的length长度，返回一个新字符串。
string.padEnd(length,str);//es6 在字符串的后端用str将字符串补全到指定的length长度，返回一个新字符串。

