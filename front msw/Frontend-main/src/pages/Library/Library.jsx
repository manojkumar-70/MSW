import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import Page from "../../components/Page";
import api from "../../utils/axios";

export default function Library() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/library/books", {
        params: { search: search.trim() || undefined },
      });
      setBooks(res.data?.data?.books || []);
    } catch {
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search]);

  return (
    <Page title="Library">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Box mb={3}>
          <Typography variant="h4" fontWeight={700}>
            Library Information Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Search the institutional book catalog and check real-time availability
          </Typography>
        </Box>

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
                <Card sx={{ height: "100%" }}>
                  <CardContent>
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
                    <Typography variant="caption" color="primary.main" fontWeight={600} display="block" mt={1.5}>
                      {book.availableCopies} / {book.totalCopies} copies available
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Page>
  );
}
