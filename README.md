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

# Version Log

This is a log of which version of ExpressJS is provided by each version of StringStack/snowflake.

@stringstack/snowflake@0.0.1 => snowflake-sdk@1.1.4
