# StringStack Snowflake

StringStack/snowflake is a component container for snowflake-sdk that allows you to easily include the snowflake  
connectivity in your StringStack application.

# Installation

```bash
npm install @stringstack/snowflake --save
```

This will also install snowflake-sdk for you. See the version log at the end of this document to see which version of 
snowflake-sdk is provided with each version of StringStack/snowflake. 

# Configuration

StringStack/snowflake looks for configuration in the nconf container provided by StringStack/core. Store the configuration
in nconf at the path ```stringstack:snowflake```.

# Testing

You will need your own Snowflake account. Tests simply run read only queries to ensure the framework is functioning. One
such query is ```show databases;```. The purposes of the tests are to ensure the component complies with StringStack
patterns and to ensure that the component manages the underlying Snowflake connections. It is up to the underlying 
snowflake-sdk driver to implement more robust tests.

```bash
export NODE_SNOWFLAKE_ACCOUNT_TESTING='<your snowflake account>'
export NODE_SNOWFLAKE_USERNAME_TESTING='<your snowflake username>'
export NODE_SNOWFLAKE_PASSWORD_TESTING='<your snowflake password>'
export NODE_SNOWFLAKE_REGION_TESTING='<your snowflake region>'
npm test
```

# Version Log

This is a log of which version of ExpressJS is provided by each version of StringStack/snowflake.

@stringstack/snowflake@0.0.1 => snowflake-sdk@1.1.4
