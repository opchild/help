$(document).ready(function () {

    enableForcedColorSupport();

    if (isSmallTouchDevice()) {
        createMobileMenu();
        initMobileShopCategories();
        enableTransparentHeader();
    } else {
        initRegularShopCategories();
        enableCascadingMenuTouch();
        if (document.fonts) {
            document.fonts.ready.then(function () {
                initHeaderLayoutHelper();
                initFixedMenu();
                enableTransparentHeader();
            });
        } else {
            initHeaderLayoutHelper();
            initFixedMenu();
            enableTransparentHeader();
        }
    }

    // Opens pictures in fancy box

    var fancyButtons = [
              //'slideShow',
              //'fullScreen',
              'thumbs',
              'close'
    ];

    if (typeof $.fancybox != 'undefined') {
        $.fancybox.defaults.idleTime = false; // override to show controls always
        $.fancybox.defaults.mobile.clickContent = false; // override to show controls always
        $.fancybox.defaults.mobile.clickSlide = "close"; // override to close on background tap on mobiles
        $('.mz_catalog a.fancy').fancybox({
            buttons : fancyButtons
        });
    }

    if (!$('body').hasClass('backend')) {

        // Opens Gallery Pictures in a Fancybox.
        if (typeof $.fancybox != 'undefined') {
            $('ul.moze-gallery.pictures li a').fancybox({
                buttons : fancyButtons
            });
        }

        // Removes overlay if it is empty
        var olay = $('#bigbar-overlay:not(.persistent)');
        if (olay.length) {
            if ($.trim(olay.find('.moze-wysiwyg-editor:visible').text()) == '') {
                olay.css('background-color', 'transparent');
            }
        }

    }

    // On RTL languages swaps sidebar position

    /*if ($('body').hasClass('mz_rtl')) {
        $('#sidebar-wrap').toggleClass('sidebar-reverse');
    }*/

    // Detect thumbnail image layout

    $('.mz_catalog .cat-thumb-pic img')
        .one('load', function() {
            fixThumbnailImageLayout(this);
        })
        .each(function() {
            if (this.complete && typeof $(this).attr('src') != 'undefined') {
                $(this).trigger('load');
            }
        });

    // Adjusts the title font size for images.

    var adjustFont = function () {
        var fontSize = $('.moze-gallery-overlay').width();
        var maxSize = parseInt($('body').css('font-size'));
        fontSize = Math.min(fontSize * 0.09, maxSize);
        $('.moze-gallery-overlay').css('font-size', fontSize);
    };

    adjustFont();
    $(window).resize(function () {
        adjustFont();
    });

    // Add Google Maps.

    function processMaps() {
        if ($('.moze-maps').length > 0) {
            var doc_lang = $('body').attr('lang');
            if (!doc_lang) {
                doc_lang = 'en';
            }
            //$.getScript("//maps.google.com/maps/api/js?key=AIzaSyCbQd3r9wS61hmQYZrv4ZdbDJo2Q0h3k7g&v=3.exp&callback=DynamicMapApiLoaded&language=" + doc_lang, function () { });
            doProcessMaps(doc_lang);
        }
    }

    function doProcessMaps(lang) {
        $('.moze-maps').each(function () {
            initializeEmbedMap($(this), lang);
        });
    }

    if (!$('body').hasClass('backend')) {
        processMaps();
    }

    // Loads MozBanner.
    if (!$('body').hasClass('backend')) {
        $('.mz_banner').mozbannerplay({});
    }

    // Skip link
    $('#skip-link').click(function() {
        var goto = $('.section:first-child');
        goto.attr('tabindex', 0);
        goto.focus();
        setTimeout(function(){
            var offsetWithExtraSpace = goto.offset().top - $('#header').outerHeight();
            $('html, body').animate({ scrollTop: offsetWithExtraSpace }, 200);
        }, 100);
    });
    
    // Enable nag banner position updating
    $(window).resize(function(){
         setNagBannerPosition();
    });
            
    
    // Enable accessibility tab mode with "ugly" frames
    $(document).on('keydown', function(event) {
        if (event.keyCode == 9) { // 9 is the keycode for the Tab key
            $('body').addClass('wants-focus-rect');
        }
    });

    initHeaderSideMenu();
    initCart();
    initSearchbox();
    loadSocialIcons();
    initAccordionComponents();
    setNagBannerPosition();

});

var icon_fold = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102 102"><path d="M6.23,77.24a3,3,0,1,1-4.3-4.18L48.77,24.91a3,3,0,0,1,4.29,0l47.15,47.85A3,3,0,1,1,95.94,77l-45-45.67Z"/></svg>';
var icon_unfold = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102 102"><path d="M6.23,24.76a3,3,0,1,0-4.3,4.18L48.77,77.09a3,3,0,0,0,4.29,0l47.15-47.85A3,3,0,1,0,95.94,25l-45,45.67Z"/></svg>';
var icon_close = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102 102"><path d="M51,46.76,6.12,1.88A3,3,0,0,0,1.88,6.12L46.76,51,1.88,95.88a3,3,0,0,0,4.24,4.24L51,55.24l44.88,44.88a3,3,0,0,0,4.24-4.24L55.24,51,100.12,6.12a3,3,0,0,0-4.24-4.24Z"/></svg>';
var icon_menu = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102 102"><path d="M4,25a3,3,0,0,1,0-6H98a3,3,0,0,1,0,6ZM4,54a3,3,0,0,1,0-6H98a3,3,0,0,1,0,6ZM4,83a3,3,0,0,1,0-6H98a3,3,0,0,1,0,6Z"/></svg>';
var icon_cart = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102 102"><path d="M91,86.19,85.31,22.73a3,3,0,0,0-3-2.73H71.74C70.24,8.7,61.93,1,51.06,1S31.76,8.63,30.23,20H19.7a3,3,0,0,0-3,2.73L11,86.19a2.44,2.44,0,0,0,0,.27A14.46,14.46,0,0,0,25.38,101H76.62A14.46,14.46,0,0,0,91,86.46,2.44,2.44,0,0,0,91,86.19ZM51,7c7.53,0,13.28,5.05,14.63,13H36.3C37.68,12,43.48,7,51,7ZM76.62,95H25.38A8.46,8.46,0,0,1,17,86.59L22.44,26H30l0,7.93a3,3,0,0,0,6,0l0-8H66l0,8a3,3,0,0,0,6,0L72,26h7.6L85,86.59A8.46,8.46,0,0,1,76.62,95Z"/></svg>';
var icon_search = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102 102"><path d="M100.19,95.81,71.38,67a39.91,39.91,0,1,0-4.23,4.26L96,100.05a3,3,0,0,0,4.24-4.24ZM7,41A34,34,0,1,1,41,75,34,34,0,0,1,7,41Z"/></svg>';
var icon_languages = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 102 102"><path d="M51.61,1H50.39a50,50,0,0,0,0,100h1.22a50,50,0,0,0,0-100ZM33.86,10.46A47.3,47.3,0,0,0,27.27,22H17.92A44,44,0,0,1,33.86,10.46ZM13.49,28H25.18a80.06,80.06,0,0,0-3.13,20H7.11A43.47,43.47,0,0,1,13.49,28ZM12,71h-.2A43.57,43.57,0,0,1,7.11,54H22.05a82,82,0,0,0,2.31,17Zm3.51,6H26.14a49.63,49.63,0,0,0,7.72,14.54A44.19,44.19,0,0,1,15.51,77ZM48,94.61C41.81,93,36.23,86.45,32.55,77H48ZM48,71H30.58a73.76,73.76,0,0,1-2.52-17H48Zm0-23H28.06a72.89,72.89,0,0,1,3.41-20H48Zm0-26H33.83C37.46,14.18,42.49,8.83,48,7.39Zm40.51,6a43.47,43.47,0,0,1,6.38,20H80a80.06,80.06,0,0,0-3.13-20Zm-4.43-6H74.73a47.3,47.3,0,0,0-6.59-11.54A44,44,0,0,1,84.08,22ZM54,7.39C59.51,8.83,64.54,14.18,68.17,22H54ZM54,28H70.53a72.89,72.89,0,0,1,3.41,20H54Zm0,26H73.94a73.76,73.76,0,0,1-2.52,17H54Zm0,40.61V77H69.45C65.77,86.45,60.19,93,54,94.61Zm14.14-3.07A49.63,49.63,0,0,0,75.86,77H86.49A44.19,44.19,0,0,1,68.14,91.54ZM90.2,71H77.64A82,82,0,0,0,80,54H94.89A43.52,43.52,0,0,1,90.2,71Z"/></svg>';

