'use strict';

class SetupTestConfigComponent {

  constructor( deps ) {

    this._nconf = deps.get( 'config' );

    this._nconf.defaults( {
      stringstack: {
        snowflake: SetupTestConfigComponent.defaultConfig
      }
    } );

  }

  init( done ) {

    done();

  }

  dinit( done ) {

    done();

  }

}

SetupTestConfigComponent.restoreDefaultConfig = function ( config ) {

  config = config || null;

  SetupTestConfigComponent.defaultConfig = {
    connections: {
      test: config || {
        account: process.env.NODE_SNOWFLAKE_ACCOUNT_TESTING || 'account',
        username: process.env.NODE_SNOWFLAKE_USERNAME_TESTING || 'username',
        password: process.env.NODE_SNOWFLAKE_PASSWORD_TESTING || 'password',
        region: process.env.NODE_SNOWFLAKE_REGION_TESTING || 'region'
      }
    }
  };

};

SetupTestConfigComponent.restoreDefaultConfig();

module.exports = SetupTestConfigComponent;
