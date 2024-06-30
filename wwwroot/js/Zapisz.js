$(document).ready(function () {
    $('#Save').click(function () {
        var dataToSend = [];

        $('.parent').each(function () {
            var id = $(this).find('input[name="id"]').val();
            var description = $(this).find('textarea[name="description"]').val();
            var imageFile = $(this).find('input[name="imagePath"]').prop('files')[0];
            var decisionCount = $(this).find('select[name="decisionCount"]').val();
            var children = $(this).find('input[name="children"]').val();

            // Pobieranie odpowiedzi dla dzieci
            var childResponses = [];
            $(this).find('input[type="text"][choice-id]').each(function () {
                var childId = $(this).attr('choice-id');
                var response = $(this).val();
                childResponses.push(`${childId}#*$${response}`);
            });
            var responsesString = childResponses.join('&&$');

            // Utwórz obiekt zawierający dane jednego elementu
            var item = {
                id: id,
                description: description,
                decisionCount: decisionCount,
                children: children,
                responses: responsesString
            };

            // Dodaj obraz jako base64 string tylko jeśli został wybrany
            if (imageFile) {
                var reader = new FileReader();
                reader.onloadend = function () {
                    item.image = reader.result.split(',')[1]; // Usuń prefiks "data:image/png;base64,"
                    dataToSend.push(item);
                    // Wysłanie danych AJAX-em po zakończeniu wczytywania obrazu
                    if (dataToSend.length === $('.parent').length) {
                        sendAjax(dataToSend);
                    }
                };
                reader.readAsDataURL(imageFile);
            } else {
                dataToSend.push(item);
                // Wysłanie danych AJAX-em jeśli nie ma obrazu
                if (dataToSend.length === $('.parent').length) {
                    sendAjax(dataToSend);
                }
            }
        });
    });

    function sendAjax(dataToSend) {
        $.ajax({
            url: '/DecisionBlocks/HandleFormData',  // URL Twojej akcji w kontrolerze (np. /Story/HandleFormData)
            type: 'POST',
            data: JSON.stringify(dataToSend),
            contentType: 'application/json',
            success: function (response) {
                // Obsłuż sukces
                console.log('Dane wysłane poprawnie.');
                console.log('Odpowiedź od serwera:', response);
            },
            error: function (error) {
                // Obsłuż błędy
                console.error('Błąd podczas wysyłania danych:', error);
            }
        });
    }
});
