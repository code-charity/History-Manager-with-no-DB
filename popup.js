
function dataSearch(event) {
    var value = event.target.value;

    if (HISTORY_MANAGER.SEARCH.INTERVAL) {
        clearInterval(HISTORY_MANAGER.SEARCH.INTERVAL);

        HISTORY_MANAGER.SEARCH.DOMAINS = {};

        HISTORY_MANAGER.SEARCH.INDEX = 0;
    }

    if (value.length === 0) {
        updateTable1(true, HISTORY_MANAGER.DOMAINS);
        updateTable2(true, HISTORY_MANAGER.PAGES);
        updateTable3(true, HISTORY_MANAGER.PARAMS);

        return;
    }

    HISTORY_MANAGER.SEARCH.INTERVAL = setInterval(function() {
        if (HISTORY_MANAGER.SEARCH.INDEX < HISTORY_MANAGER.LENGTH[0]) {
            for (var i = HISTORY_MANAGER.SEARCH.INDEX, l = HISTORY_MANAGER.LENGTH[0]; i < l; i++) {
                HISTORY_MANAGER.SEARCH.INDEX++;
                var key = HISTORY_MANAGER.KEYS[0][i];

                if (key.indexOf(value) !== -1 || (HISTORY_MANAGER.DOMAINS[key].title || '').indexOf(value) !== -1) {
                    HISTORY_MANAGER.SEARCH.DOMAINS[key] = HISTORY_MANAGER.DOMAINS[key];
                }
            }
        } else if (HISTORY_MANAGER.SEARCH.INDEX - HISTORY_MANAGER.LENGTH[0] < HISTORY_MANAGER.KEYS[1].length) {
            for (var i = HISTORY_MANAGER.SEARCH.INDEX - HISTORY_MANAGER.LENGTH[0], l = HISTORY_MANAGER.KEYS[1].length; i < l; i++) {
                HISTORY_MANAGER.SEARCH.INDEX++;
                var key = HISTORY_MANAGER.KEYS[1][i];

                if (key.indexOf(value) !== -1 || (HISTORY_MANAGER.PAGES[key].title || '').indexOf(value) !== -1) {
                    HISTORY_MANAGER.SEARCH.PAGES[key] = HISTORY_MANAGER.PAGES[key];
                }
            }
        } else if (HISTORY_MANAGER.SEARCH.INDEX - HISTORY_MANAGER.LENGTH[1] < HISTORY_MANAGER.KEYS[2].length) {
            for (var i = HISTORY_MANAGER.SEARCH.INDEX - HISTORY_MANAGER.LENGTH[1], l = HISTORY_MANAGER.KEYS[2].length; i < l; i++) {
                HISTORY_MANAGER.SEARCH.INDEX++;

                var key = HISTORY_MANAGER.KEYS[2][i];

                if (key.indexOf(value) !== -1) {
                    HISTORY_MANAGER.SEARCH.PARAMS[key] = HISTORY_MANAGER.DOMAINS[key];
                }
            }
        }

        if (HISTORY_MANAGER.SEARCH.INDEX === HISTORY_MANAGER.LENGTH[0]) {
            document.querySelector('#by-domain').pagingIndex = 0;

            updateTable1(true, HISTORY_MANAGER.SEARCH.DOMAINS);

            HISTORY_MANAGER.SEARCH.DOMAINS = {};
        } else if (HISTORY_MANAGER.SEARCH.INDEX === HISTORY_MANAGER.LENGTH[1]) {
            document.querySelector('#by-url').pagingIndex = 0;

            updateTable2(true, HISTORY_MANAGER.SEARCH.PAGES);

            HISTORY_MANAGER.SEARCH.PAGES = {};
        } else if (HISTORY_MANAGER.SEARCH.INDEX === HISTORY_MANAGER.LENGTH[2]) {
            document.querySelector('#by-params').pagingIndex = 0;

            updateTable3(true, HISTORY_MANAGER.SEARCH.PARAMS);

            HISTORY_MANAGER.SEARCH.PARAMS = {};
            HISTORY_MANAGER.SEARCH.INDEX = 0;

            clearInterval(HISTORY_MANAGER.SEARCH.INTERVAL);
        }
    }, 100);
}

