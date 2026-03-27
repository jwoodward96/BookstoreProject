type CategoryFilterProps = {
  categories: string[];
  selectedCategory: string;
  onChange: (category: string) => void;
};

export default function CategoryFilter({ categories, selectedCategory, onChange }: CategoryFilterProps) {
  return (
    <div className="mb-3">
      <label htmlFor="category" className="form-label fw-bold">
        Filter by category:
      </label>
      <select
        id="category"
        className="form-select"
        value={selectedCategory}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filter by book category"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}
