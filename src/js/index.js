/*---------------------------------------------------------------
>>> INDEX:
-----------------------------------------------------------------
# Storage import
# Locale import
# History import
---------------------------------------------------------------*/

Satus.storage.import(function() {
    var end_time = new Date().getTime(),
        start_time = Satus.storage.get('startTime') || start_time - 7.776e+9,
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

                History[host].visitCount += item.visitCount;

                History[host].items[url] = {
                    title: item.title,
                    visitCount: item.visitCount
                };
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
                    text: ''
                },
                {
                    text: key,
                    html: '<a href="https://' + key + '">' + key + '</a>'
                }
                ]);
            }

            Menu.main.table_01.data = data;

            Satus.render(Menu);

            document.querySelector('.satus-table__cell:nth-child(3)').click();
        });
    });
});
