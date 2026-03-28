// Displays a full-width hero banner at the top of the book list page.
export default function WelcomeBand() {
  return (
    <div className="row mb-3">
      <div className="col">
        <div className="p-3 rounded-3 bg-primary text-white">
          <h1 className="h2">Bookstore</h1>
          <p className="mb-0">Filter categories, add to shopping cart, and checkout.</p>
        </div>
      </div>
    </div>
  );
}
