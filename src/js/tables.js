/*---------------------------------------------------------------
>>> TABLES
-----------------------------------------------------------------
1.0 Table 1
2.0 Table 2
3.0 Table 3
---------------------------------------------------------------*/

/*---------------------------------------------------------------
>>> TABLE 1
---------------------------------------------------------------*/

function updateTable1(force, d) {
    var data = d || HISTORY_MANAGER.DOMAINS,
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
                html: '<a class="satus-link--domain" href="' + key + '"><img src="chrome://favicon/https://' + key + '">' + key + '</a>'
            }
        ]);
    }
    
    Menu.main.section.table_01.data = table;
    
    if (force === true) {
        document.querySelector('#by-domain').update(table);
    }
}


/*---------------------------------------------------------------
>>> TABLE 2
---------------------------------------------------------------*/

function updateTable2(force, d) {
    var data = d || HISTORY_MANAGER.PAGES,
        table = [];

    for (var key in data) {
        var item = data[key],
            url = /*decodeURI*/(key.replace(/^.*\/\/[^\/]+:?[0-9]?\//g, ''));
        
        table.push([
        {
            text: item.visitCount
        },
        {
            html: '<img src="chrome://favicon/' + key + '">' + item.title,
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

    Menu.main.section.table_02.data = table;
    
    if (force === true) {
        document.querySelector('#by-url').update(table);
    }
}


/*---------------------------------------------------------------
>>> TABLE 3
---------------------------------------------------------------*/

function updateTable3(force, d) {
    var data = d || HISTORY_MANAGER.PARAMS,
        table = [];

    for (var key in data) {
        var item = data[key];
        
        table.push([
        {
            text: item.visitCount
        },
        {
            html: '<a href="' + key + '"><img src="chrome://favicon/' + key + '">' + key + '</a>',
            text: key
        }
        ]);
    }

    Menu.main.section.table_03.data = table;
    
    if (force === true) {
        document.querySelector('#by-params').update(table);
    }
}