function updateSearchResults(search_field) {
    var value = search_field.value;

    if (value.length > 0 && value.match(/[^ ]/)) {
        var sorted = Object.keys(HISTORY_MANAGER.DOMAINS).map((key) => [key, HISTORY_MANAGER.DOMAINS[key]]).sort(function(a, b) {
            return b[1] - a[1];
        });

        search_results_element.innerHTML = '';

        for (var i = 0, l = sorted.length; i < l; i++) {
            var key = sorted[i][0],
                s = key.indexOf(value);

            if (s === 0) {
                search_results_element.innerHTML += '<a href="https://' + key + '"><img src="chrome://favicon/https://' + key + '"><span >' + key + '</span></a>';
            } else if (key.indexOf('www.') === 0 && s === 4) {
                var url = key.replace('www.', '');

                search_results_element.innerHTML += '<a href="https://' + url + '"><img src="chrome://favicon/https://' + key + '"><span >' + url + '</span></a>';
            }
        }

        search_results_element.innerHTML += '<a href="' + searchEngine.url + search_field.value + '">' + search_field.value + ' <span>' + searchEngine.title + ' Search</span></a>';

        search_field.classList.add('satus-header__text-field--show-results');

        setTimeout(function() {
            var element = document.querySelector('.satus-search-results a');

            if (element) {
                element.classList.add('focused');
            }
        });
    } else {
        search_field.classList.remove('satus-header__text-field--show-results');
    }
}

function chooseSearchEngine(event) {
    searchEngine = {
        title: this.innerText,
        url: this.dataset.url,
        icon: this.dataset.icon
    };

    document.querySelector('.satus-header__search-engine').style.backgroundImage = 'url(chrome://favicon/' + searchEngine.icon + ')';

    document.querySelector('.satus-dialog__scrim').click();

    satus.storage.set('searchEngine', searchEngine);
}








/*--------------------------------------------------------------
>>> TABLE OF CONTENTS:
----------------------------------------------------------------
# Skeleton
--------------------------------------------------------------*/

/*--------------------------------------------------------------
# SKELETON
--------------------------------------------------------------*/

var searchEngine = {
    title: 'Google',
    icon: 'https://www.google.com/',
    url: 'https://www.google.com/search?q='
};

