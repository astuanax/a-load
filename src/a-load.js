;
var a = {
    version: '0.1',
    options: {
        debug: true,
        log: true,
        cdn: '',
        javascriptpath: 'assets/javascripts/',
        csspath: 'assets/stylesheets/'
    },
    mng: {
        _add: function(t, n, v) {
            if ('undefined' === typeof(n) || 'undefined' === typeof(v)) {
                a.mng._log({
                    Type: t,
                    Message: "Name or value is not set."
                })
                return;
            }
            a[t][n] = {};
            a[t][n]['filename'] = v
        },
        _log: function(m) {
            a.options.log ? console.log(m) : $();
        },
        _registercss: function(n, v) {
            if ('undefined' === typeof(n) || 'undefined' === typeof(v)) {
                a.mng._log({
                    Type: 'css',
                    Message: "Name or value is not set."
                })
                return this;
            }
            a.mng._log(['css', n, v]);
            var link = document.createElement("link"),
                head = document.getElementsByTagName("head")[0];
            link.rel = "stylesheet", link.href = a.options.csspath + v.filename;
            head.parentNode.insertBefore(link, head);
        },
        _registerplugin: function(n, v) {
            if ('undefined' === typeof(n) || 'undefined' === typeof(v)) {
                a.mng._log({
                    Type: 'plugin',
                    Message: "Name or value is not set."
                })
                return this;
            }
            a.mng._log(['plugin test', n, v]);
            var result = $.Deferred(),
                script = document.createElement("script");
            script.async = "async";
            script.src = a.options.cdn + a.options.javascriptpath + v.filename;
            script.onload = script.onreadystatechange = function(_, isAbort) {
                if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                    if (isAbort) {
                        result.reject();
                    } else {
                        result.resolve();
                    }
                }
            };
            script.onerror = function() {
                result.reject();
            };
            head = document.getElementsByTagName("head")[0];
            head.parentNode.insertBefore(script, head)
            a.data['promises'].push(result.promise());
        },
        registerCSS: function(n, v) {
            a.mng._add('css', n, v);
        },
        registerPlugin: function(n, v) {
            a.mng._add('plugins', n, v);
        },
        registerFunction: function(n, v) {
            a.mng._add('functions', n, v);
        }
    },
    // Add functions in this object
    functions: {},
    // Add default plugins in this object
    plugins: {},
    css: {},
    data: {},
    init: function() {
        $(window).ready( function(){
            a.data['promises'] = []; $.when($.each(a.plugins, function(k, v) {
                a.mng._registerplugin(k, v)
            })); $.when($.each(a.css, function(k, v) {
                a.mng._registercss(k, v)
            })); $.when.apply($, a.data['promises']).done(function() {
                $.each(a.functions, function(key, value) {
                    value();
                    a.mng._log([key, value]);
                });
            });
        });
    }
};
