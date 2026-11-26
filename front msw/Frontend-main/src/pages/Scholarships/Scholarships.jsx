import { useEffect, useState } from "react";
import {
  Box,
  Button,
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
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Page from "../../components/Page";
import api from "../../utils/axios";

const STATUS_FILTERS = ["All", "Open", "Closed"];

export default function Scholarships() {
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");

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
        <Box mb={3}>
          <Typography variant="h4" fontWeight={700}>
            Scholarship Information & Updates
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Explore active scholarships, eligibility criteria, and application deadlines
          </Typography>
        </Box>

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
                    </Stack>
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
