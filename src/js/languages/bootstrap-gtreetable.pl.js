(function( $ ) {
    $.fn.gtreetable.defaults.languages.pl = {
        save: 'Zapisz',
        cancel: 'Anuluj',
        action: 'Akcja',
        actions: {
            createBefore: 'Dodaj przed',
            createAfter: 'Dodaj po',
            createFirstChild: 'Dodaj pierwszy',
            createLastChild: 'Dodaj ostatni',
            update: 'Edytuj',
            'delete': 'Usuń'
        },
        messages: {
            onDelete: 'Czy na pewno?',
            onNewRootNotAllowed: 'Dodawania nowego węzła głównego jest zabronione.',
            onMoveInDescendant: 'Wezeł nadrzędny nie może być potomnym.',
            onMoveAsRoot: 'Przenosiny jako węzeł główny jest zabronione.'          
        }
    };
}( jQuery ));
