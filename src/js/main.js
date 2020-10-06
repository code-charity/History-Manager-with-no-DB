var Selected = {},
    all_loaded = false,
    all_loading = false;

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
    
    window.dispatchEvent(new Event('resize'));
}

function star(target) {
    var value = Number(target.dataset.value) === 0 ? 1 : 0;

    target.dataset.value = value;

    HISTORY_MANAGER.PAGES[target.dataset.href].star = value;

    updateTable2(true);

    satus.storage.set('_all', {
        dimains: HISTORY_MANAGER.DOMAINS,
        pages: HISTORY_MANAGER.PAGES
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
                                        },
                                        {},
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
                title: 'Domain'
            }],
            beforeUpdate: function(item) {
                if (all_loaded === false) {
                    satus.storage.import('_all', function(item) {
                        HISTORY_MANAGER.DOMAINS = item.domains;
                        HISTORY_MANAGER.PAGES = item.pages;

                        document.querySelector('#by-domain').data = updateTable1(true);
                        document.querySelector('#by-url').data = updateTable2();
                        document.querySelector('#by-params').data = updateTable3();

                        HISTORY_MANAGER.KEYS[0] = Object.keys(HISTORY_MANAGER.DOMAINS);
                        HISTORY_MANAGER.KEYS[1] = Object.keys(HISTORY_MANAGER.PAGES);
                        HISTORY_MANAGER.KEYS[2] = Object.keys(HISTORY_MANAGER.DOMAINS);
                        HISTORY_MANAGER.LENGTH[0] = HISTORY_MANAGER.KEYS[0].length;
                        HISTORY_MANAGER.LENGTH[1] = HISTORY_MANAGER.KEYS[0].length + HISTORY_MANAGER.KEYS[1].length;
                        HISTORY_MANAGER.LENGTH[2] = HISTORY_MANAGER.KEYS[0].length + HISTORY_MANAGER.KEYS[1].length + HISTORY_MANAGER.KEYS[2].length;
                        
                        all_loaded = true;
                        
                        document.querySelectorAll('.satus-table')[0].querySelector('.satus-scrollbar__wrapper').scrollTo(0, 0);
                    });
                }
            }
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
            },
            beforeUpdate: function(item) {
                if (all_loaded === false) {
                    satus.storage.import('_all', function(item) {
                        HISTORY_MANAGER.DOMAINS = item.domains;
                        HISTORY_MANAGER.PAGES = item.pages;

                        document.querySelector('#by-domain').data = updateTable1();
                        document.querySelector('#by-url').data = updateTable2(true);
                        document.querySelector('#by-params').data = updateTable();

                        HISTORY_MANAGER.KEYS[0] = Object.keys(HISTORY_MANAGER.DOMAINS);
                        HISTORY_MANAGER.KEYS[1] = Object.keys(HISTORY_MANAGER.PAGES);
                        HISTORY_MANAGER.KEYS[2] = Object.keys(HISTORY_MANAGER.DOMAINS);
                        HISTORY_MANAGER.LENGTH[0] = HISTORY_MANAGER.KEYS[0].length;
                        HISTORY_MANAGER.LENGTH[1] = HISTORY_MANAGER.KEYS[0].length + HISTORY_MANAGER.KEYS[1].length;
                        HISTORY_MANAGER.LENGTH[2] = HISTORY_MANAGER.KEYS[0].length + HISTORY_MANAGER.KEYS[1].length + HISTORY_MANAGER.KEYS[2].length;
                        
                        all_loaded = true;
                        
                        document.querySelectorAll('.satus-table')[1].querySelector('.satus-scrollbar__wrapper').scrollTo(0, 0);
                    });
                }
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
                                        } catch(err) {
                                            var qq = q[0].substring(q[0].indexOf('=') + 1);
                                        }

                                        data.push([{
                                                text: item.visitCount
                                            },
                                            {},
                                            {
                                                text: key,
                                                html: '<a class="satus-link--domain" href="https://' + host + '/' + key + '" title="' + q + '">' + qq + '</a>'
                                            }
                                        ]);
                                    }
                                }
                                
                                if (data.length === 0) {
                                    return;
                                }

                                Satus.render({
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
                title: 'Domain'
            }],
            beforeUpdate: function(item) {
                if (all_loaded === false) {
                    satus.storage.import('_all', function(item) {
                        HISTORY_MANAGER.DOMAINS = item.domains;
                        HISTORY_MANAGER.PAGES = item.pages;

                        document.querySelector('#by-domain').data = updateTable1();
                        document.querySelector('#by-url').data = updateTable2();
                        document.querySelector('#by-params').data = updateTable3(true);

                        HISTORY_MANAGER.KEYS[0] = Object.keys(HISTORY_MANAGER.DOMAINS);
                        HISTORY_MANAGER.KEYS[1] = Object.keys(HISTORY_MANAGER.PAGES);
                        HISTORY_MANAGER.KEYS[2] = Object.keys(HISTORY_MANAGER.DOMAINS);
                        HISTORY_MANAGER.LENGTH[0] = HISTORY_MANAGER.KEYS[0].length;
                        HISTORY_MANAGER.LENGTH[1] = HISTORY_MANAGER.KEYS[0].length + HISTORY_MANAGER.KEYS[1].length;
                        HISTORY_MANAGER.LENGTH[2] = HISTORY_MANAGER.KEYS[0].length + HISTORY_MANAGER.KEYS[1].length + HISTORY_MANAGER.KEYS[2].length;
                        
                        all_loaded = true;
                        
                        document.querySelectorAll('.satus-table')[2].querySelector('.satus-scrollbar__wrapper').scrollTo(0, 0);
                    });
                }
            }
        }
    }
};
