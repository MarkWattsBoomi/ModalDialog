
The latest version can be included in your player from this location: -

```
https://files-manywho-com.s3.amazonaws.com/e1dbcceb-070c-4ce6-95b0-ba282aaf4f48/modal.js
https://files-manywho-com.s3.amazonaws.com/e1dbcceb-070c-4ce6-95b0-ba282aaf4f48/modal.css
```


# ModalDialog

![alt text](https://github.com/MarkWattsBoomi/ModalDialog/blob/main/ModalDialog.png)

A running demo can be seen here: -

https://flow.manywho.com/270413cf-3d82-420b-8432-11bc064f50b4/play/QRCode/?flow-id=8ccd9aa0-9ae4-4b71-83cb-4355a1e94fb5


## Functionality

Based on a single boolean Flow Value, this will pop up a draggable modal dialog.

The dialog's title, content and buttons are all configuable.


## Component Settings

### Width & Height

Width and height if specified control the component's dimensions - in pixels.


### Label

This will be used as the title bar of the Modal Dialog.


### Content

This will be displayed in the client area of the dialog box.


### State

A boolean value which should contain true to show the dialog or false to hide it.

When the dialog closes it will set the state value to false;


### Help Information

Optional.

String.

If set and if there's an icon specified in attributes then this text will be shown as the icon's tool tip when hovered.


### Component Attributes

#### classes
Optional.

String.

Like all components, adding a "classes" attribute will cause that string to be added to the base container's class value


### icon

Optional.

String.

The short name of a glyphicon to display to the left of the dialog title.

Defaults to not showing an icon.



## Outcomes

Any outcomes defined and attached to the component will be rendered as buttons on the dialog.

### Outcome Properties

#### Label
The outcome's label is used as the button's text.

### Outcome Attributes

### tooltip

Optional.

String.

The text you want displayed when a user hovers over the button.

Defaults to the outcome's label if not defined.

### icon

Optional.

String.

The short name of a glyphicon to display beside the text on the button.

Defaults to not showing an icon.

### noTrigger

Optional.

Boolean.

If "true" then the outcome will not actually be triggered when the corresponding button is pressed.
