/*-----------------------------------------------------------------------------
>>> «HEADER» TEMPLATE
-----------------------------------------------------------------------------*/

const Menu = {
    header: {
        type: 'header',

        section_start: {
            type: 'section',
            class: ['satus-section--align-start'],

            search: {
                type: 'textarea',
                id: 'satus-header__search',
                placeholder: 'Search'
            }
        },
        section_end: {
            type: 'section',
            class: ['satus-section--align-end'],
            style: {
                flex: 0
            },

            vert: {
                type: 'button',
                icon: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>',

                onclick: function(event) {
                    event.stopPropagation();

                    document.querySelector('.satus').appendChild(Satus.components.dialog({
                        right: 8,
                        top: 56,
                        scrim: false,

                        save_as: {
                            type: 'button',
                            label: 'saveAs',
                            icon: '<svg viewBox="0 0 24 24" style=width:16px;height:16px;margin-right:10px;margin-top:2px><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>',
                            onclick: function(satus, component) {
                                chrome.runtime.sendMessage({
                                    name: 'download',
                                    filename: 'improvedtube-report',
                                    value: satus.modules.user.get()
                                });
                            }
                        }
                    }));
                }
            }
        }
    }
};