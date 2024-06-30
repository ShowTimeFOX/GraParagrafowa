$(document).ready(function () {
    var idCounter = 1; // Inicjalizacja licznika ID

    // Event listener dla przycisków "Stwórz"
    $('body').on('click', '.create-button', function () {
        addNewStructure($(this));
        checkAndToggleDisable($(this));
    });

    // Event listener dla przycisków "Usuń"
    $('body').on('click', '.delete-button', function () {
        deleteStructure($(this));
    });

    function addNewStructure($button) {
        // Znajdowanie parent elementu, który wywołał event
        var $parentDiv = $button.closest('.parent');

        // Pobranie wartości z pola select
        var decisionCount = $parentDiv.find('select[name="decisionCount"]').val();

        // Usunięcie istniejących inputów typu text z atrybutem choice-id
        $parentDiv.find('input[type="text"][choice-id]').remove();
        $parentDiv.find('label[choice-id]').remove();

        // Tworzenie odpowiedniej liczby elementów
        for (var i = 0; i < decisionCount; i++) {
            // Tworzenie nowego elementu global
            var $newGlobal = $('<div>', { class: 'global' });

            // Tworzenie nowego elementu parent
            var $newParent = $('<div>', { class: 'parent' });

            // Nadawanie unikalnego ID
            var uniqueId = idCounter++;

            // Dodanie zawartości do elementu parent
            $newParent.html(`
                <p>ID dziecka: ${uniqueId}</p>
                <input type="hidden" name="id" value="${uniqueId}" />                
                opis <textarea name="description"></textarea>
                obraz <input type="file" name="imagePath" value="" />
                <hr />
                ilosc decyzji
                <select name="decisionCount">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>end</option>
                </select>
                <input type="hidden" name="children" value="" />
                <input type="button" value="Stwórz" class="create-button" name="Create" />
                <input type="button" value="Usuń" class="delete-button" name="Delete" />
            `);

            // Tworzenie elementu children
            var $newChildren = $('<div>', { class: 'children' });

            // Dodanie parent i children do global
            $newGlobal.append($newParent).append($newChildren);

            // Dodanie nowego global do elementu children znajdującego się obok parentDiv
            $parentDiv.next('.children').append($newGlobal);

            // Dodanie ID potomka do listy children w rodzicu
            var childrenIds = $parentDiv.find('input[name="children"]').val();
            childrenIds += (childrenIds.length > 0 ? ';' : '') + uniqueId;
            $parentDiv.find('input[name="children"]').val(childrenIds);

            // Dodanie nowego inputa text z atrybutem choice-id i etykiety
            var $newChoiceLabel = $('<label>', {
                'choice-id': uniqueId,
                text: `Odpowiedź dla ID: ${uniqueId}`
            });
            var $newChoiceInput = $('<input>', {
                type: 'text',
                'choice-id': uniqueId,
            });
            $parentDiv.append($newChoiceLabel).append($newChoiceInput);
        }

        // Sprawdzenie i przełączenie przycisków po dodaniu nowych elementów
        checkAndToggleDisable($button);
    }

    function deleteStructure($button) {
        // Znajdowanie parent elementu, który wywołał event
        var $parentDiv = $button.closest('.parent');
        var $globalDiv = $parentDiv.parent('.global');
        var $parentGlobal = $globalDiv.closest('.children').prev('.parent');

        // Usuwanie całego elementu global
        $globalDiv.remove();

        // Aktualizacja listy ID potomków w rodzicu
        var childrenIds = $parentGlobal.find('input[name="children"]').val().split(';');
        var idToRemove = $parentDiv.find('input[name="id"]').val();
        var updatedChildrenIds = childrenIds.filter(function (id) {
            return id !== idToRemove;
        });
        $parentGlobal.find('input[name="children"]').val(updatedChildrenIds.join(';'));

        // Usunięcie odpowiednich inputów text i etykiet z atrybutem choice-id
        $parentGlobal.find(`input[type="text"][choice-id="${idToRemove}"]`).remove();
        $parentGlobal.find(`label[choice-id="${idToRemove}"]`).remove();

        // Sprawdzenie i przełączenie przycisków po usunięciu elementu
        checkAndToggleDisable($parentGlobal.find('.create-button'));
    }

    function checkAndToggleDisable($button) {
        var $parentDiv = $button.closest('.parent');
        var $childrenDiv = $parentDiv.next('.children');

        // Sprawdzanie czy w children są jakieś elementy
        if ($childrenDiv.children().length === 0) {
            $parentDiv.find('select[name="decisionCount"]').prop('disabled', false);
            $parentDiv.find('.create-button').prop('disabled', false);
        } else {
            $parentDiv.find('select[name="decisionCount"]').prop('disabled', true);
            $parentDiv.find('.create-button').prop('disabled', true);
        }
    }

    // Inicjalne sprawdzenie stanu przycisków i list wyboru po załadowaniu strony
    $('.create-button').each(function () {
        checkAndToggleDisable($(this));
    });
});

///////////////////////////////

//function saveElements() {
//    var elements = [];

//    $('.global').each(function () {
//        var $parent = $(this).find('.parent');
//        var id = $parent.find('input[name="id"]').val();
//        var description = $parent.find('input[name="description"]').val();
//        var imagePath = $parent.find('input[name="imagePath"]').val();
//        var decisionCount = $parent.find('select[name="decisionCount"]').val();
//        var children = $parent.find('input[name="children"]').val();

//        var element = {
//            id: id,
//            description: description,
//            imagePath: imagePath,
//            decisionCount: decisionCount,
//            children: children
//        };

//        elements.push(element);
//    });

//    // Przygotowanie danych do wysłania
//    var postData = {
//        elements: elements
//    };

//    // Wysłanie danych do kontrolera za pomocą AJAX
//    $.ajax({
//        type: 'POST',
//        url: '/Story/Save', // Zmienić na odpowiedni adres URL kontrolera
//        data: JSON.stringify(postData),
//        contentType: 'application/json',
//        success: function (response) {
//            // Obsługa sukcesu, jeśli potrzebna
//            console.log('Zapisano elementy do bazy danych.');
//        },
//        error: function (xhr, status, error) {
//            // Obsługa błędu, jeśli potrzebna
//            console.error('Wystąpił błąd podczas zapisywania elementów: ' + error);
//        }
//    });
//}
//});
//</script >
















    //document.addEventListener('DOMContentLoaded', function () {
    //    var zoomContainer = document.getElementById('zoom-container');
    //var zoomContent = document.getElementById('zoom-content');
    //var scale = 1;
    //var scaleStep = 0.1;
    //var minScale = 0.5;
    //var maxScale = 5;

    //zoomContainer.addEventListener('wheel', function (event) {
    //    event.preventDefault();

    //if (event.deltaY < 0) {
    //    // Zoom in
    //    scale = Math.min(maxScale, scale + scaleStep);
    //        } else {
    //    // Zoom out
    //    scale = Math.max(minScale, scale - scaleStep);
    //        }

    //zoomContent.style.transform = 'scale(' + scale + ')';
    //    });
//});
