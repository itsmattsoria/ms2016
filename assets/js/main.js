var Main = (function($) {

  var $document;

  function _init() {
    // touch-friendly fast clicks
    FastClick.attach(document.body);

    // Cache some common DOM queries
    $document = $(document);
    $('body').addClass('loaded');

    // Init functions
    _initColorScheme();
    _initPageAnchors();

  } // end init()

  function _initColorScheme() {
    $.adaptiveBackground.run({
      parent: 'body',
      exclude: [ 'rgb(0,0,0)', 'rgba(255,255,255)' ],
      normalizeTextColor:   true,
      normalizedTextColors:  {
        light: "#f8e5c9",
        dark: "#4f433c"
      },
      lumaClasses:  {
        light: "ab-light",
        dark: "ab-dark"
      },
      success: function($img, data) {
        var colorSchemePrimary = data.color;

        $('.header-gradient').css('background-image', 'linear-gradient(to bottom, rgba(0,0,0,0), '+colorSchemePrimary+' 99%)');
        $('.about-image-wrap').css('background-color', colorSchemePrimary);

        $('body').removeClass('loading');

        setTimeout(function() {
          _initAnimations();
        },0);
      }
    });
  }

  function _initAnimations() {
    $('.animate-me').each(function() {
      new Waypoint.Inview({
        element: this,
        enter: function() {
          $(this.element).addClass('-animate');
        }
      });
    });
  }

  function _initPageAnchors() {
    $('section').each(function() {
      if ($(this)[0].hasAttribute('id')) {
        $(this).addClass('has-anchor');

        $(this).find('.section-title').append('<a class="section-anchor" href="'+ document.URL.replace(/#.*$/, "") + '#' + $(this).attr('id')+'">#</a>');
      }
    });
  }

  // Public functions
  return {
    init: _init
  };

})(jQuery);

// Fire up the mothership
jQuery(document).ready(Main.init);

// Zig-zag the mothership
jQuery(window).resize(Main.resize);
