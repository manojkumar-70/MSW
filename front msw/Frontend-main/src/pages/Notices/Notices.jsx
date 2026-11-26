import { useEffect, useState, useContext } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useSnackbar } from "notistack";
import Page from "../../components/Page";
import api from "../../utils/axios";
import { AuthContext } from "../../context/AuthContext";

const CATEGORIES = ["All", "General", "Exam", "Event", "Academic", "Urgent"];

const categoryColor = {
  General: "default",
  Exam: "warning",
  Event: "info",
  Academic: "primary",
  Urgent: "error",
};

export default function Notices() {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const canManage = ["admin", "faculty", "hod", "director"].includes(user?.roleName);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "General",
    isPinned: false,
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post("/notices", form);
      enqueueSnackbar("Notice posted", { variant: "success" });
      setOpenModal(false);
      setForm({ title: "", description: "", category: "General", isPinned: false });
      fetchNotices();
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Failed to post notice", { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notices/${id}`);
      enqueueSnackbar("Notice deleted", { variant: "success" });
      setNotices((prev) => prev.filter((n) => n._id !== id));
    } catch {
      enqueueSnackbar("Failed to delete notice", { variant: "error" });
    }
  };

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await api.get("/notices", {
        params: { category, search: search.trim() || undefined },
      });
      setNotices(res.data?.data?.notices || []);
    } catch {
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [category, search]);

  return (
    <Page title="Notices & Circulars">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} mb={3}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Notices & Circulars
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Official announcements, exam schedules, and campus circulars
            </Typography>
          </Box>
          {canManage && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenModal(true)}
            >
              Post Notice
            </Button>
          )}
        </Stack>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }} justifyContent="space-between">
              <TextField
                size="small"
                placeholder="Search notices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ minWidth: { md: 300 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {CATEGORIES.map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    clickable
                    color={category === cat ? "primary" : "default"}
                    variant={category === cat ? "filled" : "outlined"}
                    onClick={() => setCategory(cat)}
                  />
                ))}
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : notices.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: "center", py: 6 }}>
              <CampaignOutlinedIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
              <Typography variant="h6" color="text.secondary">
                No notices found
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Check back later for new circulars and announcements.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {notices.map((notice) => (
              <Card key={notice._id}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" mb={0.75}>
                        {notice.isPinned && <PushPinIcon fontSize="small" color="primary" />}
                        <Typography variant="h6" fontWeight={700}>
                          {notice.title}
                        </Typography>
                        <Chip
                          size="small"
                          label={notice.category}
                          color={categoryColor[notice.category] || "default"}
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                        {notice.description}
                      </Typography>
                      <Typography variant="caption" color="text.disabled" display="block" mt={1.5}>
                        Posted {new Date(notice.createdAt).toLocaleDateString()}
                        {notice.createdBy?.name ? ` • ${notice.createdBy.name}` : ""}
                      </Typography>
                    </Box>
                    {canManage && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(notice._id)}
                        aria-label="Delete notice"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
          <form onSubmit={handleCreate}>
            <DialogTitle>Post New Notice</DialogTitle>
            <DialogContent>
              <Stack spacing={2} mt={1}>
                <TextField
                  label="Title"
                  required
                  fullWidth
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <TextField
                  label="Category"
                  select
                  fullWidth
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Description"
                  required
                  fullWidth
                  multiline
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.isPinned}
                      onChange={(e) => setForm({ ...form, isPinned: e.target.checked })}
                    />
                  }
                  label="Pin notice to top"
                />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? "Posting..." : "Post Notice"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Page>
  );
}
