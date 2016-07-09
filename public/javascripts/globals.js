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

// Sign-up
$('.signup-form input').on('keyup', function() {
  var username = $('input[name=username]').val();
  var email    = $('input[name=email]').val();
  var password = $('input[name=password]').val();
  var confirm  = $('input[name=confirm]').val();
  var button   = $('.signup-form button');

  if (username.length && email.length && password.length && confirm.length &&
      password === confirm) {
    $(button).prop('disabled', false);
  } else {
    $(button).prop('disabled', true);
  }
});

$('input[name=confirm],input[name=password]').on('keyup', function() {
  var password = $('input[name=password]');
  var confirm  = $('input[name=confirm]');

  if (password.val() !== confirm.val()) {
    confirm.parent().addClass('has-error');
    confirm.parent().removeClass('has-success');
  } else {
    confirm.parent().removeClass('has-error');
    confirm.parent().addClass('has-success');
  }
});
