/*---------------------------------------------------------------
>>> BACKGROUND
-----------------------------------------------------------------
# Parse history
# Extension installed
  # History
  # Pinned tabs
# History updated
# Tabs updated
---------------------------------------------------------------*/

/*---------------------------------------------------------------
# PARSE HISTORY
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
# EXTENSION INSTALLED
---------------------------------------------------------------*/

chrome.runtime.onInstalled.addListener(function() {

    /*-----------------------------------------------------------
    # HISTORY
    -----------------------------------------------------------*/

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
            },
            pinned: {},
            bookmarks: {}
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


        /*-------------------------------------------------------
        # PINNED TABS
        -------------------------------------------------------*/

        chrome.tabs.query({}, function(tabs) {
            for (var i = 0, l = tabs.length; i < l; i++) {
                var tab = tabs[i];

                if (tab.pinned === true) {
                    var title = tab.title,
                        visit_count = tab.visitCount,
                        url = tab.url,
                        domain = url.split('/')[2],
                        path = url.match(/\w(\/.*)/)[1];

                    if (!storage.pinned[url]) {
                        storage.pinned[url] = {
                            title: title,
                            visit_count: 1
                        };
                    } else {
                        storage.pinned[url].visit_count++;
                    }
                }
            }

            var pinned = Object.keys(storage.pinned).map((key) => [key, storage.pinned[key]]).sort(function(a, b) {
                return b[1].visitCount - a[1].visitCount;
            });

            for (var i = 0; i < Math.min(100, pinned.length); i++) {
                storage.pinned[pinned[i][0]] = pinned[i][1];
            }

            chrome.storage.local.set(storage);
        });
    });

});


/*---------------------------------------------------------------
# HISTORY UPDATED
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


/*---------------------------------------------------------------
# TABS UPDATED
---------------------------------------------------------------*/

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.pinned === true) {
        chrome.storage.local.get('pinned', function(items) {
            var title = tab.title,
                visit_count = tab.visitCount,
                url = tab.url,
                domain = url.split('/')[2],
                path = url.match(/\w(\/.*)/)[1];

            if (!items.pinned[url]) {
                items.pinned[url] = {
                    title: title,
                    visit_count: 1
                };
            } else {
                items[url].visit_count++;
            }

            var pinned = Object.keys(items.pinned).map((key) => [key, items.pinned[key]]).sort(function(a, b) {
                return b[1].visitCount - a[1].visitCount;
            });

            for (var i = 0; i < Math.min(100, pinned.length); i++) {
                items.pinned[pinned[i][0]] = pinned[i][1];
            }

            chrome.storage.local.set({
                pinned: items.pinned
            });
        });
    }
});