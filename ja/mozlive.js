/* MozLive 3 */

function mozLive3(settings)
{
    var defaults = {
        source: null,         // Source object (id, name, global, superglobal).
        action: '',           // Component-specific action to execute.
        parameters: {},       // Additional action-specific parameters.
        response: {
            callback: [],     // Callbacks to execute on the response.
            append: [],       // Objects to append with the response.
            replace: [],      // Objects to replace with the response.
            html: [],         // Objects to replace the HTML with the response.
            redirect: null,   // Redirect to perform (URL, @response, @refresh).
        },
        errors: {
            maintenance: 'We can not process your request right now. Please try again later.'
        }
    };

    this.options = $.extend(true, {}, this.defaults, settings);
    this.run();
};

mozLive3.prototype.resolveObject = function(definitions)
{
    var base = this,
        resolved = null;

    if (definitions == '@self') {
        definitions = base.options.source;
    }

    if (typeof definitions.id !== 'undefined') {
        resolved = $('[data-cid="' + definitions.id + '"]');
    }
    else if (typeof definitions.name !== 'undefined') {
        resolved = $('[data-name="' + definitions.name + '"]');
    }
    else if (typeof definitions.jquery !== 'undefined') {
        resolved = $(definitions.jquery);
    }

    return resolved;
};

mozLive3.prototype.respond = function(mozResult) {

    var base = this;

    // Runs callbacks.

    if ($.isArray(base.options.response.callback)) {
        base.options.response.callback.forEach(function(value, index) {
            value(mozResult);
        });
    }

    // Runs append tasks.

    if ($.isArray(base.options.response.append)) {
        base.options.response.append.forEach(function(value, index) {
            var obj = base.resolveObject(value);
            if (obj) {
                obj.append(mozResult);
            }
        });
    }

    // Runs replace tasks.

    if ($.isArray(base.options.response.replace)) {
        base.options.response.replace.forEach(function(value, index) {
            var obj = base.resolveObject(value);
            if (obj) {
                if (typeof value.target == 'string') {
                    obj.find(value.target).replaceWith(mozResult);
                }
                else {
                    obj.replaceWith(mozResult);
                }
            }
        });
    }

    // Runs replace HTML tasks.

    if ($.isArray(base.options.response.html)) {
        base.options.response.html.forEach(function(value, index) {
            var obj = base.resolveObject(value);
            if (obj) {
                if (typeof value.target == 'string') {
                    obj.find(value.target).html(mozResult);
                }
                else {
                    obj.html(mozResult);
                }
            }
        });
    }

    // Runs redirect tasks.

    if (typeof base.options.response.redirect == 'string') {
        var redirectTo = '';
        switch (base.options.response.redirect) {
            case '@response':
                redirectTo = mozResult;
                break;
            case '@refresh':
                redirectTo = '/m/refresh/';
                break;
            default:
                redirectTo = base.options.response.redirect;
                break;
        }
        window.location.href = redirectTo;
    }
};

mozLive3.prototype.run = function()
{
    var base = this;

    $.ajax({
        url: '/m/mozlive/' + base.options.action + '/',
        type: 'post',
        data: {
            src: base.options.source,
            action: base.options.action,
            parameters: base.options.parameters,
            url: window.location.pathname
        },
        success: function(response) {
            if (response.error == true) {
                if (response.reason == 'maintenance' && base.options.errors && base.options.errors.maintenance) {
                    alert(base.options.errors.maintenance);
                }
            }
            else {
                base.respond(response);
                if (typeof base.options.onComplete == 'function') {
                    base.options.onComplete(response);
                }
            }
        }
    });
};

/* MozLive 2 */

