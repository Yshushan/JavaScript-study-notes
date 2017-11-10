//JavaScript五大基本原始类型：
Number
String
Boolean 
Undefined
Null 

//基本数据类型的值保存在栈内存中，占有固定大小的空间。
//引用数据类型的值保存在堆内存中，占据空间大小不确定。
//引用数据类型的变量保存的是指向该堆数据的指针。
//当把一个引用类型的变量复制给另一个变量时，后者得到的是指针的拷贝，两个变量指向同一份堆数据。

//ECMAScript中所有函数的参数都是值传递。即使传递引用类型的变量，也是值传递，即传递指针的拷贝。
//ECMAScript中所有函数都是Function类型的实例对象。没有函数重载的概念，后定义的函数会覆盖前面定义的同名函数：
var myfunc=new Function("prop1","prop2","function code1");
var myfunc=new Function("Prop3","function code2"); 
//myfunc失去与第一个函数对象的联系，而指向当前的对象，所以不存在重载的情况。
//ECMAScript中所有函数都有两个内部属性：arguments和this
	//arguments是个类数组对象，包含传入函数的所有参数。arguments有一个属性callee，它指向当前函数
	//this是函数在执行时所处的作用域
//ECMAScript中所有函数都包含length和prototype属性
	//length属性表示函数希望接受的命名参数的个数
	//prototype属性指向该函数的原型对象
//每个函数都包含两个非继承而来的方法：apply()和call(), 这两个方法的用途都是在特定的作用域中调用函数
	//apply()接受两个参数，第一个代表函数在哪个环境中执行，第二个是参数数组，或者执行函数的arguments。
	function fun1(arg1,arg2){
		fun2.apply(this,[arg1,arg2]);
		//or fun2.apply(arguments);
	}
	//call()第一个参数与apply()相同，其余参数需要一一列出
	function fun1(arg1,arg2){
		func2.call(this,arg1,arg2);
	}
	var color="red";
	var obj={color:"blue"};
	function sayColor(){
		alert(this.color);
	}
	sayColor();//red;
	sayColor(this);//red  在全局环境中执行
	sayColor.call(obj);//blue 在obj中执行


typeof 运算符确定一个变量的数据类型（string, number, boolean, undefined, object)
//注意：如果变量的值是null或者一个对象，typeof都返回object。用typeof检测函数时，返回"function"

//JavaScript没有块级作用域，只有函数作用域。

//常用数组Array方法：
join(ch) //将数组每一项通过分隔符ch连结成字符串
push(newItems)
pop() //弹出最后一项
shift() //弹出第一项
unshift(newItems)
concat(values) //先创建数组的一个副本，再将接受的参数连结到副本中，最后返回该副本。
slice(start,end) //返回参数指定的部分数组,即：[start,end) or [start,array.length)（如果不指定第二个参数）
splice(start,count,items) //该方法始终返回被删除项组成的数组
	splice(start,count) //从start位置开始，删除count项
	splice(start,count,items) //从start位置开始，删除count项，然后插入items。（如果不删除只插入，把第二个参数设为0）
reverse()
sort(compare) //sort()默认调用数组每一项的toString()方法进行升序排列。

//正则表达式中需要转义的字符：
( [ { \ $ ^ | . * + ? } ] )


//Date对象常用方法
toLocaleString();
toString();
valueOf(); //返回日期毫秒数，可用于比较时间
getTime();//返回日期毫秒数
setTime(milliseconds); //以毫秒数设定日期
getFullYear(); //获得4位数年份
getMonth();//返回月份 0-11
setMonth();
getDate();//1-31
setDate();
getDay();//0-6
getHours();//0-23
getMinutes();//0-59
getSeconds();//0-59
getMilliseconds();

