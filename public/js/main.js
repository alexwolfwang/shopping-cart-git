/**
 * Created by Alex.W on 2017/1/11.
 */
(function() {
   $('.removeBook').click(function(e) {

       deleteId = $(this).data('id');
       //alert(deleteId);
       $.ajax({
           url: '/manage/books/delete/' + deleteId,
           type: 'delete',
           success: function () {

           }
       });

       window.location = '/manage/books';
   });


    $('.removeCategory').click(function(e) {
        deleteId = $(this).data('id');

        $.ajax({
            url:'/manage/categories/delete/' + deleteId,
            type:'delete',
            success:function(){}
        });

        window.location = '/manage/categories';
    })


    $('#navbar li').click(function() {
        alert('!')
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
    })
})();