function mozLive2(settings)
{
    var base = this;

    /**
     * Default settings.
     */
    this.defaults = {
        source: null,         // Source object (id, name, global, superglobal).
        action: '',           // Component-specific action to execute.
        parameters: {},       // Additional action-specific parameters.
        response: {
            callback: [],     // Callbacks to execute on the response.
            append: [],       // Objects to append with the response.
            replace: [],      // Objects to replace with the response.
            html: [],         // Objects to replace the HTML only.
            redirect: null,   // Redirect to perform (URL, @response, @refresh).
        },
        errors: {
            maintenance: 'We can not process your request right now. Please try again later.'
        }
    };

    /**
     * Resolves a jQuery object from definitions (source, response.append, response.replace).
     */
    this.resolveObject = function(definitions) {

        var resolved = null;

        if (definitions == '@self') {
            definitions = base.options.source;
        }

        if (typeof definitions.id !== 'undefined') {
            resolved = $('[data-cid="' + definitions.id + '"]');
        }
        else if (typeof definitions.name !== 'undefined') {
            resolved = $('[data-name="' + definitions.name + '"]');
        }

        return resolved;
    };

    /**
     * Executes the MozLive function.
     */
    this.run = function() {

        $.ajax({
            url: '/m/mozlive/',
            type: 'post',
            data: {
                src: base.options.source,
                action: base.options.action,
                parameters: base.options.parameters,
                url: window.location.pathname
            },
            success: function(response) {
                if (response.error == true) {
                    if (response.reason == 'maintenance') {
                        alert(base.options.errors.maintenance);
                    }
                }
                else {
                    base.respond(response);
                    if (typeof base.options.onComplete == 'function') {
                        base.options.onComplete(response);
                    }
                }
            }
        });
    };

    /**
     * Responds after executing the MozLive function.
     */
    this.respond = function(response) {

        // Runs callbacks.

        if ($.isArray(base.options.response.callback)) {
            base.options.response.callback.forEach(function(value, index) {
                value(response);
            });
        }

        // Runs append tasks.

        if ($.isArray(base.options.response.append)) {
            base.options.response.append.forEach(function(value, index) {
                var obj = base.resolveObject(value);
                if (obj) {
                    obj.append(response);
                }
            });
        }

        // Runs replace tasks.

        if ($.isArray(base.options.response.replace)) {
            base.options.response.replace.forEach(function(value, index) {
                var obj = base.resolveObject(value);
                if (obj) {
                    if (typeof value.target == 'string') {
                        obj.find(value.target).replaceWith(response);
                    }
                    else {
                        obj.replaceWith(response);
                    }
                }
            });
        }

        // Runs replace HTML tasks.

        if ($.isArray(base.options.response.html)) {
            base.options.response.html.forEach(function(value, index) {
                var obj = base.resolveObject(value);
                if (obj) {
                    if (typeof value.target == 'string') {
                        obj.find(value.target).html(response);
                    }
                    else {
                        obj.html(response);
                    }
                }
            });
        }

        // Runs redirect tasks.

        if (typeof base.options.response.redirect == 'string') {
            var redirectTo = '';
            switch (base.options.response.redirect) {
                case '@response':
                    redirectTo = response;
                    break;
                case '@refresh':
                    redirectTo = '/m/refresh/';
                    break;
                default:
                    redirectTo = base.options.response.redirect;
                    break;
            }
            window.location.href = redirectTo;
        }
    };

    /**
     * Runs the MozLive function.
     */
    this.options = $.extend({}, this.defaults, settings);
    this.run();

    return false;
};

/* MozLive */

function mozLive(settings) {

    var base = this;

    /**
     * Default settings.
     */
    base.defaults = {
        src: null,          // Source component.
        dest: 'self',       // Destination component (for output).
        action: '',         // Component-specific action to execute.
        task: 'replace',    // Post-task for the output (append, replace).
        tasktarget: null,   // Post-task specific target (jQuery selector).
        parameters: {},     // Additional parameters for the action.
        errors: {
            maintenance: 'We can not process your request right now. Please try again later.'
        },
        onComplete: function() { }
    };

    base.processResult = function (response) {

        // Execute callback

        if (typeof base.options.parameters.callback !== 'undefined') {
            base.options.parameters.callback(response);
        }

        // Is it a refresh task?

        if (base.options.task === 'refresh') {
            window.location.href = '/m/refresh/';
            return;
        }

        // Is it a redirect task?

        if (base.options.task === 'redirect') {
            if (typeof base.options.parameters.href !== 'undefined') {
                window.location.href = base.options.parameters.href;
            }
            return;
        }

        if (base.options.task == 'redirect-response') {
            window.location.href = response;
            return;
        }

        if (base.options.task == 'replace-html') {
            var newDoc = document.open('text/html');
            newDoc.write(response);
            newDoc.close();
            return;
        }

        // It should be replace or append task.

        var updatable = null;
        var updatableJq = null;

        if (base.options.dest !== null && base.options.dest !== 'self') {
            updatable = base.options.dest;
        }
        if (base.options.dest === 'self') {
            updatable = base.options.src;
        }

        if (updatable != null) {
            if (typeof updatable.id !== 'undefined') {
                updatableJq = $('[data-cid="' + updatable.id + '"]');
            }
            else if (typeof updatable.name !== 'undefined') {
                updatableJq = $('[data-name="' + updatable.name + '"]');
            }
        }

        if (updatableJq != null) {
            switch (base.options.task) {
                case 'replace':
                    if (base.options.tasktarget == null) {
                        $(updatableJq).replaceWith(response);
                    }
                    else {
                        $(updatableJq).find(base.options.tasktarget).replaceWith(response);
                    }
                    break;

                case 'append':
                    $(updatableJq).append(response);
                    break;
            }
        }

    };

    /**
     * Executes the function.
     */
    base.run = function () {

        var base = this;

        $.ajax({
            url: '/m/mozlive/' + base.options.action + '/',
            type: 'post',
            data: {
                action: base.options.action,
                url: window.location.pathname,
                src: base.options.src,
                parameters: base.options.parameters,
            },
            success: function (result) {
                if (result.error == true) {
                    if (result.reason == 'maintenance' && base.options.errors && base.options.errors.maintenance) {
                        alert(base.options.errors.maintenance);
                    }
                }
                else {
                    base.processResult(result);
                    if (typeof base.options.onComplete == 'function') {
                        base.options.onComplete(result);
                    }
                }
            }
        });

    };

    // Runs the MozLive.

    base.options = $.extend({}, this.defaults, settings);
    base.run();

    return false;
}


