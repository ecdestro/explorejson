$(document).ready(function() {
    fetch('/data/toys.json')
        .then(response => response.json())
        .then(jsonData => {
            generateJSONTree(jsonData);
        })
        .catch(error => {
            console.error('Error fetching JSON data:', error);
        });
});

function generateJSONTree(data) {
    const sidebar = $("#sidebar");
    sidebar.empty();

    const header2 = $("<h2>").text("JSON Objects");
    sidebar.append(header2);
    const uList = $("<ul>").attr("id", "json-tree");
    sidebar.append(uList);

    data.toys.forEach(toy => {
        const listItem = $("<li>").text(`${toy.name} - ${toy.manufacturer}`).attr("data-id", toy.id);
        listItem.on("click", () => {
            displayToyDetails(toy);
        });
    });
    const addButton = $("<button>").attr("id", "add-toy-button").text("Add Toy");
    sidebar.append(addButton);
    addButton.on("click", displayAddToyForm);
}

function displayToyDetails(toy) {
    const detailsContainer = $("#main.content");
    detailsContainer.empty();

    const header2 = $("<h2>").text("Object Details");
    detailsContainer.append(header2);

    for (const key in toy) {
        if(toy.hasOwnProperty(key)) {
            const inputLabel = $("<label>").text(key + ": ");
            const inputField = $("<input>").attr("type", "text").attr("id", key).val(toy[key]);
            detailsContainer.append(inputLabel);
            detailsContainer.append(inputField);
            detailsContainer.append($("<br />"));
        }
    }

    const saveButton = $("<button>").text("Save Changes");
    saveButton.on("click", function() {
        saveChanges(toy);
    });
    detailsContainer.append(saveButton);

    const deleteButton = $("<button>").text("Delete Toy");
    deleteButton.on("click", function() {
        deleteToy(toy.id);
    });
}

function saveChanges(toy) {
    const updatedToy = {};
    for (const key in toy) {
        if (toy.hasOwnProperty(key)) {
            const inputField = $("#" + key);
            updatedToy[key] = inputField.val();
        }
    }
    fetch('/update-toy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedToy)
    })
        .then(response => {
            if (response.ok) {
                console.log('Changes saved successfully');
                window.location.reload();
            } else {
                console.error('Failed to save changes');
            }
        })
        .catch(error => {
            console.error('Error saving changes:', error);
        });
}

function deleteToy(toyId) {
    fetch(`/delete-toy/${toy.id}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                console.log('Toy deleted successfully');
                window.location.reload();
            } else {
                console.error('Failed to delete toy');
            }
        })
        .catch(error => {
            console.error('Error deleting toy:', error);
        });
}

function displayAddToyForm() {
    const detailsContainer = $("#main-content");
    detailsContainer.empty();

    const header2 = $("<h2>").text("Add New Object");
    detailsContainer.append(header2);

    const newForm = $("<form>").attr("id", "add-toy-form");
    
    const nameLabel = $("<label>").attr("for", "name").text("Name: ");
    const nameInput = $("<input>").attr("type", "text").attr("id", "name").attr("name", "name");
    const makeLabel = $("<label>").attr("for", "manufacturer").text("Manufacturer: ");
    const makeInput = $("<input>").attr("type", "text").attr("id", "manufacturer").attr("name", "manufacturer");
    const tagsLabel = $("<label>").attr("for", "tags").text("Tags (comma-separated): ");
    const tagsInput = $("<input>").attr("type", "text").attr("id", "tags").attr("name", "tags");

    detailsContainer.append(newForm);
    newForm.append(nameLabel).append(nameInput).append($("<br />"));
    newForm.append(makeLabel).append(makeInput).append($("<br />"));
    newForm.append(tagsLabel).append(tagsInput).append($("<br />"));

    const saveNew = $("<button>").text("Save New Toy");
    newForm.append(saveNew);
    newForm.on("submit", (event) => {
        event.preventDefault();
        saveNewToy();
        newForm[0].reset();
    });
}

function saveNewToy() {
    const name = $("#name").val();
    const manufacturer = $("#manufacturer").val();
    const tags = $("#tags").val().split(",").map(tag => tag.trim());
    const newToy = {
        name: name,
        manufacturer: manufacturer,
        tags: tags
    };
    fetch('/add-toy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newToy)
        })
        .then(response => {
            if (response.ok) {
                console.log('New toy added successfully');
                window.location.reload();
            } else {
                console.error('Failed to add new toy');
            }
        })
        .catch(error => {
            console.error('Error adding new toy:', error);
        });
}