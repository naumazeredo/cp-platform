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
$('.category').on('click', function() {
  var el = $(this).find('.category-caret');
  if (el.hasClass('fa-caret-right')) el.removeClass('fa-caret-right').addClass('fa-caret-down');
  else el.removeClass('fa-caret-down').addClass('fa-caret-right');
});

// Initialize tooltips
$(function() {
  $('[data-toggle="tooltip"]').tooltip()
})
