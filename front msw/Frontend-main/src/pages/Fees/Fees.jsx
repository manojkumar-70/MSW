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
  MenuItem,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import AddIcon from "@mui/icons-material/Add";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useSnackbar } from "notistack";
import Page from "../../components/Page";
import api from "../../utils/axios";
import { AuthContext } from "../../context/AuthContext";

const CATEGORIES = ["Academic", "Exam", "Library Fine"];

export default function Fees() {
  const { user } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();
  const canManage = ["admin", "faculty", "hod", "director"].includes(user?.roleName);

  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [payTarget, setPayTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    studentEmail: "",
    studentName: "",
    title: "",
    category: "Academic",
    amount: "",
    dueDate: "",
  });

  const fetchFees = async () => {
    try {
      setLoading(true);
      const res = await api.get("/fees");
      setFees(res.data?.data?.fees || []);
    } catch {
      setFees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post("/fees", form);
      enqueueSnackbar("Fee / fine assigned", { variant: "success" });
      setOpenAdd(false);
      setForm({ studentEmail: "", studentName: "", title: "", category: "Academic", amount: "", dueDate: "" });
      fetchFees();
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Failed to assign fee", { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePay = async () => {
    if (!payTarget) return;
    try {
      setSubmitting(true);
      await api.patch(`/fees/${payTarget._id}/pay`);
      enqueueSnackbar("Payment successful!", { variant: "success" });
      setPayTarget(null);
      fetchFees();
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Payment failed", { variant: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const totalPending = fees.filter((f) => f.status === "Pending").reduce((sum, f) => sum + f.amount, 0);
  const totalPaid = fees.filter((f) => f.status === "Paid").reduce((sum, f) => sum + f.amount, 0);

  return (
    <Page title="Fees & Fines">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} mb={3}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Fees & Fines
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pay Academic, Exam, and Lost Library Book fees
            </Typography>
          </Box>
          {canManage && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAdd(true)}>
              Assign Fee / Fine
            </Button>
          )}
        </Stack>

        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Total Pending</Typography>
                <Typography variant="h4" fontWeight={700} color="warning.main">₹{totalPending}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="caption" color="text.secondary">Total Paid</Typography>
                <Typography variant="h4" fontWeight={700} color="success.main">₹{totalPaid}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {loading ? (
          <Box display="flex" justifyContent="center" py={6}>
            <CircularProgress />
          </Box>
        ) : fees.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: "center", py: 6 }}>
              <ReceiptLongIcon sx={{ fontSize: 48, color: "text.disabled", mb: 1 }} />
              <Typography variant="h6" color="text.secondary">No fees or fines recorded</Typography>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={2}>
            {fees.map((fee) => (
              <Card key={fee._id}>
                <CardContent>
                  <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2}>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                        <Typography variant="h6" fontWeight={700}>{fee.title}</Typography>
                        <Chip size="small" label={fee.category} variant="outlined" />
                        <Chip size="small" label={fee.status} color={fee.status === "Paid" ? "success" : "warning"} />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        Amount: <strong>₹{fee.amount}</strong> • Due: {new Date(fee.dueDate).toLocaleDateString()}
                        {canManage ? ` • Student: ${fee.studentEmail}` : ""}
                      </Typography>
                      {fee.transactionId && (
                        <Typography variant="caption" color="success.main" display="block" mt={0.5}>
                          Receipt ID: {fee.transactionId}
                        </Typography>
                      )}
                    </Box>
                    {fee.status === "Pending" && user?.roleName === "student" && (
                      <Button variant="contained" startIcon={<PaymentIcon />} onClick={() => setPayTarget(fee)}>
                        Pay ₹{fee.amount}
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        <Dialog open={openAdd} onClose={() => setOpenAdd(false)} fullWidth maxWidth="sm">
          <form onSubmit={handleCreate}>
            <DialogTitle>Assign Fee / Library Fine</DialogTitle>
            <DialogContent>
              <Stack spacing={2} mt={1}>
                <TextField label="Student Email" type="email" required fullWidth value={form.studentEmail} onChange={(e) => setForm({ ...form, studentEmail: e.target.value })} />
                <TextField label="Student Name (optional)" fullWidth value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} />
                <TextField label="Title (e.g., Semester 3 Exam Fee)" required fullWidth value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <TextField label="Category" select fullWidth value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
                <TextField label="Amount (₹)" type="number" required fullWidth inputProps={{ min: 1 }} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
                <TextField label="Due Date" type="date" required fullWidth InputLabelProps={{ shrink: true }} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={submitting}>Assign</Button>
            </DialogActions>
          </form>
        </Dialog>

        <Dialog open={Boolean(payTarget)} onClose={() => setPayTarget(null)} fullWidth maxWidth="xs">
          <DialogTitle>Confirm Payment</DialogTitle>
          <DialogContent>
            <Typography variant="body2">
              Pay <strong>₹{payTarget?.amount}</strong> for <strong>{payTarget?.title}</strong> ({payTarget?.category})?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPayTarget(null)}>Cancel</Button>
            <Button variant="contained" onClick={handlePay} disabled={submitting}>
              {submitting ? "Processing..." : "Confirm & Pay"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Page>
  );
}