var Menu = {
    header: {
        type: 'header',

        section_start: {
            type: 'section',
            class: 'satus-section--align-start',

            search_engine_back: {
                type: 'button',
                class: 'satus-header__search-engine__back'
            },
            search_engine: {
                type: 'button',
                class: 'satus-header__search-engine',
                dataset: {
                    icon: 'https://www.google.com/search',
                    url: 'https://www.google.com/?q='
                },
                style: {
                    backgroundImage: 'url(chrome://favicon/https://www.google.com/)'
                },
                onclick: {
                    type: 'dialog',
                    class: 'satus-dialog--search-engine',
                    scrollbar: false,

                    google: {
                        type: 'button',
                        label: 'Google',
                        dataset: {
                            icon: 'https://www.google.com/',
                            url: 'https://www.google.com/search?q='
                        },
                        onclick: chooseSearchEngine
                    },
                    youtube: {
                        type: 'button',
                        label: 'YouTube',
                        dataset: {
                            icon: 'https://www.youtube.com/',
                            url: 'https://www.youtube.com/results?search_query='
                        },
                        onclick: chooseSearchEngine
                    },
                    duckduckgo: {
                        type: 'button',
                        label: 'DuckDuckGo',
                        dataset: {
                            icon: 'https://duckduckgo.com/',
                            url: 'https://duckduckgo.com/?q='
                        },
                        onclick: chooseSearchEngine
                    },
                    bing: {
                        type: 'button',
                        label: 'Bing',
                        dataset: {
                            icon: 'https://bing.com/',
                            url: 'https://bing.com/search?q='
                        },
                        onclick: chooseSearchEngine
                    },
                    yahoo: {
                        type: 'button',
                        label: 'Yahoo!',
                        dataset: {
                            icon: 'https://search.yahoo.com/',
                            url: 'https://search.yahoo.com/search?p='
                        },
                        onclick: chooseSearchEngine
                    },
                    ecosia: {
                        type: 'button',
                        label: 'Ecosia',
                        dataset: {
                            icon: 'https://www.ecosia.org/',
                            url: 'https://www.ecosia.org/search?q='
                        },
                        onclick: chooseSearchEngine
                    },
                    history: {
                        type: 'button',
                        label: 'History',
                        onclick: chooseSearchEngine
                    }
                }
            },
            search_field: {
                type: 'text-field',
                class: 'satus-header__text-field',
                placeholder: 'Search',
                onkeydown: function(event) {
                    if (event.keyCode === 13) {
                        setTimeout(function() {
                            var focused = document.querySelector('.satus-search-results a.focused');

                            if (focused) {
                                window.open(focused.href, '_self')
                            }
                        });
                    } else if (event.keyCode === 38) {
                        var focused = document.querySelector('.satus-search-results a.focused'),
                            prev = focused.previousElementSibling || focused.parentNode.lastElementChild;

                        focused.classList.remove('focused');

                        prev.classList.add('focused');
                    } else if (event.keyCode === 40) {
                        var focused = document.querySelector('.satus-search-results a.focused'),
                            next = focused.nextElementSibling || focused.parentNode.firstElementChild;

                        focused.classList.remove('focused');

                        next.classList.add('focused');
                    }
                },
                oninput: function(event) {
                    if (searchEngine.title === 'History') {
                        if (all_loading === false) {
                            if (all_loaded === false) {
                                all_loading = true;

                                satus.storage.import('_all', function(item) {
                                    HISTORY_MANAGER.DOMAINS = item.domains;
                                    HISTORY_MANAGER.PAGES = item.pages;

                                    document.querySelector('#by-domain').data = updateTable1();
                                    document.querySelector('#by-url').data = updateTable2();
                                    document.querySelector('#by-params').data = updateTable3();

                                    HISTORY_MANAGER.KEYS[0] = Object.keys(HISTORY_MANAGER.DOMAINS);
                                    HISTORY_MANAGER.KEYS[1] = Object.keys(HISTORY_MANAGER.PAGES);
                                    HISTORY_MANAGER.KEYS[2] = Object.keys(HISTORY_MANAGER.PARAMS);
                                    HISTORY_MANAGER.LENGTH[0] = HISTORY_MANAGER.KEYS[0].length;
                                    HISTORY_MANAGER.LENGTH[1] = HISTORY_MANAGER.KEYS[0].length + HISTORY_MANAGER.KEYS[1].length;
                                    HISTORY_MANAGER.LENGTH[2] = HISTORY_MANAGER.KEYS[0].length + HISTORY_MANAGER.KEYS[1].length + HISTORY_MANAGER.KEYS[2].length;

                                    all_loaded = true;
                                    all_loading = false;

                                    dataSearch(event);
                                });
                            } else {
                                dataSearch(event);
                            }
                        }
                    } else {
                        updateSearchResults(this);
                    }
                },
                onrender: function() {
                    var self = this;

                    setTimeout(function() {
                        self.focus();
                    }, 500);
                }
            },
            dropdown_menu: {
                type: 'div',
                class: 'satus-search-results'
            },
            search_icon: {
                type: 'button',
                class: 'satus-header__search-button',
                before: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>'
            }
        },
        section_end: {
            type: 'section',
            class: 'satus-section--align-end',

            button: {
                type: 'button',
                before: '<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="5.25" r="0.45"/><circle cx="12" cy="12" r="0.45"/><circle cx="12" cy="18.75" r="0.45"/></svg>',

                onclick: {
                    type: 'dialog',
                    class: 'satus-dialog--vertical-menu',

                    language: {
                        type: 'select',
                        label: 'language',
                        options: [{
                            label: 'English',
                            value: 'en'
                        }, {
                            label: 'Русский',
                            value: 'ru'
                        }, {
                            label: 'Deutsch',
                            value: 'de'
                        }]
                    },
                    compact_mode: {
                        type: 'switch',
                        label: 'compactMode',
                        storage_key: 'compact_mode',
                        onclick: function() {
                            setTimeout(function() {
                                document.body.dataset.compactMode = satus.storage.get('compact_mode');

                                setTimeout(function() {
                                    window.dispatchEvent(new Event('resize'));
                                });
                            });
                        }
                    }
                }
            }
        }
    }
};
var Selected = {},
    all_loaded = false,
    all_loading = false;

