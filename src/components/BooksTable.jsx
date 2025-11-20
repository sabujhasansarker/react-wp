import { Badge, Button, Table } from "@radix-ui/themes";
import { BookOpen, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import AddBookDialog from "./AddBookDialog"; // Import the dialog
import ImageWithFallback from "./ImageWithFallback";

const BooksTable = () => {
  const wpData = window.wpReactData || {};
  const apiUrl = wpData.apiUrl;
  const nonce = wpData.nonce || "";
  const [books, setBooks] = useState([]);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${apiUrl}/list`, {
        headers: {
          "X-WP-Nonce": nonce,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch books");

      const result = await response.json();
      result && setBooks(result.data);
    } catch (err) {
      console.error("Error fetching books:", err);
    }
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setDialogOpen(true);
  };

  const handleDeleteClick = (book) => {
    console.log("Delete book:", book);
  };
  return (
    <>
      <AddBookDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        bookToEdit={selectedBook}
      />

      {/* Table */}
      <Table.Root className="font-[poppins]" variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell className="w-[80px]">
              Cover
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Author</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Genre</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Copies</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Created at</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="w-[150px]">
              Actions
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {books.length <= 0 && (
            <Table.Row>
              <Table.Cell colSpan={8} className="text-center text-gray-500">
                No books found
              </Table.Cell>
            </Table.Row>
          )}
          {books.map((book) => (
            <Table.Row key={book.id} align={"center"}>
              <Table.Cell>
                <div className="w-12 h-16 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                  {book.cover_image ? (
                    <ImageWithFallback
                      src={book.cover_image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="h-6 w-6 text-gray-400" />
                  )}
                </div>
              </Table.Cell>
              <Table.Cell>{book.title}</Table.Cell>
              <Table.Cell className="text-gray-600">{book.author}</Table.Cell>
              <Table.Cell>
                <Badge size="3" radius="full">
                  {book.genre || "N/A"}
                </Badge>
              </Table.Cell>
              <Table.Cell className="text-gray-600">{book.copies}</Table.Cell>
              <Table.Cell className="text-gray-600">
                {book.created_at}
              </Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  <Button
                    className="cursor-pointer"
                    color="indigo"
                    variant="soft"
                    size="sm"
                    radius="sm"
                    onClick={() => handleEdit(book)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    color="crimson"
                    variant="soft"
                    size="sm"
                    onClick={() => handleDeleteClick(book)}
                    className="cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  );
};

export default BooksTable;
