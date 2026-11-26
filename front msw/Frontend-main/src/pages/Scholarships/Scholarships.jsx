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
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useSnackbar } from "notistack";
import Page from "../../components/Page";
import api from "../../utils/axios";
import { AuthContext } from "../../context/AuthContext";

const STATUS_FILTERS = ["All", "Open", "Closed"];

export default function Scholarships() {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const canManage = ["admin", "hod", "director"].includes(user?.roleName);
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    provider: "",
    eligibility: "",
    amount: "",
    deadline: "",
    applyLink: "",
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post("/scholarships", form);
      enqueueSnackbar("Scholarship added", { variant: "success" });
      setOpenModal(false);
      setForm({ name: "", provider: "", eligibility: "", amount: "", deadline: "", applyLink: "" });
      fetchScholarships();
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Failed to add scholarship", { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/scholarships/${id}`);
      enqueueSnackbar("Scholarship deleted", { variant: "success" });
      setScholarships((prev) => prev.filter((s) => s._id !== id));
    } catch {
      enqueueSnackbar("Failed to delete scholarship", { variant: "error" });
    }
  };

  const fetchScholarships = async () => {
    try {
      setLoading(true);
      const res = await api.get("/scholarships", {
        params: {
          status: statusFilter,
          search: search.trim() || undefined,
        },
      });
      setScholarships(res.data?.data?.scholarships || []);
    } catch {
      setScholarships([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, [statusFilter, search]);

  return (
    <Page title="Scholarships">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} mb={3}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Scholarship Information & Updates
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Explore active scholarships, eligibility criteria, and application deadlines
            </Typography>
          </Box>
          {canManage && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
              Add Scholarship
            </Button>
          )}
        </Stack>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ md: "center" }}
              justifyContent="space-between"
            >
              <TextField
                size="small"
                placeholder="Search scholarships or providers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ minWidth: { md: 320 } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <Stack direction="row" spacing={1}>
                {STATUS_FILTERS.map((s) => (
                  <Chip
                    key={s}
                    label={s}
                    clickable
                    color={statusFilter === s ? "primary" : "default"}
                    variant={statusFilter === s ? "filled" : "outlined"}
                    onClick={() => setStatusFilter(s)}
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
        ) : scholarships.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: "center", py: 6 }}>
              <SchoolOutlinedIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
              <Typography variant="h6" color="text.secondary">
                No scholarships found
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Check back later for new scholarship opportunities.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={2.5}>
            {scholarships.map((item) => (
              <Grid item xs={12} md={6} key={item._id}>
                <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1} mb={1}>
                      <Typography variant="h6" fontWeight={700}>
                        {item.name}
                      </Typography>
                      <Chip
                        size="small"
                        label={item.status}
                        color={item.status === "Open" ? "success" : "default"}
                      />
                    </Stack>
                    <Typography variant="body2" color="primary.main" fontWeight={600} mb={1}>
                      {item.provider} • {item.amount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1.5}>
                      <strong>Eligibility:</strong> {item.eligibility}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mt="auto">
                      <Typography variant="caption" color="text.disabled">
                        Deadline: {new Date(item.deadline).toLocaleDateString()}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        {item.applyLink && (
                          <Button
                            size="small"
                            variant="outlined"
                            endIcon={<OpenInNewIcon fontSize="small" />}
                            href={item.applyLink}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Apply
                          </Button>
                        )}
                        {canManage && (
                          <IconButton size="small" color="error" onClick={() => handleDelete(item._id)}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
          <form onSubmit={handleCreate}>
            <DialogTitle>Add Scholarship</DialogTitle>
            <DialogContent>
              <Stack spacing={2} mt={1}>
                <TextField label="Scholarship Name" required fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                <TextField label="Provider" required fullWidth value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} />
                <TextField label="Amount (e.g., ₹25,000 / year)" required fullWidth value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                <TextField label="Eligibility Criteria" required fullWidth multiline rows={2} value={form.eligibility} onChange={(e) => setForm({ ...form, eligibility: e.target.value })} />
                <TextField label="Deadline" type="date" required fullWidth InputLabelProps={{ shrink: true }} value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                <TextField label="Application Link (optional)" fullWidth value={form.applyLink} onChange={(e) => setForm({ ...form, applyLink: e.target.value })} />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? "Saving..." : "Add Scholarship"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Page>
  );
}
