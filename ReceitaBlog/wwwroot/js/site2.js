function addRecipe() {

    let blogPost = {
        title: document.getElementById('title').value,
        shortDescription: document.getElementById('description').value,
        ingredients: document.getElementById('ingredients').value,
        preparationMode: document.getElementById('preparationMode').value,
        image: document.getElementById('uploadPreview').src
        //sendNotification: notificationService.checkPushEnabled()        
    };

    var blogPostRecipeUrl = '/recipe/';

    fetch(blogPostRecipeUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(blogPost)
    }).then(() => {
        //blogService.loadLatestBlogPosts();
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        document.getElementById('ingredients').value = '';
        document.getElementById('preparationMode').value = '';
        document.getElementById('uploadPreview').src = '';
    }).catch(error => console.error('Unable to add item.', error));

}

function LimpaCampos() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('ingredients').value = '';
    document.getElementById('preparationMode').value = '';
    document.getElementById('uploadPreview').src = '';
}