# bhallaY.github.io

This repository contains the code and contents of my personal website. It has a somewhat unusual structure to it because I 
do not use Jekyll as my static website generator. The `master` branch consists of only the built contents of my website.
The `develop` branch consists of the code of this website. A travis CI job builds my website and deploys it by commiting
the built resources to the `master` branch. I do this so that I have easy access to my website code and still have the 
built resources for Github Pages without having a weird commit history on `master`. To clarify, this prevents the `master`
git commit history from alternating between website code and built website. 


