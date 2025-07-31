<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name     = htmlspecialchars($_POST['name']);
    $email    = htmlspecialchars($_POST['email']);
    $address  = htmlspecialchars($_POST['address']);
    $feedback = htmlspecialchars($_POST['feedback']);
    $problem  = htmlspecialchars($_POST['problem']);

    // Save to a file (you can also send it via email or insert into database)
    $data = "Name: $name\nEmail: $email\nAddress: $address\nFeedback: $feedback\nProblem: $problem\n\n";
    file_put_contents("form_submissions.txt", $data, FILE_APPEND);

    echo "Thank you for contacting us!";
}
?>