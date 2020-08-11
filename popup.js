
/*---------------------------------------------------------------
>>> HEADER
---------------------------------------------------------------*/

var header_search = false,
    search_type = 'bookmarks',
    Menu = {
        header: {
            type: 'header',

            section_start: {
                type: 'section',
                class: 'satus-section--align-start',
                style: {
                    position: 'relative'
                },

                text_field: {
                    type: 'text-field',
                    rows: 1,
                    class: 'satus-header__text-field',
                    placeholder: 'Search',
                    on: {
                        keyup: function(event) {
                            if (event.keyCode === 13) {
                                var type = search_type;

                                if (header_search !== false) {
                                    header_search.clear();
                                    header_search = false;
                                }

                                if (type === 'bookmarks') {
                                    Satus.chromium_bookmarks.get(function(items) {
                                        header_search = Satus.search(event.target.value, items, function(results) {
                                            var rows = [];

                                            for (var i = 0, l = results.length; i < l; i++) {
                                                rows.push([{
                                                    select: {
                                                        type: 'text'
                                                    }
                                                }, {
                                                    visit_count: {
                                                        type: 'text',
                                                        label: 0
                                                    }
                                                }, {
                                                    domain: {
                                                        type: 'text',
                                                        label: results[i]
                                                    }
                                                }]);
                                            }

                                            document.querySelector('#table-search').update(rows);
                                        });
                                    });
                                } else if (type === 'history') {
                                    Satus.chromium_history.get('', function(items) {
                                        header_search = Satus.search(event.target.value, items, function(results) {
                                            var rows = [];

                                            for (var i = 0, l = results.length; i < l; i++) {
                                                rows.push([{
                                                    select: {
                                                        type: 'checkbox'
                                                    }
                                                }, {
                                                    visit_count: {
                                                        type: 'text',
                                                        label: 0
                                                    }
                                                }, {
                                                    domain: {
                                                        type: 'text',
                                                        label: results[i]
                                                    }
                                                }]);
                                            }

                                            document.querySelector('#table-search').update(rows);
                                        });
                                    });
                                } else if (type === 'duckduckgo') {
                                    window.open('https://duckduckgo.com/?q=' + this.value, '_self');
                                } else if (type === 'google') {
                                    window.open('https://www.google.com/search?q=' + this.value, '_self');
                                }
                            }
                        }
                    }
                },

                menu: {
                    type: 'button',
                    icon: '<svg viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"></svg>',
                    onClickRender: {
                        type: 'dialog',
                        class: 'satus-dialog--vertical-menu satus-dialog--search-menu',

                        bookmarks: {
                            type: 'button',
                            label: 'Bookmarks',
                            before: '<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>',

                            on: {
                                click: function() {
                                    search_type = 'bookmarks';
                                    document.querySelector('.satus-dialog__scrim').click();
                                }
                            }
                        },
                        history: {
                            type: 'button',
                            label: 'History',
                            before: '<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>',

                            on: {
                                click: function() {
                                    search_type = 'history';
                                    document.querySelector('.satus-dialog__scrim').click();
                                }
                            }
                        },
                        duckduckgo: {
                            type: 'button',
                            label: 'DuckDuckGo',
                            before: '<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',

                            on: {
                                click: function() {
                                    search_type = 'duckduckgo';
                                    document.querySelector('.satus-dialog__scrim').click();
                                }
                            }
                        },
                        google: {
                            type: 'button',
                            label: 'Google',
                            before: '<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',

                            on: {
                                click: function() {
                                    search_type = 'google';
                                    document.querySelector('.satus-dialog__scrim').click();
                                }
                            }
                        }
                    }
                }
            },
            section_end: {
                type: 'section',
                class: 'satus-section--align-end',

                button_vert: {
                    type: 'button',
                    icon: '<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="5.25" r="0.45"/><circle cx="12" cy="12" r="0.45"/><circle cx="12" cy="18.75" r="0.45"/></svg>',
                    onClickRender: {
                        type: 'dialog',
                        class: 'satus-dialog--vertical-menu',

                        export: {
                            type: 'button',
                            label: 'Export',
                            onclick: function() {
                                chrome.runtime.sendMessage({
                                    name: 'download',
                                    filename: 'regex-replace.json',
                                    value: Satus.storage.get('data')
                                });
                            }
                        },
                        import: {
                            type: 'button',
                            label: 'Import',
                            onclick: function() {
                                try {
                                    var input = document.createElement('input');

                                    input.type = 'file';

                                    input.addEventListener('change', function() {
                                        var file_reader = new FileReader();

                                        file_reader.onload = function() {
                                            var data = JSON.parse(this.result);

                                            for (var i in data) {
                                                Satus.storage.set(i, data[i]);
                                            }

                                            Satus.render({
                                                type: 'dialog',

                                                message: {
                                                    type: 'text',
                                                    label: 'successfullyImportedSettings',
                                                    style: {
                                                        'width': '100%',
                                                        'opacity': '.8'
                                                    }
                                                },
                                                section: {
                                                    type: 'section',
                                                    class: 'controls',
                                                    style: {
                                                        'justify-content': 'flex-end',
                                                        'display': 'flex'
                                                    },

                                                    cancel: {
                                                        type: 'button',
                                                        label: 'cancel',
                                                        onclick: function() {
                                                            var scrim = document.querySelectorAll('.satus-dialog__scrim');

                                                            scrim[scrim.length - 1].click();
                                                        }
                                                    },
                                                    ok: {
                                                        type: 'button',
                                                        label: 'OK',
                                                        onclick: function() {
                                                            var scrim = document.querySelectorAll('.satus-dialog__scrim');

                                                            scrim[scrim.length - 1].click();
                                                        }
                                                    }
                                                }
                                            });
                                        };

                                        file_reader.readAsText(this.files[0]);
                                    });

                                    input.click();
                                } catch (err) {
                                    chrome.runtime.sendMessage({
                                        name: 'dialog-error',
                                        value: err
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    };

var History = {},
    Selected = {};

window.addEventListener('click', function(event) {
    var target = event.target;
    
    if (target.classList.contains('satus-button--star')) {
        star(target);
    } else if (target.classList.contains('satus-link--domain')) {
        updateURLTable(target.innerText);
            
        event.preventDefault();

        return false;
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
                    Selected[href] = History[href.split('/')[2]].items[href];
                }
                
                event.path[i].classList.toggle('selected');
                
                checkToolbar();
            }
        }
    }
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
}

function star(target) {
    var value = Number(target.dataset.value) === 0 ? 1 : 0;
    
    target.dataset.value = value;
    
    History[target.dataset.href.split('/')[2]].items[target.dataset.href].star = value;

    Satus.storage.set('history', History);
    
    updateURLTable(target.dataset.href.split('/')[2]);
    
    for (var key in Selected) {
        Selected[key] = undefined;
    }
    
    checkToolbar();
}

function tags() {    
    History[this.dataset.href.split('/')[2]].items[this.dataset.href].tags = this.value;

    Satus.storage.set('history', History);
    
    updateURLTable(this.dataset.href.split('/')[2]);
    
    for (var key in Selected) {
        Selected[key] = undefined;
    }
    
    checkToolbar();
}

function updateURLTable(domain) {
    var data = [],
        object = History[domain];

    for (var key in object.items) {
        var url = decodeURI(key.replace(/^.*\/\/[^\/]+:?[0-9]?\//g, ''));
        
        data.push([
        {
            text: object.items[key].visitCount
        },
        {
            text: object.items[key].title
        },
        {
            html: '<a href="' + key + '">/' + url + '</a>',
            text: url
        },
        {
            html: '<button class="satus-button satus-button--star" data-href="' + key + '" data-value="' + object.items[key].star + '"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></button>',
            text: object.items[key].star
        },
        {
            html: '<input class="satus-input--tags" type="text" data-href="' + key + '" value="' + object.items[key].tags + '">',
            text: object.items[key].tags,
            onrender: function() {
                this.querySelector('.satus-input--tags').onblur = tags;
            }
        }
        ]);
    }

    document.querySelector('#by-url').pagingIndex = 0;
    document.querySelector('#by-url').update(data);
}

Menu.main = {
    type: 'main',
    scrollbar: false,

    table_01: {
        type: 'table',
        id: 'by-domain',
        paging: 100,
        columns: [{
            title: 'Visits',
            sorting: 'desc'
        }, {
            title: 'Domain'
        }]
    },

    table_02: {
        type: 'table',
        id: 'by-url',
        paging: 100,
        columns: [{
            title: 'Visits',
            sorting: 'desc'
        }, {
            title: 'Title'
        }, {
            title: 'URL'
        }, {
            title: '★'
        }, {
            title: 'Tags'
        }],
        onrender: function() {
            var toolbar = document.createElement('div');
            
            toolbar.className = 'satus-table--toolbar';
            
            Satus.render({
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
                            if  (Selected[key]) {
                                Selected[key].star = 1;
                            }
                        }
                        
                        updateURLTable(document.querySelector('#by-url a').href.split('/')[2]);

                        Satus.storage.set('history', History);
                        
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
                            if  (Selected[key]) {
                                delete History[key.split('/')[2]].items[key];
                                delete Selected[key];
                            }
                        }
                        
                        updateURLTable(document.querySelector('#by-url a').href.split('/')[2]);

                        Satus.storage.set('history', History);
                        
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
                            if  (Selected[key]) {
                                Selected[key].tags = this.parentNode.querySelector('input').value;
                            }
                        }
                        
                        updateURLTable(document.querySelector('#by-url a').href.split('/')[2]);

                        Satus.storage.set('history', History);
                        
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
                                if  (Selected[key]) {
                                    Selected[key].tags = this.value;
                                }
                            }
                            
                            updateURLTable(document.querySelector('#by-url a').href.split('/')[2]);

                            Satus.storage.set('history', History);
                        }
                    }
                }
            }, toolbar);
            
            this.appendChild(toolbar);
        }
    }
};

/*---------------------------------------------------------------
>>> INDEX:
-----------------------------------------------------------------
# Storage import
# Locale import
# History import
---------------------------------------------------------------*/

Satus.storage.import(function() {
    var end_time = new Date().getTime(),
        start_time = Satus.storage.get('startTime') || 0,
        language = 'en';

    Satus.locale.import('_locales/' + language + '/messages.json', function() {
        chrome.history.search({
            text: '',
            startTime: start_time,
            endTime: end_time,
            maxResults: 999999
        }, function(items) {
            History = Satus.storage.get('history') || {};

            for (var i = 0, l = items.length; i < l; i++) {
                var item = items[i],
                    url = item.url,
                    host = url.split('/')[2];

                if (History.hasOwnProperty(host) === false) {
                    History[host] = {
                        items: {},
                        lastVisitTime: item.lastVisitTime,
                        visitCount: 0
                    };
                }

                History[host].items[url] = {
                    title: item.title,
                    visitCount: item.visitCount,
                    star: 0,
                    tags: ''
                };
            }
            
            for (var key in History) {
                History[key].visitCount = 0;
                
                for (var i in History[key].items) {
                    History[key].visitCount += History[key].items[i].visitCount;
                }
            }

            Satus.storage.set('history', History);
            Satus.storage.set('startTime', end_time);

            var data = [];

            for (var key in History) {
                data.push([
                {
                    text: History[key].visitCount
                },
                {
                    text: key,
                    html: '<a class="satus-link--domain" href="https://' + key + '">' + key + '</a>'
                }
                ]);
            }

            Menu.main.table_01.data = data;

            Satus.render(Menu);
            
            updateURLTable(document.querySelector('.satus-table__cell:nth-child(2) a').innerText);
        });
    });
});
