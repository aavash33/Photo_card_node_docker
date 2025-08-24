const express = require('express');
const path = require('path');
const { Pool } = require('pg');
const app = express();
const port = 3000;

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

// Middleware to parse POST request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

/* const connectionString = 'postgresql://aavash:Aavash@33@localhost:5432/form2'; */
//FOR DOCKER
const connectionString = 'postgresql://aavash:Aavash@33@db:5432/form2';

// Using a connection pool  
const pool = new Pool({
    connectionString: connectionString
});

app.post('/submit-form', async (req, res) => {
  const {
    customer_number,
    attachment,
    application_type,
    new_application_duration,
    replacement_reason,
    applicants_surname,
    applicants_givenname,
    liscence_CRN_number,
    applicants_date_of_birth,
    Gender,
    applicants_residential_address,
    residential_postcode,
    applicants_mailing_address,
    mailing_postcode,
    applicants_emailadd,
    applicants_mobile_number,
    pensioner,
    permanent_resident,
    non_permanent_resident_entry_date,
    have_had_nsw_liscence_photocard_registration_permit,
    nsw_liscence_photocard_registration_permit_details,
    nsw_liscence_number_change_due_to_data_breach,
    applicants_signature,
    applicants_signature_date,
  } = req.body;

  // Check required signature
  if (!applicants_signature) {
    return res.status(400).send("Signature data is empty.");
  }

  // Decode base64 signature
  let signatureBuffer;
  try {
    const base64Data = applicants_signature.replace(/^data:image\/png;base64,/, "");
    signatureBuffer = Buffer.from(base64Data, 'base64');
  } catch (err) {
    return res.status(400).send("Invalid signature format.");
  }

  // Decode attachment if base64 was used (optional)
  let attachmentBuffer = null;
  if (attachment && attachment.startsWith("data:")) {
    attachmentBuffer = Buffer.from(attachment.split(',')[1], 'base64');
  }

  // Encode replacement reason as JSON
  const replacement_reason_json = JSON.stringify(replacement_reason || []);

  const query = `
    INSERT INTO photo_card_application (
      customer_number,
      attachment,
      application_type,
      new_application_duration,
      replacement_reason,
      applicants_surname,
      applicants_givenname,
      liscence_CRN_number,
      applicants_date_of_birth,
      Gender,
      applicants_residential_address,
      residential_postcode,
      applicants_mailing_address,
      mailing_postcode,
      applicants_emailadd,
      applicants_mobile_number,
      pensioner,
      permanent_resident,
      non_permanent_resident_entry_date,
      have_had_nsw_liscence_photocard_registration_permit,
      nsw_liscence_photocard_registration_permit_details,
      nsw_liscence_number_change_due_to_data_breach,
      applicants_signature,
      applicants_signature_date
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
      $21, $22, $23, $24
    )
  `;

  const values = [
    customer_number,
    attachmentBuffer,
    application_type,
    new_application_duration,
    replacement_reason_json,
    applicants_surname,
    applicants_givenname,
    liscence_CRN_number,
    applicants_date_of_birth,
    Gender,
    applicants_residential_address,
    residential_postcode,
    applicants_mailing_address,
    mailing_postcode,
    applicants_emailadd,
    applicants_mobile_number,
    pensioner,
    permanent_resident,
    non_permanent_resident_entry_date || null,
    have_had_nsw_liscence_photocard_registration_permit,
    nsw_liscence_photocard_registration_permit_details,
    nsw_liscence_number_change_due_to_data_breach,
    signatureBuffer,
    applicants_signature_date,
  ];

  try {
    await pool.query(query, values);
    res.status(200).send(`
      <script>
        alert('Form submitted successfully!');
        setTimeout(function() {
          window.location.href = './index.html';
        }, 5000);
      </script>
    `);
  } catch (err) {
    console.error('DB Insert Error:', err);
    res.status(500).send("Query Failed: " + err.message);
  }
});

// Fallback for GET
app.get('/*', function(req, res) {
  res.redirect('/');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});