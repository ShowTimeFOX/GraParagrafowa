// Funkcja initializePlayer
function initializePlayer(gameData) {
    const playButton = $('#playButton');
    const stopButton = $('#stopButton');
    const storyContainer = $('#storyContainer');

    // Ustawienie tła kontenera na podstawie imagePath
    storyContainer.css('background-image', 'url("data:image/png;base64,' + gameData.story.ImagePath + '")');

    playButton.click(function () {
        console.log('start'); // Wypisanie "start" na konsoli

        // Sprawdzenie czy istnieją historyBlocks
        if (gameData.story.HistoryBlocks && gameData.story.HistoryBlocks.length > 0) {
            // Znalezienie pierwszego bloku, gdzie InStoryId == 0
            var initialBlock = gameData.story.HistoryBlocks.find(function (block) {
                return block.InStoryId === 0;
            });

            if (initialBlock) {
                // Rozpoczęcie od pierwszego znalezionego bloku
                displayBlock(initialBlock, gameData.story.HistoryBlocks, gameData.choice_list, storyContainer);
            }
        }
    });

    stopButton.click(function () {
        clearPlayer();
    });
}

// Funkcja displayBlock do wyświetlania bloków
function displayBlock(block, allBlocks, choiceList, storyContainer) {
    console.log("display block:", block);

    var blockDescription = $('#blockDescription');
    var choicesContainer = $('#choicesContainer');

    // Wyświetlenie opisu bloku
    blockDescription.text(block.Description);

    // Aktualizacja tła kontenera na podstawie imagePath
    //if (block.ImagePath) {
        storyContainer.css('background-image', 'url("data:image/png;base64,' + block.ImagePath + '")');
    //}

    // Wyczyszczenie kontenera na wybory
    choicesContainer.empty();

    // Iteracja przez dostępne wybory
    choiceList.forEach(function (choice) {
        if (choice.SourceBlock.Id === block.Id) {
            var button = $('<button>').text(choice.Text);
            button.click(function () {
                var nextBlock = allBlocks.find(function (b) {
                    return b.Id === choice.OutcomeBlock.Id;
                });
                displayBlock(nextBlock, allBlocks, choiceList, storyContainer);
            });
            choicesContainer.append(button);
        }
    });
}

// Funkcja clearPlayer do czyszczenia interfejsu odtwarzacza
function clearPlayer() {
    $('#blockDescription').text('');
    $('#choicesContainer').empty();
}
