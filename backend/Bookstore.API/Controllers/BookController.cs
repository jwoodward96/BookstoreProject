using Microsoft.AspNetCore.Mvc;
using Bookstore.API.Data;

namespace Bookstore.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookstoreContext _context;

        public BookController(BookstoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Book> Get()
        {
            return _context.Books.ToList();
        }
    }
}
