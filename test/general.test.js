'use strict';

const assert = require( 'assert' );
const async = require( 'async' );
const SetupTestConfigComponent = require( './lib/test.config' );
const StringStackCore = require( '@stringstack/core' );


describe( 'stringstack', function () {
  describe( 'snowflake', function () {

    it( 'should instantiate, init and dinit', function ( done ) {

      let app = null;

      async.series( [
        ( done ) => {

          try {

            SetupTestConfigComponent.defaultConfig = {
              http: {
                enabled: false
              },
              https: {
                enabled: false
              }
            };

            let core = new StringStackCore();

            const App = core.createApp( {
              rootComponents: [
                './test/lib/test.config',
                './index'
              ]
            } );

            app = new App( 'test' );

            done();

          } catch ( e ) {
            return done( e );
          }

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
            app.dinit( done );
          } catch ( e ) {
            return done( e );
          }
        }
      ], done );

    } );


  } );
} );