// Mobile detection (will match tablets in contrast to isSmallTouchDevice)

function isMobileDevice() {
    if (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i) ||
        navigator.userAgent.match(/IEMobile/i)
    ) {
        return true;
    } else {
        return false;
    }
}

// Google Maps stuff.

function initializeEmbedMap(jqelem, lang) {
    var query = jqelem.data('query');
    var zoom = jqelem.data('zoom');

    // legacy customers and custom locations
    if (!query || query == '') {
        query = jqelem.data('lat') + ',' + jqelem.data('lng');
    }

    var src = 'https://www.google.com/maps/embed/v1/place?key=AIzaSyCbQd3r9wS61hmQYZrv4ZdbDJo2Q0h3k7g&q=' + query + '&zoom=' + zoom + '&language=' + lang;
    map = $('<iframe frameborder="0" style="border:0" aria-label="Google Maps" allowfullscreen>');
    map.addClass('moze-maps');
    map.css('height', jqelem.css('height'));
    map.css('width', jqelem.css('width'));
    map.attr('src', src);
    jqelem.replaceWith(map);
}

/* Makes compatible with forced color modes Firefox, Windows */

function enableForcedColorSupport() {

    function deleteSupportsRule(supportsQuery) {
        $.each(document.styleSheets, function (i, stylesheet) {
            try {
                for (var j = stylesheet.cssRules.length - 1; j >= 0; j--) {
                    var rule = stylesheet.cssRules[j];
                    if (rule.cssRules && rule.conditionText && !rule.media) {
                        if (rule.conditionText === supportsQuery) {
                            stylesheet.deleteRule(j);
                        }
                    }
                }
            } catch (e) {
                console.error("Access to stylesheet rules is restricted:", e);
            }
        });
    }

    if (window.matchMedia('(forced-colors: active)').matches) {
        deleteSupportsRule("not (hide-for-forced-colors)");
    }

}

/* Menu logic */

function menuAddOpenerLogic(menuBox, menuOpenerElement) {
    menuOpenerElement.on('click', function () {
        $('.sliding-panel').hide().removeClass('visible'); // remove other side panels too
        $(menuBox).css('top', $('body').css('margin-top'));
        $(menuBox).removeClass('visible');
        $(menuBox).show();
        $(menuBox).on('keydown', function(e) {
            if ((e.key === "Escape")) {
                $(menuBox).hide();
            }
        });
        setTimeout(function(){
            $(menuBox).addClass('visible');
            var firstFocusableElement = $(menuBox).find('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])').filter(':visible').first();
            firstFocusableElement.focus();
        }, 5);
    });
}

function menuAddCloseLogic(menuBox, ulElement) {
    var menu_closer = $('<button class="clearbutton">' + icon_close + '</button>');
    menu_closer.addClass('mobile-menu-closer');
    $(ulElement).before(menu_closer);
    menu_closer.on('click', function () {
        $(menuBox).hide();
    });
}

function menuMakeFoldable(ulContainer) {
    var arrow_unfold = $('<button class="clearbutton" aria-label="' + mozLocalization['cmLabelExpand'] + '">' + icon_unfold + '</button>').addClass('mobile-menu-arrow').addClass('unfold');
    var arrow_fold = $('<button class="clearbutton" aria-label="' + mozLocalization['cmLabelCollapse'] + '">' + icon_fold + '</button>').addClass('mobile-menu-arrow').addClass('fold');
    arrow_unfold.on('click', function(e) {
        e.preventDefault();
        $(this).parent().addClass('expanded');
        $(this).siblings('ul').find('a').filter(':visible').first().focus();
    });
    arrow_fold.on('click', function(e) {
        e.preventDefault();
        $(this).parent().removeClass('expanded');
        $(this).siblings('button').filter(':visible').focus();
    });

    $(ulContainer + ' > ul > li > a').each(function(e){
        if ($(this).siblings('ul').length) {
            $(this).addClass('foldable');
            $(this).after(arrow_unfold.clone(true, true));
            $(this).after(arrow_fold.clone(true, true));
        }
    });

    /*** Lastmost selected class ***/
    $(ulContainer + ' ul li.selected').each(function(e){
        if ($(this).find('.selected').length == 0) {
            $(this).addClass('current-item');
        }
    });

}

// Normal menu helper for touch devices

function enableCascadingMenuTouch() {

    // opens submenus on single tap, default action happens on second tap
    $('#menu ul li a').on('touchend', function(e) {
        var submenu = $(this).parent().children('ul');
        if (!$('body').hasClass('mobile-header') && submenu.length) {
            // can not use is(:visible) due to iOS bug firing CSS hover and setting visible before any events
            if (!submenu.hasClass('touch-opened')) {
                e.preventDefault();
                // hide all
                $('#menu ul ul').css('display', '').removeClass('touch-opened');
                // show this branch
                $(this).parents('#menu ul ul').show().addClass('touch-opened');
                submenu.show().addClass('touch-opened');
            }
        }
    });

    // closes menu on touch outside
    $(document).on('touchstart', function(e) {
        if (!$(e.target).parents('#menu > ul').length) {
            $('#menu ul ul').css('display', '').removeClass('touch-opened');
        }
    });

}

// Mobile menu loader

