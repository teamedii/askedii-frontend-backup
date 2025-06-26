# EDII ASK



1) If Memory Error:  export NODE_OPTIONS=--max_old_space_size=8192
In Windows
1) node --max_old_space_size=8192 ./node_modules/@angular/cli/bin/ng serve


## For Deployment
1) node --max_old_space_size=8192 node_modules/@angular/cli/bin/ng build  --aot=true --configuration production
2) cd dist/
3) aws s3 sync . s3://ask.edii.in1

node --max_old_space_size=8192 node_modules/@angular/cli/bin/ng build  --aot=true --configuration production && cd dist && aws s3 sync . s3://ask.edii.in1

