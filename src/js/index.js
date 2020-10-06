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

satus.locale.import('en', function() {
    satus.storage.import('compact_mode', function(item) {
        document.body.dataset.compactMode = satus.storage.get('compact_mode');
    });

    satus.storage.import('_top', function(item) {
        HISTORY_MANAGER.DOMAINS = item.domains;
        HISTORY_MANAGER.PAGES = item.pages;

        updateTable1();
        updateTable2();
        updateTable3();
        
        Menu.main.section.table_01.pages = Math.ceil(satus.storage.data._top.length[0] / 100);
        Menu.main.section.table_02.pages = Math.ceil(satus.storage.data._top.length[1] / 100);
        Menu.main.section.table_03.pages = Math.ceil(satus.storage.data._top.length[0] / 100);

        HISTORY_MANAGER.KEYS[0] = Object.keys(HISTORY_MANAGER.DOMAINS);
        HISTORY_MANAGER.KEYS[1] = Object.keys(HISTORY_MANAGER.PAGES);
        HISTORY_MANAGER.KEYS[2] = Object.keys(HISTORY_MANAGER.DOMAINS);
        HISTORY_MANAGER.LENGTH[0] = HISTORY_MANAGER.KEYS[0].length;
        HISTORY_MANAGER.LENGTH[1] = HISTORY_MANAGER.KEYS[0].length + HISTORY_MANAGER.KEYS[1].length;
        HISTORY_MANAGER.LENGTH[2] = HISTORY_MANAGER.KEYS[0].length + HISTORY_MANAGER.KEYS[1].length + HISTORY_MANAGER.KEYS[0].length;
        
        satus.render(Menu);
        
        console.timeEnd();
    });
});
