import { useEffect, useState, useContext } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "notistack";
import { BrowserMultiFormatReader } from "@zxing/browser";
import Page from "../../components/Page";
import api from "../../utils/axios";
import { AuthContext } from "../../context/AuthContext";

export default function Library() {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const canManage = ["admin", "hod", "director", "faculty"].includes(user?.roleName);

  const [tab, setTab] = useState(0);
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [scanCode, setScanCode] = useState("");
  const [openCamera, setOpenCamera] = useState(false);
  const [openAddBook, setOpenAddBook] = useState(false);
  const [issueBookTarget, setIssueBookTarget] = useState(null);
  const [bookForm, setBookForm] = useState({ title: "", author: "", isbn: "", category: "Social Work", totalCopies: 1 });
  const [issueForm, setIssueForm] = useState({ studentName: "", studentEmail: "", dueDate: "" });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/library/books", { params: { search: search.trim() || undefined } });
      setBooks(res.data?.data?.books || []);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchIssues = async () => {
    try {
      const res = await api.get("/library/issues");
      setIssues(res.data?.data?.issues || []);
    } catch {
      setIssues([]);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search]);

  useEffect(() => {
    if (canManage && tab === 1) fetchIssues();
  }, [tab, canManage]);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await api.post("/library/books", bookForm);
      enqueueSnackbar("Book added to catalog", { variant: "success" });
      setOpenAddBook(false);
      setBookForm({ title: "", author: "", isbn: "", category: "Social Work", totalCopies: 1 });
      fetchBooks();
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Failed to add book", { variant: "error" });
    }
  };

  const handleIssueBook = async (e) => {
    e.preventDefault();
    try {
      await api.post("/library/issues", { bookId: issueBookTarget._id, ...issueForm });
      enqueueSnackbar("Book issued", { variant: "success" });
      setIssueBookTarget(null);
      setIssueForm({ studentName: "", studentEmail: "", dueDate: "" });
      fetchBooks();
      fetchIssues();
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Failed to issue book", { variant: "error" });
    }
  };

  const handleReturnBook = async (issueId) => {
    try {
      await api.patch(`/library/issues/${issueId}/return`);
      enqueueSnackbar("Book returned", { variant: "success" });
      fetchBooks();
      fetchIssues();
    } catch {
      enqueueSnackbar("Failed to return book", { variant: "error" });
    }
  };

  const processScannedCode = (rawCode) => {
    const code = rawCode.trim();
    if (!code) return;
    const matchedBook = books.find(
      (b) => b.isbn?.toLowerCase() === code.toLowerCase() || b._id === code
    );
    if (!matchedBook) {
      setBookForm({ title: "", author: "", isbn: code, category: "Social Work", totalCopies: 1 });
      setOpenAddBook(true);
      enqueueSnackbar(`New serial "${code}" — fill details to add book`, { variant: "info" });
    } else if (matchedBook.availableCopies > 0) {
      setIssueBookTarget(matchedBook);
      enqueueSnackbar(`Found "${matchedBook.title}" — ready to issue`, { variant: "success" });
    } else {
      setTab(1);
      fetchIssues();
      enqueueSnackbar(`"${matchedBook.title}" has 0 copies available — mark a copy returned`, { variant: "warning" });
    }
    setScanCode("");
  };

  const handleScanSubmit = (e) => {
    e.preventDefault();
    processScannedCode(scanCode);
  };

  useEffect(() => {
    if (!openCamera) return;
    const codeReader = new BrowserMultiFormatReader();
    let controls;

    const startCamera = async () => {
      try {
        const video = document.getElementById("library-scanner-video");
        if (!video) return;
        controls = await codeReader.decodeFromVideoDevice(undefined, video, (result) => {
          if (result) {
            const text = result.getText();
            if (controls) controls.stop();
            setOpenCamera(false);
            processScannedCode(text);
          }
        });
      } catch {
        enqueueSnackbar("Unable to access camera. Check browser permissions.", { variant: "error" });
        setOpenCamera(false);
      }
    };

    startCamera();
    return () => {
      if (controls) controls.stop();
    };
  }, [openCamera]);

  return (
    <Page title="Library">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} mb={3}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Library Information Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Search the institutional book catalog and check real-time availability
            </Typography>
          </Box>
          {canManage && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAddBook(true)}>
              Add Book
            </Button>
          )}
        </Stack>

        {canManage && (
          <Card sx={{ mb: 2.5 }}>
            <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
              <form onSubmit={handleScanSubmit}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems={{ sm: "center" }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Scan or enter book serial / ISBN and press Enter..."
                    value={scanCode}
                    onChange={(e) => setScanCode(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <QrCodeScannerIcon fontSize="small" color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button type="submit" variant="outlined" sx={{ whiteSpace: "nowrap" }}>
                    Lookup
                  </Button>
                  <Button
                    type="button"
                    variant="contained"
                    startIcon={<QrCodeScannerIcon />}
                    onClick={() => setOpenCamera(true)}
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    Scan Camera
                  </Button>
                </Stack>
              </form>
            </CardContent>
          </Card>
        )}

        {canManage && (
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="Book Catalog" />
            <Tab label="Issued Books" />
          </Tabs>
        )}

        {tab === 0 ? (
          <>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Search by title, author, or ISBN..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </CardContent>
            </Card>

            {loading ? (
              <Box display="flex" justifyContent="center" py={6}>
                <CircularProgress />
              </Box>
            ) : books.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: "center", py: 6 }}>
                  <MenuBookOutlinedIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
                  <Typography variant="h6" color="text.secondary">
                    No books found
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Add books to the catalog or try a different search term.
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={2.5}>
                {books.map((book) => (
                  <Grid item xs={12} sm={6} md={4} key={book._id}>
                    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1} mb={1}>
                          <Typography variant="h6" fontWeight={700}>
                            {book.title}
                          </Typography>
                          <Chip
                            size="small"
                            label={book.availableCopies > 0 ? "Available" : "Out of Stock"}
                            color={book.availableCopies > 0 ? "success" : "error"}
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary" mb={0.5}>
                          by {book.author}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" display="block">
                          {book.category} {book.isbn ? `• ISBN: ${book.isbn}` : ""}
                        </Typography>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
                          <Typography variant="caption" color="primary.main" fontWeight={600}>
                            {book.availableCopies} / {book.totalCopies} available
                          </Typography>
                          {canManage && book.availableCopies > 0 && (
                            <Button size="small" variant="outlined" onClick={() => setIssueBookTarget(book)}>
                              Issue
                            </Button>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        ) : (
          <Stack spacing={2}>
            {issues.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: "center", py: 5 }}>
                  <Typography color="text.secondary">No issued books recorded yet.</Typography>
                </CardContent>
              </Card>
            ) : (
              issues.map((issue) => (
                <Card key={issue._id}>
                  <CardContent>
                    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={1}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={700}>
                          {issue.book?.title || "Book"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Issued to: {issue.studentName} ({issue.studentEmail}) • Due: {new Date(issue.dueDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip size="small" label={issue.status} color={issue.status === "Issued" ? "warning" : "success"} />
                        {issue.status === "Issued" && (
                          <Button size="small" variant="contained" onClick={() => handleReturnBook(issue._id)}>
                            Mark Returned
                          </Button>
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))
            )}
          </Stack>
        )}

        <Dialog open={openCamera} onClose={() => setOpenCamera(false)} fullWidth maxWidth="xs">
          <DialogTitle>Scan Book Barcode / QR</DialogTitle>
          <DialogContent>
            <Box sx={{ width: "100%", borderRadius: 2, overflow: "hidden", bgcolor: "black" }}>
              <video id="library-scanner-video" style={{ width: "100%", display: "block" }} muted playsInline />
            </Box>
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              Point your camera at the book's ISBN barcode or QR code.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCamera(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openAddBook} onClose={() => setOpenAddBook(false)} fullWidth maxWidth="sm">
          <form onSubmit={handleAddBook}>
            <DialogTitle>Add Book to Catalog</DialogTitle>
            <DialogContent>
              <Stack spacing={2} mt={1}>
                <TextField label="Title" required fullWidth value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} />
                <TextField label="Author" required fullWidth value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })} />
                <TextField label="Category" fullWidth value={bookForm.category} onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })} />
                <TextField label="ISBN (optional)" fullWidth value={bookForm.isbn} onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })} />
                <TextField label="Total Copies" type="number" required fullWidth inputProps={{ min: 1 }} value={bookForm.totalCopies} onChange={(e) => setBookForm({ ...bookForm, totalCopies: e.target.value })} />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAddBook(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Add Book</Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog open={Boolean(issueBookTarget)} onClose={() => setIssueBookTarget(null)} fullWidth maxWidth="sm">
          <form onSubmit={handleIssueBook}>
            <DialogTitle>Issue "{issueBookTarget?.title}"</DialogTitle>
            <DialogContent>
              <Stack spacing={2} mt={1}>
                <TextField label="Student Name" required fullWidth value={issueForm.studentName} onChange={(e) => setIssueForm({ ...issueForm, studentName: e.target.value })} />
                <TextField label="Student Email" type="email" required fullWidth value={issueForm.studentEmail} onChange={(e) => setIssueForm({ ...issueForm, studentEmail: e.target.value })} />
                <TextField label="Due Date" type="date" required fullWidth InputLabelProps={{ shrink: true }} value={issueForm.dueDate} onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })} />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIssueBookTarget(null)}>Cancel</Button>
              <Button type="submit" variant="contained">Issue Book</Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Page>
  );
}
