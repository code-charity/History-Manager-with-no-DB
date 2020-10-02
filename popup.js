
/*---------------------------------------------------------------
>>> HEADER
---------------------------------------------------------------*/

// TODO optimize dataSearch function

function dataSearch(event) {
    var value = this.value;

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

                if (key.indexOf(value) !== -1 || (HISTORY_MANAGER.PARAMS[key].title || '').indexOf(value) !== -1) {
                    HISTORY_MANAGER.SEARCH.PARAMS[key] = HISTORY_MANAGER.PARAMS[key];
                }
            }
        }
        
        if (HISTORY_MANAGER.SEARCH.INDEX === HISTORY_MANAGER.LENGTH[0]) {
            updateTable1(true, HISTORY_MANAGER.SEARCH.DOMAINS);

            HISTORY_MANAGER.SEARCH.DOMAINS = {};
        } else if (HISTORY_MANAGER.SEARCH.INDEX === HISTORY_MANAGER.LENGTH[1]) {
            updateTable2(true, HISTORY_MANAGER.SEARCH.PAGES);

            HISTORY_MANAGER.SEARCH.PAGES = {};
        } else if (HISTORY_MANAGER.SEARCH.INDEX === HISTORY_MANAGER.LENGTH[2]) {
            updateTable3(true, HISTORY_MANAGER.SEARCH.PARAMS);

            HISTORY_MANAGER.SEARCH.PARAMS = {};
            HISTORY_MANAGER.SEARCH.INDEX = 0;
            
            clearInterval(HISTORY_MANAGER.SEARCH.INTERVAL);
        }
    }, 100);
}

var Menu = {
        header: {
            type: 'header',

            section_start: {
                type: 'section',
                class: 'satus-section--align-start',

                search_icon: {
                    type: 'button',
                    class: 'satus-header__search-button',
                    before: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>'
                },
                text_field: {
                    type: 'text-field',
                    rows: 1,
                    class: 'satus-header__text-field',
                    placeholder: 'Search',
                    oninput: dataSearch
                }
            },
            section_end: {
                type: 'section',
                class: 'satus-section--align-end',

                button_vert: {
                    type: 'button',
                    before: '<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="5.25" r="0.45"/><circle cx="12" cy="12" r="0.45"/><circle cx="12" cy="18.75" r="0.45"/></svg>'
                }
            }
        }
    };

var Selected = {};

