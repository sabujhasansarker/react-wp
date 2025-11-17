import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
function App() {
  const books = [
    {
      id: 1,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "978-0-06-112008-4",
      year: 1960,
      genre: "Fiction",
      copies: 3,
      cover: "/to-kill-a-mockingbird-cover.png",
    },
    {
      id: 2,
      title: "1984",
      author: "George Orwell",
      isbn: "978-0-452-26249-2",
      year: 1949,
      genre: "Dystopian",
      copies: 2,
      cover: "/1984-orwell-book-cover.jpg",
    },
  ];
  const [searchTerm, setSearchTerm] = useState("");
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="font-[poppins] py-[100px]">
      <h2 className="text-[40px] text-center font-[500]">Book Lists</h2>
      <div className="overflow-x-auto rounded-lg border border-border bg-card mt-[40px] bg-white">
        <table className="w-full ">
          <thead>
            <tr className="border-b border-border bg-secondary/10">
              <th className="px-6 py-4 text-left text-sm font-[600] text-foreground">
                #id
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Image
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Title
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Author
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Genre
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                ISBN
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Copies
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <tr
                  key={book.id}
                  className="border-b border-border transition-colors hover:bg-secondary/5"
                >
                  <td className="px-6 py-4 text-sm text-gray-500 font-[600] text-foreground">
                    #{book.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    <img src={book.cover} alt={book.title} />
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {book.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {book.author}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {book.genre}
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                    {book.isbn}
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground text-center">
                    {book.copies}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <button className="gap-2">
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      <button className="gap-2">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  No books found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-[20px] grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4 bg-white">
          <p className="text-sm text-muted-foreground">Total Books</p>
          <p className="text-2xl font-bold text-foreground">{books.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 bg-white">
          <p className="text-sm text-muted-foreground">Total Copies</p>
          <p className="text-2xl font-bold text-foreground">
            {books.reduce((sum, b) => sum + b.copies, 0)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 bg-white">
          <p className="text-sm text-muted-foreground">Available Now</p>
          <p className="text-2xl font-bold text-foreground">
            {books.reduce((sum, b) => sum + b.available, 0)}
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 bg-white">
          <p className="text-sm text-muted-foreground">Average Rating</p>
          <p className="text-2xl font-bold text-foreground">
            {(
              books.reduce((sum, b) => sum + b.rating, 0) / books.length
            ).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