function createMobileMenu() {

    /*** Add menu and language menu buttons ***/

    var hasMenu = ($('#menu ul').length > 0);
    var hasLanguages = ($('#languages ul').length > 0);


    // For legacy designs
    if (typeof legacyInitMobileMenu === 'function') {
        legacyInitMobileMenu();
    }

    // Create languages button
    var languages_opener = $('#languages-opener');

    if (hasLanguages) {
        // Menu logic
        menuAddOpenerLogic('#languages', languages_opener);
        menuAddCloseLogic('#languages', '#languages ul');
    } else {
        languages_opener.css('visibility', 'hidden');
    }

    // Create menu button
    var menu_opener = $('#menu-opener');

    // Move icons to menu, but preserve languages
    $('#languages').appendTo($('#header'));
    $('#header-side').prependTo($('#menu'));

    if (hasMenu) {

        // Menu logic
        menuAddOpenerLogic('#menu', menu_opener);
        menuAddCloseLogic('#menu', '#menu > ul');
        menuMakeFoldable('#menu');
        // Necessary for anchor links on mobile menu
        $('#menu > ul li a[href], #header-side a.menu-icon').click(function(event) {
            setTimeout(function() {
                $('#menu').hide();
            }, 50);
        });

    } else {
        menu_opener.css('visibility', 'hidden');
    }

    /*** Copy icons ***/

    $('#menu-opener svg').replaceWith(icon_menu);
    $('#languages-opener svg').replaceWith(icon_languages);

    /*** Adjust logo ***/
    $('#top #title img').on('load', function() {
        if (this.naturalWidth/this.naturalHeight < 1.75) {
            $(this).addClass('tall');
        }
    }).each(function() {
        if (this.complete && typeof $(this).attr('src') != 'undefined') {
            $(this).trigger('load');
        }
    });

    /*** Add scroll events ***/

    if (document.fonts) {
        document.fonts.ready.then(function () {
            var last_known_scroll_position = 0;
            var elem = $('#header').parent();
            var floating_top = $('body').css('margin-top');
            var header_height = null; // Due to iOS specifics, calculate header height only after scrolling has begin and not here
            var absolute_header = ($('#header').css('position') == 'absolute');

            $(window).scroll(function(e) {
                if (!header_height) header_height = $('#header').outerHeight();
                if ((window.scrollY > 3) && (last_known_scroll_position > window.scrollY)) {
                    $('#header').addClass('floating').css('top', floating_top);
                    if (!absolute_header) {
                        elem.css('padding-top', header_height);
                    }
                } else {
                    $('#header').removeClass('floating').css('top', 0);
                    elem.css('padding-top', '');
                }
                last_known_scroll_position = window.scrollY;
            });
        });
    }

    /*** Legacy color processing ***/

    if (typeof legacyInitMobileMenuColors === 'function') {
        legacyInitMobileMenuColors();
    }

    /*** General preparations ***/

    $('#menu li.selected').addClass('expanded');
    $('body').addClass('mobile-header');

}

// Initialize regular shop categories

function initRegularShopCategories() {

    if (!$('#sidebar-wrap.sidebar-none').length) {

        // Duplicate side categories for smaller width screens

        var sideCategories = $('.mz_catalogcategories > ul');
        if (sideCategories.length) {
            if (!$('#submenu div ul').length)  // defnesive, avoid duplicate, should never happen
                $('#submenu').append($('<div>').append(sideCategories.clone()));
        }

        // Add expandability to side categories

        var sideMenu = $('.mz_component.mz_catalogcategories ul');
        if (sideMenu.length) {
            sideMenu.find('ul').hide();
            sideMenu.find('li.selected').parents('ul').show();
            sideMenu.find('li.selected').find('ul').show();
            var expandableLi = sideMenu.find('li ul').parent('li');
            expandableLi.children('a').attr('aria-haspopup', 'true');
            expandableLi.addClass('dropdown').append($('<span>&rsaquo;</span>').click(function() {
                window.location = $(this).parent('li').children("a:first").attr('href');
            }));
        }

    }

    // Process top categories

    var submenuSubcats = $('#submenu ul li.selected ul');
    if (submenuSubcats.length) {
        $('#submenu div').append(submenuSubcats);
    } else {
        submenuSubcats = $('#submenu ul li ul li.selected');
        if (submenuSubcats.length) {
            $('#submenu div').append(submenuSubcats.parent());
        }
    }

}

// Initialize online store category browser

function initMobileShopCategories() {

    // Move side categories to #submenu
    var sideCategories = $('.mz_catalogcategories > ul');
    if (sideCategories.length) {
        // defensive
        if (!$('#submenu div ul').length)  // defnesive, avoid duplicate, should never happen
            $('#submenu').append($('<div>').append(sideCategories));
        $('.mz_catalogcategories').remove();
    }

    // Show sublevels
    $('#submenu ul ul li.selected').parent().closest('li').addClass('expanded');

    if ($('#submenu > div > ul > li').length) {

        // Get breadcrumb text for opener
        var selectedCategory = $('#submenu li.selected > a');

        var breadCrumb = 'Menu';
        if ($('#menu li.selected > a').length) breadCrumb = $('#menu li.selected > a').text();

        if (selectedCategory.length) {
            breadCrumb = selectedCategory.text();
            selectedCategory = selectedCategory.parents('#submenu > div > ul > li:not(.selected)');
            if (selectedCategory.length) {
                breadCrumb = selectedCategory.children('a').text() + ' &gt; ' + breadCrumb;
            }
        }

        // Create opener
        var submenuOpener = $('#submenu-opener');
        submenuOpener.html($('<span>' + breadCrumb + '</span>' + icon_unfold));
        $('#submenu').prepend(submenuOpener);

        // Make foldable
        menuAddOpenerLogic('#submenu > div', submenuOpener);
        menuAddCloseLogic('#submenu > div', '#submenu > div > ul');
        menuMakeFoldable('#submenu > div');

        if (typeof legacyInitMobileShopCategoryColors === 'function') {
            legacyInitMobileShopCategoryColors();
        }

    } else $('#submenu-opener').remove();

}

// Initialize nag banner when necessary

function setNagBannerPosition(){
    if ($('#bottom').length == 0) {
        return;
    }
    var padding = parseInt($('#bottom').css('padding-top'));
    $('#bottom').css('padding-bottom', padding + $('#nag-banner').outerHeight());
    $('#bottom')[0].style.setProperty('padding-bottom', (padding + $('#nag-banner').outerHeight()) + 'px', 'important');
    if ($('#shopbar').length && (window.innerWidth <= 750)) {
        $('#nag-banner').css('bottom', $('#shopbar').outerHeight());
    } else {
        $('#nag-banner').css('bottom', 0);
    }
}

// Internal Mozello stuff

if (window.addEventListener) {
    window.addEventListener("message", receiveMessage, false);
}

function fixThumbnailImageLayout(image)
{
    var imgH = image.naturalHeight;
    var imgW = image.naturalWidth;

    image = $(image);

    image.removeClass('portrait wider taller');
    if (imgW < imgH) {
        image.addClass('portrait');
    }
    if (imgH / imgW < 0.66) {
        image.addClass('wider');
    }
    else if (imgH / imgW > 1.5) {
        image.addClass('taller');
    }
    if (imgH / imgW > 0.80) {
        image.addClass('taller80');
    }
}

function isExternalLinkOrImage(url) {
    var general_urls = new RegExp("(http|https)\:\/\/[^\.]+.[^\.]+", "g");
    var exclude_urls = new RegExp("^(http|https)\:\/\/(www\.)?(mozello|youtube|facebook|twitter)\.[a-z]{2,3}(\/|$)", "g");
    var content_urls = new RegExp("^(http|https)\:\/\/site\-[0-9]+\.mozfiles\.com", "g");
    if (url.match(general_urls) && !url.match(exclude_urls) && !url.match(content_urls)) {
        return true;
    }
    return false;
}

