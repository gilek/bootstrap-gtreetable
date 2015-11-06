(function( $ ) {
    $.fn.gtreetable.defaults.languages.pl = {
        save: 'Salvar',
        cancel: 'Cancelar',
        action: 'Ações',
        actions: {
            createBefore: 'Criar antes',
            createAfter: 'Criar após',
            createFirstChild: 'Criar primeiro filho',
            createLastChild: 'Criar último filho',
            update: 'Atualizar',
            'delete': 'Excluir'
        },
        messages: {
            onDelete: 'Você tem certeza?',
            onNewRootNotAllowed: 'Você não pode adicionar um nó na raiz.',
            onMoveInDescendant: 'O nó de destino não pode ser um filho.',
            onMoveAsRoot: 'O nó de destino não deve ser root.'          
        }
    };
}( jQuery ));
