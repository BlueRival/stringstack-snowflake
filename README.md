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
      "region": "string [optional: blank, omitted or us-west-2 to indicate default region]",
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

## getConnection( connectionRef, done )

Given a connection name (string) passed to connectionRef, will return a connection configured with the options in the 
connections section of config. If connectionRef is an object an one-off connection will be established to those 
credentials. The object must include account, username and password. It may also contain region, database, schema,
warehouse, and/or role.

The connection will be connected and ready for queries immediately once done() is called. Do anything with this that
you would do with a raw snowflake-sdk connection return to the callback to connect();

If you would like a little syntactic sugar, use StringStack/snowflake.execute() and StringStack/snowflake.stream(). Both
of these methods will manage connections for you and expose all the underlying execution power. 

## execute( connectionRef, query, done )

If connectionRef is a string, will automatically connect to the connection identified by connectionRef in config, and 
will execute the provided query against the connection. If connectionRef is an object an one-off connection will be 
established to those credentials. The object must include account, username and password. It may also contain region, 
database, schema, warehouse, and/or role.

The query object must contain sqlText. It may optionally contain bind, streamResult and fetchAsString. It MUST not 
contain a complete field. If a complete field is included on the query it will be ignored. See the documentation located
at https://docs.snowflake.net/manuals/user-guide/nodejs-driver-use.html#executing-statements for explanation of how 
these fields are used when passed to execute();

The done callback will be called with done(err, stmt, rows).


## stream( connectionRef, query, done )

If connectionRef is a string, will automatically connect to the connection identified by connectionRef in config, and 
will execute the provided query against the connection. If connectionRef is an object an one-off connection will be 
established to those credentials. The object must include account, username and password. It may also contain region, 
database, schema, warehouse, and/or role.

stream() is actually still using snowflake-sdk's native execute() method, but its adding some connection management and
some additional syntactic sugar. See 
https://docs.snowflake.net/manuals/user-guide/nodejs-driver-use.html#streaming-results for documentation on how to use
the stream object returned to the callback.

The query object must contain sqlText. It may optionally contain bind and fetchAsString. It MUST not contain a complete 
or streamResult field. If a complete or streamResult field is included on the query it will be ignored. See the 
documentation located at https://docs.snowflake.net/manuals/user-guide/nodejs-driver-use.html#streaming-results for 
explanation of how these fields are used when passed to execute();

The done callback will be called with done(err, stream), where stream is an instance of statement.streamRows(). Note
that done() is passed an error, and that stream may event an error also. If the stream fails to connect done() will be
passed an error. If the stream fails while pulling rows then the stream error event will fire.

# Testing

You will need your own Snowflake account. Tests simply run read only queries to ensure the framework is functioning. One
such query is ```show databases;```. The purposes of the tests are to ensure the component complies with StringStack
patterns and to ensure that the component manages the underlying Snowflake connections. It is up to the underlying 
snowflake-sdk driver to implement more robust tests.

It is recommended that you test in multiple regions, including the default region. This is because the underlying
snowflake-sdk driver handles config for the default region completely different than other regions. They claim it is a
feature, but in actuality its an anti-pattern. We resolve that with some sanity checking on region that allows you to 
config the region explicitly even for default, while also allowing (rather than requiring) omission of region to 
indicate default. To specify the default region explicitly, specify us-west-2

```bash
export NODE_SNOWFLAKE_ACCOUNT_TESTING='vu47657'
export NODE_SNOWFLAKE_USERNAME_TESTING='DEV'
export NODE_SNOWFLAKE_PASSWORD_TESTING='BlueRival_test_dev_1'
export NODE_SNOWFLAKE_REGION_TESTING='us-west-2'
npm test
```

# Version Log

This is a log of which version of snowflake-sdk is provided by each version of StringStack/snowflake.

@stringstack/snowflake@0.0.3 => snowflake-sdk@1.1.5
@stringstack/snowflake@0.0.1 => snowflake-sdk@1.1.4
