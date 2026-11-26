import { useEffect, useState, useContext } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";
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
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

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
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Container>
    </Page>
  );
}
