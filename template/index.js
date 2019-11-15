/*-----------------------------------------------------------------------------
>>> «INDEX» TEMPLATE
-----------------------------------------------------------------------------*/

Menu.main = {
    type: 'main'
};

Satus.chromium_storage.sync(function() {
    Satus.locale(function() {
        Satus.chromium_history.get('', function(items) {
            var results = {};

            // SORT
            for (var i = 0, l = items.length; i < l; i++) {
                var item = items[i],
                    origin = item.url.split('/')[2];

                if (!results.hasOwnProperty(origin)) {
                    results[origin] = {
                        visit_count: item.visitCount,
                        urls: []
                    };
                } else {
                    results[origin].visit_count += item.visitCount;
                }

                if (item.url.substr(item.url.indexOf(origin)).replace(origin, '') === '/') {
                    results[origin].title = item.title;
                }

                results[origin].urls.push({
                    id: item.id,
                    url: item.url,
                    title: item.title,
                    visit_count: item.visitCount
                });
            }

            var sorted_keys = Object.keys(results).sort(function(a, b) {
                    return results[b].visit_count - results[a].visit_count
                }),
                new_results = {};

            for (var i = 0, l = sorted_keys.length; i < l; i++) {
                new_results[sorted_keys[i]] = results[sorted_keys[i]];
            }

            results = new_results;

            for (var key in results) {
                results[key].urls = results[key].urls.sort(function(a, b) {
                    return b.visit_count - a.visit_count
                });
            }


            // MENU
            console.log(results);

            Menu.main.section = {
                type: 'section',
                class: ['satus-section--dashboard']
            };

            Menu.main.section.by_domain = {
                type: 'table',
                id: 'table-domain',
                columns: [{
                    visit_count: {
                        type: 'text',
                        label: 'visitCount',
                        sort: 'visit_count/label'
                    }
                }, {
                    expand: {
                        type: 'text'
                    }
                }, {
                    domain: {
                        type: 'text',
                        label: 'domain',
                        sort: 'domain/label'
                    }
                }],
                rows: []
            };

            Menu.main.section.by_url = {
                type: 'table',
                id: 'table-url',
                columns: [{
                    visit_count: {
                        type: 'text',
                        label: 'visitCount',
                        sort: 'visit_count/label'
                    }
                }, {
                    title: {
                        type: 'text',
                        label: 'title',
                        sort: 'title/label'
                    }
                }, {
                    url: {
                        type: 'text',
                        label: 'url',
                        sort: 'url/label'
                    }
                }, {
                    favorite: {
                        type: 'text'
                    }
                }],
                rows: []
            };

            Menu.main.section.search = {
                type: 'table',
                id: 'table-search',
                columns: [{
                    visit_count: {
                        type: 'text',
                        label: 'visitCount',
                        sort: 'visit_count/label'
                    }
                }, {
                    domain: {
                        type: 'text',
                        label: 'domain',
                        sort: 'domain/label'
                    }
                }],
                rows: []
            };

            var kk = 0;

            for (var key in results) {
                var result = results[key];

                Menu.main.section.by_domain.rows.push([{
                    visit_count: {
                        type: 'text',
                        label: result.visit_count
                    }
                }, {
                    expand: {
                        type: 'button',
                        icon: '<svg viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></svg>'
                    }
                }, {
                    domain: {
                        type: 'text',
                        label: key,

                        on: {
                            click: function(event) {
                                var key = this.querySelector('.label').innerText,
                                    result = results[this.querySelector('.label').innerText],
                                    rows = [];

                                for (var i = 0, l = result.urls.length; i < l; i++) {
                                    var url = result.urls[i].url;

                                    rows.push([{
                                        visit_count: {
                                            type: 'text',
                                            label: result.urls[i].visit_count
                                        }
                                    }, {
                                        title: {
                                            type: 'text',
                                            label: result.urls[i].title.substr(0, 28),
                                            title: result.urls[i].title
                                        }
                                    }, {
                                        label: {
                                            type: 'text',
                                            label: url.substr(url.indexOf(key)).replace(key, '').substr(0, 24),
                                            title: url.substr(url.indexOf(key)).replace(key, '')
                                        }
                                    }, {
                                        star: {
                                            type: 'button',
                                            icon: '<svg viewBox="0 0 24 24"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"></svg>'
                                        }
                                    }]);
                                }

                                document.querySelector('#table-url').update(rows);
                            }
                        }
                    }
                }]);

                /*Menu.main.section.search.rows.push([{
                    visit_count: {
                        type: 'text',
                        label: result.visit_count
                    }
                }, {
                    domain: {
                        type: 'text',
                        label: key
                    }
                }]);*/

                if (kk === 0) {
                    kk++;

                    for (var i = 0, l = result.urls.length; i < l; i++) {
                        var url = result.urls[i].url;

                        Menu.main.section.by_url.rows.push([{
                            visit_count: {
                                type: 'text',
                                label: result.urls[i].visit_count
                            }
                        }, {
                            title: {
                                type: 'text',
                                label: result.urls[i].title.substr(0, 28),
                                title: result.urls[i].title
                            }
                        }, {
                            url: {
                                type: 'text',
                                label: url.substr(url.indexOf(key)).replace(key, '').substr(0, 24),
                                title: url.substr(url.indexOf(key)).replace(key, '')
                            }
                        }, {
                            favorite: {
                                type: 'button',
                                icon: '<svg viewBox="0 0 24 24"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"></svg>'
                            }
                        }]);
                    }
                }
            }

            document.querySelector('.satus').innerHTML = '';

            Satus.render(document.querySelector('.satus'), Menu);
        });
    });
});


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.name === 'dialog-error') {
        Satus.components.dialog({
            options: {
                scrim_visibility: false,
                surface_styles: {
                    position: 'absolute',
                    bottom: '16px',
                    boxShadow: 'none',
                    border: '1px solid rgba(255, 0, 0, .4)',
                    background: 'rgba(255,0,0,.2)'
                }
            },

            message: {
                type: 'text',
                label: request.value,
                style: {
                    'padding': '0 16px',
                    'width': '100%',
                    'opacity': '.8'
                }
            }
        });
    }
});