function isExternalScript(script) {

    if (typeof script == 'undefined' || script == '') {
        return false;
    }

    var link = document.createElement("a"),
        hostname = '';

    link.href = script;
    hostname = link.hostname;

    var generalUrls = new RegExp('(http|https)\:\/\/[^\.]+.[^\.]+', 'g');
    var excludeUrls = new RegExp('(mozello.com|mozfiles.com|dss4hwpyv4qfp.cloudfront.net|youtube.com|facebook.com|twitter.com|googleapis.com)$', 'g');

    if (typeof hostname != 'undefined' && hostname != '') {
        return script.match(generalUrls) && !hostname.match(excludeUrls);
    }
    else {
        return false;
    }
}

function receiveMessage(event)
{
    var knownOrigins = [
        'http://mozello.local',
        'http://www.mozello.com',
        'https://www.mozello.com'
    ];

    if (knownOrigins.indexOf(event.origin) != -1) {
        if (event.data == 'highlight-links') {
            $('.mz_editable img').each(function () {
                var url = $(this).attr('src').trim();
                if (isExternalLinkOrImage(url)) {
                    $(this).css('border', '4px dotted blue');
                }
            });
            $('.mz_editable a').each(function () {
                var url = $(this).attr('href').trim();
                if (isExternalLinkOrImage(url)) {
                    $(this).css('border-bottom', '4px dotted red');
                    $(this).find('img').css('border-bottom', '4px dotted red');
                }
            });
        }
        if (event.data == 'detect-scripts') {
            var detected = false;
            $('script, iframe').each(function() {
                var script = $(this).attr('src');
                if (isExternalScript(script)) {
                    console.log('External script detected: ', script);
                    if (!detected) {
                        var guruEyesOnly = $('#guruEyesOnly');
                        if (guruEyesOnly.length == 0) {
                            guruEyesOnly = $('<div id="guruEyesOnly">').html('Scripts detected.&nbsp;');
                            $('body').append(guruEyesOnly);
                        }
                        else {
                            guruEyesOnly.html(guruEyesOnly.html() + '<br>Scripts detected.&nbsp;');
                        }
                    }
                    detected = true;
                }
            });
        }
    }
}

/**
 * Cart
 */

// Show side widget loader

function initShopWidget()
{

    // Search action

    $('.shopbar-search').click(function() {
        $('#cat-search-panel').show();
        $('#shopbar-searchform .search-query').focus().select();
    });

    $('#cat-search-panel').on('click keydown', function(e) {
        if ($(e.target).is('#cat-search-panel') || (e.key === "Escape")) {
            $('#cat-search-panel').hide();
        }
    });

    $('#cat-search-panel #shopbar-searchform .close-btn').click(function(e) {
        $('#cat-search-panel').hide();
    });

    // Load icons inline
    // done at sidecart init

    // Set colors

    if (typeof legacySetShopbarColors === 'function') {
        legacySetShopbarColors();
    }

    // Show processed widget

    $('#shopbar').show();

}

// Initialize sliding out side cart for shop

function initShopSidecart()
{

    var sidecartPanel = $('#shopbar-sidecart');

    // Add opening and close logic
    menuAddOpenerLogic('#shopbar-sidecart', $('.shopbar-cart'));
    $('#shopbar-sidecart-close').on('click', function () {
        sidecartPanel.hide().removeClass('visible');
    });

    // Load icons inline
    $('.shopbar-search svg').replaceWith(icon_search);
    $('.shopbar-cart svg').replaceWith(icon_cart);
    $('#shopbar-sidecart-close svg').replaceWith(icon_close);
    $('#shopbar-searchform .close-btn svg').replaceWith(icon_close);

    // Set colors
    if (typeof legacySetSlidingPanelColors === 'function') {
        var tmp = $('<div class="mz_editable"></div>').appendTo('body');
        legacySetSlidingPanelColors(getElementColor(tmp, 'color'));
        tmp.remove();
    }
    

}

// Initializes cart action buttons

