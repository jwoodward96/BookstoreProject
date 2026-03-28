using Microsoft.EntityFrameworkCore;

namespace Bookstore.API.Data
{
    // Entity Framework Core DbContext for the Bookstore application.
    // Acts as the bridge between the application and the SQLite database.
    public class BookstoreContext : DbContext
    {
        // Constructor accepts EF Core configuration options (e.g. the connection string).
        public BookstoreContext(DbContextOptions<BookstoreContext> options)
            : base(options)
        {
        }

        // Represents the Books table; used to query and save Book records.
        public DbSet<Book> Books { get; set; }
    }
}