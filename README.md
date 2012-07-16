Version 0.99

The Gist
========

Kickstrap uses the latest version of Twitter's bootstrap (http://twitter.github.com/bootstrap) and adds a layer of extras to create slick web applications with themes, modern html/css standards, an icon font, and progressive enhancement through javascript.

Quick Start
===========

1. Kickstrap is no-install and zero-config. Just download Kickstrap and open index.html from your server.
(Must be run at an http:// address; either public or localhost. I recommend using MAMP and VirtualHostX)

Unlike earlier releases, Kickstrap 1.0 does not require a LESS compiler. In fact, <strong>it doesn't require anything</strong> provided you can host it on a server. Kickstrap uses a client side less.js file to compile your less files for the browser.
If you'd rather use plain CSS, the included build script (requires Java) will do this for you. (More on that later).

Configuration
=============

1. We've made it easy for you to customize your site using just two files: settings.less and theme.less. Settings controls things like the prepackaged theme you're using (if you want to use one), turning the console on and off, the included console tools (see below), and add-ons.
Your theme file is for writing your own custom css. If you're starting a new site, you may want to use this file to adjust the way your prepackaged theme looks or remove that theme and adjust the default Bootstrap theme.

Add-ons
=======

In the new Kickstrap, you get to choose from an enormous library of jQuery plugins to install on your site. To do so, simply write in the name of the add-on to your comma-separated list in settings.

```@addOns: "addon1, addon2, addon3";```

The name should match the folder name of the add-on in the Kickstrap/extras folder. To verify it has loaded, open the console on your site and look for "Loading add-on "[your add-on here]"

Console Tools
=============

A new feature we're testing in Kickstrap 1.0 are the console tools, turned on by default. This makes your Google Chrome console into a sort of instant messenger for your web application. 
Besides notifying you of your website's status, you can also talk back. Here are some features:

- ```clearCache()``` Clears your LESS cache. You can also turn off the cache in settings.less
- ```setColor()``` Start using the color scheming tool by choosing a color. Accepts plain english colors (e.g. "red") and hex, hsv, hsl, and rgb. Place in quotes as such: ```setColor('orange')```
- ```get()``` Get your current color in a different format, hsv, hex, hsl, or rgb. E.g. ```get(hex)```
- ```getMono()``` Create a monochromatic color scheme for your chosen color. For these and others, you can also force this to return in a different format, e.g. ```getMono('rgb')```
- ```getTriad()``` Create triad scheme around chosen color.
- ```getTetrad()``` Create tetrad scheme around chosen color.
- ```getSplit()```  Create split complement scheme around chosen color.
- ```getAnalogous``` Create analogous scheme around chosen color.
- ```togglePreview``` Show or hide the color schemer.

To try any of these, just open the console on your Kickstrap website.

Build Script
============

The build script is an awesome project originally part of HTML5 Boilerplate: https://github.com/h5bp/ant-build-script

To use in Kickstrap, open a terminal and proceed with the following:
<ol>
  <li>Type "cd " (don't forget the space).</li>
  <li>Drag the build folder into the terminal. You should now see the path copied in. Press enter.</li>
  <li>Type "ant build" and press enter.</li>
</ol>

The ant build script may take a while on the first run. When it's finished, you should see a "public" folder in your root. This is what you should upload as your finished site.

<strong>What does it do?</strong>

The build script does a number of things. Here it is in order:
<ol>
  <li>Minifies your JS.</li>
  <li>Concatenates minified JS into a single file.</li>
  <li>Updates links in HTML to the new JS file.</li>
  <li>Turns off Kickstrap's console-writing and console tools if left on.</li>
  <li>Compiles all your LESS files to CSS.</li>
  <li>Updates LESS link in HTML to link to new CSS file.</li>
  <li>Removes less.js from HTML.</li>
  <li>Removes html comments from files.</li>
  <li>Optimizes images.</li>
  <li>Deletes LESS files.</li>
  <li>Copies root goodies to root.</li>
  <li>Deletes build folder.</li>
</ol>

This is all done in the public folder, so none of your original files are changed.
You'll end up with an expertly-crafted web structure for fast page speed, error-handling, and SEO optimization.
