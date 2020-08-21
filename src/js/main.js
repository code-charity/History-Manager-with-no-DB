var Selected = {};

window.addEventListener('click', function(event) {
    var target = event.target;
    
    if (target.classList.contains('satus-button--star')) {
        star(target);
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
                    Selected[href] = satus.history.pages[href];
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
    
    satus.history.pages[target.dataset.href].star = value;
    
    updateTable2(true);

    Satus.storage.set('history', satus.history);
    
    for (var key in Selected) {
        Selected[key] = undefined;
    }
    
    checkToolbar();
}

function tags() {    
    satus.history.pages[this.dataset.href].tags = this.value;

    Satus.storage.set('history', satus.history);
    
    updateTable2(true);
    
    for (var key in Selected) {
        Selected[key] = undefined;
    }
    
    checkToolbar();
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
            title: '',
            onrender: function() {
                this.querySelector('.satus-button--dropdown').addEventListener('click', function() {
                    var container = this.parentNode.parentNode;
                    
                    if (!container.querySelector('.satus-dropdown-list')) {
                        var list = document.createElement('div'),
                            data = [],
                            host = this.dataset.key;
                        
                        list.className = 'satus-dropdown-list';
                        
                        for (var key in satus.history.hosts[host].items) {
                            var item = satus.history.hosts[host].items[key];
                            
                            data.push([
                            {
                                
                            },
                            {
                                text: item.visitCount
                            },
                            {
                                text: key,
                                html: '<a class="satus-link--domain" href="https://' + host + '/' + key + '" title="' + item.title + '">' + key + '</a>'
                            }
                            ]);
                        }
                        
                        Satus.render({
                            type: 'table',
                            paging: 100,
                            columns: [{
                                title: ''
                            }, {
                                title: 'Visits',
                                sorting: 'desc'
                            }, {
                                title: 'Title',
                                onrender: function() {
                                    this.querySelector('a').innerText = '/' + this.querySelector('a').innerText;
                                }
                            }],
                            data: data
                        }, list);
                        
                        container.appendChild(list);
                        
                        this.classList.add('opened');
                    } else {
                        container.querySelector('.satus-dropdown-list').remove();
                    
                        this.classList.remove('opened');
                    }
                });
            }
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
            title: 'Tags',
            onrender: function() {
                this.querySelector('.satus-input--tags').onblur = tags;
            }
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
                        
                        updateTable2(true);

                        Satus.storage.set('history', satus.history);
                        
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
                                delete satus.history.pages[key];
                                delete Selected[key];
                            }
                        }
                        
                        updateTable2(true);

                        Satus.storage.set('history', satus.history);
                        
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
                        
                        updateTable2(true);

                        Satus.storage.set('history', satus.history);
                        
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
                            
                            updateTable2(true);

                            Satus.storage.set('history', satus.history);
                        }
                    }
                }
            }, toolbar);
            
            this.appendChild(toolbar);
        }
    },
    
    table_03: {
        type: 'table',
        id: 'by-params',
        paging: 100,
        columns: [{
            title: 'Visits',
            sorting: 'desc'
        }, {
            title: 'Domain'
        }]
    }
};
