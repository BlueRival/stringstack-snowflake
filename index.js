'use strict';

const __ = require( 'doublescore' );
const async = require( 'async' );
const snowflake = require( 'snowflake-sdk' );

let defaultConfig = {
  connections: {}
};

let defaultConnectionConfig = {
  account: null,
  username: null,
  password: null,
  region: null,
  database: null,
  schema: null,
  warehouse: null,
  role: null
};

class SnowflakeComponent {

  constructor( deps ) {

    this._nconf = deps.get( 'config' );

    this._config = null;

    this._connectionPool = {};

  }

  init( done ) {

    this._config = __( defaultConfig ).mixin( this._nconf.get( 'stringstack:snowflake' ) );

    done();

  }

  dinit( done ) {

    this._config = null;

    async.series( [
      ( done ) => {
        async.eachOfSeries( this._connectionPool, ( connection, name, done ) => {
          connection.destroy( done );
        }, done );
      },
      ( done ) => {
        Object.keys( this._connectionPool ).forEach( ( name ) => {
          delete this._connectionPool[ name ];
        } );
        done();
      }
    ], done );

  }

  getConnection( name, done ) {

    if ( !this._config ) {
      return done( new Error( 'not initialized' ) );
    }

    if ( this._connectionPool.hasOwnProperty( name ) ) {
      return done( null, this._connectionPool[ name ] );
    }

    if ( !this._config.connections.hasOwnProperty( name ) ) {
      return done( new Error( 'connection identifier not found' ) );
    }

    let config = __( defaultConnectionConfig ).mixin( this._config.connections[ name ] );

    let missingField = null;
    [
      'account',
      'username',
      'password',
      'region'
    ].forEach( ( field ) => {

      if ( missingField ) {
        return;
      }

      if ( !config.hasOwnProperty( field ) || typeof config[ field ] !== 'string' || config[ field ].trim().length < 1 ) {
        missingField = field;
      }

    } );

    if ( missingField ) {
      return done( new Error( 'configuration field ' + missingField + ' must be non-empty string' ) );
    }

    let connection = snowflake.createConnection( config );

    async.waterfall( [
      ( done ) => {
        connection.connect( done );
      },
      ( handle, done ) => {

        this._connectionPool[ name ] = handle;

        done( null, handle );

      }
    ], done );


  }

  execute( connection, query, done ) {

    async.waterfall( [
      ( done ) => {
        this.getConnection( connection, done );
      },
      ( connection, done ) => {

        // clone the query
        query = JSON.parse( JSON.stringify( query ) );

        // inject callback
        query.complete = done;

        connection.execute( query );

      }
    ], done );

  }

  stream( connection, query, done ) {

    async.waterfall( [
      ( done ) => {
        this.getConnection( connection, done );
      },
      ( connection, done ) => {
        done( null, connection.execute( query ).streamRows() );
      }
    ], done );

  }


}

module.exports = SnowflakeComponent;