window.addEventListener('click', function(event) {
    var target = event.target;

    if (target.classList.contains('satus-button--star')) {
        star(target);
    } else if (target.classList.contains('satus-button--pin')) {
        pin(target);
    } else if (!target.classList.contains('satus-input--tags')) {
        var is_url_table = false;

        for (var i = event.path.length - 2; i > 0; i--) {
            if (event.path[i].id === 'by-url') {
                is_url_table = true;
            }

            if (event.path[i].classList && event.path[i].classList.contains('satus-table__row') && is_url_table === true) {
                var href = event.path[i].querySelector('a').href;

                if (event.path[i].classList.contains('selected')) {
                    Selected[href] = undefined;
                } else {
                    Selected[href] = HISTORY_MANAGER.PAGES[href];
                }

                event.path[i].classList.toggle('selected');

                checkToolbar();
            }
        }
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.hasOwnProperty('pinned')) {
        updateTable4(true);
    }
});

chrome.bookmarks.onCreated.addListener(function() {
    updateTable2(true);
});

chrome.bookmarks.onRemoved.addListener(function() {
    updateTable2(true);
});

chrome.bookmarks.onChanged.addListener(function() {
    updateTable2(true);
});

function checkToolbar() {
    var is_empty = true;

    for (var key in Selected) {
        if (Selected[key]) {
            is_empty = false;
        }
    }

    if (is_empty === false) {
        document.querySelector('#by-url').classList.add('satus-table--selected');
    } else {
        document.querySelector('#by-url').classList.remove('satus-table--selected');
    }

    window.dispatchEvent(new Event('resize'));
}

function parseBookmarks(items, callback) {
    var bookmarks = {},
        threads = 0;

    function parse(items) {
        threads++;

        for (var i = 0, l = items.length; i < l; i++) {
            var item = items[i];


            if (item.url) {
                bookmarks[item.url] = item.id;
            }

            if (item.children) {
                parse(item.children);
            }
        }

        threads--;

        if (threads === 0) {
            if (callback) {
                callback(bookmarks);
            }
        }
    }

    parse(items);
}

function star(target) {
    if (target.dataset.value === 'false') {
        chrome.bookmarks.create({
            title: target.dataset.title,
            url: target.dataset.href,
            parentId: '1'
        }, function(item) {
            target.dataset.id = item.id;
            target.dataset.value = 'true';
        });
    } else {
        chrome.bookmarks.remove(target.dataset.id);

        target.dataset.value = 'false';
    }
}

function tags() {
    HISTORY_MANAGER.PAGES[this.dataset.href].tags = this.value;

    var DOMAINS = HISTORY_MANAGER.DOMAINS,
        PAGES = HISTORY_MANAGER.PAGES,
        PARAMS = HISTORY_MANAGER.PARAMS;

    satus.storage.set('HISTORY', {
        DOMAINS,
        PAGES,
        PARAMS
    });

    updateTable2(true);

    for (var key in Selected) {
        Selected[key] = undefined;
    }

    checkToolbar();
}

