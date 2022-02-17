// !!!! this has been included in a script in boilerplate

    // Example starter JavaScript for disabling form submissions if there are invalid fields
    (function () {
     'use strict'

        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.querySelectorAll('.validated-form')

        // Loop over them and prevent submission
         Array.from(forms)
         .forEach(function (form) {
             form.addEventListener('submit', function (event) {
             if (!form.checkValidity()) {
                event.preventDefault() // do not use html submit default
                event.stopPropagation() // listener is bounded to this level/child
            }
            form.classList.add('was-validated') // bootstrap class
            }, false)
        })
     })()
