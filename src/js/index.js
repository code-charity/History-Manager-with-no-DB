/*---------------------------------------------------------------
>>> INDEX
-----------------------------------------------------------------
1.0 Storage
2.0 Locale
3.0 History
4.0 Init
---------------------------------------------------------------*/

/*---------------------------------------------------------------
1.0 STORAGE
---------------------------------------------------------------*/

function importStorage(callback) {
    satus.storage.import(callback);
}


/*---------------------------------------------------------------
2.0 LOCALE
---------------------------------------------------------------*/

function importLocale(path, callback) {
    satus.locale.import(path, callback);
}


/*---------------------------------------------------------------
3.0 HISTORY
---------------------------------------------------------------*/

function importHistory(params, callback) {
    chrome.history.search(params, callback);
}


/*---------------------------------------------------------------
4.0 INIT
---------------------------------------------------------------*/

window.addEventListener('load', function() {
    importStorage(function() {
        satus.history = satus.storage.get('history') || {
            hosts: {},
            pages: {},
            params: {}
        };
        
        importLocale('_locales/en/messages.json', function() {
            var end_time = new Date().getTime();
            
            importHistory({
                text: '',
                startTime: Satus.storage.get('startTime') || 0,
                endTime: end_time,
                maxResults: 9999999
            }, function(items) {
                parseHistory(items);
                
                updateTable1();
                updateTable2();
                updateTable3();
                
                Satus.render(Menu);
            });
            
            Satus.storage.set('startTime', end_time);
        });
    });
});