//字符串常用方法：
charAt(index)
charCodeAt(index)
concat(newString1,newString2,...)
slice(startPosition,optionalEndPosition) //当参数出现负值时，转换成负值加字符串的长度
substring(startPosition,optionalEndPosition) //所有负值参数都转换为0
substr(startPosition,optionalNumberOfChars) //当第一个参数是负值时加上字符串的长度，第二个参数时负值时转换为0
indexOf(str,optionalSearchStartPosition) //没找到str,返回-1，否者返回第一次出现位置
lastIndexOf(str,optionalSearchStartPosition)
toLowerCase()
toUpperCase()
match(pattern) //返回匹配项组成的数组
search(pattern) //返回一个匹配项的索引，否则返回-1，该方法忽略全局匹配标志g
replace(patternOrString,newString) //第一个参数可以是正则表达式或者字符串，若是字符串则只替换匹配的第一个项。
split(strOrPattern,optionalSize); //用指定的字符串或模式分割字符串，第二个参数可选，为分割后数组的大小
String.fromCharCode(charCode)//String的静态方法，将一个（多个）字符编码转化成字符（字符串）


//global 方法
isNaN();
isFinite();
parseFloat();
parseInt();
encodeURI(); //不会对本身属于URI的特殊字符编码
encodeURIComponent() //对所有非标准字符编码
decodeURI(); //与encodeURI()配对
decodeURIComponent()//与encodeURIComponent()配对
eval(codeString) //接受一个代码字符串参数，解析器在调用eval时，会将字符串解析为真正的ECMAScript语句，并执行

//Math对象
Math.ceil();
Math.floor();
Math.round();
Math.random(); //返回0-1之间随机数，不包含0和1
Math.max();
Math.min();
//产生任意两个整数之间的随机数，包括边界
function generateRandomValue(lowerValue,upperValue){
	var numbers=upperValue-lowerValue+1;
	return Math.floor(Math.random()*numbers+lowerValue);
}




//创建对象的方法：
//1、工厂模式  缺点：无法识别一个对象的类型
function createPerson(name,age,gender)
{
	var obj=new object();
	obj.name=name;
	obj.age=age;
	obj.gender=gender;
	obj.sayName=function(){
		alert(this.name);
	}
	return obj;
}
var person1=createPerson("yangshushan",25,"male");
person1.sayName(); //"yangshushan"



//2、构造函数模式  缺点：每个对象实例都拥有各自的一套方法，浪费资源
function Person(name,age,gender)
{
	this.name=name;
	this.age=age;
	this.gender=gender;
	this.sayName=function(){
		alert(this.name);
	}
}
var person1=new Person("yangshushan",25,"male");
var person2=new Person("Susan",23,"female");
alert(person1.sayName==person2.sayName); //false 两个对象的sayName是不同的实例
//构造函数其它用法
	//直接调用构造函数
	Person("Lucy",13,"female"); //添加到全局对象window；
	window.sayName(); //Lucy
	
	//在某个对象中调用
	var o={};
	Person.call(o,"Jack",34,"male"); //在对象o中调用
	o.sayName(); //Jack,  o获得全部的方法和属性


	
//3、原型模式
//每一个构造函数都有一个prototype属性，它也是一个对象，
//包含该构造函数创建的所有实例对象所共有的方法和属性（与C++里的基类的作用相似）
//即让所有对象实例共享某些方法和属性。
//prototype对象中有一个constructor属性，它指向与它关联的那个构造函数，即：Person.prototype.constructor==Person
//构造函数创建的每一个实例对象都拥有一个指向原型对象的指针。（注意：实例的指针指向原型对象，而非它的构造函数）

function Person(){} //构造函数不做任何事，只创建空对象。
//将所有方法和属性放到原型对象里， 这样所有实例将共享所有的方法和字段
Person.prototype.name="yangshushan"; 
Person.prototype.age=25;
Person.prototype.gender="male"
Person.prototype.sayName=function(){
	alert(this,name);
}
//或者这样写
Person.prototype={
	name: "yangshushan",
	age: "25",
	gender: "male",
	sayName: function(){
		alert(this.name);
	} 
}
//但是这样相当于完全重写了默认的prototype对象，
//因此它的constructor属性将不再指向Person构造函数，而是指向Object构造函数
//如果在构造函数创建对象之后，完全重写了prototype原型对象，那么新原型对象中的方法，之前创建的对象是无法调用的，
//因为之前创建的对象中的指针还指向最初的原始原型对象。即切断了现有实例与新原型之间的联系

var person1=new Person();
person1.sayName(); //"yangshushan"  调用原型对象里方法
var person2=new Person();
person2.sayName(); //"yangshushan"

