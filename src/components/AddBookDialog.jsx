import {
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";

const AddBookDialog = ({ open, onOpenChange, bookToEdit = null }) => {
  const wpData = window.wpReactData || {};
  const apiUrl = wpData.apiUrl;
  const nonce = wpData.nonce || "";
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: "",
    copies: "",
    cover_image: "",
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [tempImage, setTempImage] = useState(null);

  useEffect(() => {
    if (bookToEdit) {
      setFormData({
        title: bookToEdit.title || "",
        author: bookToEdit.author || "",
        genre: bookToEdit.genre || "",
        copies: bookToEdit.copies || "",
        cover_image: bookToEdit.cover_image || "",
      });
      setPreviewUrl(bookToEdit.cover_image || "");
    } else if (!open) {
      // Reset form when dialog closes
      setFormData({
        title: "",
        author: "",
        genre: "",
        copies: "",
        cover_image: "",
      });
      setPreviewUrl(null);
    }
  }, [bookToEdit, open]);

  // Apply temp image when available
  useEffect(() => {
    if (tempImage) {
      setFormData((prev) => ({ ...prev, cover_image: tempImage }));
      setPreviewUrl(tempImage);
      console.log("Applied temp image:", tempImage);
    }
  }, [tempImage]);

  const { title, author, genre, copies } = formData;

  const openMediaLibrary = () => {
    // Check if wp.media is available
    if (typeof wp !== "undefined" && wp.media) {
      const mediaUploader = wp.media({
        title: "Select Book Cover",
        button: {
          text: "Use this image",
        },
        multiple: false,
        library: {
          type: "image",
        },
      });

      mediaUploader.on("select", function () {
        const attachment = mediaUploader
          .state()
          .get("selection")
          .first()
          .toJSON();
        const imageUrl = attachment.url;

        console.log("Image selected:", imageUrl);

        // Update immediately
        setTempImage(imageUrl);
        setFormData((prev) => ({ ...prev, cover_image: imageUrl }));
        setPreviewUrl(imageUrl);
      });

      mediaUploader.open();
    } else {
      console.error("wp.media is not available");
      document.getElementById("fileInput").click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setFormData({ ...formData, cover_image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !author || !genre || !copies) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": nonce,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save book");

      const result = await response.json();
      alert(
        bookToEdit ? "Book updated successfully!" : "Book added successfully!"
      );
      onOpenChange(false);

      // Reset form
      setFormData({
        title: "",
        author: "",
        genre: "",
        copies: "",
        cover_image: "",
      });
      setPreviewUrl(null);

      // Trigger refresh if you have a callback
      if (window.refreshBooksList) {
        window.refreshBooksList();
      }
    } catch (error) {
      console.error("Error saving book:", error);
      alert("Failed to save book. Please try again.");
    }
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content maxWidth="520px">
          <Dialog.Title>
            {bookToEdit ? "Edit Book" : "Add New Book"}
          </Dialog.Title>
          <Dialog.Description size="2" mb="4">
            {bookToEdit
              ? "Update the book information below."
              : "Add a new book to the library inventory. Fill in all the required information."}
          </Dialog.Description>

          <Flex direction="column" gap="4">
            <Flex direction="column" gap="2">
              <Text as="label" size="2" weight="bold" htmlFor="title">
                Book Title *
              </Text>
              <TextField.Root
                id="title"
                value={title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter book title"
              />
            </Flex>

            <Flex direction="column" gap="2">
              <Text as="label" size="2" weight="bold" htmlFor="author">
                Author *
              </Text>
              <TextField.Root
                value={author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                id="author"
                placeholder="Enter author name"
              />
            </Flex>

            <Flex direction="column" gap="2">
              <Text as="label" size="2" weight="bold">
                Genre *
              </Text>
              <Select.Root
                value={genre}
                onValueChange={(value) =>
                  setFormData({ ...formData, genre: value })
                }
              >
                <Select.Trigger placeholder="Select a category" />
                <Select.Content>
                  <Select.Item value="Fiction">Fiction</Select.Item>
                  <Select.Item value="Non-Fiction">Non-Fiction</Select.Item>
                  <Select.Item value="Technology">Technology</Select.Item>
                  <Select.Item value="Science">Science</Select.Item>
                  <Select.Item value="History">History</Select.Item>
                  <Select.Item value="Biography">Biography</Select.Item>
                  <Select.Item value="Children">Children</Select.Item>
                  <Select.Item value="Reference">Reference</Select.Item>
                </Select.Content>
              </Select.Root>
            </Flex>

            <Flex direction="column" gap="2">
              <Text as="label" size="2" weight="bold" htmlFor="copies">
                Total Copies *
              </Text>
              <TextField.Root
                id="copies"
                type="number"
                placeholder="Enter number of copies"
                variant="surface"
                value={copies}
                onChange={(e) =>
                  setFormData({ ...formData, copies: e.target.value })
                }
              />
            </Flex>

            <Flex direction="column" gap="2">
              <Text as="label" size="2" weight="bold">
                Book Cover
              </Text>
            </Flex>

            <Flex direction="column" gap="3" align="start">
              <div
                style={{
                  width: "130px",
                  height: "160px",
                  border: "2px dashed #d1d5db",
                  borderRadius: "8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backgroundColor: "#f9fafb",
                  position: "relative",
                  overflow: "hidden",
                }}
                onClick={openMediaLibrary}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Book cover preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <>
                    <Upload size={32} color="#9ca3af" />
                    <Text size="2" color="gray" style={{ marginTop: "8px" }}>
                      No cover
                    </Text>
                  </>
                )}
              </div>
              {/* Fallback file input */}
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </Flex>

            <Flex gap="3" mt="4" justify="end">
              <Button
                variant="soft"
                color="gray"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                style={{ backgroundColor: "#000", color: "#fff" }}
                onClick={handleSubmit}
              >
                {bookToEdit ? "Update Book" : "Add Book"}
              </Button>
            </Flex>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export default AddBookDialog;
