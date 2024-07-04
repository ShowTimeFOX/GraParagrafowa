function initializeUpdater(gameData) {
    console.log(gameData.story.Name);
    console.log(gameData.choice_list[0].Text);

    // Sortowanie HistoryBlocks względem InStoryId rosnąco
    gameData.story.HistoryBlocks.sort((a, b) => a.InStoryId - b.InStoryId);

    gameData.story.HistoryBlocks.forEach(function (element) {
        var choicy = gameData.choice_list.filter(fuk => fuk.SourceBlock.Id === element.Id);
        var outcomeIdsString;

        if (choicy.length > 0) {
            outcomeIdsString = choicy.map(choice => choice.OutcomeBlock.InStoryId).join(';');
        } else {
            outcomeIdsString = "";
        }

        choicy.forEach(function (choice) {
            console.log('String z dziećmi: ' + choice.OutcomeBlock.InStoryId);
        });

        console.log('String z dziećmi: ' + outcomeIdsString);
        console.log('Ilość odpowiedzi dla bloku ' + element.Id + ' = ' + choicy.length);

        
       

        var parent = createParentElement(element.InStoryId, element.Description, element.ImagePath, choicy.length, outcomeIdsString, choicy);

        console.log('InstoryID: ' + element.InStoryId);

        if (element.InStoryId == 0) {

            $('#zoom-content').append(parent);
        }
        else
        {
            var niemamnazwy = gameData.choice_list.filter(fuk => fuk.OutcomeBlock.Id === element.Id);
            //console.log('Szukam swojego rodzica o id' + choicy.SourceBlock.length);
            console.log('dzieci id: : ' + outcomeIdsString);
            var inputidElement = document.querySelector(`input[name="id"][value="${niemamnazwy.SourceBlock[0].InStoryId}"]`);
            var $parentDiv = inputidElement.closest('.parent');
            var childreanthing = $parentDiv.closest('.children');
            childreanthing.appendChild(parent);
        }
            
        
        
    });

    function createParentElement(id, description, imagePath, decisionCount, childString, choicyforBlock) {

        var global = document.createElement('div');
        global.classList.add('global');

        var parentDiv = document.createElement('div');
        parentDiv.classList.add('parent');
        global.appendChild(parentDiv);

        // Dodawanie <p> z ID dziecka
        var childIdParagraph = document.createElement('p');
        childIdParagraph.textContent = 'ID dziecka: ' + id;
        parentDiv.appendChild(childIdParagraph);

        // Dodawanie inputa hidden z id
        var idInput = document.createElement('input');
        idInput.setAttribute('type', 'hidden');
        idInput.setAttribute('name', 'id');
        idInput.setAttribute('value', id.toString());
        parentDiv.appendChild(idInput);

        // Dodawanie textarea z opisem
        var descriptionTextarea = document.createElement('textarea');
        descriptionTextarea.setAttribute('name', 'description');
        descriptionTextarea.textContent = description;
        parentDiv.appendChild(document.createTextNode('opis '));
        parentDiv.appendChild(descriptionTextarea);

        // Dodawanie inputa file z obrazem
        var imagePathInput = document.createElement('input');
        imagePathInput.setAttribute('type', 'file');
        imagePathInput.setAttribute('name', 'imagePath');
        imagePathInput.setAttribute('value', imagePath);
        parentDiv.appendChild(document.createTextNode(' obraz '));
        parentDiv.appendChild(imagePathInput);

        // Dodawanie hr
        parentDiv.appendChild(document.createElement('hr'));

        // Dodawanie selecta z ilością decyzji
        var decisionCountSelect = document.createElement('select');
        decisionCountSelect.setAttribute('name', 'decisionCount');
        for (var i = 1; i <= 5; i++) {
            var option = document.createElement('option');
            option.textContent = i.toString();
            decisionCountSelect.appendChild(option);
        }
        decisionCountSelect.value = decisionCount.toString();
        parentDiv.appendChild(document.createTextNode('ilosc decyzji '));
        parentDiv.appendChild(decisionCountSelect);

        // Dodawanie inputa hidden na dzieci
        var childrenInput = document.createElement('input');
        childrenInput.setAttribute('type', 'hidden');
        childrenInput.setAttribute('name', 'children');
        childrenInput.setAttribute('value', childString);
        parentDiv.appendChild(childrenInput);

        // Dodawanie inputa Stwórz
        var createButton = document.createElement('input');
        createButton.setAttribute('type', 'button');
        createButton.setAttribute('value', 'Stwórz');
        createButton.classList.add('create-button');
        createButton.setAttribute('name', 'Create');
        parentDiv.appendChild(createButton);

        // Dodawanie inputa Usuń
        var deleteButton = document.createElement('input');
        deleteButton.setAttribute('type', 'button');
        deleteButton.setAttribute('value', 'Usuń');
        deleteButton.classList.add('delete-button');
        deleteButton.setAttribute('name', 'Delete');
        parentDiv.appendChild(deleteButton);

        choicyforBlock.forEach(function (choice) {
            var outcomeId = choice.OutcomeBlock.InStoryId;

            var label = document.createElement('label');
            label.setAttribute('choice-id', outcomeId);
            label.textContent = 'Odpowiedź dla ID: ' + outcomeId;
            parentDiv.appendChild(label);

            var input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('choice-id', outcomeId);
            parentDiv.appendChild(input);
        });

        // Zwracanie gotowego diva parent
        return parentDiv;
    }

    function addNewStructure(choicy) {
        var inputidElement = document.querySelector(`input[name="id"][value="${choicy.SourceBlock.InStoryId}"]`);

        if (inputidElement) {
            console.log('Znaleziono element:', inputidElement);
            inputidElement.setAttribute('value', '123');
            console.log('Zmieniona wartość:', inputidElement.value);
        } else {
            console.log('Element nie został znaleziony');
        }

        var $parentDiv = inputidElement.closest('.parent');
        var decisionCount = $parentDiv.querySelector('select[name="decisionCount"]').value;

        var textInputs = $parentDiv.querySelectorAll('input[type="text"][choice-id]');
        textInputs.forEach(function (input) {
            input.remove();
        });

        var labels = $parentDiv.querySelectorAll('label[choice-id]');
        labels.forEach(function (label) {
            label.remove();
        });

        choicy.forEach(function (choice) {
            var $newGlobal = document.createElement('div');
            $newGlobal.classList.add('global');

            var $newParent = document.createElement('div');
            $newParent.classList.add('parent');

            var uniqueId = choice.OutcomeBlock.InStoryId;

            $newParent.appendChild(parentDiv);

            var $newChildren = document.createElement('div');
            $newChildren.classList.add('children');

            $newGlobal.appendChild($newParent);
            $newGlobal.appendChild($newChildren);

            $parentDiv.nextElementSibling.appendChild($newGlobal);

            checkAndToggleDisable($button);
        });
    }
}
