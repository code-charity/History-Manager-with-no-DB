/*---------------------------------------------------------------
>>> INDEX:
-----------------------------------------------------------------
# Storage import
# Locale import
# History import
---------------------------------------------------------------*/
Satus.storage.import(function() {
    var end_time = new Date().getTime(),
        start_time = Satus.storage.get('startTime') || 0,
        language = 'en';

    Satus.locale.import('_locales/' + language + '/messages.json', function() {
        chrome.history.search({
            text: '',
            startTime: start_time,
            endTime: end_time,
            maxResults: 999999
        }, function(items) {
            History = Satus.storage.get('history') || {};
            
            //console.log(items);

            for (var i = 0, l = items.length; i < l; i++) {
                var item = items[i],
                    parsed = item.url.split('/'),
                    host = parsed[2];

                if (History.hasOwnProperty(host) === false) {
                    History[host] = {
                        items: {},
                        lastVisitTime: item.lastVisitTime,
                        visitCount: 0
                    };
                }
                
                var latest = History[host].items;
                
                for (var j = 3, k = parsed.length; j < k; j++) {
                    if (j === 3 && parsed[j] === '') {
                        History[host].title = item.title;
                    } else {
                        if (j !== k - 1) {
                            if (latest.hasOwnProperty(parsed[j]) === false) {
                                latest[parsed[j]] = {};
                            }
                            
                            latest = latest[parsed[j]];
                        } else if (j === k - 1) {
                            if (parsed[j].indexOf('?') !== -1) {
                                var key = parsed[j].slice(0, parsed[j].indexOf('?'));
                                
                                if (latest.hasOwnProperty(key) === false) {
                                    latest[key] = {};
                                }
                                
                                latest[key].params = parsed[j].slice(parsed[j].indexOf('?'));
                                
                                latest = latest[key];
                            } else if (parsed[j].indexOf('#') !== -1) {
                                var key = parsed[j].slice(0, parsed[j].indexOf('#'));
                                
                                if (latest.hasOwnProperty(key) === false) {
                                    latest[key] = {};
                                }
                                
                                latest[key].params = parsed[j].slice(parsed[j].indexOf('#'));
                                
                                latest = latest[key];
                            } else {
                                if (latest.hasOwnProperty(parsed[j]) === false) {
                                    latest[parsed[j]] = {};
                                }
                                
                                latest = latest[parsed[j]];
                            }
                            
                            /*if (parsed[j].indexOf('?') !== -1) {
                                latest.params = parsed[j].slice(parsed[j].indexOf('?'), -1);
                            
                                latest = latest[parsed[j].split('?')[0]];
                            } else if (parsed[j].indexOf('#') !== -1) {
                                latest.params = parsed[j].slice(parsed[j].indexOf('#'), -1);

                                latest = latest[parsed[j].split('#')[0]];
                            }*/
                        }
                        
                        if (j === k - 1) {
                            if (latest.hasOwnProperty('title') === false) {
                                latest.title = item.title;
                            }
                            
                            if (latest.hasOwnProperty('visitCount') === false) {
                                latest.visitCount = item.visitCount;
                            }
                            
                            latest.star = 0;
                            latest.tags = '';
                        }
                    }
                }
            }
            
            console.log(History['github.com']);
            
            return false;
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            

            for (var key in History) {
                History[key].visitCount = 0;

                for (var i in History[key].items) {
                    History[key].visitCount += History[key].items[i].visitCount;
                }
            }

            Satus.storage.set('history', History);
            Satus.storage.set('startTime', end_time);

            var data = [],
                data2 = [],
                has_params = false;

            for (var key in History) {
                data.push([{
                        text: History[key].visitCount
                    },
                    {
                        html: '<button class="satus-button satus-button--dropdown"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button>'
                    },
                    {
                        text: key,
                        html: '<a class="satus-link--domain" href="https://' + key + '">' + key + '</a>'
                    }
                ]);

                /*for (var i in History[key].items) {
                    if (i.indexOf('?') !== -1) {
                        has_params = true;
                    }
                }
                
                if (has_params === true) {
                    data2.push([
                    {
                        text: History[key].visitCount
                    },
                    {
                        html: '<button class="satus-button satus-button--dropdown"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M5 12h14"/></svg></button>'
                    },
                    {
                        text: key,
                        html: '<a class="satus-link--domain" href="https://' + key + '">' + key + '</a>'
                    }
                    ]);
                }*/
            }

            Menu.main.table_01.data = data;
            //Menu.main.table_03.data = data2;

            Satus.render(Menu);

            //updateURLTable(document.querySelector('.satus-table__cell:nth-child(3) a').innerText);
        });
    });
});
