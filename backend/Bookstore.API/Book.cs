using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

// Represents a single book record stored in the database.
// Data annotations are used to enforce validation and define the primary key.
public class Book
{
    // Primary key for the Books table; auto-incremented by the database.
    [Key]
    public int BookID { get; set; }

    // The title of the book.
    [Required]
    public string Title { get; set; } = string.Empty;

    // The author of the book.
    [Required]
    public string Author { get; set; } = string.Empty;

    // The publisher of the book.
    [Required]
    public string Publisher { get; set; } = string.Empty;

    // The ISBN identifier used to uniquely identify the book.
    [Required]
    public string ISBN { get; set; } = string.Empty;

    // The genre or subject category the book belongs to (e.g. Fiction, Science).
    [Required]
    public string Category { get; set; } = string.Empty;

    // The provided SQLite database also requires a Classification column.
    // Keep it aligned with Category so the frontend still works with one field.
    [JsonIgnore]
    public string Classification { get; set; } = string.Empty;

    // The total number of pages in the book.
    [Required]
    public int PageCount { get; set; }

    // The retail price of the book in USD.
    [Required]
    public double Price { get; set; }
}