function pin(target) {
    var value = target.dataset.value == 'false' ? true : false;

    chrome.tabs.query({}, function(tabs) {
        for (var i = 0, l = tabs.length; i < l; i++) {
            var tab = tabs[i];

            if (tab.url === target.dataset.href) {
                chrome.tabs.update(tab.id, {
                    pinned: value
                });

                target.dataset.value = value;
            }
        }
    });
}

function loadAll(item) {
    if (all_loaded === false) {
        console.time('loading-all');

        document.body.classList.add('loading');

        satus.storage.import('_all', function(_all) {
            var _new = satus.storage.get('_new'),
                _top = satus.storage.get('_top');

            updateData(_new, _all);

            HISTORY_MANAGER.NEW.domains = {};
            HISTORY_MANAGER.NEW.pages = {};
            HISTORY_MANAGER.NEW.params = {};

            satus.storage.set('_new', HISTORY_MANAGER.NEW);
            satus.storage.set('_all', _all);

            HISTORY_MANAGER.DOMAINS = _all.domains;
            HISTORY_MANAGER.PAGES = _all.pages;
            HISTORY_MANAGER.PARAMS = _all.params;

            document.querySelector('#by-domain').data = updateTable1(true);
            document.querySelector('#by-url').data = updateTable2(true);
            document.querySelector('#by-params').data = updateTable3(true);

            HISTORY_MANAGER.KEYS[0] = Object.keys(HISTORY_MANAGER.DOMAINS);
            HISTORY_MANAGER.KEYS[1] = Object.keys(HISTORY_MANAGER.PAGES);
            HISTORY_MANAGER.KEYS[2] = Object.keys(HISTORY_MANAGER.PARAMS);
            HISTORY_MANAGER.LENGTH[0] = HISTORY_MANAGER.KEYS[0].length;
            HISTORY_MANAGER.LENGTH[1] = HISTORY_MANAGER.KEYS[0].length + HISTORY_MANAGER.KEYS[1].length;
            HISTORY_MANAGER.LENGTH[2] = HISTORY_MANAGER.KEYS[0].length + HISTORY_MANAGER.KEYS[1].length + HISTORY_MANAGER.KEYS[2].length;

            all_loaded = true;

            document.querySelectorAll('.satus-table')[0].querySelector('.satus-scrollbar__wrapper').scrollTo(0, 0);

            document.body.classList.remove('loading');

            console.timeEnd('loading-all');

            var domains = Object.keys(_all.domains).map((key) => [key, _all.domains[key]]).sort(function(a, b) {
                    return b[1] - a[1];
                }),
                pages = Object.keys(_all.pages).map((key) => [key, _all.pages[key]]).sort(function(a, b) {
                    return b[1].visitCount - a[1].visitCount;
                });

            for (var i = 0; i < Math.min(100, domains.length); i++) {
                _top.domains[domains[i][0]] = domains[i][1];
            }

            for (var i = 0; i < Math.min(100, pages.length); i++) {
                _top.pages[pages[i][0]] = pages[i][1];
            }

            _top.length[0] = Object.keys(_all.domains).length;
            _top.length[1] = Object.keys(_all.pages).length;

            satus.storage.set('_top', _top);
        });

        return false;
    }

    var items = document.querySelectorAll('#by-url a');

    for (var i = 0, l = items.length; i < l; i++) {
        for (var key in Selected) {
            if (items[i].href === key) {
                items[i].parentNode.parentNode.classList.add('selected');
            }
        }
    }
}

