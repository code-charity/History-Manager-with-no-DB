/*---------------------------------------------------------------
>>> BACKGROUND
-----------------------------------------------------------------
1.0 Parse history
2.0 Extension installed
3.0 History updated
---------------------------------------------------------------*/

/*---------------------------------------------------------------
1.0 PARSE HISTORY
---------------------------------------------------------------*/

function parseHistory(item, result) {
    var url = item.url,
        domain = url.split('/')[2],
        path = url.match(/\w(\/.*)/)[1],
        q = url.match(/[?&]q=[^&]+/),
        title = item.title,
        visit_count = item.visitCount;

    if (result.domains[domain]) {
        result.domains[domain].visitCount += visit_count;
    } else {
        result.domains[domain] = {
            items: {},
            visitCount: visit_count
        };
    }

    result.domains[domain].items[path] = {
        title: title,
        visitCount: visit_count
    };

    result.pages[url] = {
        title: title,
        visitCount: visit_count,
        star: 0,
        tags: ''
    };

    result.params[url] = {
        title: title,
        visitCount: visit_count,
        star: 0,
        tags: ''
    };
}


/*---------------------------------------------------------------
2.0 EXTENSION INSTALLED
---------------------------------------------------------------*/

chrome.runtime.onInstalled.addListener(function() {
    chrome.history.search({
        text: '',
        startTime: 0,
        maxResults: 999999999
    }, function(items) {
        var storage = {
            _all: {
                domains: {},
                pages: {},
                params: {}
            },
            _top: {
                domains: {},
                pages: {},
                params: {},
                length: [0, 0, 0]
            }
        };

        for (var i = 0, l = items.length; i < l; i++) {
            var item = items[i],
                title = item.title,
                visit_count = item.visitCount,
                url = item.url,
                domain = url.split('/')[2],
                path = url.match(/\w(\/.*)/)[1],
                q = url.match(/[?&]q=[^&]+/) || [];

            // DOMAINS
            if (!storage[domain]) {
                storage[domain] = {};
            }

            storage[domain][path] = {
                title: title,
                visitCount: visit_count,
                params: q[0]
            };

            if (storage._all.domains[domain]) {
                storage._all.domains[domain] += visit_count;
            } else {
                storage._all.domains[domain] = visit_count;
            }

            // PAGES
            storage._all.pages[url] = {
                title: title,
                visitCount: visit_count,
                star: 0,
                tags: ''
            };
            
            // PARAMS
            if (q && q[0] && !storage._all.params[domain]) {
                storage._all.params[domain] = visit_count;
            }

            if (storage._all.params[domain]) {
                storage._all.params[domain] += visit_count;
            }
        }


        // TOP
        var domains = Object.keys(storage._all.domains).map((key) => [key, storage._all.domains[key]]).sort(function(a, b) {
                return b[1] - a[1];
            }),
            pages = Object.keys(storage._all.pages).map((key) => [key, storage._all.pages[key]]).sort(function(a, b) {
                return b[1].visitCount - a[1].visitCount;
            }),
            params = Object.keys(storage._all.params).map((key) => [key, storage._all.params[key]]).sort(function(a, b) {
                return b[1] - a[1];
            });

        for (var i = 0; i < Math.min(100, domains.length); i++) {
            storage._top.domains[domains[i][0]] = domains[i][1];
        }

        for (var i = 0; i < Math.min(100, pages.length); i++) {
            storage._top.pages[pages[i][0]] = pages[i][1];
        }

        for (var i = 0; i < Math.min(100, params.length); i++) {
            storage._top.params[params[i][0]] = params[i][1];
        }

        storage._top.length[0] = Object.keys(storage._all.domains).length;
        storage._top.length[1] = Object.keys(storage._all.pages).length;
        storage._top.length[2] = Object.keys(storage._all.params).length;

        chrome.storage.local.set(storage);
    });
});


/*---------------------------------------------------------------
3.0 HISTORY UPDATED
---------------------------------------------------------------*/

chrome.history.onVisited.addListener(function(item) {
    chrome.storage.local.get('_new', function(items) {
        var storage = items._new || {
                domains: {},
                pages: {},
                params: {}
            },
            title = item.title,
            url = item.url,
            domain = url.split('/')[2],
            path = url.match(/\w(\/.*)/)[1],
            q = url.match(/[?&]q=[^&]+/) || [];

        // DOMAINS
        if (storage.domains[domain]) {
            storage.domains[domain] += 1;
        } else {
            storage.domains[domain] = 1;
        }

        // PAGES
        if (storage.pages[url]) {
            storage.pages[url].visitCount += 1;
        } else {
            storage.pages[url] = {
                title: title,
                visitCount: 1,
                star: 0,
                tags: ''
            };
        }
            
        // PARAMS
        if (url.indexOf(/[?&]+q=/)) {
            if (storage.params[domain]) {
                storage.params[domain] += 1;
            } else {
                storage.params[domain] = 1;
            }
        }

        chrome.storage.local.set({
            _new: storage
        });
    });
});
