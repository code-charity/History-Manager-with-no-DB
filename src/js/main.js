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