Menu.main = {
    type: 'main',
    scrollbar: false,

    section: {
        type: 'section',
        class: 'satus-section--tables',

        table_01: {
            type: 'table',
            id: 'by-domain',
            paging: 100,
            columns: [{
                title: 'visits',
                sorting: 'desc'
            }, {
                title: '',
                onrender: function() {
                    this.querySelector('.satus-button--dropdown').addEventListener('click', function() {
                        var container = this.parentNode.parentNode;

                        if (!container.querySelector('.satus-dropdown-list')) {
                            var self = this,
                                list = document.createElement('div'),
                                data = [],
                                host = this.dataset.key;

                            list.className = 'satus-dropdown-list';

                            satus.storage.import(host, function(items) {
                                for (var key in items) {
                                    var item = items[key];

                                    data.push([{
                                        text: item.visitCount
                                    }, {}, {
                                        text: key,
                                        html: '<a class="satus-link--domain" href="https://' + host + '/' + key + '" title="' + item.title + '">' + key + '</a>'
                                    }]);
                                }

                                setTimeout(function() {
                                    satus.render({
                                        type: 'table',
                                        paging: 100,
                                        columns: [{
                                            title: 'Visits',
                                            sorting: 'desc'
                                        }, {
                                            title: ''
                                        }, {
                                            title: 'Title',
                                            onrender: function() {
                                                this.querySelector('a').innerText = this.querySelector('a').innerText;
                                            }
                                        }],
                                        data: data
                                    }, list);

                                    setTimeout(function() {
                                        list.querySelector('.satus-table__body').style.height = list.querySelector('.satus-table').offsetHeight - 39 + 'px';

                                        list.querySelector('.satus-scrollbar').resize();
                                    });
                                });

                                container.appendChild(list);

                                self.classList.add('opened');
                            });
                        } else {
                            container.querySelector('.satus-dropdown-list').remove();

                            this.classList.remove('opened');
                        }
                    });
                }
            }, {
                title: 'domain'
            }],
            beforeUpdate: loadAll
        },

        table_02: {
            type: 'table',
            id: 'by-url',
            paging: 100,
            columns: [{
                title: 'visits',
                sorting: 'desc'
            }, {
                title: 'title'
            }, {
                title: 'URL'
            }, {
                title: '★'
            }, {
                title: 'tags',
                onrender: function() {
                    this.querySelector('.satus-input--tags').onblur = tags;
                }
            }],
            onrender: function() {
                var toolbar = document.createElement('div');

                toolbar.className = 'satus-table--toolbar';

                satus.render({
                    undo: {
                        type: 'button',
                        label: 'Undo',

                        onclick: function() {
                            var selected = document.querySelectorAll('.satus-table__row.selected')

                            for (var key in Selected) {
                                Selected[key] = undefined;
                            }

                            for (var i = 0, l = selected.length; i < l; i++) {
                                selected[i].classList.remove('selected');
                            }

                            checkToolbar();
                        }
                    },
                    star: {
                        type: 'button',
                        label: 'Star',

                        onclick: function() {
                            for (var key in Selected) {
                                if (Selected[key]) {
                                    Selected[key].star = 1;
                                }
                            }

                            updateTable2(true);

                            var DOMAINS = HISTORY_MANAGER.DOMAINS,
                                PAGES = HISTORY_MANAGER.PAGES,
                                PARAMS = HISTORY_MANAGER.PARAMS;

                            satus.storage.set('HISTORY', {
                                DOMAINS,
                                PAGES,
                                PARAMS
                            });

                            for (var key in Selected) {
                                Selected[key] = undefined;
                            }

                            checkToolbar();
                        }
                    },
                    remove: {
                        type: 'button',
                        label: 'Remove',

                        onclick: function() {
                            for (var key in Selected) {
                                if (Selected[key]) {
                                    delete HISTORY_MANAGER.PAGES[key];
                                    delete Selected[key];
                                }
                            }

                            updateTable2(true);

                            var DOMAINS = HISTORY_MANAGER.DOMAINS,
                                PAGES = HISTORY_MANAGER.PAGES,
                                PARAMS = HISTORY_MANAGER.PARAMS;

                            satus.storage.set('HISTORY', {
                                DOMAINS,
                                PAGES,
                                PARAMS
                            });

                            for (var key in Selected) {
                                Selected[key] = undefined;
                            }

                            checkToolbar();
                        }
                    },
                    edit: {
                        type: 'button',
                        label: 'Edit',

                        onclick: function() {
                            for (var key in Selected) {
                                if (Selected[key]) {
                                    Selected[key].tags = this.parentNode.querySelector('input').value;
                                }
                            }

                            updateTable2(true);

                            var DOMAINS = HISTORY_MANAGER.DOMAINS,
                                PAGES = HISTORY_MANAGER.PAGES,
                                PARAMS = HISTORY_MANAGER.PARAMS;

                            satus.storage.set('HISTORY', {
                                DOMAINS,
                                PAGES,
                                PARAMS
                            });

                            for (var key in Selected) {
                                Selected[key] = undefined;
                            }

                            checkToolbar();
                        }
                    },
                    tags: {
                        type: 'text-field',
                        class: 'satus-input--tags',

                        onkeydown: function(event) {
                            if (event.keyCode === 13) {
                                for (var key in Selected) {
                                    if (Selected[key]) {
                                        Selected[key].tags = this.value;
                                    }
                                }

                                updateTable2(true);

                                var DOMAINS = HISTORY_MANAGER.DOMAINS,
                                    PAGES = HISTORY_MANAGER.PAGES,
                                    PARAMS = HISTORY_MANAGER.PARAMS;

                                satus.storage.set('HISTORY', {
                                    DOMAINS,
                                    PAGES,
                                    PARAMS
                                });
                            }
                        }
                    }
                }, toolbar);

                this.appendChild(toolbar);
            },
            beforeUpdate: loadAll
        },

        table_03: {
            type: 'table',
            id: 'by-params',
            paging: 100,
            columns: [{
                title: 'visits',
                sorting: 'desc'
            }, {
                title: '',
                onrender: function() {
                    this.querySelector('.satus-button--dropdown').addEventListener('click', function() {
                        var container = this.parentNode.parentNode;

                        if (!container.querySelector('.satus-dropdown-list')) {
                            var self = this,
                                list = document.createElement('div'),
                                data = [],
                                host = this.dataset.key;

                            list.className = 'satus-dropdown-list';

                            satus.storage.import(host, function(items) {
                                for (var key in items) {
                                    var q = key.match(/[?&]q=[^&]+/) || key.match(/[?&]search_query=[^&]+/);

                                    if (q) {
                                        var item = items[key];

                                        try {
                                            var qq = decodeURIComponent(q[0].substring(q[0].indexOf('=') + 1));
                                        } catch (err) {
                                            var qq = q[0].substring(q[0].indexOf('=') + 1);
                                        }

                                        data.push([{
                                            text: item.visitCount
                                        }, {}, {
                                            text: key,
                                            html: '<a class="satus-link--domain" href="https://' + host + '/' + key + '" title="' + q + '">' + qq + '</a>'
                                        }]);
                                    }
                                }

                                if (data.length === 0) {
                                    return;
                                }

                                satus.render({
                                    type: 'table',
                                    paging: 100,
                                    columns: [{
                                        title: 'Visits',
                                        sorting: 'desc'
                                    }, {
                                        title: ''
                                    }, {
                                        title: 'Title',
                                        onrender: function() {
                                            this.querySelector('a').innerText = this.querySelector('a').innerText;
                                        }
                                    }],
                                    data: data
                                }, list);

                                container.appendChild(list);

                                self.classList.add('opened');
                            });
                        } else {
                            container.querySelector('.satus-dropdown-list').remove();

                            this.classList.remove('opened');
                        }
                    });
                }
            }, {
                title: 'domain'
            }],
            beforeUpdate: loadAll
        },

        table_04: {
            type: 'table',
            id: 'pinned',
            paging: 100,
            columns: [{
                title: ''
            }, {
                title: 'domain'
            }]
        }
    }
};
/*---------------------------------------------------------------
>>> TABLES
-----------------------------------------------------------------
# Table 1
# Table 2
# Table 3
# Table 4
---------------------------------------------------------------*/

