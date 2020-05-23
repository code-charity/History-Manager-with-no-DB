
var Menu = {
	header: {
		type: 'header'
	}
};
var History = {};

Menu.main = {
    type: 'main',
    scrollbar: false,
    onclick: function(event) {
        for (var i = 0, l = event.path.length; i < l; i++) {
            var item = event.path[i];

            if (item.nodeName === 'TD') {
                if (Array.prototype.indexOf.call(item.parentElement.children, item) === 3) {
                    var data = [],
                        object = History[item.innerText];

                    for (var key in object.items) {
                        data.push([
                            object.items[key].visitCount,
                            object.items[key].title,
                            key,
                            ''
                        ]);
                    }

                    document.querySelector('.satus-main__container > .satus-table:nth-child(2)').update(data, 0, 'desc');

                    i = l;
                }
            }
        }
    },

    table_01: {
        type: 'table',
        columns: [{
            title: ''
        }, {
            title: 'Visit count',
            sorting: 'desc'
        }, {
            title: ''
        }, {
            title: 'Domain'
        }]
    },

    table_02: {
        type: 'table',
        columns: [{
            title: 'Visit count'
        }, {
            title: 'Title'
        }, {
            title: 'URL'
        }, {
            title: 'Tags'
        }]
    },

    table_03: {
        type: 'table',
        columns: [{
            title: 'Visit count'
        }, {
            title: 'Domain'
        }]
    }
};
Satus.storage.import(function() {
    var end_time = new Date().getTime(),
        start_time = Satus.storage.get('startTime') || start_time - 7.776e+9;

    chrome.history.search({
        text: '',
        startTime: start_time,
        endTime: end_time,
        maxResults: 99999
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
            data.push(['', History[key].visitCount, '', key]);
        }

        Menu.main.table_01.data = data;

        Satus.render(Menu);
    });
});