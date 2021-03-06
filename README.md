# angular-editme

Convert your AngularJS input and textarea elements to be edited inline ala [LinkedIn profiles](https://www.linkedin.com/).


![alt text](https://raw.githubusercontent.com/ryandrewjohnson/angular-editme/master/demo/images/angular-editme.gif "angular-editme demo gif")


## Demo

Check out a working example on the [demo page](http://ryandrewjohnson.github.io/angular-editme/).

## Installation

* `npm install angular-editme` or
* `bower install angular-editme` or
* `jspm install npm:angular-editme` or
* Download and add to your html file

## Usage

Add the `shaka-editme` module as a dependency to your Angular app's main module:

##### Installed with global:

```javascript
angular.module('app', ['shaka-editme']);
```

##### Installed with npm:

```javascript
let angular = require('angular');
angular.module('app', [require('angular-editme')]);
```

##### Installed with jspm:

```javascript
import editme from 'angular-editme';
angular.module('app', [editme]);
```


#### Basic example

To convert an existing input element into an editable element wrap it with the `<sk-editme>` directive.

```html
<form name="demo">
  ...
  <sk-editme>
    <editable>
      <input type="text" name="location" ng-model="locale" ng-required="true">
    </editable>
  </sk-editme>

  <sk-editme submit-on-enter-key="false">
    <editable>
      <textarea name="description" ng-model="body" ng-required="true"></textarea>
    </editable>
  </sk-editme>
</form>
```

The `<sk-editme>` directive has the following transclusions:

* (Required) `<editable>` must contain a single `<textarea>` or `<input type="text|url|date|email|week|month|number|time">` element with a valid `ng-model` attribute.
* (Optional) `<static>` may contain the static version of the editable content.


#### Handling invalid input

An editable field in edit-state will remain so until a user enters a valid value. If a user enters an invalid or empty value the field will remain in the edit-state until a valid value is entered. The validity of the field is governed by the `ngModel` validators of the wrapped element.

##### Example:

Will validate user has entered valid email before exiting edit-state.

```html
<sk-editme>
  <editable>
    <input type="email" name="email" ng-model="email" ng-required="true">
  </editable>
</sk-editme>
```

Will validate user has entered only numbers before exiting edit-state.

```html
<sk-editme>
  <editable>
    <input type="text" ng-model="number" name="number" ng-pattern="/\d+/" />
  </editable>
</sk-editme>
```



#### Interacting with directive from your Controller

Given markup styled with [Bootstrap](http://getbootstrap.com/css/#forms-control-validation) we can add the `has-error` class to the `form-group` element when the edmitme directive is invalid, and then remove it when the directive is valid.

index.html
```html
<!--
  on-change - will be triggered when input loses focus and the value is both changed and valid.
  on-invalid - will be triggered when input loses focus and the value is invalid
-->
<div ng-controller="DemoController as demo">
  <div class="form-group" ng-class="{'has-error': demo.isInvalid}">
    <label>Email</label>
    <sk-editme on-change="demo.onChange($value)" on-invalid="demo.onInvalid($error)">
      <editable>
        <input type="email" name="email" ng-model="demo.email">
      </editable>
      <static>
        <code ng-bind="demo.email">
      </code>
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
   * The value arg will be the current valid value from the input.
   * (same as vm.email in this case)
   */
  vm.onChange = (value) => {
    vm.isInvalid = false;
    userService.saveEmail(value);
  };

  /**
   * The $error arg will be the input's ngModel $error object
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
  submit-on-enter-key="{Boolean}"
  submit-on-blur="{Boolean}"
  on-change="{Expression}"
  on-invalid="{Expression}"
  on-state-change="{Expression}"
>
  <editable>
    <!-- form element (required) -->
  </editable>
  <static>
    <!-- display version of editable content (optional) -->
  </static>
</sk-editme>
```

| Name          | Type                 | Description  | Default     |
| ------------- | -------------------- | ------------ | ----------- |
| isEditing     | Boolean              | Can be set to true if you want to start in edit mode | false
| hideIcon      | Boolean              | Will hide pencil icon if set to true | false
| submitOnEnterKey | Boolean           | Set to `false` to disable toggling out of edit mode when the Enter key is pressed, so that multi-line inputs can be entered | true
| submitOnBlur  | Boolean              | Set to `false` to disable toggling out of edit mode when the form element loses focus. Note that you must include a submit button (`<button type="submit">`) in the `<editable />` transclusion slot | true
| onChange      | Expression(Function) | Expression will be evaluated when input loses focus and the entered value is both changed and valid. The valid value is available as $value. | –
| onInvalid     | Expression(Function) | Expression will be evaluated when input loses focus and the entered value is invalid. The ngModel error is available as $error. | –
| onStateChange | Expression(Function) | Expression will be evaluated when the directive changes to and from edit mode. A Boolean value $isEditing is availble to determine the current state. | –



