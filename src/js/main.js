/*-----------------------------------------------------------------------------
>>> «MAIN» TEMPLATE
-----------------------------------------------------------------------------*/

Menu.main = {
    type: 'main',

    section: {
        type: 'section',
        class: 'satus-section--dashboard',

        by_domain: {
            type: 'table',
            id: 'table-domain',

            columns: [{
                select: {
                    type: 'text'
                }
            }, {
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
        },
        by_url: {
            type: 'table',
            id: 'table-url',

            columns: [{
                select: {
                    type: 'text'
                }
            }, {
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
            }, {
                tags: {
                    type: 'text',
                    label: 'tags'
                }
            }],
            rows: []
        },
        search: {
            type: 'table',
            id: 'table-search',

            columns: [{
                select: {
                    type: 'text'
                }
            }, {
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
        }
    }
};