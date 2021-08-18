
The latest version can be included in your player from this location: -

```
https://files-manywho-com.s3.amazonaws.com/e1dbcceb-070c-4ce6-95b0-ba282aaf4f48/modal.js
https://files-manywho-com.s3.amazonaws.com/e1dbcceb-070c-4ce6-95b0-ba282aaf4f48/modal.css
```

# ModalContainer 

![alt text](https://github.com/MarkWattsBoomi/ModalDialog/blob/main/ModalContainer.png)

A running demo can be seen here: -

https://flow.manywho.com/270413cf-3d82-420b-8432-11bc064f50b4/play/ModalDialog?flow-id=7aa8a3c8-3ab3-48a1-9972-2645d2d030dd

A sharing token of that exaple flow is: -

2ukkQ3036d8/zIsyENo+cPPbOUX/JTyE5X487XqozF8Pz95ZE/ZWUZvrhvrHWVN8


## Functionality

Based on a single boolean Flow Value or Tag, this will pop up a draggable modal dialog based on a page container.

!!! This component hijacks the Chart type container.

The dialog's content is the content of the page container.

The dialog's title, content and buttons are all configuable.


## Container Settings

### Type

Set the container type to "Chart"


### Label

Leave blank !!! important.


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

### tooltip

Optional.

String.

The text to display when the user hovers the main dialog icon.

### title

Optional.

String.

The text to display in the dialog's title bar.


### state

Either the name of a "Tag" or a Flow Value element which contains the boolean display flag.

If it's a Tag then it must be attached to the container in the metadata.



## Outcomes

Add an outcomes component inside the container and name it "ModalOutcomes".

Any outcomes defined and attached to this outcomes component will be rendered as buttons on the dialog.

!!! You are responsible to use an operator on these outcomes to set the boolean display value !!!


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






# ModalDialog

![alt text](https://github.com/MarkWattsBoomi/ModalDialog/blob/main/ModalDialog.png)

A running demo can be seen here: -

https://flow.manywho.com/270413cf-3d82-420b-8432-11bc064f50b4/play/ModalDialog?flow-id=7aa8a3c8-3ab3-48a1-9972-2645d2d030dd

A sharing token of that exaple flow is: -

0x9fg32l5ZoITX3ONAdDsk/F/0XpQ0Od6Kwc/tvVPYYENPHdJZBW7wrjw0ruRg5U


## Functionality

Based on a single boolean Flow Value, the component's state or a Tag, this will pop up a draggable modal dialog.

The dialog's title, content and buttons are all configuable.


## Component Settings

### Width & Height

Width and height if specified control the component's dimensions - in pixels.


### Label

This will be used as the title bar of the Modal Dialog if the "title" attribute is not defined.


### Content

This will be displayed in the client area of the dialog box.


### State

A boolean value which should contain true to show the dialog or false to hide it.

This is used if the "state" attribute is not defined.


### Help Information

Optional.

String.

If set and if there's an icon specified in attributes then this text will be shown as the icon's tool tip when hovered.

Overridden byt the "tooltip" attribute if defined.


## Component Attributes

### classes
Optional.

String.

Like all components, adding a "classes" attribute will cause that string to be added to the base container's class value


### icon

Optional.

String.

The short name of a glyphicon to display to the left of the dialog title.

Defaults to not showing an icon.

### tooltip

Optional.

String.

The text to display when the user hovers the main dialog icon.

### title

Optional.

String.

The text to display in the dialog's title bar.


### state

Either the name of a "Tag" or a Flow Value element which contains the boolean display flag.

If it's a Tag then it must be attached to the container in the metadata.



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