//在实例中添加的属性会覆盖原型中的同名属性
person1.name="Frank";//覆盖原型中的name属性
alert(person1.name); //"Frank"
alert(person1.hasOwnProperty("name"));//true;
delete person1.name; //删除实例中的属性，不影响原型中的同名属性
alert(person1.name);//"yangshushan"
alert(person1.hasOwnProperty("name"));//false;
//hasOwnProperty(propName)方法只有当该属性属于实例时才返回true
//而in操作符：propName in instance，只要能访问到给定属性，就返回true，不论存在于实例中还是原型中；
alert("age" in person1); //true;

//4、混合模式（构造函数+原型）
	function Person(name,age,gender,country){ //在构造函数中添加各个实例对象不共享的字段属性
		this.name=name;
		this.age=age;
		this.gender=gender;
		this.country=country;
	}
	Person.prototype.sayName=function(){ //在原型中添加共享的方法属性
		console.log("Hello, "+this.name+"!");
	}
	Person.prototype.sayInfo=function(){
		if(this.gender=="male")
			var sex="boy";
		else
			sex="girl";
		console.log(this.name+" is a "+sex+", "+this.age+" years old, and come from "+this.country+".");
	}
	var person1=new Person("yangshushan",25,"male","China");
	var person2=new Person("Susan",23,"female","USA");
	
	
//继承











//Ajax + JSON

Ajax //Asyncronous JavaScript + XML 
XHR: //XMLHttpRequest

var XHR=new XMLHttpRequest(); //获取XMLHttpRequest对象
XHR.open(method,url,isAsync); //method:get/post 发送请求的方法  url:请求的url  isAsync:true/false 是否异步发送请求
							//open方法并不会真正发送请求，只是启动一个请求
XHR.sent(data); //发送请求，data:发送到服务器端的数据，如果不需要发送数据，data必须设置为null
//如果请求是同步的，即open方法的第三个参数设置为false，javascript代码会等到服务器响应之后再继续执行。
//在收到服务器的响应之后，响应的数据会自动填充XHR的特定属性，如下：
responseText //保存文本格式的响应数据，响应的主体内容
responseXML //保存XML类型的响应数据，XML DOM文档
status //响应的HTTP状态  200：成功  304：请求的资源并没有被修改
statusText //HTTP状态的说明

//多数情况下我们应该发送异步请求，让javascript继续执行，而不是等待响应。
//这时我们可以通过检测XHR的readyState属性来判断响应处于什么状态
//readyState属性有4个取值：
// 0：未初始化，即还未调用open方法
// 1：已经调用open方法，但还未调用sent方法
// 2：已发送请求，但还未收到响应
// 3：已经接收到部分响应
// 4：响应接收完毕，接收到的数据已经可以在客户端使
//每当readyState属相的状态值发生改变时，都会触发onreadystatechange事件，
//通过监听onreadystatechange事件来判断请求所处的阶段

XHR.abort();//在接收到响应之前调用该方法可以取消异步请求

//请求方法：
//get请求，常用于向服务器查询某些信息，可将查询字符串参数追加到url的末尾（必须先经过encodeURIComponent()方法编码）
//post请求，通常用于向服务器发送应该被保存的数据，且数据应该作为请求的主体提交，即作为sent方法的参数提交


JSON //JavaScript Object Notation
//JSON是一种数据格式，类似javascript中的数组和对象字面量，但是属性名必须用双引号引起来




//作用域安全的构造函数
//通常的构造函数，如果调用时不使用new，那么this对象会绑定到全局作用域window上
function Person(name,age,job){
	this.name=name;
	this.age=age;
	this.job=job;
}
var person1=Person("Jack",22,"teacher") //不使用new
person1.name //error, person1 is undefined
window.name //Jack
window.age //22
window.job //teacher
//这样全局作用域会受到污染
//可以如下解决这个问题
function Person(name,age,job){
	if(this instanceof Person){
		this.name=name;
		this.age=age;
		this.job=job;
		this.sayName=function(){
			console.log(this.name);
		}
	else{
		return new Person(name,age,job);
	}
}
var person1=new Person("Jack",22,teacher);//is ok
var person2=Person("Mary",22,"singer"); //is ok












