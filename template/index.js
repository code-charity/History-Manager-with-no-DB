/*-----------------------------------------------------------------------------
>>> «INDEX» TEMPLATE
-----------------------------------------------------------------------------*/

Menu.main = {
    type: 'main'
};

Satus.chromium_history.get('', function(items) {
    var results = {};

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

        results[origin].urls.push({
            id: item.id,
            url: item.url,
            title: item.title
        });
    }

    for (var key in results) {
        var result = results[key];

        Menu.main[key] = {
            type: 'folder',
            label: '[' + result.visit_count + '] ' + key
        };

        for (var i = 0, l = result.urls.length; i < l; i++) {
            var url = result.urls[i].url;

            Menu.main[key][result.urls[i].id] = {
                type: 'section',
                title: {
                    type: 'text',
                    label: result.urls[i].title
                },
                url: {
                    type: 'text',
                    label: url.substr(url.indexOf(key)).replace(key, '')
                }
            };
        }
    }

    document.querySelector('.satus').innerHTML = '';

    Satus.render(document.querySelector('.satus'), Menu);
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