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
  MenuItem,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useSnackbar } from "notistack";
import Page from "../../components/Page";
import api from "../../utils/axios";
import { AuthContext } from "../../context/AuthContext";

const CATEGORIES = ["Academic", "Infrastructure", "Hostel", "Library", "Scholarship", "Other"];

export default function Grievance() {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Academic", description: "" });

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get("/complaint");
      setComplaints(res.data?.data?.complaints || res.data?.complaints || []);
    } catch {
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post("/complaint", {
        ...form,
        student: user?._id,
        studentName: user?.name,
        email: user?.email,
      });
      enqueueSnackbar("Grievance submitted successfully", { variant: "success" });
      setOpenModal(false);
      setForm({ title: "", category: "Academic", description: "" });
      fetchComplaints();
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Failed to submit grievance", { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page title="Grievance & Support">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} mb={3}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Grievance & Support
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submit campus grievances, track resolution status, and get institutional support
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
            Submit Grievance
          </Button>
        </Stack>

        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : complaints.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: "center", py: 6 }}>
              <SupportAgentOutlinedIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
              <Typography variant="h6" color="text.secondary">
                No grievances submitted
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Click "Submit Grievance" if you need assistance.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {complaints.map((item) => (
              <Card key={item._id}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" mb={0.75}>
                        <Typography variant="h6" fontWeight={700}>
                          {item.title || item.subject || "Grievance"}
                        </Typography>
                        {item.category && <Chip size="small" label={item.category} variant="outlined" />}
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {item.description || item.complaint}
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      label={item.status || "Open"}
                      color={item.status === "Resolved" ? "success" : "warning"}
                    />
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
          <form onSubmit={handleSubmit}>
            <DialogTitle>Submit Grievance</DialogTitle>
            <DialogContent>
              <Stack spacing={2} mt={1}>
                <TextField label="Subject / Title" required fullWidth value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <TextField label="Category" select fullWidth value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </TextField>
                <TextField label="Description" required fullWidth multiline rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenModal(false)}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Page>
  );
}
