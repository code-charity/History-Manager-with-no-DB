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

/*chrome.runtime.onInstalled.addListener(function() {
    console.time();

    chrome.history.search({
        text: '',
        startTime: 0,
        maxResults: 999999999
    }, function(items) {
        var all = {
            domains: {},
            pages: {},
            params: {}
        },
        top = {
            domains: {},
            pages: {},
            params: {}
        },
        cache = {
            domains: [],
            pages: [],
            params: []
        };

        for (var i = 0, l = items.length; i < l; i++) {
            parseHistory(items[i], all);
        }
        
        // TODO: IMPROVE ALGORITHM
        for (var key in all.domains) {
            cache.domains.push(all.domains[key]);
        }
        
        for (var key in all.pages) {
            cache.pages.push(all.pages[key]);
        }
        
        for (var key in all.params) {
            cache.params.push(all.params[key]);
        }
        
        cache.domains = cache.domains.sort(function(a, b) {
            return b.visitCount - a.visitCount;
        });
        
        cache.pages = cache.pages.sort(function(a, b) {
            return b.visitCount - a.visitCount;
        });
        
        cache.params = cache.params.sort(function(a, b) {
            return b.visitCount - a.visitCount;
        });
        
        var keys = [
            Object.keys(all.domains),
            Object.keys(all.pages),
            Object.keys(all.params)
        ];
        
        for (var i = 0; i < 100; i++) {
            top.domains[keys[0][i]] = all.domains[keys[0][i]];
            top.pages[keys[1][i]] = all.pages[keys[1][i]];
            top.params[keys[2][i]] = all.params[keys[2][i]];
        }
        // END

        chrome.storage.local.set({
            'all': all,
            'top': top
        }, function() {
            console.timeEnd();
        });
    });
});*/

chrome.runtime.onInstalled.addListener(function() {
    console.time();

    chrome.history.search({
        text: '',
        startTime: 0,
        maxResults: 999999999
    }, function(items) {
        var storage = {
            _all: {
                domains: {},
                pages: {}
            },
            _top: {
                domains: {},
                pages: {},
                length: [0, 0]
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
        }
        
        
        // TOP
        var domains = Object.keys(storage._all.domains).map((key) => [key, storage._all.domains[key]]).sort(function(a, b) {
                return b[1] - a[1];
            }),
            pages = Object.keys(storage._all.pages).map((key) => [key, storage._all.pages[key]]).sort(function(a, b) {
                return b[1].visitCount - a[1].visitCount;
            });
            
        for (var i = 0; i < Math.min(100, domains.length); i++) {
            storage._top.domains[domains[i][0]] = domains[i][1];
        }
            
        for (var i = 0; i < Math.min(100, pages.length); i++) {
            storage._top.pages[pages[i][0]] = pages[i][1];
        }
        
        storage._top.length[0] = Object.keys(storage._all.domains).length;
        storage._top.length[1] = Object.keys(storage._all.pages).length;
            

        chrome.storage.local.set(storage, function() {
            console.timeEnd();

            console.log(storage);
        });
    });
});


/*---------------------------------------------------------------
3.0 HISTORY UPDATED
---------------------------------------------------------------*/

chrome.history.onVisited.addListener(function(item) {
    chrome.storage.local.get('new', function(items) {
        var items = items.new || {
            domains: {},
            pages: {},
            params: {}
        };

        chrome.storage.local.set({
            'new': parseHistory(item, items)
        });
    });
});
