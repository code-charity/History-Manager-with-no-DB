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