/*---------------------------------------------------------------
# TABLE 1
---------------------------------------------------------------*/

function updateTable1(force, d) {
    var data = d || HISTORY_MANAGER.DOMAINS,
        table = [];

    for (var key in data) {
        table.push([{
            text: data[key]
        }, {
            html: '<button class="satus-button satus-button--dropdown" data-key="' + key + '"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button>'
        }, {
            text: key,
            html: '<a class="satus-link--domain" href="' + key + '"><img src="chrome://favicon/https://' + key + '">' + key + '</a>'
        }]);
    }

    Menu.main.section.table_01.data = table;

    if (force === true) {
        document.querySelector('#by-domain').update(table);
    }

    return table;
}


/*---------------------------------------------------------------
# TABLE 2
---------------------------------------------------------------*/

function updateTable2(force, d) {
    chrome.bookmarks.getTree(function(results) {
        parseBookmarks(results, function(bookmarks) {
            var data = d || HISTORY_MANAGER.PAGES,
                table = [];

            for (var key in data) {
                var item = data[key],
                    url = key.replace(/^.*\/\/[^\/]+:?[0-9]?\//g, '');

                table.push([{
                    text: item.visitCount
                }, {
                    html: '<img src="chrome://favicon/https://' + key.split('/')[2] + '">' + item.title,
                    text: item.title
                }, {
                    html: '<a href="' + key + '">/' + url + '</a>',
                    text: url
                }, {
                    html: '<button class="satus-button satus-button--star" data-title="' + item.title + '" data-id="' + bookmarks[key] + '" data-href="' + key + '" data-value="' + (bookmarks[key] ? true : false) + '"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></button>',
                    text: item.star
                }, {
                    html: '<input class="satus-input--tags" type="text" data-href="' + key + '" value="' + item.tags + '">',
                    text: item.tags
                }]);
            }

            Menu.main.section.table_02.data = table;

            if (force === true) {
                document.querySelector('#by-url').update(table);
            }
        });
    });
}


/*---------------------------------------------------------------
# TABLE 3
---------------------------------------------------------------*/

function updateTable3(force, d) {
    var data = d || HISTORY_MANAGER.PARAMS,
        table = [];

    for (var key in data) {
        table.push([{
            text: data[key]
        }, {
            html: '<button class="satus-button satus-button--dropdown" data-key="' + key + '"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button>'
        }, {
            html: '<a href="' + key + '"><img src="chrome://favicon/https://' + key + '">' + key + '</a>',
            text: key
        }]);
    }

    Menu.main.section.table_03.data = table;

    if (force === true) {
        document.querySelector('#by-params').update(table);
    }

    return table;
}


/*---------------------------------------------------------------
# TABLE 4
---------------------------------------------------------------*/

function updateTable4() {
    chrome.tabs.query({}, function(tabs) {
        var data = HISTORY_MANAGER.PINNED,
            table = [],
            pinned_tabs = {};

        for (var i = 0, l = tabs.length; i < l; i++) {
            var tab = tabs[i];

            table.push([{
                html: '<button class="satus-button satus-button--pin" data-href="' + tab.url + '" data-value="' + tab.pinned + '"><svg fill="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M4 10h5c1.12 0 2.16-.37 3-1v6c-.86-.65-1.9-1-3-1H4v-4M2 7v10c0 .55.45 1 1 1s1-.45 1-1v-1h5c1.66 0 3 1.34 3 3h2v-5.97h7l1-1-1-1h-7V5h-2c0 1.66-1.34 3-3 3H4V7c0-.55-.45-1-1-1s-1 .45-1 1z"/></svg></button>'
            }, {
                html: '<a href="' + tab.url + '"><img src="chrome://favicon/' + tab.url + '">' + tab.title + '</a>',
                text: tab.url
            }]);
        }

        if (table.length > 0) {
            Menu.main.section.table_04.data = table;

            document.querySelector('#pinned').update(table);
        }
    });
}
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

                        satus.storage.import('searchEngine', function(item) {
                            if (item) {
                                searchEngine = item;

                                document.querySelector('.satus-header__search-engine').style.backgroundImage = 'url(chrome://favicon/' + searchEngine.icon + ')';
                            }
                        });
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