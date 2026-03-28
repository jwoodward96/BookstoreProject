using System.ComponentModel.DataAnnotations;

// Represents a single book record stored in the database.
// Data annotations are used to enforce validation and define the primary key.
public class Book
{
    // Primary key for the Books table; auto-incremented by the database.
    [Key]
    public int BookID { get; set; }

    // The title of the book.
    [Required]
    public string Title { get; set; }

    // The author of the book.
    [Required]
    public string Author { get; set; }

    // The publisher of the book.
    [Required]
    public string Publisher { get; set; }

    // The ISBN identifier used to uniquely identify the book.
    [Required]
    public string ISBN { get; set; }

    // The genre or subject category the book belongs to (e.g. Fiction, Science).
    [Required]
    public string Category { get; set; }

    // The total number of pages in the book.
    [Required]
    public int PageCount { get; set; }

    // The retail price of the book in USD.
    [Required]
    public double Price { get; set; }
}