//mozPluginsCollection
mozPlugins = new (function() {

    var collection = this;
    collection.plugins = {};
    eventQueue = {};

    collection.subscribeEvent = function(eventName, callback) {
        $(document).on(eventName, function(event) {
            callback.apply(null, arguments);
        });

        if (eventQueue.hasOwnProperty(eventName)) {
            callback.apply(null, eventQueue[eventName]);
        }
    }

    function mozPluginsBase(settings) {
        var base = this;

        base.defaults = {
            containerElement: null,
            eventName: '',
            eventParams: {},
            onAnyInitiated: null,
            onAnyContent: null
        };

        base.order = 0;
        base.anyInitiated = false;
        base.anyContent = false;

        base.insertInOrder = function(htmlContentElement, position) {
            var added = false;
            if (base.options.containerElement.find(htmlContentElement).length === 0) {
                base.options.containerElement.children('div').each(function () {
                    var existingPosition = parseInt($(this).data('order'), 10);
                    if (position < existingPosition) {
                        $(this).before(htmlContentElement);
                        added = true;
                        return false;
                    }
                });

                if (!added) {
                    base.options.containerElement.append(htmlContentElement);
                }
            }
        }

        base.eventCallbackStart = function() {
            var position = ++base.order;
            var contentWrapper = $('<div>').attr('data-order', position);

            function eventCallbackFinish(htmlContent) {
                contentWrapper.html(htmlContent);
                base.insertInOrder(contentWrapper, position);

                if (!base.anyContent) {
                    base.anyContent = true;
                    if (base.options.onAnyContent) {
                        base.options.onAnyContent.call(base);
                    }
                }

                return contentWrapper;
            }

            if (!base.anyInitiated) {
                base.anyInitiated = true;
                if (base.options.onAnyInitiated) {
                    base.options.onAnyInitiated.call(base);
                }
            }

            return {
                setContent: eventCallbackFinish,
                params: base.options.eventParams
            }
        }

        function sendEvent(eventName, eventData) {
            try {
                eventQueue[eventName] = [{ type: eventName }].concat(eventData);

                $(document).trigger(eventName, eventData);
            } catch (e) {
                if (console && console.error) {
                    console.error(e);
                }
            }
        }

        base.run = function() {
            $(function() {
                sendEvent(base.options.eventName, [base.eventCallbackStart, base.options.eventParams]);
            });
        }

        base.updated = function(updateParams) {
            $(function() {
                sendEvent(base.options.eventName + '-updated', [base.eventCallbackStart, base.options.eventParams, updateParams]);
            });
        }

        base.options = $.extend({}, base.defaults, settings);
        if (base.options.containerElement && base.options.eventName) {
            base.run();
        }

        return false;

    }


    //mozPlugins_ItemAfterPrice
    function mozPlugins_ItemAfterPrice(settings) {
        mozPluginsBase.call(this, settings);
    }
    mozPlugins_ItemAfterPrice.prototype = Object.create(mozPluginsBase.prototype);
    mozPlugins_ItemAfterPrice.prototype.constructor = mozPlugins_ItemAfterPrice;

    collection.InitPluginItemAfterPrice = function(settings) {
        collection.plugins.ItemAfterPrice = new mozPlugins_ItemAfterPrice(settings);
    }


    //mozPlugins_AfterCart
    function mozPlugins_AfterCart(settings) {
        mozPluginsBase.call(this, settings);
    }
    mozPlugins_AfterCart.prototype = Object.create(mozPluginsBase.prototype);
    mozPlugins_AfterCart.prototype.constructor = mozPlugins_AfterCart;

    collection.InitPluginAfterCart = function(settings) {
        collection.plugins.AfterCart = new mozPlugins_AfterCart(settings);
    }


    //mozPlugins_AfterCheckout
    function mozPlugins_AfterCheckout(settings) {
        mozPluginsBase.call(this, settings);
    }
    mozPlugins_AfterCheckout.prototype = Object.create(mozPluginsBase.prototype);
    mozPlugins_AfterCheckout.prototype.constructor = mozPlugins_AfterCheckout;

    collection.InitPluginAfterCheckout = function(settings) {
        collection.plugins.AfterCheckout = new mozPlugins_AfterCheckout(settings);
    }

})();







/* End */