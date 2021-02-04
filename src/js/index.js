/*---------------------------------------------------------------
>>> INDEX
---------------------------------------------------------------*/

var HISTORY_MANAGER = {
    DOMAINS: {},
    PAGES: {},
    PARAMS: {},
    PINNED: {},

    KEYS: [
        [],
        [],
        []
    ],

    LENGTH: [0, 0, 0],

    SEARCH: {
        INDEX: 0,
        INTERVAL: false,

        DOMAINS: {},
        PAGES: {},
        PARAMS: {},
        PINNED: {}
    },

    NEW: {}
};

function updateData(new_items, current_items) {
    if (new_items) {
        if (new_items.domains) {
            for (var key in new_items.domains) {
                if (current_items.domains[key] || current_items.domains[key] === 0) {
                    current_items.domains[key] += new_items.domains[key];
                }
            }
        }

        if (new_items.pages) {
            for (var key in new_items.pages) {
                if (current_items.pages[key]) {
                    current_items.pages[key].visitCount += new_items.pages[key].visitCount;
                } else {
                    current_items.pages[key] = new_items.pages[key];
                }
            }
        }

        if (new_items.params) {
            for (var key in new_items.params) {
                if (current_items.params[key] || current_items.params[key] === 0) {
                    current_items.params[key] += new_items.params[key];
                }
            }
        }
    }
}

console.time('start');

function init() {
    if (location.href.indexOf('?loaded') === -1) {
        location.replace(location.href + '?loaded');

        return false;
    }

    satus.storage.import('language', function(language) {
        satus.updateStorageKeys(Menu);

        satus.locale.import(language || 'en', function() {
            satus.storage.import('compact_mode', function(compact_mode) {
                document.body.dataset.compactMode = compact_mode;
            });

            satus.storage.import('_new', function(_new) {
                var _new = _new || {
                    domains: {},
                    pages: {},
                    params: {}
                };

                satus.storage.import('_top', function(_top) {
                    var _top = _top || {
                        domains: {},
                        pages: {},
                        params: {}
                    };

                    //backgroundFetch('https://www.google.com/favicon.ico', 'updateSearchEngineIcon');

                    updateData(_new, _top);

                    HISTORY_MANAGER.NEW = _new;

                    HISTORY_MANAGER.DOMAINS = _top.domains;
                    HISTORY_MANAGER.PAGES = _top.pages;
                    HISTORY_MANAGER.PARAMS = _top.params;

                    updateTable1();
                    updateTable3();

                    Menu.main.section.table_01.pages = Math.ceil(satus.storage.data._top.length[0] / 100);
                    Menu.main.section.table_02.pages = Math.ceil(satus.storage.data._top.length[1] / 100);
                    Menu.main.section.table_03.pages = Math.ceil(satus.storage.data._top.length[2] / 100);

                    HISTORY_MANAGER.KEYS[0] = Object.keys(HISTORY_MANAGER.DOMAINS);
                    HISTORY_MANAGER.KEYS[1] = Object.keys(HISTORY_MANAGER.PAGES);
                    HISTORY_MANAGER.KEYS[2] = Object.keys(HISTORY_MANAGER.PARAMS);

                    HISTORY_MANAGER.LENGTH[0] = HISTORY_MANAGER.KEYS[0].length;
                    HISTORY_MANAGER.LENGTH[1] = HISTORY_MANAGER.KEYS[0].length + HISTORY_MANAGER.KEYS[1].length;
                    HISTORY_MANAGER.LENGTH[2] = HISTORY_MANAGER.KEYS[0].length + HISTORY_MANAGER.KEYS[1].length + HISTORY_MANAGER.KEYS[2].length;

                    satus.render(Menu, document.body);

                    search_results_element = document.querySelector('.satus-search-results');

                    updateTable2(true);

                    console.timeEnd('start');

                    satus.storage.import('pinned', function(pinned) {
                        HISTORY_MANAGER.PINNED = pinned;

                        updateTable4();
                    });
                });
            });
        });
    });
}

init();


chrome.runtime.onMessage.addListener(async function(message, sender) {
    if (typeof message !== 'object') {
        return false;
    }

    if (message.action === 'history-manager--fetch-response') {
        if (window[message.callback]) {
            window[message.callback](message.response);
        }
    }
});

function backgroundFetch(url, callback) {
    chrome.runtime.sendMessage({
        action: 'history-manager--fetch',
        url: url,
        callback: callback
    });
}