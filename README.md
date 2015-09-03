# Lightbox
An image display script designed with progressive enhancement in mind.

**Powered by CSS3 & jQuery**

***
### About
This plugin has been made available on GitHub in an attempt to stop myself from re-writing it with every new project that requires a lightbox.

Why do I re-write it everytime? Because I like the challenege of making each incarnation better and more refined but it’s gotten to the point where each build turns out more-or-less identical to the last.

**It is a simple script that does exactly what I need it to do.**

***
### Usage
The main aim of this script is to take a hyperlink that normally forwards to an image file, override that default behaviour using the power of javascript and load the image within a lightbox via ajax.

**At it’s most basic all you need to do is insert a data attribute on the hyperlink that points to an image file.**

```
<a href=”image.jpg” data-lightbox>click me to view image</a>
```

***
##### Groups
Did you notice there is no value to the ‘data-lightbox’ attribute in the example above?

Without a value with the data-lightbox attribute that image will load as a single image, it won’t interact with any other lightbox links. It will simply open a lightbox and load that single image.

If you would like to open a lightbox with multiple images that the user can change via previous and next buttons then you need to add a group name by adding a value to the data-lightbox attribute.

```
<a href=”image.jpg” data-lightbox=”group1”>click me to view all images in this group</a>
<a href=”image.jpg” data-lightbox=”group1”>click me to view all images in this group</a>
```

***
### Demo
Available here: [Live Demo](http://plugins.ozpital.com/lightbox)
