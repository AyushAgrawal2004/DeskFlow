<?php
session_start();
include 'dbconnect.php';

// Check if user is logged in and is admin
if (!isset($_SESSION['username']) || $_SESSION['position'] != 'admin') {
    header("Location: login.php");
    exit();
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $desk_no = mysqli_real_escape_string($conn, $_POST['desk_no']);
    $rent_per_hour = floatval($_POST['rent_per_hour']);
    $status = mysqli_real_escape_string($conn, $_POST['status']);

    // Check if desk number already exists
    $check_query = "SELECT id FROM desks WHERE desk_no = ?";
    $stmt = mysqli_prepare($conn, $check_query);
    mysqli_stmt_bind_param($stmt, "s", $desk_no);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if (mysqli_num_rows($result) > 0) {
        $_SESSION['error'] = "Desk number already exists!";
        header("Location: manage_desks.php");
        exit();
    }

    // Insert new desk
    $insert_query = "INSERT INTO desks (desk_no, rent_per_hour, status) VALUES (?, ?, ?)";
    $stmt = mysqli_prepare($conn, $insert_query);
    mysqli_stmt_bind_param($stmt, "sds", $desk_no, $rent_per_hour, $status);

    if (mysqli_stmt_execute($stmt)) {
        $_SESSION['success'] = "Desk added successfully!";
    } else {
        $_SESSION['error'] = "Error adding desk: " . mysqli_error($conn);
    }

    header("Location: manage_desks.php");
    exit();
} else {
    header("Location: manage_desks.php");
    exit();
} 