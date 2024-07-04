// Funkcja initializePlayer
function initializePlayer(story) {
    const playButton = $('#playButton');
    const stopButton = $('#stopButton');

    console.log("JS Story", story);
    const storyContainer = $('#storyContainer');

    // Ustawienie tła kontenera na podstawie imagePath
    storyContainer.css('background-image', 'url("data:image/png;base64,' + story.imagePath + '")');

    playButton.click(function () {
        console.log('start'); // Wypisanie "start" na konsoli

        if (story.historyBlocks && story.historyBlocks.$values.length > 0) {
            displayBlock(story.historyBlocks.$values[0], story.historyBlocks.$values);
        }
    });

    stopButton.click(function () {
        clearPlayer();
    });
}

// Funkcja displayBlock do wyświetlania bloków
function displayBlock(block, allBlocks) {
    if (!block) {
        console.error('Błąd: Blok jest niezdefiniowany');
        return;
    }

    console.log("display block:", block);

    var blockDescription = $('#blockDescription');
    var choicesContainer = $('#choicesContainer');

    // Wyświetlenie opisu bloku
    blockDescription.text(block.description);

    // Wyczyszczenie kontenera na wybory
    choicesContainer.empty();

    // Iteracja przez dostępne wybory
    $.each(block.choices.$values, function (index, choice) {
        var button = $('<button>').text(choice.text);
        button.click(function () {
            var nextBlock = allBlocks.find(function (b) { return b.id === choice.outcomeBlock.id; });
            displayBlock(nextBlock, allBlocks);
        });
        choicesContainer.append(button);
    });
}

// Funkcja clearPlayer do czyszczenia interfejsu odtwarzacza
function clearPlayer() {
    $('#blockDescription').text('');
    $('#choicesContainer').empty();
}
