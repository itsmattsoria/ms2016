var Main = (function($) {

  var $document,
      loadingTimer;

  function _init() {
    // touch-friendly fast clicks
    FastClick.attach(document.body);

    // Cache some common DOM queries
    $document = $(document);
    $('body').addClass('loaded');

    // Init functions
    _initColorScheme();

    // Smoothscroll links
    $('a.smoothscroll').click(function(e) {
      e.preventDefault();
      var href = $(this).attr('href');
      _scrollBody($(href));
    });

  } // end init()

  function _scrollBody(element, duration, delay) {
    if ($('#wpadminbar').length) {
      wpOffset = $('#wpadminbar').height();
    } else {
      wpOffset = 0;
    } 
    element.velocity("scroll", {
      duration: duration,
      delay: delay,
      offset: -wpOffset
    }, "easeOutSine");
  }

  function _initColorScheme() {
    $.adaptiveBackground.run({
      parent:               'body',
      exclude:              [ 'rgb(0,0,0)', 'rgba(255,255,255)' ],
      normalizeTextColor:   true,
      normalizedTextColors:  {
        light:      "#f8e5c9",
        dark:       "#4f433c"
      },
      lumaClasses:  {
        light:      "ab-light",
        dark:       "ab-dark"
      },
      success: function($img, data) {
        var colorSchemePrimary = data.color;

        $('.header-gradient').css('background-image', 'linear-gradient(to bottom, rgba(0,0,0,0), '+colorSchemePrimary+' 99%)');

        $('body').removeClass('loading');
        setTimeout(function() {
          $('.animate-me').addClass('-animate');
        }, 1000);
      }
    });

  }

  // Public functions
  return {
    init: _init,
    scrollBody: function(section, duration, delay) {
      _scrollBody(section, duration, delay);
    }
  };

})(jQuery);

// Fire up the mothership
jQuery(document).ready(Main.init);

// Zig-zag the mothership
jQuery(window).resize(Main.resize);
