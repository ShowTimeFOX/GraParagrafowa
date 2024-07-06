$(document).ready(function () {
    $('#Save').click(function () {
        var dataToSend = {
            storyName: $('input[name="Name"]').val(),
            photo: '',
            formData: [],
            StoryId: gameData.story.Id
        };

        var photoFile = $('input[name="Photo"]').prop('files')[0];
        if (photoFile) {
            var reader = new FileReader();
            reader.onloadend = function () {
                dataToSend.photo = reader.result.split(',')[1]; // Zapisz Base64 string
                gatherFormData(dataToSend);
            };
            reader.readAsDataURL(photoFile);
        } else {
            gatherFormData(dataToSend);
        }
    });

    function gatherFormData(dataToSend) {
        var totalParents = $('.parent').length;
        var processedParents = 0;

        $('.parent').each(function () {
            var id = $(this).find('input[name="id"]').val();
            var description = $(this).find('textarea[name="description"]').val();
            var imageFile = $(this).find('input[name="imagePath"]').prop('files')[0];
            var decisionCount = $(this).find('select[name="decisionCount"]').val();
            var children = $(this).find('input[name="children"]').val();

            var childResponses = [];
            $(this).find('input[type="text"][choice-id]').each(function () {
                var childId = $(this).attr('choice-id');
                var response = $(this).val();
                childResponses.push(`${childId}#*$${response}`);
            });
            var responsesString = childResponses.join('&&$');

            var item = {
                id: id,
                description: description,
                decisionCount: decisionCount,
                children: children,
                responses: responsesString,
                image: ''
            };

            if (imageFile) {
                var reader = new FileReader();
                reader.onloadend = function () {
                    item.image = reader.result.split(',')[1];
                    dataToSend.formData.push(item);
                    processedParents++;
                    if (processedParents === totalParents) {
                        sendAjax(dataToSend);
                    }
                };
                reader.readAsDataURL(imageFile);
            } else {
                dataToSend.formData.push(item);
                processedParents++;
                if (processedParents === totalParents) {
                    sendAjax(dataToSend);
                }
            }
        });
    }

    function sendAjax(dataToSend) {

        $.ajax({
            url: '/DecisionBlocks/HandleUpdate',
            type: 'POST',
            data: JSON.stringify(dataToSend),
            contentType: 'application/json',
            success: function (response) {
                console.log('Dane wysłane poprawnie.');
                console.log('Odpowiedź od serwera:', response);
                // Wyświetl komunikat o sukcesie przez 5 sekund
                $('#successMessage').fadeIn().delay(5000).fadeOut();
                $('#errorMessage').hide();
            },
            error: function (error) {
                console.error('Błąd podczas wysyłania danych:', error);
                // Wyświetl komunikat o błędzie przez 5 sekund
                $('#errorMessage').fadeIn().delay(5000).fadeOut();
                $('#successMessage').hide();
            }
        });
    }
});
