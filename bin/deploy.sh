#/bin/bash
deployName=deploy
filenname=website
dest=$dist

if [ ! -e $deployName ];
then
    mkdir $deployName
fi

if [ -z $dist ];
then
    dest=dist
fi

if [ ! -e $dest ]
then
    echo "no $dest file"
    exit 1
fi

tar -zcvf $filenname.tar.gz -C $dest/ .
mv $filenname.tar.gz deploy/
if [ $? -eq 0 ]
then
echo "deploy successful"
else
echo 'deploy wrong'
fi
