define([], function () {

    function generateBlogItem(item) {
        var template = $('#blog-card').html();
        template = template.replace('{{PostId}}', item.postId);
        template = template.replace('{{Image}}', item.image);
        template = template.replace('{{Title}}', item.title);
        template = template.replace('{{ShortDescription}}', item.shortDescription);
        template = template.replace('{{Ingredients}}', item.ingredients);
        template = template.replace('{{PreparationMode}}', item.preparationMode);
        template = template.replace('{{Link}}', item.link);
        return template;
    }

    function appendBlogList(items) {
        var cardHtml = '';
        for (var i = 0; i < items.length; i++) {
            cardHtml += generateBlogItem(items[i]);
        }

        $('.blog-list').append(cardHtml);
    }

    function showBlogItem(html, link) {
        var template = $('#blog-item').html();
        template = template.replace('{{Link}}', link);
        template = template.replace('{{Link}}', link);        
        template = template.replace('{{Content}}', html);
        $('#blog-item-container').html(template);
        document.querySelector('.blog-item-close')
            .addEventListener('click', function(){
                document.getElementById('blog-item-container').innerHTML = '';
            }); 
    }

    return {
        appendBlogList: appendBlogList,
        showBlogItem: showBlogItem
    }
});