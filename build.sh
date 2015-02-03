#!/bin/sh
7z a taskyBird.zip install.rdf chrome.manifest chrome defaults license.txt
value=`cat revision.txt`
value=$((value+1))
echo $value > revision.txt
mkdir -p "../Test Versions/0.1/"; mv *.xpi "../Test Versions/0.1/"
mv taskyBird.zip taskyBird-tb-pb-sm-0.1pre"$value".xpi
