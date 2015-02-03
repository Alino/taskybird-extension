"C:\Program Files\7-Zip\7z" a -xr!.svn taskyBird.zip install.rdf chrome.manifest chrome defaults license.txt
set /P taskyBirdRev=<revision.txt
set /a taskyBirdRev+=1
echo %taskyBirdRev% > revision.txt
move *.xpi "..\Test Versions\0.1\"
rename taskyBird.zip taskyBird-tb-pb-sm-0.1pre%taskyBirdRev%.xpi