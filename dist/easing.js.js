/*! Simple Easing Plugin - v0.0.1 - 2/6/2012
* https://github.com/danheberden/easing.js
* Copyright (c) 2012 Dan Heberden; Licensed MIT */

// New Object Template
(function( $, window){
  var easing = window.Easing = function( type, start, end ) {
      return new window.Easing.fn.init( type, start, end );
    },

    proto = easing.fn = easing.prototype= {
      constructor: easing,
      init: function( type, start, end ){

        // what kind of easing fn?
        var kind = /(InOut|In|Out)(\w+)/.exec( type ),
          easingFn = type,
          fn;


        if ( kind ) {
          fn = proto.easingsIn[ kind[2] ];
          easingFn = fn;
          if ( kind[1] === "InOut" ){
            easingFn = function( p, e ){
              return p < 0.5 ?
                     fn( p * 2, e ) / 2 :
                     fn( p * -2 + 2, e ) / -2 + 1;
            };
          } else if ( kind[1] === "Out" ) {
            easingFn = function( p, e) {
              return 1 - fn(1-p, e);
            };
          }
        } else if ( typeof type !== 'function' ) {
          easingFn = easing.fn.easings[ type || 'linear' ];
        }

        // assign the easing props of this object
        this.type = "" + type;
        this.easingFn = easingFn;
        this.start = start || 0;
        this.end = end || 1;
      },
      calc: function( p ) {
        return p === 0 ? this.start :
               p === 1 ? this.end :
               this.easingFn( p, this ) * ( this.end - this.start ) + this.start;
      },
      easings: {
        linear: function( p ){
          return p;
        }
      },
      easingsIn: {
        Sine: function ( p ) {
          return 1-Math.cos( p * pi / 2  ) ;
        },
        Expo: function ( p ) {
          return pow( 2, 10 * (p - 1) );
        },
        Circ: function ( p ) {
          return 1 - arc( p, 1, 1 );
        },
        Elastic: function( p ) {
          var s = 15 / pi * Math.asin( 1 ) ;
          return -(pow( 2, 8 * (p - 1) ) * Math.sin( ((p - 1) * 80 - s ) * pi / 15 ));
        },
        Back: function( p ) {
          return p * p * ( 3 * p - 2 );
        },
        Bounce: function( p ) {
          var levels = [0.10,0.32,0.68,1.305],
            result = 0,
            i = 0;
          for ( ; i < levels.length; i++ ) {
            if ( p < levels[i] ) {
              var half = ( levels[i] - ( levels[i-1] || 0 ) ) / 2,
                height = proto.easingsIn.Sine( levels[i] - half ) + 0.01;
              return arc( p - (levels[i] - half) , height, half );
            }
          }
        },
        Quad: function( p ) {
          return pow( p, 2 );
        },
        Cubic: function( p ) {
          return pow( p, 3 );
        },
        Quart: function( p ) {
          return pow( p, 4 );
        },
        Quint: function( p ) {
          return pow( p, 5 );
        }
      }
    },

    // p is progress (0-1), h is height of arc, rX is radius on X
    arc = function( p, h, rX ) {
      return Math.sqrt( h * h - pow( ( h / rX ) * p, 2 ) );
    },

    pow = Math.pow,
    pi = Math.PI;

  proto.init.prototype = proto;

  // all the jqueries
  if ( $ ) {
    $.each( proto.easingsIn, function( n, v ){
      $.each( ['In', 'Out', 'InOut'], function( i, t ) {
        var name = "ease" + t + n;

        // make a jq version
        $.easing[name] = function( x, t, b, c, d ) {
          return easing( name, b, c-b ).calc( t/d );
        };
      });
    });
  }
}( jQuery, this));