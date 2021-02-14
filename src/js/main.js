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