/*---------------------------------------------------------------
>>> HEADER
---------------------------------------------------------------*/

// TODO optimize dataSearch function

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
        updateTable3(true, HISTORY_MANAGER.DOMAINS);
        
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
                    oninput: function(event) {
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
                                    HISTORY_MANAGER.KEYS[2] = Object.keys(HISTORY_MANAGER.DOMAINS);
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
                    }
                }
            },
            section_end: {
                type: 'section',
                class: 'satus-section--align-end',

                button_vert: {
                    type: 'button',
                    before: '<svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="5.25" r="0.45"/><circle cx="12" cy="12" r="0.45"/><circle cx="12" cy="18.75" r="0.45"/></svg>',
                    onclick: {
                        type: 'dialog',
                        class: 'satus-dialog--vertical-menu',
                        
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
