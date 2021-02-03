/*---------------------------------------------------------------
>>> TABLES
-----------------------------------------------------------------
# Table 1
# Table 2
# Table 3
# Table 4
---------------------------------------------------------------*/

/*---------------------------------------------------------------
# TABLE 1
---------------------------------------------------------------*/

function updateTable1(force, d) {
    var data = d || HISTORY_MANAGER.DOMAINS,
        table = [];

    for (var key in data) {
        table.push([{
            text: data[key]
        }, {
            html: '<button class="satus-button satus-button--dropdown" data-key="' + key + '"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button>'
        }, {
            text: key,
            html: '<a class="satus-link--domain" href="' + key + '"><img src="chrome://favicon/https://' + key + '">' + key + '</a>'
        }]);
    }

    Menu.main.section.table_01.data = table;

    if (force === true) {
        document.querySelector('#by-domain').update(table);
    }

    return table;
}


/*---------------------------------------------------------------
# TABLE 2
---------------------------------------------------------------*/

function updateTable2(force, d) {
    chrome.bookmarks.getTree(function(results) {
        parseBookmarks(results, function(bookmarks) {
            var data = d || HISTORY_MANAGER.PAGES,
                table = [];

            for (var key in data) {
                var item = data[key],
                    url = key.replace(/^.*\/\/[^\/]+:?[0-9]?\//g, '');

                table.push([{
                    text: item.visitCount
                }, {
                    html: '<img src="chrome://favicon/https://' + key.split('/')[2] + '">' + item.title,
                    text: item.title
                }, {
                    html: '<a href="' + key + '">/' + url + '</a>',
                    text: url
                }, {
                    html: '<button class="satus-button satus-button--star" data-title="' + item.title + '" data-id="' + bookmarks[key] + '" data-href="' + key + '" data-value="' + (bookmarks[key] ? true : false) + '"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></button>',
                    text: item.star
                }, {
                    html: '<input class="satus-input--tags" type="text" data-href="' + key + '" value="' + item.tags + '">',
                    text: item.tags
                }]);
            }

            Menu.main.section.table_02.data = table;

            if (force === true) {
                document.querySelector('#by-url').update(table);
            }
        });
    });
}


/*---------------------------------------------------------------
# TABLE 3
---------------------------------------------------------------*/

function updateTable3(force, d) {
    var data = d || HISTORY_MANAGER.PARAMS,
        table = [];

    for (var key in data) {
        table.push([{
            text: data[key]
        }, {
            html: '<button class="satus-button satus-button--dropdown" data-key="' + key + '"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button>'
        }, {
            html: '<a href="' + key + '"><img src="chrome://favicon/https://' + key + '">' + key + '</a>',
            text: key
        }]);
    }

    Menu.main.section.table_03.data = table;

    if (force === true) {
        document.querySelector('#by-params').update(table);
    }

    return table;
}


/*---------------------------------------------------------------
# TABLE 4
---------------------------------------------------------------*/

function updateTable4() {
    chrome.tabs.query({}, function(tabs) {
        var data = HISTORY_MANAGER.PINNED,
            table = [],
            pinned_tabs = {};

        for (var i = 0, l = tabs.length; i < l; i++) {
            var tab = tabs[i];

            table.push([{
                html: '<button class="satus-button satus-button--pin" data-href="' + tab.url + '" data-value="' + tab.pinned + '"><svg fill="currentColor" stroke-width="1.75" viewBox="0 0 24 24"><path d="M4 10h5c1.12 0 2.16-.37 3-1v6c-.86-.65-1.9-1-3-1H4v-4M2 7v10c0 .55.45 1 1 1s1-.45 1-1v-1h5c1.66 0 3 1.34 3 3h2v-5.97h7l1-1-1-1h-7V5h-2c0 1.66-1.34 3-3 3H4V7c0-.55-.45-1-1-1s-1 .45-1 1z"/></svg></button>'
            }, {
                html: '<a href="' + tab.url + '"><img src="chrome://favicon/' + tab.url + '">' + tab.title + '</a>',
                text: tab.url
            }]);
        }

        if (table.length > 0) {
            Menu.main.section.table_04.data = table;

            document.querySelector('#pinned').update(table);
        }
    });
}