function initCart()
{
    var cartSource = $('.mz_catalogcart[data-type="catalogcartside"] form.moze-form input[name^="cart_item_"]');

    if (typeof typeof mozCatItem !== 'undefined' && typeof mozCatItemVariants !== 'undefined') {

        mozCatItem.stock = mozCatItem.stock_total;
        mozCatItemVariants.forEach(function(variant) {
            variant.stock = variant.stock_total;
        });

        cartSource.each(function() {

            var catItemID = $(this).attr('data-id');
            var catItemVariantID = $(this).attr('data-variant-id');
            var count = $(this).val();

            if (mozCatItem.id == catItemID) {

                if (catItemVariantID == 0 && mozCatItem.stock !== null) {
                    mozCatItem.stock = mozCatItem.stock - count;
                    toggleAddToCartButton(mozCatItem.stock > 0);
                }

                else if (catItemVariantID > 0) {
                    mozCatItemVariants.forEach(function(variant) {
                        if (variant.id == catItemVariantID && variant.stock !== null) {
                            variant.stock = variant.stock - count;
                            var selection = getSelectedVariant();
                            if (selection && selection.id == variant.id) {
                                toggleAddToCartButton(variant.stock > 0);
                            }
                        }
                    });
                }
            }
        });
    }

    if (typeof mozCatItems !== "undefined") {

        $.each(mozCatItems, function(index, item) {
            mozCatItems[index].stock = mozCatItems[index].stock_total;
        });

        $.each(cartSource, function(cartSourceIndex, cartSourceItem) {

            var cartCatItemID = $(cartSourceItem).attr("data-id"),
                cartCatItemVariantID = $(cartSourceItem).attr("data-variant-id"),
                count = $(cartSourceItem).val();

            $.each(mozCatItems, function(catItemIndex, catItem) {
                if (cartCatItemID != catItem.id || cartCatItemVariantID > 0) {
                    return true;
                }
                if (catItem.stock !== null) {
                    catItem.stock -= count;
                    reinitMozCatalogCartActions();
                }
            });
        });
    }

    var cartUpdateMozLiveFx = function(parameters, callback) {

        new mozLive3({
            source: {
                name: 'maincatalog',
                superglobal: 1
            },
            action: 'catalog-update-cart',
            parameters: parameters,
            response: {
                html: [
                    { name: 'maincatalogcartside', target: '#shopbar-sidecart-base' }
                ]
            },
            errors: {
                maintenance: mozLocalization.erInMaintenanceMode
            },
            onComplete: function() {
                initCart();
                if (typeof callback == "function") {
                    callback();
                }
                syncCartToLocalStorage();
            }
        });
    };

    $('form.moze-form input[name^="cart_item_"]')
        .off()
        .on('change', function() {
            cartUpdateMozLiveFx({
                    cat_item_id: $(this).attr('data-id'),
                    cat_item_variant_id: $(this).attr('data-variant-id'),
                    count: Math.max(1, Math.floor($(this).val()))
                }
            );
            syncCartToLocalStorage();
        })
        .on('keypress', function(e) {
            if (e.keyCode == 13) {
                $('#moze-checkout-button').focus();
                return false;
            }
        });

    $('form.moze-form a.plus, form.moze-form a.minus')
        .off()
        .on('click', function() {
            var input = $(this).parents('td.qty').find('input[name^="cart_item_"]');
            if ($(this).hasClass('plus')) {
                input.val(function(i, val) {
                    var newVal = parseInt(val) || 0;
                    return Math.max(newVal + 1, 1);
                });
            } else {
                input.val(function(i, val) {
                    var newVal = parseInt(val) || 2;
                    return Math.max(newVal - 1, 1);
                });
            }
            input.trigger('change');
        });

    $('form.moze-form a.delete')
        .off()
        .on('click', function() {

            var input = $(this).parents('td.qty').find('input[name^="cart_item_"]');
            var catItemID = input.attr('data-id');
            var catItemVariantID = input.attr('data-variant-id');

            new mozLive3({
                source: {
                    name: 'maincatalog',
                    superglobal: 1
                },
                action: 'catalog-delete-from-cart',
                parameters: {
                    cat_item_id: catItemID,
                    cat_item_variant_id: catItemVariantID
                },
                response: {
                    html: [
                        { name: 'maincatalogcartside', target: '#shopbar-sidecart-base' }
                    ]
                },
                errors: {
                    maintenance: mozLocalization.erInMaintenanceMode
                },
                onComplete: function() {
                    initCart();
                    var total = 0;
                    $('#shopbar-sidecart').find('input[name^="cart_item_"]').each(function() {
                        total = total + parseInt($(this).val());
                    });
                    if (total == 0) {
                        $('#shopbar-sidecart').hide();
                        var checkoutString = '/params/checkout/go/';
                        var reviewString = '/params/review/go/';
                        if (window.location.pathname.endsWith(checkoutString) || window.location.pathname.endsWith(reviewString)) {
                            window.location.reload();
                        }
                    }
                    $('.moze-added-to-cart').removeClass('moze-added-to-cart');
                    $('.moze-added-to-cart-item').removeClass('moze-added-to-cart-item').html(mozLocalization.cmCatalogCartAdd);
                    syncCartToLocalStorage();
                    reinitMozCatalogCartActions();
                }
            });

            if (typeof mozCatItem !== 'undefined' && typeof mozCatItemVariants !== 'undefined') {

                if (catItemID > 0 && catItemVariantID == 0) {
                    mozCatItem.stock = mozCatItem.stock_total;
                    toggleAddToCartButton(mozCatItem.stock === null || mozCatItem.stock > 0);
                }

                if (catItemID > 0 && catItemVariantID > 0) {
                    mozCatItemVariants.forEach(function(variant) {
                        if (variant.id == catItemVariantID) {
                            variant.stock = variant.stock_total;
                            var selection = getSelectedVariant();
                            if (selection.id == variant.id) {
                                toggleAddToCartButton(variant.stock === null || variant.stock > 0);
                            }
                        }
                    });
                }
            }
        });

    var lastInputInFocus = null;

    $('form.moze-form input[name^="cart_item_"]')
        .on("focusin", function() {
            lastInputInFocus = $(this);
        });

    $("#moze-checkout-button")
        .off()
        .on("click", function(e) {
            var checkoutButton = $(this);
            if (lastInputInFocus) {
                e.preventDefault();
                cartUpdateMozLiveFx({
                        cat_item_id: lastInputInFocus.attr('data-id'),
                        cat_item_variant_id: lastInputInFocus.attr('data-variant-id'),
                        count: Math.max(1, Math.floor(lastInputInFocus.val()))
                    },
                    function() {
                        window.location.href = checkoutButton.attr('href');
                    }
                );
                return false;
            }
        });

    // Counts the total number of products in the cart.

    var total = 0;

    $('#shopbar-sidecart').find('input[name^="cart_item_"]').each(function() {
        total = total + parseInt($(this).val());
    });

    $('.shopbar-cart span').html(total).toggle(total > 0);

    // Manages showing and hiding of the sidecart.
    // Additionally, PHP does not output the sidesearch if the user is not eligible to search.

    var isCatalog = $('.mz_catalogsidecart').attr('data-page-type') == 6,
        catalogLayout = $('.mz_catalogsidecart').attr('data-catalog-layout'),
        isSearchEnabled = $('.mz_catalog.cat-has-searchbox').length > 0;

    var showSidecart = $('.mz_catalogsidecart .shopbar-cart').length > 0,
        showSidesearch = isCatalog && isSearchEnabled;

    /*if (isMobileDevice()) {
        $('#shopicons').hide();
    }*/

    if (!isSmallTouchDevice()) {
        showSidesearch = isCatalog && isSearchEnabled && (catalogLayout == 'top');
    }

    $('.shopbar-search').toggle(showSidesearch);
    if (showSidesearch) $('.menu-icon.shopbar-search').css('display', 'flex');

    $('.shopbar-cart').toggle(showSidecart);
    if (showSidecart) $('.menu-icon.shopbar-cart').css('display', 'flex');

    $('#shopbar .separator').toggle(showSidesearch && showSidecart);
}

function createUid()
{
    return 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, function(c) {
        return (Math.random() * 16 | 0).toString(16);
    });
}

function isLocalStorageAvailable()
{
    if (typeof localStorage !== "undefined") {
        try {
            localStorage.setItem("featureTest", "yes");
            if (localStorage.getItem("featureTest") === "yes") {
                localStorage.removeItem("featureTest");
                return true;
            }
        }
        catch (e) {

        }
    }
    return false;
}

function setCartUID(uid)
{
    $("div.mz_catalogcart").attr("data-cart-id", uid);
    if (isLocalStorageAvailable()) {
        window.localStorage.setItem("mozCartID", uid);
    }

    new mozLive3({
        source: {
            name: 'maincatalog',
            superglobal: 1
        },
        action: 'catalog-set-cart-uid',
        parameters: {
            cart_uid: uid,
        },
        response: {},
        errors: {},
        onComplete: function () {}
    });
}

function getSessionCartUID()
{
    var sessionCartUID = $("div.mz_catalogcart").first().attr("data-cart-id");
    if (typeof sessionCartUID !== "undefined" && sessionCartUID !== "" && sessionCartUID) {
        return sessionCartUID;
    }

    return "";
}

function getLocalStorageCartUID()
{
    if (isLocalStorageAvailable()) {
        var localStorageCartUID = window.localStorage.getItem("mozCartID");
        if (typeof localStorageCartUID !== "undefined" && localStorageCartUID !== "" && localStorageCartUID) {
            return localStorageCartUID;
        }
    }

    return "";
}

function clearLocalStorageCart()
{
    if (isLocalStorageAvailable()) {
        window.localStorage.removeItem("mozCart");
        window.localStorage.removeItem("mozCartID");
    }
}

function setLocalStorageCart(cart, uid)
{
    if (isLocalStorageAvailable()) {
        window.localStorage.setItem("mozCart", JSON.stringify(cart));
        window.localStorage.setItem("mozCartID", uid);
    }
}

function getLocalStorageCart()
{
    if (isLocalStorageAvailable()) {

        var mozCart = window.localStorage.getItem("mozCart"),
            mozLocalStorageCartUID = getLocalStorageCartUID(),
            mozSessionCartUID = getSessionCartUID();

        if (mozSessionCartUID == mozLocalStorageCartUID && mozCart != null) {
            try {
                mozCart = JSON.parse(mozCart);
            }
            catch (e) {
                mozCart = [];
            }
        }
        else {
            mozCart = [];
        }

        return mozCart;
    }

    return [];
}

