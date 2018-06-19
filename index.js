'use strict';

const __ = require( 'doublescore' );
const async = require( 'async' );
const snowflake = require( 'snowflake-sdk' );

let defaultConfig = {
  username: null,
  password: null
};

class SnowflakeComponent {

  constructor( deps ) {

    this._nconf = deps.get( 'config' );

  }

  init( done ) {

    done();

  }

  dinit( done ) {

    done();

  }

}

module.exports = SnowflakeComponent;
