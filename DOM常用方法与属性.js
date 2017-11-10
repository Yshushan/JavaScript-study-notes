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
element.cloneNode(boolValue)// true: 深复制（但不会复制属性）  false：浅复制

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