const API_URL = "http://127.0.0.1:8000/items"


const form = document.querySelector("#item-form")

const nameInput = document.querySelector("#name")

const descriptionInput =
    document.querySelector("#description")

const tableBody =
    document.querySelector("#items-table-body")

const submitButton =
    document.querySelector("#submit-button")

const cancelButton =
    document.querySelector("#cancel-button")

const formTitle =
    document.querySelector("#form-title")

const message =
    document.querySelector("#message")

const refreshButton =
    document.querySelector("#refresh-button")


let editingItemId = null


// ==========================================
// READ ALL ITEMS
// GET /items
// ==========================================

const getItems = async () => {

    try {

        const response = await fetch(API_URL)

        if (!response.ok) {
            throw new Error("Failed to fetch items")
        }


        const items = await response.json()


        displayItems(items)


    } catch (error) {

        console.error(error)

        showMessage(
            "Could not load items",
            "error"
        )

    }

}


// ==========================================
// DISPLAY ITEMS
// ==========================================

const displayItems = (items) => {

    tableBody.innerHTML = ""


    if (items.length === 0) {

        const row =
            document.createElement("tr")

        const cell =
            document.createElement("td")

        cell.colSpan = 4

        cell.textContent =
            "No items have been created yet."

        cell.classList.add("empty")

        row.appendChild(cell)

        tableBody.appendChild(row)

        return

    }


    items.forEach((item) => {

        const row =
            document.createElement("tr")


        // ID

        const idCell =
            document.createElement("td")

        idCell.textContent = item.id


        // NAME

        const nameCell =
            document.createElement("td")

        nameCell.textContent = item.name


        // DESCRIPTION

        const descriptionCell =
            document.createElement("td")

        descriptionCell.textContent =
            item.description


        // ACTIONS

        const actionsCell =
            document.createElement("td")

        const actions =
            document.createElement("div")

        actions.classList.add("actions")


        // EDIT BUTTON

        const editButton =
            document.createElement("button")

        editButton.textContent = "Edit"

        editButton.classList.add(
            "edit-button"
        )

        editButton.addEventListener(
            "click",
            () => startEdit(item)
        )


        // DELETE BUTTON

        const deleteButton =
            document.createElement("button")

        deleteButton.textContent =
            "Delete"

        deleteButton.classList.add(
            "delete-button"
        )

        deleteButton.addEventListener(
            "click",
            () => deleteItem(item.id)
        )


        actions.appendChild(editButton)

        actions.appendChild(deleteButton)

        actionsCell.appendChild(actions)


        row.appendChild(idCell)

        row.appendChild(nameCell)

        row.appendChild(descriptionCell)

        row.appendChild(actionsCell)


        tableBody.appendChild(row)

    })

}


// ==========================================
// CREATE ITEM
// POST /items
// ==========================================

const createItem = async (itemData) => {

    try {

        const response = await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(itemData)
            }
        )


        if (!response.ok) {
            throw new Error(
                "Failed to create item"
            )
        }


        showMessage(
            "Item created successfully",
            "success"
        )


        resetForm()

        await getItems()


    } catch (error) {

        console.error(error)

        showMessage(
            "Could not create item",
            "error"
        )

    }

}


// ==========================================
// UPDATE ITEM
// PUT /items/{id}
// ==========================================

const updateItem = async (
    itemId,
    itemData
) => {

    try {

        const response = await fetch(
            `${API_URL}/${itemId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(itemData)
            }
        )


        if (!response.ok) {
            throw new Error(
                "Failed to update item"
            )
        }


        showMessage(
            "Item updated successfully",
            "success"
        )


        resetForm()

        await getItems()


    } catch (error) {

        console.error(error)

        showMessage(
            "Could not update item",
            "error"
        )

    }

}


// ==========================================
// DELETE ITEM
// DELETE /items/{id}
// ==========================================

const deleteItem = async (itemId) => {

    const confirmed =
        confirm(
            "Are you sure you want to delete this item?"
        )


    if (!confirmed) {
        return
    }


    try {

        const response = await fetch(
            `${API_URL}/${itemId}`,
            {
                method: "DELETE"
            }
        )


        if (!response.ok) {
            throw new Error(
                "Failed to delete item"
            )
        }


        showMessage(
            "Item deleted successfully",
            "success"
        )


        await getItems()


    } catch (error) {

        console.error(error)

        showMessage(
            "Could not delete item",
            "error"
        )

    }

}


// ==========================================
// START EDITING
// ==========================================

const startEdit = (item) => {

    editingItemId = item.id


    nameInput.value =
        item.name


    descriptionInput.value =
        item.description


    formTitle.textContent =
        "Edit Item"


    submitButton.textContent =
        "Update Item"


    cancelButton.classList.remove(
        "hidden"
    )


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })

}


// ==========================================
// RESET FORM
// ==========================================

const resetForm = () => {

    editingItemId = null


    form.reset()


    formTitle.textContent =
        "Add Item"


    submitButton.textContent =
        "Add Item"


    cancelButton.classList.add(
        "hidden"
    )

}


// ==========================================
// FORM SUBMISSION
// ==========================================

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault()


        const itemData = {

            name:
                nameInput.value.trim(),

            description:
                descriptionInput.value.trim()

        }


        if (
            !itemData.name ||
            !itemData.description
        ) {

            showMessage(
                "Please fill in all fields",
                "error"
            )

            return
        }


        if (editingItemId) {

            await updateItem(
                editingItemId,
                itemData
            )

        } else {

            await createItem(
                itemData
            )

        }

    }
)


// ==========================================
// CANCEL EDIT
// ==========================================

cancelButton.addEventListener(
    "click",
    resetForm
)


// ==========================================
// REFRESH
// ==========================================

refreshButton.addEventListener(
    "click",
    getItems
)


// ==========================================
// MESSAGE
// ==========================================

const showMessage = (
    text,
    type
) => {

    message.textContent = text

    message.className = type


    setTimeout(() => {

        message.textContent = ""

        message.className = ""

    }, 3000)

}


// ==========================================
// INITIAL LOAD
// ==========================================

getItems()