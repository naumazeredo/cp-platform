// Closes user menu when clicking outside
$(document).ready(function () {
  $(document).click(function (event) {
    var clickover = $(event.target);
    var _opened = $("#user-menu").hasClass("collapse in");
    if (_opened === true && !clickover.hasClass("user-menu-toggle")) {
      $(".user-menu-toggle").click();
    }
  });
});

// Categories caret
$('.category-body').on('shown.bs.collapse', function() {
  $(this).parent().find('.glyphicon-triangle-right').removeClass('glyphicon-triangle-right').addClass('glyphicon-triangle-bottom');
}).on('hidden.bs.collapse', function() {
  $(this).parent().find('.glyphicon-triangle-bottom').removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-right');
});

// Initialize tooltips
$(function() {
  $('[data-toggle="tooltip"]').tooltip()
})
