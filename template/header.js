/*-----------------------------------------------------------------------------
>>> «HEADER» TEMPLATE
-----------------------------------------------------------------------------*/

const Menu = {
    header: {
        type: 'header',

        section_start: {
            type: 'section',
            class: ['satus-section--align-start'],

            back: {
                type: 'button',
                class: ['satus-button--back'],
                icon: '<svg viewBox="0 0 24 24" style=width:20px;height:20px><path d="M16.6 3c-.5-.5-1.3-.5-1.8 0l-8.3 8.3a1 1 0 0 0 0 1.4l8.3 8.3a1.2 1.2 0 1 0 1.8-1.7L9.4 12l7.2-7.3c.5-.4.5-1.2 0-1.7z"></path></svg>',
                on: {
                    click: function() {
                        document.querySelector('.satus-main__container').close();
                    }
                }
            },
            title: {
                type: 'text',
                class: ['satus-header__title'],
                innerText: 'History Manager'
            }
        },
        section_end: {
            type: 'section',
            class: ['satus-section--align-end'],

            vert: {
                type: 'button',
                icon: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>',

                onclick: function() {
                    Satus.components.dialog({
                        options: {
                            scrim: false,
                            surface_styles: {
                                'position': 'absolute',
                                'right': '8px',
                                'top': '48px',
                                'max-width': '200px',
                                'min-width': '0px'
                            }
                        },

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
                    });
                }
            }
        }
    }
};