function getCartDataFromHtml()
{
    var mozCart = [];

    $("#shopbar-sidecart form.moze-form input[name^='cart_item_']")
        .each(function() {
            var mozCartItem = {
                id: $(this).attr("data-id"),
                text: $(this).attr("data-pref-title"),
                variant_id: $(this).attr("data-variant-id"),
                variant_text: $(this).attr("data-pref-variant"),
                count: $(this).val()
            };
            mozCart.push(mozCartItem);
        });

    return mozCart;
}

function syncCartToLocalStorage()
{
    if (isLocalStorageAvailable()) {
        setLocalStorageCart(getCartDataFromHtml(), getSessionCartUID());
    }
}

function syncLocalStorageToCart()
{
    if (isLocalStorageAvailable()) {

        var sessionCartUID = getSessionCartUID(),
            localStorageCartUID = getLocalStorageCartUID(),
            sessionCart = getCartDataFromHtml(),
            localStorageCart = getLocalStorageCart();

        if (sessionCartUID == localStorageCartUID &&
            sessionCart.length == 0 &&
            localStorageCart.length > 0) {

            new mozLive3({
                source: {
                    name: 'maincatalog',
                    superglobal: 1
                },
                action: 'catalog-add-to-cart-multi',
                parameters: {
                    cart: localStorageCart,
                    cart_uid: sessionCartUID,
                },
                response: {
                    callback: [
                        function(response) {
                            var json = JSON.parse(response);
                            if (json.is_valid_uid) {
                                $('#shopbar-sidecart-base').html(json.output);
                            }
                            else {
                                var newCartUID = createUid();
                                setCartUID(newCartUID);
                            }
                        }
                    ]
                },
                errors: {
                    
                },
                onComplete: function () {
                    initCart();
                    syncCartToLocalStorage();
                }
            });
        }
        else {

            new mozLive3({
                source: {
                    name: 'maincatalog',
                    superglobal: 1
                },
                action: 'catalog-check-cart-uid',
                parameters: {
                    cart_uid: sessionCartUID,
                },
                response: {
                    callback: [
                        function(response) {
                            var json = JSON.parse(response);
                            if (json.result == 'invalid') {
                                var newCartUID = createUid();
                                setCartUID(newCartUID);
                            }
                        }
                    ]
                },
                errors: {},
                onComplete: function () {
                    syncCartToLocalStorage();
                }
            });
        }
    }
}

$(document).ready(function() {

    if ($(".mz_component.mz_catalog").length ||
        $(".mz_component.mz_catalogsidecart").length) {

        var sessionCartUID = getSessionCartUID(),
            localStorageCartUID = getLocalStorageCartUID();

        // New cart.

        if (sessionCartUID === "" && localStorageCartUID === "") {
            setCartUID(createUid());
        }

        // Using the session cart UID, the Local Storage might be disabled.

        if (sessionCartUID !== "" && localStorageCartUID === "") {
            setCartUID(sessionCartUID);
        }

        // The cart is in the local storage.

        if (sessionCartUID === "" && localStorageCartUID !== "") {
            setCartUID(localStorageCartUID);
        }

        // Prefers the session cart UID over the Local Storage.

        if (sessionCartUID !== "" && localStorageCartUID !== "") {
            if (sessionCartUID != localStorageCartUID) {
                clearLocalStorageCart();
                setCartUID(sessionCartUID);
            }
        }

        syncLocalStorageToCart();
    }
});

/**
 * Searchbox
 */

function initSearchbox()
{
    function submitSearchbox()
    {
        var query = $('.moze-catalog-searchbox-form .search-query').val();
        query = $.trim(query);
        if (query != '') {
            window.location =
                $('.moze-catalog-searchbox-form').attr('action') +
                'params/search/' + encodeURIComponent(query.replace('/', ' ')) + '/';
        }
    }

    function submitSideSearchbox()
    {
        var query = $('.moze-catalog-searchbox-sideform .search-query').val();
        query = $.trim(query);
        if (query != '') {
            window.location =
                $('.moze-catalog-searchbox-sideform').attr('action') +
                'params/search/' + encodeURIComponent(query.replace('/', ' ')) + '/';
        }
    }

    $('.moze-catalog-searchbox-form, .moze-catalog-searchbox-sideform').submit(function(e) {
        e.preventDefault();
    });

    $('.moze-catalog-searchbox-form .search-query').keyup(function(e) {
        if (e.keyCode == 13) {
            submitSearchbox();
        }
    });

    $('.moze-catalog-searchbox-sideform .search-query').keyup(function(e) {
        if (e.keyCode == 13) {
            submitSideSearchbox();
        }
    });

    $('.moze-catalog-searchbox-form .search-btn').click(function() {
        submitSearchbox();
    });

    $('.moze-catalog-searchbox-sideform .search-btn').click(function() {
        submitSideSearchbox();
    });
}

/**
 * Fixed menu
 */

