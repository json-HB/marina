#/bin/bash
deployName=deploy
filenname=website

if [ ! -e $deployName ];
then
    mkdir $deployName
fi

tar -zcvf $filenname.tar.gz -C dist/ .
mv $filenname.tar.gz deploy/
if [ $? -eq 0 ]
then
echo "deploy successful"
else
echo 'deploy wrong'
fi
