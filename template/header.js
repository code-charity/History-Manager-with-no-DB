/*-----------------------------------------------------------------------------
>>> «HEADER» TEMPLATE
-----------------------------------------------------------------------------*/

var header_search = false;

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
                            var type = 'bookmarks';

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
                            }
                        }
                    }
                }
            }
        },
        section_end: {
            type: 'section',
            class: ['satus-section--align-end'],

            vert: {
                type: 'dialog',
                icon: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>',
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
            }
        }
    }
};