function initFixedMenu() {

    function analyzeLogo(logo) {
        $('#top').removeClass('resize-logo'); // for backend
        if (logo.height() > 50) {
            $('#top').addClass('resize-logo');
        }
    }

    $('body.backend #title').on('mousedown touchstart', function() {
        if ($('#top').hasClass('sticky')) {
            window.scrollTo(0, 0);
        }
    });

    if ($('#menu').length && $('body').not('.mobile-header').length && ($('#menu').outerHeight() < 75)) {

        if ($('#header > #header-main > #menu, .legacy-sticky-menu, #header + #menubox').length) {

            // Updates floating menu colors
            if (typeof legacyInitFixedMenuColors === 'function') {
                legacyInitFixedMenuColors();
            }

            var scrollThreshold, marginSize, shrinkDelta;
            var absoluteTop = ($('#top').css('position') == 'absolute');
            var isBackend = $('body').hasClass('backend');
            var legacyMenu = ($('#top.legacy-sticky-menu').length);

            if (legacyMenu) {
                $('#menu').after($('<div id="menu-placeholder"></div>'));
            }

            if (!isBackend) {
                $('#top #title img').on('load', function() {
                    analyzeLogo($(this));
                }).each(function() {
                    if(this.complete && typeof $(this).attr('src') != 'undefined') {
                        $(this).trigger('load');
                    }
                });
            }

            /* Calculates when to engage fixed mode and how much to offset body */

            function setScrollLimits() {

                if ($('#top').hasClass('sticky')) return; // do not run if scrolled

                var topOffset = $('#top').offset().top;

                // set some defaults
                scrollThreshold = topOffset;
                marginSize = topOffset + $('#top').outerHeight();
                shrinkDelta = $('#header').outerHeight() - $('#header').height(); // avoid background flicker

                var isFat = ($('body').hasClass('header-menu-centered') || $('body').hasClass('header-menu-down') || $('#top').hasClass('menu-wrapped'));
                var isSemiFat = (!isFat && $('#header-main').length && ($('#header-main').offset().top + 1 >= $('#header-side').offset().top + $('#header-side').outerHeight()));
                var legacyHasMenubox = ($('#header + #menubox').length);

                $('#top').removeClass('is-fat');
                $('#top').removeClass('is-semifat');

                if (legacyMenu) {
                    scrollThreshold = $('#menu').offset().top;
                    marginSize = $('#menu').outerHeight(true);
                } else if (legacyHasMenubox) {
                    $('#top').addClass('has-menubox');
                    scrollThreshold = topOffset + $('#header').outerHeight();
                } else if (isFat) {  // modern designs, logo above menu
                    $('#top').addClass('is-fat');
                    scrollThreshold = topOffset + $('#header').height() - $('#menu').outerHeight(true);
                } else if (isSemiFat) { // modern designs, menu wrapped under icons
                    $('#top').addClass('is-semifat');
                    scrollThreshold = topOffset + $('#header-side').outerHeight(true);
                } else if (absoluteTop) { // impress, image
                    scrollThreshold = topOffset;
                    marginSize = 0;
                } else {  // mission abort if the menu too big
                    if ($('#menu').outerHeight() > 100) return false;
                }

                if ($('body').hasClass('transparentnavi')) { // !!!
                    marginSize = 0;
                }

                if ($('#wrap #bigbar + #top').length) { // creator design
                    marginSize = $('#top').outerHeight();
                }

                return true;

            }

            /* initial calculations, some images may not have loaded
            and thus we recalculate later whenever stickyness state changes */

            if (!setScrollLimits()) return;

            /* this is where change to menu stickiness state happens */

            $(window).on('resize scroll', function () {

                var elem = $('#top').nextAll('div, main').first();
                var scrollTop = $(window).scrollTop();
                var isSticky = $('#top').hasClass('sticky');
                var becameNormal = false;

                if (elem.length) {
                    if ((scrollTop > scrollThreshold) && !window.matchMedia("(max-width: 750px), (max-height: 500px)").matches) {
                        // stick
                        if (!isSticky) {
                            /* if during initial calculations some images were not loaded
                            the thresholds might not be accurate, try to recalculate
                            them here */
                            setScrollLimits();
                            if (isBackend) {
                                analyzeLogo($('#top #title img'));
                            }
                            if (scrollTop <= scrollThreshold)
                                return true;
                        }
                        $('#top').addClass('sticky');
                        if (legacyMenu) {
                            $('#menu-placeholder').css('height', marginSize);
                        } else if (!absoluteTop) {
                            elem.css('margin-top', marginSize);
                        }
                    } else {
                        // unstick
                        becameNormal = isSticky;
                        $('#top').removeClass('sticky');
                        elem.css('margin-top', '');
                        if (legacyMenu) {
                            $('#menu-placeholder').css('height', '');
                        }
                    }
                }

                if (scrollTop > (scrollThreshold + shrinkDelta)) {
                    $('#top').addClass('scrolled-deep');
                } else {
                    $('#top').removeClass('scrolled-deep');
                }

                /* if menu is no more sticky, we can recalculate thresholds
                as they might have changed (e.g. page was loaded scrolled and
                due to unloaded images we did not get a chance to get final
                calculations) */
                if (becameNormal) {
                    setScrollLimits();
                }

            });

            /* If page is already scrolled on load and our scroll event was attached
            after browser-fired onscroll already passed, let's fire our own onscroll
            to show the fixed menu */

            if ($(window).scrollTop() > 0) {
                $(window).trigger('scroll');
            }

        }

    }

}

function manageMenuWrapClasses() {
    if ($('#menu').length && $('#title').length) {
        var isWrapped = $('#menu').offset().top + 1 >= ($('#title').offset().top +  $('#title').outerHeight());
        $('#top').toggleClass('menu-wrapped', isWrapped);
    }
}

function manageHeaderElementProportions() {
    /* manages header-menu-middle percentages as this is not possible by CSS */
    if ($('body').hasClass('header-menu-middle') && $('#menu').length && $('#title').length && ($(window).width() >= 751) && ($(window).height() >= 500)) {
        var sidePercent = ($('#header-side').outerWidth() / $('#header').width()) * 100; // % of total width for side
        var titlePercent = ($('#title .mz_logo').outerWidth() / $('#header').width()) * 100;
        var sidePercent = Math.max(sidePercent, titlePercent) + 1; // add 1 percent for safety

        var mainPercent = 100 - sidePercent; // % of total width for main
        titlePercent = (100 / mainPercent) * sidePercent; // internal % for title inside of main
        var menuPercent = 100 - titlePercent;
        $('#header-main').css('max-width', mainPercent + '%');
        $('#title').css('width', titlePercent + '%');
        $('#menu').css('width', menuPercent + '%');
    } else {
        $('#header-main').css('max-width', '');
        $('#title').css('width', '');
        $('#menu').css('width', '');
    }
}

/* Initializes dynamic header resize monitoring */

function initHeaderLayoutHelper() {
    if (!$('body').hasClass('mobile-header')) {
        // determine after fonts loaded
        manageHeaderElementProportions();
        manageMenuWrapClasses();
    }
    initHeaderResizeObserver();
}

function transparentHeaderPossible() {
    var topBanner = $('.section.section-banner, #bigbar');
    var topSection = $('.mz_grid > .section').first();
    if (topSection.length != 1) {
        return false;
    }
    var notAvailable = (topSection.hasClass('section-bigimg') && (topSection.hasClass('section-boxed') || topSection.hasClass('section-halved') || !topSection.hasClass('section-nobox')));
    return (topSection.length && !topBanner.length && !notAvailable);
}

//caller must check if transparent header enabled
function calculateTopSectionSpacers() {
    var offset = $('#top').outerHeight();
    if ($('#top').data('last-outer-width') != $('#top').outerWidth() || offset > $('#top').data('max-outer-height') || $(window).scrollTop() == 0) {
        $('#top').data('last-outer-width', $('#top').outerWidth());
        $('#top').data('max-outer-height', offset)
    } else {
        offset = $('#top').data('max-outer-height');
    }
    var topoffset = offset;
    $('#top-spacer').css('height', offset);
    $('#top-bottom-spacer').css('height', 0);
    //attempt centering bigimg container in slice area together with #top area
    var fulltopheight = $('#top-spacer').parent('.section-bigimg').outerHeight() || 0;
    var containerheight = $('#top-spacer').parent('.section-bigimg').children('.container').children('.textbox').outerHeight() || 0;
    if (fulltopheight && containerheight) {
        topoffset = offset / 2;
        $('#top-spacer').css('height', topoffset);
        $('#top-bottom-spacer').css('height', topoffset);
        if ((fulltopheight - containerheight) / 2 < offset) {
            var diff = offset - (fulltopheight - containerheight) / 2;
            topoffset = topoffset + diff;
            if (topoffset > offset) {
                topoffset = offset;
            }
        }
    }
    var bottomoffset = offset - topoffset;
    $('#top-spacer').css('height', topoffset);
    $('#top-bottom-spacer').css('height', bottomoffset);
}

