import {
  BookOpen,
  Check,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    copies: 0,
  });
  const [error, setError] = useState(null);

  const wpData = window.wpReactData || {};
  const apiUrl = wpData.apiUrl;
  const nonce = wpData.nonce || "";

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/list`, {
        headers: {
          "X-WP-Nonce": nonce,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch books");

      const result = await response.json();
      result && setBooks(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (formData.title && formData.author) {
      try {
        const response = await fetch(`${apiUrl}/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": nonce,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to create book");

        await fetchBooks();
        setFormData({ title: "", author: "", genre: "", copies: 0 });
        setIsAdding(false);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error creating book:", err);
      }
    }
  };

  const handleEdit = (book) => {
    setEditingId(book.id);
    setFormData({
      title: book.title,
      author: book.author,
      genre: book.genre || "",
      copies: book.copies || 0,
    });
  };

  const handleUpdate = async () => {
    if (formData.title && formData.author) {
      try {
        const response = await fetch(`${apiUrl}/update/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-WP-Nonce": nonce,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Failed to update book");

        await fetchBooks();
        setEditingId(null);
        setFormData({ title: "", author: "", genre: "", copies: 0 });
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error updating book:", err);
      }
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        const response = await fetch(`${apiUrl}/delete/${id}`, {
          method: "DELETE",
          headers: {
            "X-WP-Nonce": nonce,
          },
        });

        if (!response.ok) throw new Error("Failed to delete book");

        await fetchBooks();
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error deleting book:", err);
      }
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: "", author: "", genre: "", copies: 0 });
    setError(null);
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-poppins">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-white" />
                <div>
                  <h1 className="text-3xl font-bold text-white font-poppins">
                    {wpData.page_title || "Book Management"}
                  </h1>
                  <p className="text-indigo-100 text-sm mt-1">
                    Manage your library collection
                  </p>
                </div>
              </div>
              {!isAdding && !editingId && (
                <button
                  onClick={() => setIsAdding(true)}
                  className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-poppins"
                >
                  <Plus size={20} />
                  Add New Book
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 px-8 py-4">
              <p className="text-red-700 font-poppins">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}

          {/* Add Form */}
          {isAdding && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-200 px-8 py-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 font-poppins">
                Add New Book
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <input
                  type="text"
                  placeholder="Book Title *"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-poppins"
                />
                <input
                  type="text"
                  placeholder="Author *"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-poppins"
                />
                <input
                  type="text"
                  placeholder="Genre"
                  value={formData.genre}
                  onChange={(e) =>
                    setFormData({ ...formData, genre: e.target.value })
                  }
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-poppins"
                />
                <input
                  type="number"
                  placeholder="Copies"
                  value={formData.copies}
                  onChange={(e) =>
                    setFormData({ ...formData, copies: e.target.value })
                  }
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-poppins"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAdd}
                    className="flex-1 bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-poppins"
                  >
                    <Check size={18} />
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-xl hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-poppins"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider font-poppins">
                    ID
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider font-poppins">
                    Title
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider font-poppins">
                    Author
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider font-poppins">
                    Genre
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider font-poppins">
                    Copies
                  </th>
                  <th className="px-8 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider font-poppins">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books &&
                  books.map((book) => (
                    <tr key={book.id} className="hover:bg-gray-50 transition">
                      {editingId === book.id ? (
                        <>
                          <td className="px-8 py-4 text-sm text-gray-500 font-poppins">
                            #{book.id}
                          </td>
                          <td className="px-8 py-4">
                            <input
                              type="text"
                              value={formData.title}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  title: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-poppins"
                            />
                          </td>
                          <td className="px-8 py-4">
                            <input
                              type="text"
                              value={formData.author}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  author: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-poppins"
                            />
                          </td>
                          <td className="px-8 py-4">
                            <input
                              type="text"
                              value={formData.genre}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  genre: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-poppins"
                            />
                          </td>
                          <td className="px-8 py-4">
                            <input
                              type="number"
                              value={formData.copies}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  copies: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-poppins"
                            />
                          </td>
                          <td className="px-8 py-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={handleUpdate}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-1 font-poppins"
                              >
                                <Check size={16} />
                                Save
                              </button>
                              <button
                                onClick={handleCancel}
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition flex items-center gap-1 font-poppins"
                              >
                                <X size={16} />
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-8 py-4 text-sm text-gray-500 font-poppins">
                            #{book.id}
                          </td>
                          <td className="px-8 py-4 text-sm font-medium text-gray-900 font-poppins">
                            {book.title}
                          </td>
                          <td className="px-8 py-4 text-sm text-gray-600 font-poppins">
                            {book.author}
                          </td>
                          <td className="px-8 py-4">
                            <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 font-poppins">
                              {book.genre || "N/A"}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-sm text-gray-600 font-poppins">
                            {book.copies}
                          </td>
                          <td className="px-8 py-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEdit(book)}
                                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition shadow hover:shadow-lg"
                                title="Edit"
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(book.id)}
                                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition shadow hover:shadow-lg"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
              </tbody>
            </table>

            {books.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-poppins">
                  No books available. Click "Add New Book" to get started.
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 font-poppins">
              Total Books:{" "}
              <span className="font-bold text-indigo-600">{books.length}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
