$(document).ready(function() {
    $.getJSON('/data/toys.json', function(data) {
        generateJSONTree(data);
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.error('Error fetching JSON data:', errorThrown);
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
        uList.append(listItem);
        listItem.on("click", () => {
            displayToyDetails(toy);
        });
    });
    const addButton = $("<button>").attr("id", "add-toy-button").text("Add Toy");
    sidebar.append(addButton);
    addButton.on("click", displayAddToyForm);
}

function displayToyDetails(toy) {
    const detailsContainer = $("#main-content");
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
    detailsContainer.append(deleteButton);
}

function saveChanges(toy) {
    const updatedToy = {};
    for (const key in toy) {
        if (toy.hasOwnProperty(key)) {
            const inputField = $("#" + key);
            updatedToy[key] = inputField.val();
        }
    }
    $.ajax({
        url: '/update-toy',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(updatedToy),
        success: function(response) {
            console.log('Changed saved successfully');
            window.location.reload();
        },
        error: function(xhr, status, error) {
            console.error('Failed to save changes');
        }
    });
}

function deleteToy(toyId) {
    $.ajax({
        url: `/delete-toy/${toyId}`,
        type: 'DELETE',
        success: function(response) {
            console.log('Toy deleted successfully');
            window.location.reload();
        },
        error: function(xhr, status, error) {
            console.error('Failed to delete toy');
        }
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
    $.ajax({
        url: '/add-toy',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(newToy),
        success: function(response) {
            console.log('Toy added successfully');
            window.location.reload();
        },
        error: function(xhr, status, error) {
            console.error('Failed to add toy');
        }
    });
}
