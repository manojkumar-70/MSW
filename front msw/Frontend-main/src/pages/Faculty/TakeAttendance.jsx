import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SaveIcon from "@mui/icons-material/Save";
import { useSnackbar } from "notistack";
import Page from "../../components/Page";
import api from "../../utils/axios";

const TIME_SLOTS = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:15 - 12:15",
  "01:30 - 02:30",
  "02:30 - 03:30",
];

const SECTIONS = ["All", "A", "B", "C"];
const CLASSES = ["All", "CSE", "ISE", "AIML", "AIDS", "ECE", "MBA", "MCA", "MSW"];

export default function TakeAttendance() {
  const { enqueueSnackbar } = useSnackbar();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [department, setDepartment] = useState("All");
  const [section, setSection] = useState("All");
  const [subject, setSubject] = useState("Social Work");
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await api.get("/class-attendance/students", { params: { section, department } });
        const list = res.data?.data?.students || [];
        setStudents(list);
        const initial = {};
        list.forEach((s) => {
          initial[s._id] = "P";
        });
        setAttendanceMap(initial);
      } catch {
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [section, department]);

  const toggleStatus = (studentId, status) => {
    setAttendanceMap((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAllPresent = () => {
    const next = {};
    students.forEach((s) => {
      next[s._id] = "P";
    });
    setAttendanceMap(next);
  };

  const handleSave = async () => {
    if (students.length === 0) return;
    try {
      setSaving(true);
      const records = students.map((s) => ({
        student: s._id,
        studentName: s.name,
        usn: s.usn || "",
        status: attendanceMap[s._id] || "P",
      }));
      await api.post("/class-attendance", { date, timeSlot, section, subject, records });
      enqueueSnackbar("Attendance saved successfully", { variant: "success" });
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.message || "Failed to save attendance", { variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const presentCount = Object.values(attendanceMap).filter((v) => v === "P").length;
  const absentCount = students.length - presentCount;

  return (
    <Page title="Take Attendance">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} mb={3}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Take Class Attendance
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select class date, time slot, and section, then mark P / A with one click
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5}>
            <Button variant="outlined" startIcon={<CheckCircleOutlineIcon />} onClick={markAllPresent} disabled={students.length === 0}>
              Mark All P
            </Button>
            <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving || students.length === 0}>
              {saving ? "Saving..." : "Save Attendance"}
            </Button>
          </Stack>
        </Stack>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2.4}>
                <TextField label="Date" type="date" fullWidth size="small" InputLabelProps={{ shrink: true }} value={date} onChange={(e) => setDate(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <TextField label="Time Slot" select fullWidth size="small" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                  {TIME_SLOTS.map((slot) => (
                    <MenuItem key={slot} value={slot}>{slot}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <TextField label="Class" select fullWidth size="small" value={department} onChange={(e) => setDepartment(e.target.value)}>
                  {CLASSES.map((cls) => (
                    <MenuItem key={cls} value={cls}>{cls}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <TextField label="Section" select fullWidth size="small" value={section} onChange={(e) => setSection(e.target.value)}>
                  {SECTIONS.map((sec) => (
                    <MenuItem key={sec} value={sec}>{sec}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <TextField label="Subject" fullWidth size="small" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Stack direction="row" spacing={1.5} mb={2}>
          <Chip label={`Total: ${students.length}`} />
          <Chip label={`Present: ${presentCount}`} color="success" />
          <Chip label={`Absent: ${absentCount}`} color="error" />
        </Stack>

        <Card>
          <CardContent>
            {loading ? (
              <Box display="flex" justifyContent="center" py={6}>
                <CircularProgress />
              </Box>
            ) : students.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" py={4}>
                No students found for this section.
              </Typography>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Student Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>USN</TableCell>
                      <TableCell align="right">Attendance (P / A)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((s) => {
                      const status = attendanceMap[s._id] || "P";
                      return (
                        <TableRow key={s._id} hover>
                          <TableCell>{s.name}</TableCell>
                          <TableCell>{s.email}</TableCell>
                          <TableCell>{s.usn || "—"}</TableCell>
                          <TableCell align="right">
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Button
                                size="small"
                                variant={status === "P" ? "contained" : "outlined"}
                                color="success"
                                onClick={() => toggleStatus(s._id, "P")}
                                sx={{ minWidth: 44 }}
                              >
                                P
                              </Button>
                              <Button
                                size="small"
                                variant={status === "A" ? "contained" : "outlined"}
                                color="error"
                                onClick={() => toggleStatus(s._id, "A")}
                                sx={{ minWidth: 44 }}
                              >
                                A
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}
