//DOM常用方法与属性
//获取节点
document.getElementById(idValue) | element.getElementById(idValue)
document.getElementsByTagName(tagName) | element.getElementsByTagName(tagName)
document.getElementsByClassName(classValue) | element.getElementsByClassName(classValue) 
document.querySelector(selector) | element.querySelector(selector) //根据选择器选择第一个匹配的元素
document.querySelectorAll(selector) | element.querySelectorAll(selector) //返回NodeList，匹配的所有元素的集合

//创建节点
document.createElement(tagName) //创建元素节点
document.createTextNode(textValue) //创建文本节点
element.cloneNode(boolValue)// true: 深复制  false：浅复制
document.adoptNode(node) //remove and import a node from another document.
document.importNode(node,boolValue) //import a node from another document withpout removing

//获取和修改元素节点属性值
element.getAttribute(attrName)
element.setAttribute(attrName,attrValue)
element.hasAttribute(attrName)
element.removeAttribute(attrName)

//添加、插入、删除、替换节点
parent.appendChild(childElement) //返回新添加节点的引用
parent.insertBefore(newElement,targetElement) //返回新插入节点的引用
parent.removeChild(childElement) //返回被删除节点的引用    
parent.replaceChild(newChild,oldChild) //返回被替换节点的引用

//样式读写操作
element.style.backgroundColor='red'
element.style.xxx //获取xxx样式值，但是只能获取内联样式
element.style.setProperty('color','red')
element.style.removeProperty('color')

//常用属性
document.documentElement //Return the <html> element
document.doctype //Return the document's doctype
document.documentMode //Return the mode used by the browser
document.documentURI //Return the URI of the document 
element.attributes //Return a NamedNodeMap of an element's attributes
element.className //set or return the class name of an element (the value of an element's class attribute).

element.clientHeight / element.clientWidth //return the viewable height/width of an element in pixels,
// including padding, but not the border, scrollbar or margin.

element.offsetHeight / element.offsetWidth //returns the viewable height of an element in pixels,
// including padding, border and scrollbar, but not the margin.

element.scrollHeight / element.scrollWidth //returns the entire height and width of an element in pixels,
// including padding, but not the border, scrollbar or margin, that is not viewable (because of overflow).

element.scrollLeft //set or return the number of pixels an element's content is scrolled horizontally.
element.scrollTop //set or return the number of pixels an element's content is scrolled vertically.

element.nodeName //返回元素节点的标签名,属性节点的属性名，文本节点是#text
element.nodeType //返回节点的类型 1：元素节点 2：属性节点 3：文本节点
element.nodeValue //返回文本节点的文本值，属性节点的属性值，元素节点是undefined或null
element.parentNode //返回节点的父节点
element.nextSibling //返回节点的下一个兄弟节点,包括文本节点
element.previousSibling //返回节点的上一个兄弟节点,包括文本节点
element.firstChild //返回第一个儿子节点, 包括文本节点
element.lastChild //返回最后一个儿子节点。包括文本节点
element.childNodes //返回节点的所有儿子节点数组，包括文本节点

element.parentElment //类似element.parentNode,但是父节点必须是元素节点
element.children //类似element.childNodes，但只返回元素节点
element.firstElementChild //类似element.firstChild，但只返回元素节点
element.lastElementChild  //类似element.lastChild，但只返回元素节点
element.nextElementSibling //类似element.nextSibling，但只返回元素节点
element.previousElementSibling //类似element.previousSibling，但只返回元素节点
element.childElementCount //返回值和element.children.length相等

element.textContent //设置或返回指定节点的文本内容，如果节点内有子节点，同时也返回所有字节的文本内容
                    //设置时会删除节点内部的所有内容
element.innerHTML //设置和返回节点内部的html



element.classList //Return the class name(s) of an element, as a DOMTokenList object.

const classlists=element.classList;

classlists.length //Return the number of classes in the list. This property is read-only

classlists.add(classname1, classname2, more) //Add one or more class names to an element.
// If the specified class already exist, the class will not be added

classlists.contains(classname) //Return a Boolean value, 
//indicating whether an element has the specified class name. 

classlists.item(index) //Return the class name with a specified index number from an element.
//Index starts at 0. Return null if the index is out of range

classlists.remove(classname1, classname2, more) //Remove one or more class names from an element.
//NOTE: Removing a class that does not exist, does NOT throw an error

classlists.toggle(classname, boolValue)
//Toggles between a class name for an element.
//The first parameter removes the specified class from an element, and returns false.
//If the class does not exist, it is added to the element, and the return value is true.
//The optional second parameter is a Boolean value that forces the class to be added or removed, regardless of whether or not it already existed. For example:
//Remove a class: element.classList.toggle("classToRemove", false);
//Add a class: element.classList.toggle("classToAdd", true);

window.scrollBy(x,y) //scroll the document by the specified number of pixels. x and y can be negative value
window.scrollTo(xPos,yPos) // scroll the document to the specified coordinates.

element.addEventListener(eventName,handler,captureMode) 
// captureMode:true   capturing
// captureMode:false  bubbling