function initializeUpdater(gameData) {
    console.log(gameData.story.Name);
    console.log(gameData.choice_list[0].Text);

    // Sortowanie HistoryBlocks względem InStoryId rosnąco
    gameData.story.HistoryBlocks.sort((a, b) => a.InStoryId - b.InStoryId);

    var chuj = [];
    var DzieciDlaID = new Object();

    gameData.story.HistoryBlocks.forEach(function (element) {
        var choicy = gameData.choice_list.filter(fuk => fuk.SourceBlock.Id === element.Id);
        var outcomeIdsString;

        if (choicy.length > 0) {
            outcomeIdsString = choicy.map(choice => choice.OutcomeBlock.InStoryId).join(';');
            let numbersArray = outcomeIdsString.split(';').filter(Boolean).map(Number);
            DzieciDlaID[element.InStoryId] = numbersArray;
        } else {
            outcomeIdsString = "";
        }

        choicy.forEach(function (choice) {
            console.log('String z dziećmi: ' + choice.OutcomeBlock.InStoryId);
        });

        console.log('String z dziećmi: ' + outcomeIdsString);
        console.log('Ilość odpowiedzi dla bloku ' + element.Id + ' = ' + choicy.length);

        var parent = createParentElement(element.InStoryId, element.Description, element.ImagePath, choicy.length, outcomeIdsString, choicy);
        chuj.push(parent);
        console.log(parent);
    });

    console.log("-------------------------------------");
    console.log(findParentElementById(1));
    console.log("-------------------------------------");

    var zoom = document.getElementById("zoom-content");
    var jakaslistazerowa = [];
    jakaslistazerowa.push(findParentElementById(0));

    PojebanaRekurencja(zoom, jakaslistazerowa);

    function PojebanaRekurencja(ElementChildrean, listaDzieci) {
        listaDzieci.forEach(function (element) {
            var global = document.createElement('div'); // create global div
            global.classList.add('global'); // add global class

            ElementChildrean.appendChild(global); // add global div to ElementChildrean
            global.appendChild(element);

            var dzieci = [];

            if (DzieciDlaID[findIdByParentElement(element)] != null) {
                DzieciDlaID[findIdByParentElement(element)].forEach(function (id) {

                    dzieci.push(findParentElementById(id)); // find child elements by id
                });
            }
            
            
            var childrean = document.createElement('div'); // create children div
            childrean.classList.add('children'); // add children class
            global.appendChild(childrean); // add children div to global div

            if (dzieci.length > 0)
            {
                PojebanaRekurencja(childrean, dzieci); // recursive call with children div
            }
        });
    }

    function findParentElementById(id) {
        // Search the list
        for (var i = 0; i < chuj.length; i++) {
            var parentElement = chuj[i];
            var idInput = parentElement.querySelector('input[type="hidden"][name="id"]');

            if (idInput && idInput.value === id.toString()) {
                return parentElement;
            }
        }
        // Return null if no matching element is found
        return null;
    }

    function findIdByParentElement(parentElement) {
        var idInput = parentElement.querySelector('input[type="hidden"][name="id"]');

        if (idInput) {
            return idInput.value;
        } else {
            return null;
        }
    }

    function createParentElement(id, description, imagePath, decisionCount, childString, choicyforBlock) {
        

        let inputElement = document.querySelector('input[name="counter"]');

        inputElement.value++;



        var parentDiv = document.createElement('div');
        parentDiv.classList.add('parent');

        var childIdParagraph = document.createElement('p');
        childIdParagraph.textContent = 'ID dziecka: ' + id;
        parentDiv.appendChild(childIdParagraph);

        var idInput = document.createElement('input');
        idInput.setAttribute('type', 'hidden');
        idInput.setAttribute('name', 'id');
        idInput.setAttribute('value', id.toString());
        parentDiv.appendChild(idInput);

        var descriptionTextarea = document.createElement('textarea');
        descriptionTextarea.setAttribute('name', 'description');
        descriptionTextarea.textContent = description;
        parentDiv.appendChild(document.createTextNode('opis '));
        parentDiv.appendChild(descriptionTextarea);

        var imagePathInput = document.createElement('input');
        imagePathInput.setAttribute('type', 'file');
        imagePathInput.setAttribute('name', 'imagePath');
        imagePathInput.setAttribute('value', imagePath);



        parentDiv.appendChild(document.createTextNode(' obraz '));
        parentDiv.appendChild(imagePathInput);

        parentDiv.appendChild(document.createElement('hr'));

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

        if (choicyforBlock.length > 0) {
            decisionCountSelect.value = choicyforBlock.length.toString();
        }
        else
        {
            decisionCountSelect.value = 1;
        }
        



        var childrenInput = document.createElement('input');
        childrenInput.setAttribute('type', 'hidden');
        childrenInput.setAttribute('name', 'children');
        childrenInput.setAttribute('value', childString);
        parentDiv.appendChild(childrenInput);

        
            var createButton = document.createElement('input');
            createButton.setAttribute('type', 'button');
            createButton.setAttribute('value', 'Stwórz');
            createButton.classList.add('create-button');
            createButton.setAttribute('name', 'Create');
            parentDiv.appendChild(createButton);

        if (choicyforBlock.length > 0)
        {
            createButton.setAttribute('disabled', 'true');  // Dodanie atrybutu disabled
            decisionCountSelect.setAttribute('disabled', 'true');
        }
        

        if (id != 0)
        {
            var deleteButton = document.createElement('input');
            deleteButton.setAttribute('type', 'button');
            deleteButton.setAttribute('value', 'Usuń');
            deleteButton.classList.add('delete-button');
            deleteButton.setAttribute('name', 'Delete');
            parentDiv.appendChild(deleteButton);
        }
        

        choicyforBlock.forEach(function (choice) {
            var outcomeId = choice.OutcomeBlock.InStoryId;

            var label = document.createElement('label');
            label.setAttribute('choice-id', outcomeId);
            label.textContent = 'Odpowiedź dla ID: ' + outcomeId;
            parentDiv.appendChild(label);

            var input = document.createElement('input');
            input.setAttribute('type', 'text');
            input.setAttribute('choice-id', outcomeId);
            input.value = choice.Text;
            parentDiv.appendChild(input);
        });

        return parentDiv;
    }
}
