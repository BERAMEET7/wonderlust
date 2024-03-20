// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })();


  
  document.addEventListener('DOMContentLoaded', function () {
    // Select all elements with class 'deletebtn'
    var deleteButtons = document.querySelectorAll('.deletebtn');
    
    // Loop through each delete button
    deleteButtons.forEach(function (button) {
        // Add a click event listener to each delete button
        button.addEventListener('click', function (event) {
            // Prevent the default action of the button (form submission)
            event.preventDefault();

            // Display a confirmation dialog
            var result = confirm("Are you sure you want to delete this chat?");

            // If the user confirms the delete, submit the form
            if (result) {
                button.closest('form').submit();
            }
        });
    });
});