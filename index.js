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

          if ( connection && connection.destroy ) {
            connection.destroy( done );
          } else {
            done();
          }

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

  getConnection( connectionRef, done ) {

    let connectionName = null;
    let config = null;

    if ( typeof connectionRef === 'string' ) {

      connectionName = connectionRef;

      if ( !this._config ) {
        return done( new Error( 'not initialized' ) );
      }

      if ( this._connectionPool.hasOwnProperty( connectionName ) ) {
        return done( null, this._connectionPool[ connectionName ] );
      }

      if ( !this._config.connections.hasOwnProperty( connectionName ) ) {
        return done( new Error( 'connection identifier not found' ) );
      }

      config = __( defaultConnectionConfig ).mixin( this._config.connections[ connectionName ] );

    } else {

      config = __( defaultConnectionConfig ).mixin( connectionRef );
      connectionName = JSON.stringify( config ); // allows caching of one-off connections

    }

    let missingField = null;
    [
      'account',
      'username',
      'password'
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

    if ( typeof config.region !== 'string' ) {
      config.region = '';
    }

    config.region = config.region.trim();

    if ( config.region === '' || config.region === 'us-west-2' ) {
      delete config.region;
    }

    // console.log( 'config', config );

    let connection = snowflake.createConnection( config );

    async.waterfall( [
      ( done ) => {
        connection.connect( done );
      },
      ( handle, done ) => {

        this._connectionPool[ connectionName ] = handle;

        done( null, handle );

      }
    ], done );


  }

  execute( connectionRef, query, done ) {

    async.waterfall( [
      ( done ) => {
        this.getConnection( connectionRef, done );
      },
      ( connection, done ) => {

        query = this._prepareQuery( query );

        query.complete = done;

        connection.execute( query );

      }
    ], done );

  }

  stream( connectionRef, query, done ) {

    async.waterfall( [
      ( done ) => {
        this.getConnection( connectionRef, done );
      },
      ( connection, done ) => {

        query = this._prepareQuery( query );

        delete query.streamResult;

        done( null, connection.execute( query ).streamRows() );
      }
    ], done );

  }

  _prepareQuery( query ) {

    let temp = query;

    query = {
      sqlText: temp.sqlText
    };

    if ( temp.streamResult ) {
      query.streamResult = !!temp.streamResult;
    }

    if ( Array.isArray( temp.bind ) ) {
      query.bind = temp.bind;
    }

    if ( Array.isArray( temp.fetchAsString ) ) {
      query.fetchAsString = temp.fetchAsString;
    }

    return query;

  }


}

module.exports = SnowflakeComponent;
