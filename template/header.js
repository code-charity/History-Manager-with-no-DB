/*-----------------------------------------------------------------------------
>>> «HEADER» TEMPLATE
-----------------------------------------------------------------------------*/

var object_search = {
    interval: false,
    queue: [],
    results: [],
    query: '',
    search: function(object) {
        for (var key in object) {
            if (typeof object[key] === 'string') {
                if (object[key].indexOf(object_search.query) !== -1) {
                    var rows = [];

                    object_search.results.push(object[key]);

                    for (var i = 0, l = object_search.results.length; i < l; i++) {
                        rows.push([{
                            visit_count: {
                                type: 'text',
                                label: 0
                            }
                        }, {
                            domain: {
                                type: 'text',
                                label: object_search.results[i]
                            }
                        }]);
                    }

                    document.querySelector('#table-search').update(rows);
                }
            } else if (typeof object[key] === 'object') {
                object_search.queue.push(object[key]);
            }
        }
    }
};

const Menu = {
    header: {
        type: 'header',

        section_start: {
            type: 'section',
            class: ['satus-section--align-start'],

            search: {
                type: 'textarea',
                rows: 1,
                id: 'satus-header__search',
                placeholder: 'Search',
                on: {
                    keyup: function(event) {
                        if (event.keyCode === 13) {
                            object_search.query = this.value;

                            if (object_search.interval !== false) {
                                clearInterval(object_search.interval);

                                object_search.interval = false;
                                object_search.queue = [];
                                object_search.results = [];
                            }

                            Satus.chromium_bookmarks.get(function(items) {
                                object_search.interval = setInterval(function() {
                                    if (object_search.queue.length > 0) {
                                        var item = object_search.queue[0];

                                        object_search.search(item);

                                        object_search.queue.shift();
                                    }
                                });

                                object_search.search(items);
                            });
                        }
                    }
                }
            }
        },
        section_end: {
            type: 'section',
            class: ['satus-section--align-end'],

            vert: {
                type: 'button',
                icon: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>',

                onclick: function(event) {
                    event.stopPropagation();

                    document.querySelector('.satus').appendChild(Satus.components.dialog({
                        right: 8,
                        top: 8,
                        scrim: false,
                        surface: {
                            maxWidth: '200px',
                            minWidth: '200px'
                        },

                        save_as: {
                            type: 'button',
                            label: 'saveAs',
                            icon: '<svg viewBox="0 0 24 24" style=width:16px;height:16px;margin-right:10px;margin-top:2px><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>',
                            onclick: function(satus, component) {
                                chrome.runtime.sendMessage({
                                    name: 'download',
                                    filename: 'improvedtube-report',
                                    value: satus.modules.user.get()
                                });
                            }
                        }
                    }));
                }
            }
        }
    }
};