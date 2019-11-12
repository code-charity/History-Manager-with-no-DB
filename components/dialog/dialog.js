/*-----------------------------------------------------------------------------
>>> «DIALOG» COMPONENT
-----------------------------------------------------------------------------*/

Satus.components.dialog = function(item, name) {
    var dialog = document.createElement('div'),
        transform_origin = ['center', 'center'];

    dialog.className = 'satus-dialog';

    if (item.top) {
        dialog.style.top = item.top + 'px';
        transform_origin[1] = 'top';
    } else if (item.bottom) {
        dialog.style.bottom = item.bottom + 'px';
        transform_origin[1] = 'bottom';
    }

    if (item.right) {
        dialog.style.right = item.right + 'px';
        transform_origin[0] = 'right';
    } else if (item.left) {
        dialog.style.left = item.left + 'px';
        transform_origin[0] = 'left';
    }

    dialog.style.transformOrigin = transform_origin[0] + ' ' + transform_origin[1];

    function close(event) {
        var focus = false;

        for (var i = 0, l = event.path.length; i < l; i++) {
            if (event.path[i] === dialog) {
                focus = true;

                break;
            }
        }

        if (focus === false) {
            dialog.remove();

            window.removeEventListener('click', close);
        }
    }

    window.addEventListener('click', close);

    Satus.render(dialog, item);

    return dialog;
};