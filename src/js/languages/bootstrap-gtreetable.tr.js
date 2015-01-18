(function( $ ) {
    $.fn.gtreetable.defaults.languages.tr = {
        save: 'Kaydet',
        cancel: 'Vazgeç',
        action: 'İşlem',
        actions: {
            createBefore: 'Öncesine ekle',
            createAfter: 'Sonrasına ekle',
            createFirstChild: 'İlk alt öğeyi oluştur',
            createLastChild: 'Son alt öğeyi oluştur',
            update: 'Güncelle',
            'delete': 'Sil'
        },
        messages: {
            onDelete: 'Silmek istediğinize emin misiniz?',
            onNewRootNotAllowed: 'Yeni ana öğe eklenemez.',
            onMoveInDescendant: 'Taşınacak öğe alt öğe olmamalıdır.',
            onMoveAsRoot: 'Hedef ana öğe olmamalıdır.'          
        }
    };
}( jQuery ));
