# angular-editme

Allows your AngularJS `<input>` and `<textarea>` elements to be edited inline ala [LinkedIn profiles](https://www.linkedin.com/).

## Demo

Check out a working example on the [demo page]().

## Installation

* install npm
* install bower
* install jspm

## Usage

Add the `shaka-editme` as a dependency to your Angular app's main module:

```javascript
angular.module('app', ['shaka-editme']);
```

#### Basic example

To transform an existing form element into an editable element wrap it with the `<sk-editme>` directive. 

```html
<form name="demo">
  ...
  <sk-editme>
    <input type="text" name="location" ng-model="locale" ng-required="true">
  </sk-editme>
  
  <sk-editme>
    <input type="text" name="description" ng-model="body" ng-required="true">
  </sk-editme>
</form>
```

The `<sk-editme>` directive has the following requirements:

* It must wrap a single `<textarea>` or `<input type="text|url|date|email|week|month|number|time">` element.
* The element that it wraps must have a valid `ng-model` attirbute.
* The directive has to be contained in a parent `<form>` element.
* It's recommended that the wrapped element have a valid `name` attribute. This will help with validation.



#### Handling invalid input

A field in edit mode will remain in this state until a user enters a valid value. If a user enters an invalid or empty value the field will remain in edit mode until it passes validation. The validity of the field is governed by the `ngModel` validators of the wrapped element.

##### Example:

Will not exit edit mode until valid email is entered.

```html
<sk-editme>
  <input type="email" name="email" ng-model="email">
</sk-editme>
```

Will not exit edit mode until only numbers entered.

```html
<sk-editme>
  <input type="text" ng-model="number" name="number" ng-pattern="/\d+/" />
</sk-editme>
```



#### Interacting with directive from your Controller

Given markup styled with [Bootstrap](http://getbootstrap.com/css/#forms-control-validation) we can add the `has-error` class to the `form-group` element when the edmitme directive is invalid, and then remove it when the directive is valid.

index.html
```html
<!-- 
  on-change - will be triggered when input loses focus and the value is valid
  on-invalid - will be triggered when input loses focus and the value is invalid
-->
<div ng-controller="DemoController as demo">
  <div class="form-group" ng-class="{'has-error': demo.isInvalid}">
    <label>Email</label>
    <sk-editme on-change="demo.onChange($value)" on-invalid="demo.onInvalid($error)">
      <input type="email" name="email" ng-model="demo.email">
    </sk-editme>
  </div>
</div>
```

demo.controller.js
```javascript
.controller('DemoController', function(userService) {
  let vm = this;
  
  vm.email = 'myemail@email.com';
  vm.isInvalid = false;
  
  /**
   * The value arg will be the valid value from the input
   */
  vm.onChange = (value) => {
    vm.isInvalid = false;
    userService.saveEmail(value);
  };
  
  /**
   * The $error arg will be the element's ngModel $error object
   * See $error in https://docs.angularjs.org/api/ng/type/form.FormController
   */
  vm.onInvalid = ($error) => {
    vm.isInvalid = true;
  };
})
```


## API

All properties are optional.

```html
<sk-editme
  is-editing="{Boolean}"
  hide-icon="{Boolean}"
  on-change="{Expression}"
  on-invalid="{Expression}"
  on-state-change="{Expression}"
>
</sk-editme>
```

| Name          | Type                 | Description  | Default     |
| ------------- |:---------------------| -------------| ------------|
| isEditing     | Boolean              | Can be set to true if you want to start in edit mode | false
| hideIcon      | Boolean              |  Will hide pencil icon if set to true | false
| onChange      | Expression(Function) | Expression will be evaluated when input loses focus and the entered value is valid. The valid value is available as $value. | –
| onInvalid     | Expression(Function) | Expression will be evaluated when input loses focus and the entered value is invalid. The ngModel error is available as $error. | –
| onStateChange | Expression(Function) | Expression will be evaluated when the directive changes to and from edit mode. A Boolean value $isEditing is availble to determine the current state. | –



