/*---------------------------------------------------------------
>>> HISTORY
-----------------------------------------------------------------
1.0 Parse
---------------------------------------------------------------*/

/*---------------------------------------------------------------
1.0 PARSE
---------------------------------------------------------------*/

function parseHistory(items, callback) {
    var hosts_data = satus.history.hosts,
        pages_data = satus.history.pages,
        params_data = satus.history.params;
    
    items = items.sort(function(a, b) {
        return b.visitCount - a.visitCount;
    });
    
    // BY DOMAIN
    for (var i = 0, l = items.length; i < l; i++) {
        var item = items[i],
            host = item.url.split('/')[2];
        
        if (!hosts_data[host]) {
            hosts_data[host] = {
                items: {},
                visitCount: item.visitCount
            };
        } else {
            hosts_data[host].visitCount += item.visitCount;
        }
        
        hosts_data[host].items[/*decodeURI*/(item.url.replace(/^.*\/\/[^\/]+:?[0-9]?\//g, ''))] = {
            title: item.title,
            visitCount: item.visitCount
        };
    }
    
    // BY PAGE
    
    for (var i = 0, l = Math.min(items.length, 1000); i < l; i++) {
        var item = items[i];
        
        pages_data[item.url] = {
            title: item.title,
            visitCount: item.visitCount,
            star: 0,
            tags: ''
        };
    }
    
    // BY PARAM
    for (var i = 0, l = items.length, j = 0; i < l; i++) {
        var item = items[i];
        
        if (item.url.match(/[^\w]q=/) && j < 1000) {
            params_data[item.url] = {
                title: item.title,
                visitCount: item.visitCount,
                star: 0,
                tags: ''
            };
            
            j++;
        }
    }
    
    Satus.storage.set('history', satus.history);
    
    //console.log(items);
}

function updateTable1() {
    var data = satus.history.hosts,
        table = [];
    
    for (var key in data) {
        table.push([
            {
                text: data[key].visitCount
            },
            {
                html: '<button class="satus-button satus-button--dropdown" data-key="' + key + '"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button>'
            },
            {
                text: key,
                html: '<a class="satus-link--domain" href="https://' + key + '">' + key + '</a>'
            }
        ]);
    }
    
    Menu.main.table_01.data = table;
}

function updateTable2(force) {
    var data = satus.history.pages,
        table = [];

    for (var key in data) {
        var item = data[key],
            url = /*decodeURI*/(key.replace(/^.*\/\/[^\/]+:?[0-9]?\//g, ''));
        
        table.push([
        {
            text: item.visitCount
        },
        {
            text: item.title
        },
        {
            html: '<a href="' + key + '">/' + url + '</a>',
            text: url
        },
        {
            html: '<button class="satus-button satus-button--star" data-href="' + key + '" data-value="' + item.star + '"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></button>',
            text: item.star
        },
        {
            html: '<input class="satus-input--tags" type="text" data-href="' + key + '" value="' + item.tags + '">',
            text: item.tags
        }
        ]);
    }

    Menu.main.table_02.data = table;
    
    if (force === true) {
        document.querySelector('#by-url').update(table);
    }
}

function updateTable3(force) {
    var data = satus.history.hosts,
        table = [];

    for (var key in data) {
        var item = data[key];
        
        table.push([
        {
            text: item.visitCount
        },
        {
            html: '<a href="https://' + key + '">' + key + '</a>',
            text: key
        }
        ]);
    }

    Menu.main.table_03.data = table;
    
    if (force === true) {
        document.querySelector('#by-params').update(table);
    }
}
