using Microsoft.AspNetCore.Mvc;
using Bookstore.API.Data;

namespace Bookstore.API.Controllers
{
    // API controller that handles HTTP requests for book data.
    // All routes are prefixed with /api/book.
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookstoreContext _context;

        // Constructor — EF Core DbContext is injected by the DI container.
        public BookController(BookstoreContext context)
        {
            _context = context;
        }

        // GET /api/book
        // Returns the full list of all books in the database.
        [HttpGet]
        public IEnumerable<Book> Get()
        {
            return _context.Books.ToList();
        }

        // GET /api/book/{id}
        // Returns a single book by its BookID, or 404 Not Found if it doesn't exist.
        [HttpGet("{id}")]
        public ActionResult<Book> GetById(int id)
        {
            var book = _context.Books.Find(id);
            if (book == null) return NotFound();
            return book;
        }
    }
}