function enableTransparentHeader() {

    if ($('body').hasClass('header-transparent')) {

        if (transparentHeaderPossible()) {

            var topSection = $('.mz_grid > .section').first();

            $('body').addClass('transparentnavi');
            $(window).trigger('resize');

            // add text class
            topSection = topSection.first();
            if (topSection.hasClass('section-text-color-1')) {
                $('#top').addClass('section-text-color-1');
            } else {
                $('#top').removeClass('section-text-color-1');
            }

            // insert or update spacer
            var topSectionSpacer = null;
            if ($('#top-spacer').length) {
                topSectionSpacer = topSection.find('#top-spacer');
                if (!topSectionSpacer.length) {
                    $('#top-spacer').remove();
                    topSectionSpacer = null;
                }
            }
            var topSectionSpacerBottom = null;
            if ($('#top-bottom-spacer').length) {
                topSectionSpacerBottom = topSection.find('#top-bottom-spacer');
                if (!topSectionSpacerBottom.length) {
                    $('#top-bottom-spacer').remove();
                    topSectionSpacerBottom = null;
                }
            }
            if (!topSectionSpacer) {
                topSectionSpacer = $('<div>').attr('id', 'top-spacer');
                topSection.prepend(topSectionSpacer);
            }
            if (!topSectionSpacerBottom) {
                topSectionSpacerBottom = $('<div>').attr('id', 'top-bottom-spacer');
                topSection.append(topSectionSpacerBottom);
            }
            calculateTopSectionSpacers();
        }

    }

}

function disableTransparentHeader() {
    $('#top').removeClass('section-text-color-1');
    $('#top-spacer').remove();
    $('#top-bottom-spacer').remove();
    $('body').removeClass('transparentnavi');
}

/* Following resizes the spacer for transparent header dynamically only as needed */

var headerResizeObserver = null;

function onSectionResized() {
    if ($('body').hasClass('transparentnavi')) {
        calculateTopSectionSpacers();
    }
}

function onHeaderResized() {
    if ($('body').hasClass('transparentnavi')) {
        calculateTopSectionSpacers();
    }
    if (!$('body').hasClass('mobile-header')) {
        manageMenuWrapClasses();
        manageHeaderElementProportions();
    }

}

function initHeaderResizeObserver() {
    if ($('#top').length == 0) {
        return;
    }
    if ("ResizeObserver" in window && !headerResizeObserver) {
        headerResizeObserver = new ResizeObserver(onHeaderResized).observe(document.querySelector('#top'));
    }
}

function initHeaderSideMenu() {
    $('#languages .menu-icon svg').replaceWith(icon_languages);
}

function loadSocialIcons() {

    var networks = [
        'twitter',
        'facebook',
        'pinterest',
        'linkedin',
        'rss',
        'draugiem',
        'tiktok',
        'instagram',
        'youtube'
    ]

    networks.forEach(function (item, index) {
        var elem = $('.icon-' + item);
        if (elem.length) {
            var imgURL = FRONTEND_CDN + '/designs/_shared/css/social-icons/' + item + '.svg';
            jQuery.get(imgURL, function(data) {
                // Get the SVG tag, ignore the rest
                var $svg = jQuery(data).find('svg');
                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');
                // Replace image with new SVG
                elem.append($svg);
            }, 'xml');
        }
    });

}


/**
 * Accordion
 */

function initAccordionComponents()
{
    function createButton(className, imgSrc) {
        return $('<span>').addClass('arrow').addClass(className).append($(imgSrc));
    }

    var imgExpand = createButton('unfold', icon_unfold);
    var imgCollapse = createButton('fold', icon_fold);

    $('.mz_accordion .subgrid-cell.one').attr('role', 'button').attr('tabindex', '0');

    $('.mz_accordion .subgrid-cell.one .arrow.unfold, .mz_accordion .subgrid-cell.one .arrow.fold').remove();
    $('.mz_accordion .subgrid-cell.one').append(imgExpand).append(imgCollapse);

    function rowClick(elem, e) {
        var section = elem.parents('.subgrid-row');
        if (section.length && section.hasClass('expanded')) {
            if (!$(e.target).closest('.mz_component[data-role]').length) {
                section.removeClass('expanded');
            }
        }
        else {
            section.addClass('expanded');
        }
    }

    $('.mz_accordion .subgrid-cell.one')
        .off('click.arrowToggle')
        .on('click.arrowToggle', function(e) {
             rowClick($(this), e);
        });

    $('.mz_accordion .subgrid-cell.one')
        .off('keydown.arrowToggle')
        .on('keydown.arrowToggle', function(e) {
        // 13 is the key code for the Enter key
        // 32 is the key code for the Space key
        if (!$('body').hasClass('backend')) {
            if (e.which === 13 || e.which === 32) {
                // Prevent the default action to stop scrolling when space is pressed
                e.preventDefault();
                rowClick($(this), e);
            }
        }
    });

}

/**
 * DOM listener for lazy load of images
 */

document.addEventListener("DOMContentLoaded", function() {
    var lazyloadImages;

    if ("IntersectionObserver" in window) {
        lazyloadImages = document.querySelectorAll("body:not(.backend) .mz_grid .mz_wysiwyg.mz_editable .moze-wysiwyg-editor img, body:not(.backend) #sidebar .mz_wysiwyg.mz_editable .moze-wysiwyg-editor img, .mz_editable .moze-post-container img");

        if (lazyloadImages.length > 8) {

            var imageObserver = new IntersectionObserver(function(entries, observer) {

                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            var image = entry.target;
                            if (!image.complete || image.naturalHeight === 0) {
                                image.src = image.dataset.src;
                                imageObserver.unobserve(image);
                            }
                        }
                    });

            });

            lazyloadImages.forEach(function(image) {
                image.dataset.src = image.src;
                image.removeAttribute("src");
                imageObserver.observe(image);
            });

        }

    }

});

/**
 * Simple popup component
 */

var simpleModalPopup = {

    options: {
        txtTitle: '',
    },

    init: function() {

        var $popup = $(`
            <div class="moze-modal-popup">
                <div class="moze-popup-overlay">
                </div>
                <div class="moze-popup-window" aria-modal="true" role="dialog">
                </div>
            </div>
        `);
        simpleModalPopup.container = $popup;

        if (simpleModalPopup.options.txtTitle != '') {
             $popup.attr('aria-label', simpleModalPopup.options.txtTitle);
        }

        $popup.find('.moze-popup-window').append(simpleModalPopup.options.content);
        $popup.find('.moze-popup-overlay').click(function(event) {
            if (event.target === this) {
                simpleModalPopup.close();
            }
        });

        simpleModalPopup.resizeHandler = function() {
            simpleModalPopup.resize();
        };
        $(window).resize(simpleModalPopup.resizeHandler);

        $('.moze-modal-popup').remove();
        $('body').append($popup);
        $popup.show();
        simpleModalPopup.resize();

    },

    show: function(options){
        simpleModalPopup.options = options;
        simpleModalPopup.init();
        if (typeof simpleModalPopup.options.onShow === 'function') {
            simpleModalPopup.options.onShow();
        }
    },

    close: function() {
        if (typeof simpleModalPopup.options.onClose === 'function') {
            simpleModalPopup.options.onClose();
        }
        simpleModalPopup.container.remove();
        $(window).off('resize', simpleModalPopup.resizeHandler);
    },

    resize: function() {
        // Center the window
        var $popupWindow = simpleModalPopup.container.find('.moze-popup-window');
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        var panelWidth = $popupWindow.outerWidth();
        var panelHeight = $popupWindow.outerHeight();
        var leftPosition = (windowWidth - panelWidth) / 2;
        var topPosition = (windowHeight - panelHeight) / 2;
        $popupWindow.css({
            'left': leftPosition + 'px',
            'top': topPosition + 'px'
        });
    }

}

/* End */