

/* JS for New Application radio buton to checkbox lookalike */
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.new_application').forEach(radio => {
      radio.addEventListener('mousedown', function () {
        if (this.checked) {
          this.dataset.wasChecked = 'true';
        } else {
          delete this.dataset.wasChecked;
        }
      });

      radio.addEventListener('click', function () {
        if (this.dataset.wasChecked === 'true') {
          this.checked = false;
          delete this.dataset.wasChecked;
        }
      });
    });
  });
  /* JS for Replacement Application radio buton to checkbox lookalike */
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.replacement_application').forEach(radio => {
      radio.addEventListener('mousedown', function () {
        if (this.checked) {
          this.dataset.wasChecked = 'true';
        } else {
          delete this.dataset.wasChecked;
        }
      });

      radio.addEventListener('click', function () {
        if (this.dataset.wasChecked === 'true') {
          this.checked = false;
          delete this.dataset.wasChecked;
        }
      });
    });
  });

  /*  js If "New" is selected → enable duration options.

If "Replacement" is selected → disable duration options and uncheck them.*/
document.addEventListener("DOMContentLoaded", function () {
    const newAppRadio = document.querySelector('.new_application');
    const replacementAppRadio = document.querySelector('.replacement_application');
    const durationOptions = document.querySelectorAll('.duration_option');
    const replacementReasons = document.querySelectorAll('.replacement_reason');

    function updateFormState() {
        // Handle duration options
        durationOptions.forEach(option => {
            option.disabled = !newAppRadio.checked;
            if (!newAppRadio.checked) {
                option.checked = false;
            }
        });

        // Handle replacement reasons
        replacementReasons.forEach(reason => {
            reason.disabled = !replacementAppRadio.checked;
            if (!replacementAppRadio.checked) {
                reason.checked = false;
            }
        });
    }

    // Add event listeners for both radio buttons
    newAppRadio.addEventListener('click', function() {
        if (this.dataset.wasChecked === 'true') {
            this.checked = false;
            delete this.dataset.wasChecked;
        }
        updateFormState();
    });

    replacementAppRadio.addEventListener('click', function() {
        if (this.dataset.wasChecked === 'true') {
            this.checked = false;
            delete this.dataset.wasChecked;
        }
        updateFormState();
    });

    // Store initial state on mousedown
    [newAppRadio, replacementAppRadio].forEach(radio => {
        radio.addEventListener('mousedown', function() {
            if (this.checked) {
                this.dataset.wasChecked = 'true';
            }
        });
    });

    // Initialize form state
    updateFormState();
});

/* JS FOR THE SIGNATURE */

document.addEventListener('DOMContentLoaded', function () {
    if (typeof SignaturePad === "undefined") {
        console.error("SignaturePad library is not loaded.");
        return;
    }

    // Initializing the Signature Pad
    const canvas = document.querySelector('#signature-pad');
    const signaturePad = new SignaturePad(canvas);

    document.querySelector('#clear-signature').addEventListener('click', function () {
        signaturePad.clear();
    });

    // When the form is submitted, we set the signature data into the hidden input
    document.querySelector('form').addEventListener('submit', function (event) {
        const signatureData = signaturePad.toDataURL();
        if (signatureData) {
            // Set the signature data to the hidden input
            document.querySelector('#signature-input').value = signatureData;
        } else {
            alert("Please provide a signature before submitting the form.");
            event.preventDefault();  // Prevent the form from being submitted if no signature
        }
    });
});

