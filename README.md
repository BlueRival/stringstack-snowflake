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

StringStack/snowflake allows you to have an unlimited number of connections. Each connection has a name. In this schema
example we have one connection named 'example'. Each connection requires account, username, password and region. The
other fields are optional according to https://docs.snowflake.net/manuals/user-guide/nodejs-driver-use.html. The object
for each named connection is passed to snowflake.createConnection() directly.

```json
{
  "connections": {
    "example": {
      "account": "string",
      "username": "string",
      "password": "string",
      "region": "string",
      "database": "string [optional]",
      "schema": "string [optional]",
      "warehouse": "string [optional]",
      "role": "string [optional]"
    }
  }
}
```

# Usage

The component provides a very minimal interface to snowflake-sdk. The component will lazy establish connections, cache
connections in a connection pool, and disconnect from any used connections on dinit.

## getConnection( connectionName, done )

Given a connection name, will return a connection configured with the options in the connections section of config.

The connection will be connected and ready for queries immediately once done() is called. Do anything with this that
you would do with a raw snowflake-sdk connection return to the callback to connect();

If you would like a little syntactic sugar, use StringStack/snowflake.execute() and StringStack/snowflake.stream(). Both
of these methods will manage connections for you and expose all the underlying execution power. 

## execute( connectionName, query, done )

Will automatically connect to the connection identified by connectionName, and will execute the provided query against
the connection.

The query object must contain sqlText. It may optionally contain bind, streamResult and fetchAsString. It MUST not 
contain a complete field. If a complete field is included on the query it will be ignored. 

The done callback will be called with done(err, stmt, rows).


## stream( connectionName, query, done )

Will automatically connect to the connection identified by connectionName, and will execute the provided query against
the connection.

stream() is actually still using snowflake-sdk's native execute() method, but its adding some connection management and
some additional syntactic sugar. See 
https://docs.snowflake.net/manuals/user-guide/nodejs-driver-use.html#streaming-results for documentation on how to use
the stream object returned to the callback.

The query object must contain sqlText. It may optionally contain bind and fetchAsString. It MUST not contain a complete 
or streamResult field. If a complete or streamResult field is included on the query it will be ignored. 

The done callback will be called with done(err, stream), where stream is an instance of statement.streamRows(). Note
that done() is passed an error, and that stream may event an error also. If the stream fails to connect done() will be
passed an error. If the stream fails while pulling rows then the stream error event will fire.

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
