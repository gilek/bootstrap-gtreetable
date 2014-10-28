# GTreeTable 2

GTreeTable jest rozszerzeniem frameworka [Tweeter Bootstrap 3](http://getbootstrap.com) zapewniającym obsługę wielopoziomowego drzewa w oparciu o tabelę HTML. 

Dzięki skryptowi możliwe staje się tworzenie oraz zarządzanie drzewem o nieograniczonym stopniu zagnieżdżenia.

Kod wersji 2 napisany został całkowicie od zera. Zaowocowało to implementacją takich funkcji jak: zaawansowany mechanizmu pamięci podręcznej, przenoszenie węzłów metodą drag and drop, czy sortowanie z poziomu JavaScript.

Działanie aplikacji można przetestować na stronie [demo projektu](http://gtreetable2.gilek.net).

![](http://gilek.net/images/gtt2-demo.png)

## Środowisko

Do tej pory, działanie aplikacji zostało przetestowane w przeglądarkach:

+ Mozilla Firefox 30,
+ Chrome 37,
+ Internet Explorer 11.

## Minimalna instalacja

1. W pierwszym kroku dołączamy wymagane pliki:

    ```html
    <link rel="stylesheet" type="text/css" href="gtreetable.min.css" />
    <script type="text/javascript" src="http://code.jquery.com/jquery-2.1.1.min.js"></script>
    <script type="text/javascript" src="bootstrap-gtreetable.js"></script>
    ```

2. Następnie tworzymy pustą tabelę HTML:

    ```html
    <table class="table gtreetable" id="gtreetable"><thead><tr><th>Category</th></tr></thead></table>
    ```

3. Wewnątrz metody `jQuery.ready` definiujemy podstawową konfigurację:

    ```javascript
    jQuery('#gtreetable').gtreetable({
      'source': function (id) {
        return 'nodeChildren' + '?id=' + id;
      }
    });
    ```

Więcej na temat parametru `source` oraz formatu danych jakie musi zwracać, można przeczytać w części [konfiguracja](#konfiguracja).

## Funkcjonalność

### Akcje

Po wskazaniu lub wybraniu węzła, dostępne stają się akcje zdefiniowane w parametrach `defaultAction` oraz `actions`.

`defualtActions` zawiera domyśle akcje, potrzebne do operacji typu CUD. Mogą one zostać wyłączone poprzez ustawienie parametru na wartość null.
 
Z kolei parametr `actions` określa akcje, które mają zostać dodane po ostatniej pozycji zdefiniowanej w `defaultActions`.

Informacje o formacie zefiniowania akcji znajdują się w części [konfiguracja](#konfiguracja).

### CUD

Momentowi zapisu węzła lub jego usuwania może towarzyszyć komunikacja z serwerem za pośrednictwem techniki AJAX. Odpowiedzialne są za to odpowiednio zdarzenia `onSave` oraz `onDelete`. W zamyśle, powinny one być funkcjami, które zwracają obiekt typu [jQuery.ajax](http://api.jquery.com/jquery.ajax/).

Przykładowa konfiguracja:

```javascript
jQuery('#gtreetable').gtreetable({
  'source': function (id) {
    return 'nodeChildren' + '?id=' + id;
  },
  'onSave':function (oNode) {
    return jQuery.ajax({
      type: 'POST',
      url: !oNode.isSaved() ? 'nodeCreate' : 'nodeUpdate?id=' + oNoe.getId(),
      data: {
        parent: oNode.getParent(),
        name: oNode.getName(),
        position: oNode.getInsertPosition(),
        related: oNode.getRelatedNodeId()
      },
      dataType: 'json',
      error: function(XMLHttpRequest) {
        alert(XMLHttpRequest.status+': '+XMLHttpRequest.responseText);
      }
  	});
  },
  'onDelete':function (oNode) {
    return jQuery.ajax({
      type: 'POST',
      url: 'nodeDelete?id=' + oNode.getId(),
      dataType: 'json',
      error: function(XMLHttpRequest) {
        alert(XMLHttpRequest.status+': '+XMLHttpRequest.responseText);
      }
    });
  }
});
```

Warto nadmienić, że wstawianie nowego węzła może odbywać się:
+ przed wskazanym węzłem (`before`),
+ po wskazanym węźle (`after`),
+ jak pierwsze dziecko (`firstChild`),
+ jako ostatnie dziecko (`lastChild`).

### Przenoszenie

Przenoszenie węzłów wewnątrz drzewa realizowane jest z wykorzystaniem metody drag and drop. 

Domyślnie mechanizm jest wyłączony, aby go aktywować należy ustawić parametr `draggable` na wartość true oraz zdefiniować zdarzenie `onMove`. 

W momencie przeciągania węzła, jego nowa lokalizacja oznaczana jest poprzez pomocniczy wskaźnik, które może być umieszczony:
+ przed  węzłem (`before`),
+ jako ostatnie dziecko węzła (`lastChild`),
+ po węźle (`after`).
 
![](http://gilek.net/images/gtt2-pointer.png)

W tym przypadku, aplikacja korzysta z dodatkowych bibliotek tj. [jQueryUI](http://jqueryui.com/) oraz [jQuery Browser Plugin](https://github.com/gabceb/jquery-browser-plugin), zatem niezbędne staje się ich dołączenie:

```html
<script type="text/javascript" src="http://code.jquery.com/ui/1.11.1/jquery-ui.min.js"></script>
<script type="text/javascript" src="jquery.browser.js"></script>
```

Przykładowa konfiguracja:

```javascript
jQuery('#gtreetable').gtreetable({
  'source': function (id) {
    return 'nodeChildren' + '?id=' + id;
  },
  'draggable': true,
  'onMove': function (oSource, oDestination, position) {
    return jQuery.ajax({
      type: 'POST',
      url: 'nodeMove?id=' + oNode.getId(),
      data: {
        related: oDestination.getId(),
        position: position
      },
      dataType: 'json',
      error: function(XMLHttpRequest) {
        alert(XMLHttpRequest.status+': '+XMLHttpRequest.responseText);
      }
    }); 
  }    
});
```

### Wybieranie

Zaznaczenie węzła odbywa się poprzez kliknięcie na jego nazwę. W zależności od ustawienia parametru `multiselect` możliwe jest oznaczenie jednego lub wielu węzłów drzewa.

W tym przypadku warto zwrócić uwagę na kilka zdarzeń, wywoływanych w momencie:
+ zaznaczenia węzła (`onSelect`),
+ odznaczenia węzła (`onUnselect`),
+ przekroczenia dozwolonej ilości wybranych elementów (`onSelectOverflow`).

Więcej o powyższych zdarzeniach można przeczytać w dziale [konfiguracja](#konfiguracja).

### Sortowanie

Funkcja sortowania węzłów wewnątrz drzewa może być realizowana bezpośrednio z poziomu JavaScript. Wystarczy zdefiniować metodę sortująca jako funkcję parametru `sort`.

Operacja sortowania jest wywoływania podczas rozwijania gałęzi drzewa, dodawania nowego węzła oraz edytowania nazwy istniejącego.

Działanie funkcji sortującej jest analogiczne, jak w przypadku [sortowania tablicy](https://developer.mozilla.org/pl/docs/Web/JavaScript/Referencje/Obiekty/Array/sort), zatem przykładowa konfiguracja może wyglądać następująco:

```javascript
jQuery('#gtreetable').gtreetable({
  'source': function (id) {
    return 'nodeChildren' + '?id=' + id;
  },
  'sort': function (a, b) {          
    var aName = a.name.toLowerCase();
    var bName = b.name.toLowerCase(); 
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));                            
  }  
}); 
```

### Typy węzłów

W zależności o typu węzła możliwe jest wyświetlenie dodatkowej ikony obok jego nazwy. Definicja typów opiera się na parametrze `types`.

Przykładowa konfiguracja:

```javascript
jQuery('#gtreetable').gtreetable({
  'source': function(id) {
    return 'nodeChildren' + '?id=' + id;
  },
  'types': { default: 'glyphicon glyphicon-folder-open'}
});
```

Dodawanie odmiennych typów węzłów, realizowane jest poprzez metodę `GTreeTableNode.add(String position, String type)`.

![](http://gilek.net/images/gtt2-type.png) 
 
### Tłumaczenia

Elementy interfejsu użytkownika domyślne wyświetlane są w języku angielskim. Możliwa jest jego zmiana poprzez ustawienie parametru `language` oraz dołączenie odpowiedniego pliku:

Przykładowa konfiguracja:

```html
<script type="text/javascript" src="languages/bootstrap-gtreetable.pl.js"></script>
```

```javascript
jQuery('#gtreetable').gtreetable({
  'source': function(id) {
    return 'nodeChildren' + '?id=' + id;
  },
  'language': 'pl'
});
```

W momencie, gdy jakaś pozycja z tłumaczenia nie zostanie odnaleziona, wówczas jej wartość pozostaje niezmieniona w języku angielskim.

### Mechanizm pamięci podręcznej

W stosunku do wersji 1.x, mechanizm pamięci podręcznej został w znacznym stopniu udoskonalony. Możliwa staje się praca w 3 trybach:
+ 0 - mechanizm wyłączony,
+ 1 - przechowywane są informacje o węzłach potomnych. Po wykonaniu operacji CUD lub przenoszenia, wymagane jest ponowne pobranie informacji z bazy danych,
+ 2 - podobnie jak w przypadku trybu 1 z tą różnicą, że wszystkie operacje na węzłach mają swoje odwzorowanie w pamięci podręcznej.

Istnieje możliwość wymuszenia pobrania najnowszych danych, poprzez wciśnięcie klawisza Alt w momencie rozwijania węzła.

## <a name="konfiguracja"></a>Konfiguracja

### Parametry

+ `actions` (Array) - zestaw akcji, które mają zostać dodane po ostatniej pozycji określonej w parametrze `defaultActions`. Więcej informacji na temat wymaganego formatu danych znajduje się w opisie parametru `defaultActions`.

+ `cache (Integer)` - określa czy aktualny stan węzłów ma być przechowywany w pamięci podręcznej. Parametr może przyjąć wartość:
  + 0 - mechanizm wyłączony,
  + 1 - odwzorowanie pobranych węzłów. W momencie operacji CUD lub przenosin stan jest resetowany,
  + 2 - pełne odwzorowanie.

+ `classes` (Object) - parametr zawiera zestaw klas CSS wykorzystanych przy budowie interfejsu użytkownika. Nadpisanie wartości musi wiązać się ze zmianami w pliku CSS.

+ `defaultActions` (Array) - zestaw domyślnych akcji typu CUD. Zawartość parametru winna być tablicą założoną z obiektów o następującym formacie:

    ```javascript
    {
      name: 'Etykieta akcji',
      event: function (oNode, oManager) { // kod do wykonania }
    }
    ```

    Separator (pozioma linia) definiujemy poprzez obiekt:
    
    ```javascript
    { divider: true }
    ```

    Warto nadmienić, że gdy etykieta akcji znajduje się w nawiasie klamrowym  np. `{actionEdit}`, wówczas jej wartość zostanie przetłumaczona na język z parametru `language`.

+ `dragCanExpand` (boolean) - określa czy podczas przenoszenia węzła możliwe jest rozwijanie innych węzłów po najechaniu kursorem myszy na odpowiednią ikonę.

+ `draggable` (boolean) - określa, czy poszczególne węzły mogą być przenoszone. Zmiana parametru na wartość true wiąże się z koniecznością dołączenia bilblioteki [jQueryUI](http://jqueryui.com/), a konkretnie modułów:
  + core,
  + widget,
  + position,
  + mouse,
  + draggable,
  + droppable.

+ `inputWidth` (String) - szerokość pola dodawania / edycji nazwy węzła.

+ `language` (String) - język interfejsu użytkownika. W domyśle angielski. Zmiana na inny, wiąże się z koniecznością dołączenia pliku tłumaczeń. W momencie, gdy jakaś pozycja z tłumaczenia nie zostanie odnaleziona, wówczas jej wartość pozostaje w języku angielskim.

+ `manyroots` (boolean) - określa, czy możliwe jest tworzenie wielu węzłów głównych.

+ `multiselect` (mixed) - określa czy możliwe jest wybranie więcej niż jednego węzła. Jeśli wartość parametru będzie liczbą, wówczas stanowi ona limit wyboru węzłów.

+ `nodeIndent` (Integer) - odległość od lewego boku tabeli. Wartość jest pomnażana w zależność od stopnia węzła.

+ `readonly` (boolean) - określa czy drzewo ma być tylko do odczytu tzn. czy mają być wyświetlane przyciski akcji.

+ `showExpandIconOnEmpty` (boolean) - parametr ustawiony na wartość true oznacza, że ikona rozwinięcia węzła pozostanie cały czas widoczna, nawet gdy okaże się, że węzeł nie ma potomków.

+ `sort` (callback (GTreeTableNode oNodeA, GTreeTableNode oNodeB)) - funkcja sortująca wywoływania w momencie wyświetlania węzłów, dodawania nowego lub zmiany jego nazwy. Zasada działania jest analogiczna, jak w przypadku [sortowania tablicy](https://developer.mozilla.org/pl/docs/Web/JavaScript/Referencje/Obiekty/Array/sort).

    Oto przykładowe sortowanie po nazwie węzła w kolejności rosnącej:

    ```javascript
    function (a, b) {          
      var aName = a.name.toLowerCase();
      var bName = b.name.toLowerCase(); 
      return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));                            
    }
    ```
 
+ `source` (callback (Integer id)) - funkcja musi zwracać adres URL odpowiedzialny za pobieranie węzłów z bazy danych.
    
    Jeśli ID = 0, wówczas powinny zostać zwrócone korzenie drzewa.
    
    Informacje o węzłach powinny być zawarte w formie tablicy obiektów w formacie JSON:

    ```JSON
    {
      "id": "identyfikator węzła",
      "name": "nazwa węzła",
      "level": "poziom na którym się znajduje", 
      "type": "typ węzła"
    }
    ```

+ `types` (Object) - obiekt zawiera powiązania typów z klasami ikon np.
    ```javascript
    { default: "glyphicon glyphicon-folder-open" }
    ```

### Zdarzenia

+ `onDelete(GTreeTableNode node)` - zdarzenie wywoływane w momencie usuwania węzła. Musi zwrócić obiekt typu `jQuery.ajax`.

+ `onMove(GTreeTableNode node, GTreeTableNode destination, string position)` - zdarzenie wywoływane w momencie  przenoszenia węzła. Musi zwrócić obiekt typu `jQuery.ajax`.

+ `onSave(GTreeTableNode node)` - zdarzenie wywoływane w momencie dodawania nowego / zmiany nazwy istniejącego węzła. Musi zwrócić obiekt typu `jQuery.ajax`.
  
+ `onSelect(GTreeTableNode node)` - zdarzenie wywoływane w momencie zaznaczenia węzła.

+ `onSelectOverflow(GTreeTableNode node)` - zdarzenie wywoływane w momencie gdy parametr `multiselect` jest liczbą dodatnią, a zaznaczenie kolejnego węzła wiązałoby się z przekroczeniem zadeklarowanej ilości. 

+ `onUnselect(GTreeTableNode node)` - zdarzenie wywoływane w momencie odznaczenia węzła.

### Metody (wybrane)

+ `GTreeTableManager.getSelectedNodes()` - zwraca tablicę wybranych węzłów.

+ `GTreeTableNode.getPath(GTreeTableNode oNode)` - zwraca tablicę zawierającą ścieżkę węzła np.: 
		
    ```javascript
    ["Nazwa węzła", "Kategoria nadrzędna", "Węzeł główny"]
    ```

## Część serwerowa

GTreeTable oferuję obsługę jedynie z poziomu JavaScript. Za część serwerową mogą posłużyć specjalne dodatki frameworka Yii tj. [yii2-gtreetable](https://github.com/gilek/yii2-gtreetable) lub [yii-gtreetable](https://github.com/gilek/yii-gtreetable). Jeśli na co dzień, nie używasz tego oprogramowania, to nie ma powodów do obaw. W najbliższym czasie zostanie przygotowana specjalna biblioteka, napisana w natywnym PHP, przeznaczona od realizacji tego zadania.
