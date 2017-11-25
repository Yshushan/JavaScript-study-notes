//The Widow Object

//Window Size
window.innerHeight //return the inner height of the browser window (in pixels)
window.innerWidth //return the inner width of the browser window (in pixels)
//For Internet Explorer 8, 7, 6, 5:
document.documentElement.clientHeight
docuemnt.documentElement.clientWidth
//or
document.body.clientHeight
document.body.clientWidth

//Window Methods
window.open() //open a new window
window.close() //close the current window
window.moveTo() //move the current window
window.resizeTo() //resize the current window

//Window Location
//The window.location object can be written without the window prefix.

location.href //return the href (URL) of the current page
location.hostname //return the domain name of the web host
location.pathname //return the path and filename of the current page
location.protocol //return the web protocol used (http:// or https://)
location.assign(url) //loads a new document

//Window History
//The window.history object can be written without the window prefix.
history.back() //same as clicking back in the browser
history.forward() //same as clicking forward in the browser 