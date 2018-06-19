'use strict';

const assert = require( 'assert' );
const async = require( 'async' );
const SetupTestConfigComponent = require( './lib/test.config' );
const StringStackCore = require( '@stringstack/core' );

let getComponentNative = function ( app, targetPath ) {
  return app._loader.get( 'app', targetPath );
};

describe( 'stringstack', function () {
  describe( 'snowflake', function () {
    describe( 'general', function () {

      it( 'should instantiate, init and dinit', function ( done ) {

        let app = null;
        let component = null;

        SetupTestConfigComponent.restoreDefaultConfig();

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

              assert.strictEqual( component._config, null, 'component config should be null' );

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

              assert.equal( JSON.stringify( component._config, null, 4 ),
                JSON.stringify( SetupTestConfigComponent.defaultConfig, null, 4 ),
                'component config should be set' );

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

            } catch ( e ) {
              return done( e );
            }

            done();

          }
        ], done );

      } );


    } );
  } );
} );