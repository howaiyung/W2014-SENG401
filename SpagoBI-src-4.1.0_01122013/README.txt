            ===================================================
                      SpagoBI 4.1.0 source code
            ===================================================
            
You have to compile SpagoBI 4.1.0 source code with Apache Ant (http://ant.apache.org/).

This package contains SpagoBI 4.1.0 source code.
Unzip this package on your pc on a folder that we will call BASE_DIR.

Edit file 
    BASE_DIR/SpagoBI-src-4.0.0_xxxxxxxx/ant-files/SpagoBI-4.x-source/ant/build.properties
change "tomcat.home" property to your tomcat installation folder.
    (use "/" path separator also on Windows environment, not "\")

Then run the command (from BASE_DIR/SpagoBI-src-4.0.0_xxxxxxxx/ant-files/SpagoBI-4.x-source/ant folder):
    ant deploy.all
this command will compile SpagoBI source code and deploy produced war files indise the Tomcat installation, on your tomcat.home /webapps folder.
    
Then you can start SpagoBI 4.1 Demo.