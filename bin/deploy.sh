#/bin/bash
deployName=deploy
filenname=website
dest=$1
server=$server

echo "Is start server $server"
echo "server dist is $dest"

testServer() {
  cd $deployName
  tar -xvf $filenname.tar.gz -C .
  cd -
  dist=$deployName gulp server
}

rm -rf $deployName
if [ $? -eq '0' ]
then
    echo "delete $deployName success!"
fi

if [ ! -e $deployName ];
then
    mkdir $deployName
fi

if [ -z $dest ];
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
echo "tar successful"
if [[  -n $server && $server -eq "true" ]]
then
testServer
fi
else
echo 'tar wrong'
fi
