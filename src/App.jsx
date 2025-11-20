import { Button, Heading } from "@radix-ui/themes";
import { Book, Plus } from "lucide-react";
import { useState } from "react";
import AddBookDialog from "./components/AddBookDialog";
import BooksTable from "./components/BooksTable";
const App = () => {
  const [addBookOpen, setAddBookOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-50 font-[poppins]">
      <div>
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white p-2 rounded-lg">
                  <Book className="h-[40px] w-[40px]" />
                </div>
                <div>
                  <Heading className="text-gray-900 !text-[20px] !font-[500] !pt-0">
                    Library Management System
                  </Heading>
                  <p className="text-sm text-gray-500">
                    Manage your library efficiently
                  </p>
                </div>
              </div>
              <Button
                color="indigo"
                size="3"
                radius="small"
                onClick={() => setAddBookOpen(true)}
                className="cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Book
              </Button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[40px]">
          <BooksTable />
        </main>
      </div>
      <AddBookDialog open={addBookOpen} onOpenChange={setAddBookOpen} />
      {/* <Toaster /> */}
    </div>
  );
};
export default App;
