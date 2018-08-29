'use strict';

const assert = require( 'assert' );
const async = require( 'async' );
const SetupTestConfigComponent = require( './lib/test.config' );
const StringStackCore = require( '@stringstack/core' );

let getComponentNative = function ( app, targetPath ) {
  return app._loader.get( 'app', targetPath );
};

let generateQueryTest = function ( check, overrideConfig, done ) {

  let app = null;
  let component = null;

  if ( typeof overrideConfig === 'function' ) {
    done = overrideConfig;
    overrideConfig = null;
  }

  SetupTestConfigComponent.restoreDefaultConfig( overrideConfig );

  async.series( [
    ( done ) => {

      try {

        let core = new StringStackCore();

        const App = core.createApp( {
          rootComponents: [
            './test/lib/test.config',
            './index'
          ]
        } );

        app = new App( 'test' );

        component = getComponentNative( app, './index' );

        assert( component, 'component should be available' );

      } catch ( e ) {
        return done( e );
      }

      done();

    },
    ( done ) => {
      try {
        app.init( done );
      } catch ( e ) {
        return done( e );
      }
    },
    ( done ) => {

      try {
        check( component, done );
      } catch ( e ) {
        return done( e );
      }

    },
    ( done ) => {

      try {

        assert( Object.keys( component._connectionPool ).length > 0, 'connectionPool should be non-empty' );

      } catch ( e ) {
        return done( e );
      }

      done();

    },
    ( done ) => {
      try {
        app.dinit( done );
      } catch ( e ) {
        return done( e );
      }
    },
    ( done ) => {

      try {

        assert.strictEqual( component._config, null, 'component config should be null' );
        assert( Object.keys( component._connectionPool ).length < 1, 'connectionPool should be empty' );

      } catch ( e ) {
        return done( e );
      }

      done();

    }
  ], done );

};

describe( 'stringstack', function () {
  describe( 'snowflake', function () {

    describe( 'query', function () {

      it( 'should show databases', function ( done ) {

        this.timeout( 60000 );

        generateQueryTest( function ( component, done ) {

          async.waterfall( [
            ( done ) => {
              component.execute( 'test', {
                sqlText: 'show databases;'
              }, done );
            },
            ( stmt, rows, done ) => {

              try {

                assert( stmt, 'stmt should be an object' );
                assert( Array.isArray( rows ), 'rows should be an array' );
                assert( rows.length > 0, 'rows should be non-empty' );

              } catch ( e ) {
                return done( e );
              }

              done();
            }
          ], done );

        }, done );

      } );

      it( 'should stream databases', function ( done ) {

        this.timeout( 5000 );

        generateQueryTest( function ( component, done ) {

          async.waterfall( [
            ( done ) => {
              component.stream( 'test', {
                sqlText: 'show databases;'
              }, done );
            },
            ( stream, _done ) => {

              let doned = false;
              let done = ( err ) => {

                if ( doned ) {
                  return;
                }
                doned = true;

                if ( err ) {
                  _done( err );
                } else {
                  _done();
                }

              };

              let rows = [];

              stream.on( 'error', function ( err ) {
                done( err );
              } );

              stream.on( 'data', function ( row ) {
                rows.push( row );
              } );

              stream.on( 'end', function () {

                try {

                  assert( Array.isArray( rows ), 'rows should be an array' );
                  assert( rows.length > 0, 'rows should be non-empty' );

                } catch ( e ) {
                  return done( e );
                }

                done();
              } );


            }
          ], done );

        }, done );

      } );


    } );

    describe( 'query with config override', function () {

      it( 'should show databases', function ( done ) {

        this.timeout( 60000 );

        generateQueryTest( function ( component, done ) {

            async.waterfall( [
              ( done ) => {
                component.execute( {
                  account: process.env.NODE_SNOWFLAKE_ACCOUNT_TESTING || 'account',
                  username: process.env.NODE_SNOWFLAKE_USERNAME_TESTING || 'username',
                  password: process.env.NODE_SNOWFLAKE_PASSWORD_TESTING || 'password',
                  region: process.env.NODE_SNOWFLAKE_REGION_TESTING || 'region'
                }, {
                  sqlText: 'show databases;'
                }, done );
              },
              ( stmt, rows, done ) => {

                try {

                  assert( stmt, 'stmt should be an object' );
                  assert( Array.isArray( rows ), 'rows should be an array' );
                  assert( rows.length > 0, 'rows should be non-empty' );

                } catch ( e ) {
                  return done( e );
                }

                done();
              }
            ], done );

          },
          {
            account: 'account',
            username: 'username',
            password: 'password',
            region: 'region'
          },
          done );

      } );

      it( 'should stream databases', function ( done ) {

        this.timeout( 5000 );

        generateQueryTest( function ( component, done ) {

          async.waterfall( [
            ( done ) => {
              component.stream( {
                account: process.env.NODE_SNOWFLAKE_ACCOUNT_TESTING || 'account',
                username: process.env.NODE_SNOWFLAKE_USERNAME_TESTING || 'username',
                password: process.env.NODE_SNOWFLAKE_PASSWORD_TESTING || 'password',
                region: process.env.NODE_SNOWFLAKE_REGION_TESTING || 'region'
              }, {
                sqlText: 'show databases;'
              }, done );
            },
            ( stream, _done ) => {

              let doned = false;
              let done = ( err ) => {

                if ( doned ) {
                  return;
                }
                doned = true;

                if ( err ) {
                  _done( err );
                } else {
                  _done();
                }

              };

              let rows = [];

              stream.on( 'error', function ( err ) {
                done( err );
              } );

              stream.on( 'data', function ( row ) {
                rows.push( row );
              } );

              stream.on( 'end', function () {

                try {

                  assert( Array.isArray( rows ), 'rows should be an array' );
                  assert( rows.length > 0, 'rows should be non-empty' );

                } catch ( e ) {
                  return done( e );
                }

                done();
              } );


            }
          ], done );

        }, done );

      } );

      it( 'should error on bad override', function ( done ) {

        this.timeout( 60000 );

        generateQueryTest( function ( component, done ) {

          async.waterfall( [
            ( done ) => {
              component.execute( {
                account: process.env.NODE_SNOWFLAKE_ACCOUNT_TESTING || 'account',
                username: 'username',
                password: 'password',
                region: process.env.NODE_SNOWFLAKE_REGION_TESTING || 'region'
              }, {
                sqlText: 'show databases;'
              }, done );
            },
            ( stmt, rows, done ) => {

              try {

                assert( stmt, 'stmt should be an object' );
                assert( Array.isArray( rows ), 'rows should be an array' );
                assert( rows.length > 0, 'rows should be non-empty' );

              } catch ( e ) {
                return done( e );
              }

              done();
            }
          ], ( err ) => {

            try {

              assert( err, 'err should be an error object' );
              assert.strictEqual( err.message, 'Incorrect username or password was specified.' );

              // generateQueryTest() expects a connection, but connection errors prevent one from caching
              component._connectionPool.test = null;

            } catch ( e ) {
              return done( e );
            }

            done();

          } );

        }, done );

      } );

    } );

  } );
} );