var History = {};

Menu.main = {
    type: 'main',
    scrollbar: false,
    onclick: function(event) {
        for (var i = 0, l = event.path.length; i < l; i++) {
            var item = event.path[i];

            if (item.classList && item.classList.contains('satus-table__cell')) {
                if (Array.prototype.indexOf.call(item.parentElement.children, item) === 2) {
                    var data = [],
                        object = History[item.innerText];

                    for (var key in object.items) {
                        data.push([
                        {
                            html: '<input type=checkbox>',
                            text: ''
                        },
                        {
                            text: object.items[key].visitCount
                        },
                        {
                            text: object.items[key].title
                        },
                        {
                            text: key
                        },
                        {
                            text: ''
                        }
                        ]);
                    }

                    document.querySelector('#by-url').pagingIndex = 0;
                    document.querySelector('#by-url').update(data, 0, 'desc');

                    i = l;
                    
                    event.preventDefault();
                    
                    return false;
                }
            }
        }
    },

    table_01: {
        type: 'table',
        id: 'by-domain',
        paging: 100,
        columns: [{
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
        id: 'by-url',
        paging: 100,
        columns: [{
            title: ''
        }, {
            title: 'Visit count'
        }, {
            title: 'Title'
        }, {
            title: 'URL'
        }, {
            title: 'Tags'
        }]
    }
};
