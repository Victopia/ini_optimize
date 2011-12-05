#ini_optimize.js
##Installation

This is a node.js script, you must install node before using this script.

Releases of Node.js can be downloaded from http://nodejs.org, you may also 
compile it yourself from its github repository https://github.com/joyent/node.

##Usage:
This script takes two arguemnts, input path and output path.
`node ini_trim.js ~/foo/bar.ini ~/result.ini`

The second argument is optional, "result.txt" will be used as default if omitted.
Note that the file will be written in the current working directory.
`node ini_trim.js ~/foo/bar.ini`

##Example input
```
[TAG_C]
Xmx=1024m
Xms=128m

[TAG_A]
JAVA_HOME=/jdk160_14_R27.6.5-32
foo=bar

[TAG_B]
force_quit=0

[TAG_A]
foo=another_value

[TAG_C]
document_root=/xampp/htdocs
```

##Example output
```
[TAG_A]
JAVA_HOME=/jdk160_14_R27.6.5-32
foo=another_value

[TAG_B]
force_quit=0

[TAG_C]
Xmx=1024m
Xms=128m
document_root=/xampp/htdocs
```