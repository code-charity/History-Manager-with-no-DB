/*---------------------------------------------------------------
>>> BACKGROUND
----------------------------------------------------------------
1.0 Installed
2.0 Tab updated
---------------------------------------------------------------*/

/*---------------------------------------------------------------
1.0 INSTALLED
---------------------------------------------------------------*/

chrome.runtime.onInstalled.addListener(function() {
    chrome.history.search({
        text: '',
        startTime: 0,
        maxResults: 999999999
    }, function(items) {
        var DOMAINS = {},
            PAGES = {},
            PARAMS = {};
        
        items = items.sort(function(a, b) {
            return b.visitCount - a.visitCount;
        });
        
        for (var i = 0, l = items.length; i < l; i++) {
            var item = items[i],
                domain = item.url.split('/')[2],
                path = item.url.match(/\w(\/.*)/)[1],
                q = item.url.match(/[?&]q=[^&]+/);
                
            if (!DOMAINS[domain]) {
                DOMAINS[domain] = {
                    items: {},
                    visitCount: item.visitCount
                };
            } else {
                DOMAINS[domain].visitCount -= (DOMAINS[domain].items[path] || {}).visitCount || 0;
                DOMAINS[domain].visitCount += item.visitCount;
            }
            
            DOMAINS[domain].items[path] = {
                title: item.title,
                visitCount: item.visitCount
            };
            
            PAGES[item.url] = {
                title: item.title,
                visitCount: item.visitCount,
                star: 0,
                tags: ''
            };
            
            PARAMS[item.url] = {
                title: item.title,
                visitCount: item.visitCount,
                star: 0,
                tags: ''
            };
        }
        
        chrome.storage.local.set({
            HISTORY: {
                DOMAINS,
                PAGES,
                PARAMS
            }
        });
    });
});


/*---------------------------------------------------------------
2.0 TAB UPDATED
---------------------------------------------------------------*/

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.url) {
        console.log(changeInfo.url);
    }
});
