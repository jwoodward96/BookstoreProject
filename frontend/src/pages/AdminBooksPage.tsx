import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Book } from "../types/book";
import { apiUrl } from "../api";

type BookFormState = {
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  category: string;
  pageCount: string;
  price: string;
};

const emptyForm: BookFormState = {
  title: "",
  author: "",
  publisher: "",
  isbn: "",
  category: "",
  pageCount: "",
  price: "",
};

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [formState, setFormState] = useState<BookFormState>(emptyForm);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void loadBooks();
  }, []);

  async function loadBooks() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl("/api/book"));
      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.status}`);
      }

      const data: Book[] = await response.json();
      setBooks(data);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Unable to load books right now.");
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setFormState(emptyForm);
    setEditingBookId(null);
  }

  function startEdit(book: Book) {
    setFormState({
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      isbn: book.isbn,
      category: book.category,
      pageCount: String(book.pageCount),
      price: String(book.price),
    });
    setEditingBookId(book.bookID);
    setMessage(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setError(null);

    const payload = {
      title: formState.title.trim(),
      author: formState.author.trim(),
      publisher: formState.publisher.trim(),
      isbn: formState.isbn.trim(),
      category: formState.category.trim(),
      pageCount: Number(formState.pageCount),
      price: Number(formState.price),
    };

    try {
      const response = await fetch(editingBookId === null ? apiUrl("/api/book") : apiUrl(`/api/book/${editingBookId}`),
        {
          method: editingBookId === null ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Save failed: ${response.status}`);
      }

      await loadBooks();
      setMessage(editingBookId === null ? "Book added successfully." : "Book updated successfully.");
      resetForm();
    } catch (saveError) {
      console.error(saveError);
      setError("Unable to save the book. Check the values and try again.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(book: Book) {
    const confirmed = window.confirm(`Delete \"${book.title}\"?`);
    if (!confirmed) {
      return;
    }

    setMessage(null);
    setError(null);

    try {
      const response = await fetch(apiUrl(`/api/book/${book.bookID}`), {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }

      if (editingBookId === book.bookID) {
        resetForm();
      }

      setBooks((currentBooks) => currentBooks.filter((currentBook) => currentBook.bookID !== book.bookID));
      setMessage("Book deleted successfully.");
    } catch (deleteError) {
      console.error(deleteError);
      setError("Unable to delete the book right now.");
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="mb-1">Admin Books</h1>
          <p className="text-muted mb-0">Add, update, and delete books in the bookstore database.</p>
        </div>
        <span className="badge bg-dark fs-6">{books.length} books</span>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h4 mb-0">{editingBookId === null ? "Add Book" : "Edit Book"}</h2>
                {editingBookId !== null && (
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={resetForm}>
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-12">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input id="title" className="form-control" value={formState.title} onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))} required />
                </div>

                <div className="col-12">
                  <label htmlFor="author" className="form-label">Author</label>
                  <input id="author" className="form-control" value={formState.author} onChange={(event) => setFormState((current) => ({ ...current, author: event.target.value }))} required />
                </div>

                <div className="col-12">
                  <label htmlFor="publisher" className="form-label">Publisher</label>
                  <input id="publisher" className="form-control" value={formState.publisher} onChange={(event) => setFormState((current) => ({ ...current, publisher: event.target.value }))} required />
                </div>

                <div className="col-12">
                  <label htmlFor="isbn" className="form-label">ISBN</label>
                  <input id="isbn" className="form-control" value={formState.isbn} onChange={(event) => setFormState((current) => ({ ...current, isbn: event.target.value }))} required />
                </div>

                <div className="col-12">
                  <label htmlFor="category" className="form-label">Category</label>
                  <input id="category" className="form-control" value={formState.category} onChange={(event) => setFormState((current) => ({ ...current, category: event.target.value }))} required />
                </div>

                <div className="col-md-6">
                  <label htmlFor="pageCount" className="form-label">Pages</label>
                  <input id="pageCount" type="number" min={1} className="form-control" value={formState.pageCount} onChange={(event) => setFormState((current) => ({ ...current, pageCount: event.target.value }))} required />
                </div>

                <div className="col-md-6">
                  <label htmlFor="price" className="form-label">Price</label>
                  <input id="price" type="number" min={0} step="0.01" className="form-control" value={formState.price} onChange={(event) => setFormState((current) => ({ ...current, price: event.target.value }))} required />
                </div>

                <div className="col-12 d-grid">
                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    {isSaving ? "Saving..." : editingBookId === null ? "Add Book" : "Update Book"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="h4 mb-3">Current Inventory</h2>

              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Category</th>
                      <th>ISBN</th>
                      <th className="text-end">Pages</th>
                      <th className="text-end">Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4">Loading books...</td>
                      </tr>
                    ) : books.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4">No books found.</td>
                      </tr>
                    ) : (
                      books.map((book) => (
                        <tr key={book.bookID}>
                          <td>
                            <div className="fw-semibold">{book.title}</div>
                            <div className="text-muted small">{book.publisher}</div>
                          </td>
                          <td>{book.author}</td>
                          <td>{book.category}</td>
                          <td>{book.isbn}</td>
                          <td className="text-end">{book.pageCount}</td>
                          <td className="text-end">${book.price.toFixed(2)}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => startEdit(book)}>
                                Edit
                              </button>
                              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => void handleDelete(book)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}