window.addEventListener('click', function(event) {
    var target = event.target;

    if (target.classList.contains('satus-button--star')) {
        star(target);
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

    HISTORY_MANAGER.PAGES[target.dataset.href].star = value;

    updateTable2(true);

    var DOMAINS = HISTORY_MANAGER.DOMAINS,
        PAGES = HISTORY_MANAGER.PAGES,
        PARAMS = HISTORY_MANAGER.PARAMS;

    Satus.storage.set('HISTORY', {
        DOMAINS,
        PAGES,
        PARAMS
    });

    for (var key in Selected) {
        Selected[key] = undefined;
    }

    checkToolbar();
}

function tags() {
    HISTORY_MANAGER.PAGES[this.dataset.href].tags = this.value;

    var DOMAINS = HISTORY_MANAGER.DOMAINS,
        PAGES = HISTORY_MANAGER.PAGES,
        PARAMS = HISTORY_MANAGER.PARAMS;

    Satus.storage.set('HISTORY', {
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
                title: 'Visits',
                sorting: 'desc'
            }, {
                title: '',
                onrender: function() {
                    this.querySelector('.satus-button--dropdown').addEventListener('click', function() {
                        var container = this.parentNode.parentNode;

                        if (!container.querySelector('.satus-dropdown-list')) {
                            var list = document.createElement('div'),
                                data = [],
                                host = this.dataset.key;

                            list.className = 'satus-dropdown-list';

                            for (var key in HISTORY_MANAGER.DOMAINS[host].items) {
                                var item = HISTORY_MANAGER.DOMAINS[host].items[key];

                                data.push([{

                                    },
                                    {
                                        text: item.visitCount
                                    },
                                    {
                                        text: key,
                                        html: '<a class="satus-link--domain" href="https://' + host + '/' + key + '" title="' + item.title + '">' + key + '</a>'
                                    }
                                ]);
                            }

                            Satus.render({
                                type: 'table',
                                paging: 100,
                                columns: [{
                                    title: ''
                                }, {
                                    title: 'Visits',
                                    sorting: 'desc'
                                }, {
                                    title: 'Title',
                                    onrender: function() {
                                        this.querySelector('a').innerText = '/' + this.querySelector('a').innerText;
                                    }
                                }],
                                data: data
                            }, list);

                            container.appendChild(list);

                            this.classList.add('opened');
                        } else {
                            container.querySelector('.satus-dropdown-list').remove();

                            this.classList.remove('opened');
                        }
                    });
                }
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
                title: 'Tags',
                onrender: function() {
                    this.querySelector('.satus-input--tags').onblur = tags;
                }
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
                                if (Selected[key]) {
                                    Selected[key].star = 1;
                                }
                            }

                            updateTable2(true);

                            var DOMAINS = HISTORY_MANAGER.DOMAINS,
                                PAGES = HISTORY_MANAGER.PAGES,
                                PARAMS = HISTORY_MANAGER.PARAMS;

                            Satus.storage.set('HISTORY', {
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

                            Satus.storage.set('HISTORY', {
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

                            Satus.storage.set('HISTORY', {
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

                                Satus.storage.set('HISTORY', {
                                    DOMAINS,
                                    PAGES,
                                    PARAMS
                                });
                            }
                        }
                    }
                }, toolbar);

                this.appendChild(toolbar);
            }
        },

        table_03: {
            type: 'table',
            id: 'by-params',
            paging: 100,
            columns: [{
                title: 'Visits',
                sorting: 'desc'
            }, {
                title: 'Domain'
            }]
        }
    }
};

/*---------------------------------------------------------------
>>> TABLES
-----------------------------------------------------------------
1.0 Table 1
2.0 Table 2
3.0 Table 3
---------------------------------------------------------------*/

/*---------------------------------------------------------------
>>> TABLE 1
---------------------------------------------------------------*/

function updateTable1(force, d) {
    var data = d || HISTORY_MANAGER.DOMAINS,
        table = [];
    
    for (var key in data) {
        table.push([
            {
                text: data[key].visitCount
            },
            {
                html: '<button class="satus-button satus-button--dropdown" data-key="' + key + '"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button>'
            },
            {
                text: key,
                html: '<a class="satus-link--domain" href="' + key + '"><img src="chrome://favicon/https://' + key + '">' + key + '</a>'
            }
        ]);
    }
    
    Menu.main.section.table_01.data = table;
    
    if (force === true) {
        document.querySelector('#by-domain').update(table);
    }
}


/*---------------------------------------------------------------
>>> TABLE 2
---------------------------------------------------------------*/

function updateTable2(force, d) {
    var data = d || HISTORY_MANAGER.PAGES,
        table = [];

    for (var key in data) {
        var item = data[key],
            url = /*decodeURI*/(key.replace(/^.*\/\/[^\/]+:?[0-9]?\//g, ''));
        
        table.push([
        {
            text: item.visitCount
        },
        {
            html: '<img src="chrome://favicon/' + key + '">' + item.title,
            text: item.title
        },
        {
            html: '<a href="' + key + '">/' + url + '</a>',
            text: url
        },
        {
            html: '<button class="satus-button satus-button--star" data-href="' + key + '" data-value="' + item.star + '"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></button>',
            text: item.star
        },
        {
            html: '<input class="satus-input--tags" type="text" data-href="' + key + '" value="' + item.tags + '">',
            text: item.tags
        }
        ]);
    }

    Menu.main.section.table_02.data = table;
    
    if (force === true) {
        document.querySelector('#by-url').update(table);
    }
}


/*---------------------------------------------------------------
>>> TABLE 3
---------------------------------------------------------------*/

function updateTable3(force, d) {
    var data = d || HISTORY_MANAGER.PARAMS,
        table = [];

    for (var key in data) {
        var item = data[key];
        
        table.push([
        {
            text: item.visitCount
        },
        {
            html: '<a href="' + key + '"><img src="chrome://favicon/' + key + '">' + key + '</a>',
            text: key
        }
        ]);
    }

    Menu.main.section.table_03.data = table;
    
    if (force === true) {
        document.querySelector('#by-params').update(table);
    }
}

/*---------------------------------------------------------------
>>> INDEX
---------------------------------------------------------------*/

var HISTORY_MANAGER = {
    DOMAINS: {},
    PAGES: {},
    PARAMS: {},
    
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
        PARAMS: {}
    }
};

console.time();

satus.storage.import(function() {
    var object = satus.storage.get('HISTORY') || {};
    
    HISTORY_MANAGER.DOMAINS = object.DOMAINS;
    HISTORY_MANAGER.PAGES = object.PAGES;
    HISTORY_MANAGER.PARAMS = object.PARAMS;

    satus.locale.import('_locales/en/messages.json', function() {
        updateTable1();
        updateTable2();
        updateTable3();

        Satus.render(Menu);
        
        console.timeEnd();
        
        setTimeout(function() {
            HISTORY_MANAGER.KEYS[0] = Object.keys(HISTORY_MANAGER.DOMAINS);
            HISTORY_MANAGER.KEYS[1] = Object.keys(HISTORY_MANAGER.PAGES);
            HISTORY_MANAGER.KEYS[2] = Object.keys(HISTORY_MANAGER.PARAMS);
            
            HISTORY_MANAGER.LENGTH[0] = HISTORY_MANAGER.KEYS[0].length;
            HISTORY_MANAGER.LENGTH[1] = HISTORY_MANAGER.KEYS[0].length + HISTORY_MANAGER.KEYS[1].length;
            HISTORY_MANAGER.LENGTH[2] = HISTORY_MANAGER.KEYS[0].length + HISTORY_MANAGER.KEYS[1].length + HISTORY_MANAGER.KEYS[2].length;
        }, 250);
    });
});
