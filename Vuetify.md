## Icons
### [Google Material Design](https://material.io/tools/icons/?style=baseline)
#### Install
##### CDN
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Material+Icons">
```
##### NPM
```js
npm install material-design-icons-iconfont -D  //非官方库

//main.js
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuetify, {
    iconfont: 'md'
})
```
#### Usage
```html
<v-icon>{name}</v-icon>
```
### Material Design Icons
#### Install
##### NPM
```js
npm install @mdi/font -D

//main.js
import Vue from 'vue'
import Vuetify from 'vuetify'
import '@mdi/font/css/material-design-icons.css'

Vue.use(Vuetify, {
    iconfont: 'mdi'
})
```
#### Usage
```html
<v-icon>mdi-{name}</v-icon>
```
### Font Awesome 5
#### Install
##### CND
```html
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.1/css/all.css">
```
##### NPM
```js
npm install @fortawesome/fontawesome-free -D

//main.js
import Vue from 'vue'
import Vuetify from 'vuetify'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.use(Vuetify, {
    iconfont: 'fa'
})
```
#### Usage
```html
<v-icon>fas fa-{name}</v-icon>
<v-icon>fab fa-{name}</v-icon>
```

