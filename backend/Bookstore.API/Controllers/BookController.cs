using Microsoft.AspNetCore.Mvc;
using Bookstore.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Bookstore.API.Controllers
{
    // API controller that handles HTTP requests for book data.
    // All routes are prefixed with /api/book.
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly BookstoreContext _context;

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
            return _context.Books
                .AsNoTracking()
                .OrderBy(book => book.Title)
                .ToList();
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

        // POST /api/book
        // Creates a new book record and returns the saved entity.
        [HttpPost]
        public ActionResult<Book> Create([FromBody] Book book)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            book.BookID = 0;
            book.Classification = string.IsNullOrWhiteSpace(book.Category)
                ? string.Empty
                : book.Category;
            _context.Books.Add(book);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetById), new { id = book.BookID }, book);
        }

        // PUT /api/book/{id}
        // Updates an existing book record.
        [HttpPut("{id}")]
        public ActionResult<Book> Update(int id, [FromBody] Book updatedBook)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var existingBook = _context.Books.Find(id);
            if (existingBook == null)
            {
                return NotFound();
            }

            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.ISBN = updatedBook.ISBN;
            existingBook.Category = updatedBook.Category;
            existingBook.Classification = string.IsNullOrWhiteSpace(updatedBook.Category)
                ? existingBook.Classification
                : updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            _context.SaveChanges();

            return Ok(existingBook);
        }

        // DELETE /api/book/{id}
        // Removes an existing book record.
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var book = _context.Books.Find(id);
            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
