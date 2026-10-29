<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Database Configuration & Connection (PDO)
 * File: config/database.php
 */

class Database {
    private string $host = '127.0.0.1';
    private string $db_name = 'scholarship_recommendation_db';
    private string $username = 'root';
    private string $password = '';
    private int $port = 3306;
    private ?PDO $conn = null;

    public function getConnection(): ?PDO {
        if ($this->conn !== null) {
            return $this->conn;
        }

        $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->db_name};charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ];

        try {
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            // In development, error message can be inspected; in production, log to file
            error_log("Database Connection Failed: " . $e->getMessage());
            die("Database Connection Error. Please verify XAMPP MySQL is active and database is imported.");
        }

        return $this->conn;
    }
}

// Global helper to obtain connection quickly
function getDB(): PDO {
    static $dbInstance = null;
    if ($dbInstance === null) {
        $database = new Database();
        $dbInstance = $database->getConnection();
    }
    return $dbInstance;
}
?>
