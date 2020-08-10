var History = {},
    Selected = {};

window.addEventListener('click', function(event) {
    var target = event.target;
    
    if (target.classList.contains('satus-button--star')) {
        star(target);
    } else if (target.classList.contains('satus-link--domain')) {
        updateURLTable(target.innerText);
            
        event.preventDefault();

        return false;
    } else if (!target.classList.contains('satus-input--tags')) {
        var is_url_table = false;
    
        for (var i = event.path.length - 2; i > 0; i--) {
            if (event.path[i].id === 'by-url') {
                is_url_table = true;
            }
            
            if (event.path[i].classList && event.path[i].classList.contains('satus-table__row') && is_url_table === true) {
                var href = event.path[i].querySelector('a').href;
                
                if (event.path[i].classList.contains('selected')) {
                    Selected[href] = undefined;
                } else {
                    Selected[href] = History[href.split('/')[2]].items[href];
                }
                
                event.path[i].classList.toggle('selected');
                
                checkToolbar();
            }
        }
    }
});

function checkToolbar() {
    var is_empty = true;
            
    for (var key in Selected) {
        if (Selected[key]) {
            is_empty = false;
        }
    }
    
    if (is_empty === false) {
        document.querySelector('#by-url').classList.add('satus-table--selected');
    } else {
        document.querySelector('#by-url').classList.remove('satus-table--selected');
    }
}

function star(target) {
    var value = Number(target.dataset.value) === 0 ? 1 : 0;
    
    target.dataset.value = value;
    
    History[target.dataset.href.split('/')[2]].items[target.dataset.href].star = value;

    Satus.storage.set('history', History);
    
    updateURLTable(target.dataset.href.split('/')[2]);
    
    for (var key in Selected) {
        Selected[key] = undefined;
    }
    
    checkToolbar();
}

function tags() {    
    History[this.dataset.href.split('/')[2]].items[this.dataset.href].tags = this.value;

    Satus.storage.set('history', History);
    
    updateURLTable(this.dataset.href.split('/')[2]);
    
    for (var key in Selected) {
        Selected[key] = undefined;
    }
    
    checkToolbar();
}

function updateURLTable(domain) {
    var data = [],
        object = History[domain];

    for (var key in object.items) {
        var url = decodeURI(key.replace(/^.*\/\/[^\/]+:?[0-9]?\//g, ''));
        
        data.push([
        {
            text: object.items[key].visitCount
        },
        {
            text: object.items[key].title
        },
        {
            html: '<a href="' + key + '">/' + url + '</a>',
            text: url
        },
        {
            html: '<button class="satus-button satus-button--star" data-href="' + key + '" data-value="' + object.items[key].star + '"><svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></button>',
            text: object.items[key].star
        },
        {
            html: '<input class="satus-input--tags" type="text" data-href="' + key + '" value="' + object.items[key].tags + '">',
            text: object.items[key].tags,
            onrender: function() {
                this.querySelector('.satus-input--tags').onblur = tags;
            }
        }
        ]);
    }

    document.querySelector('#by-url').pagingIndex = 0;
    document.querySelector('#by-url').update(data);
}

Menu.main = {
    type: 'main',
    scrollbar: false,

    table_01: {
        type: 'table',
        id: 'by-domain',
        paging: 100,
        columns: [{
            title: 'Visits',
            sorting: 'desc'
        }, {
            title: 'Domain'
        }]
    },

    table_02: {
        type: 'table',
        id: 'by-url',
        paging: 100,
        columns: [{
            title: 'Visits',
            sorting: 'desc'
        }, {
            title: 'Title'
        }, {
            title: 'URL'
        }, {
            title: '★'
        }, {
            title: 'Tags'
        }],
        onrender: function() {
            var toolbar = document.createElement('div');
            
            toolbar.className = 'satus-table--toolbar';
            
            Satus.render({
                undo: {
                    type: 'button',
                    label: 'Undo',
                    
                    onclick: function() {
                        var selected = document.querySelectorAll('.satus-table__row.selected')
                        
                        for (var key in Selected) {
                            Selected[key] = undefined;
                        }
                        
                        for (var i = 0, l = selected.length; i < l; i++) {
                            selected[i].classList.remove('selected');
                        }
                        
                        checkToolbar();
                    }
                },
                star: {
                    type: 'button',
                    label: 'Star',
                    
                    onclick: function() {
                        for (var key in Selected) {
                            if  (Selected[key]) {
                                Selected[key].star = 1;
                            }
                        }
                        
                        updateURLTable(document.querySelector('#by-url a').href.split('/')[2]);

                        Satus.storage.set('history', History);
                        
                        for (var key in Selected) {
                            Selected[key] = undefined;
                        }
                        
                        checkToolbar();
                    }
                },
                remove: {
                    type: 'button',
                    label: 'Remove',
                    
                    onclick: function() {
                        for (var key in Selected) {
                            if  (Selected[key]) {
                                delete History[key.split('/')[2]].items[key];
                                delete Selected[key];
                            }
                        }
                        
                        updateURLTable(document.querySelector('#by-url a').href.split('/')[2]);

                        Satus.storage.set('history', History);
                        
                        for (var key in Selected) {
                            Selected[key] = undefined;
                        }
                        
                        checkToolbar();
                    }
                },
                edit: {
                    type: 'button',
                    label: 'Edit',
                    
                    onclick: function() {
                        for (var key in Selected) {
                            if  (Selected[key]) {
                                Selected[key].tags = this.parentNode.querySelector('input').value;
                            }
                        }
                        
                        updateURLTable(document.querySelector('#by-url a').href.split('/')[2]);

                        Satus.storage.set('history', History);
                        
                        for (var key in Selected) {
                            Selected[key] = undefined;
                        }
                        
                        checkToolbar();
                    }
                },
                tags: {
                    type: 'text-field',
                    class: 'satus-input--tags',
                    
                    onkeydown: function(event) {
                        if (event.keyCode === 13) {
                            for (var key in Selected) {
                                if  (Selected[key]) {
                                    Selected[key].tags = this.value;
                                }
                            }
                            
                            updateURLTable(document.querySelector('#by-url a').href.split('/')[2]);

                            Satus.storage.set('history', History);
                        }
                    }
                }
            }, toolbar);
            
            this.appendChild(toolbar);
        }
    }
};
