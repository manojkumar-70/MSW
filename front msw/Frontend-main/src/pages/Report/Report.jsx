import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ExcelJS from "exceljs";
import Page from "../../components/Page";
import api from "../../utils/axios";

export default function Report() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [nRes, sRes, bRes] = await Promise.all([
          api.get("/notices").catch(() => ({ data: { data: { notices: [] } } })),
          api.get("/scholarships").catch(() => ({ data: { data: { scholarships: [] } } })),
          api.get("/library/books").catch(() => ({ data: { data: { books: [] } } })),
        ]);
        setNotices(nRes.data?.data?.notices || []);
        setScholarships(sRes.data?.data?.scholarships || []);
        setBooks(bRes.data?.data?.books || []);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    if (tab === 0) {
      const sheet = workbook.addWorksheet("Notices Report");
      sheet.columns = [
        { header: "Title", key: "title", width: 35 },
        { header: "Category", key: "category", width: 15 },
        { header: "Pinned", key: "isPinned", width: 10 },
        { header: "Date", key: "createdAt", width: 18 },
      ];
      notices.forEach((n) =>
        sheet.addRow({
          title: n.title,
          category: n.category,
          isPinned: n.isPinned ? "Yes" : "No",
          createdAt: new Date(n.createdAt).toLocaleDateString(),
        })
      );
    } else if (tab === 1) {
      const sheet = workbook.addWorksheet("Scholarships Report");
      sheet.columns = [
        { header: "Name", key: "name", width: 35 },
        { header: "Provider", key: "provider", width: 28 },
        { header: "Amount", key: "amount", width: 18 },
        { header: "Status", key: "status", width: 12 },
        { header: "Deadline", key: "deadline", width: 18 },
      ];
      scholarships.forEach((s) =>
        sheet.addRow({
          name: s.name,
          provider: s.provider,
          amount: s.amount,
          status: s.status,
          deadline: new Date(s.deadline).toLocaleDateString(),
        })
      );
    } else {
      const sheet = workbook.addWorksheet("Library Report");
      sheet.columns = [
        { header: "Title", key: "title", width: 35 },
        { header: "Author", key: "author", width: 25 },
        { header: "Category", key: "category", width: 18 },
        { header: "Available", key: "availableCopies", width: 12 },
        { header: "Total", key: "totalCopies", width: 10 },
      ];
      books.forEach((b) =>
        sheet.addRow({
          title: b.title,
          author: b.author,
          category: b.category,
          availableCopies: b.availableCopies,
          totalCopies: b.totalCopies,
        })
      );
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `msw-report-${["notices", "scholarships", "library"][tab]}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Page title="Reports">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} spacing={2} mb={3}>
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Reports
            </Typography>
            <Typography variant="body2" color="text.secondary">
              View and export institutional data from MSW
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={exportToExcel}>
            Export to Excel
          </Button>
        </Stack>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label={`Notices (${notices.length})`} />
          <Tab label={`Scholarships (${scholarships.length})`} />
          <Tab label={`Library (${books.length})`} />
        </Tabs>

        <Card>
          <CardContent>
            {loading ? (
              <Box display="flex" justifyContent="center" py={6}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  {tab === 0 && (
                    <>
                      <TableHead>
                        <TableRow>
                          <TableCell>Title</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Pinned</TableCell>
                          <TableCell>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {notices.map((n) => (
                          <TableRow key={n._id}>
                            <TableCell>{n.title}</TableCell>
                            <TableCell><Chip size="small" label={n.category} /></TableCell>
                            <TableCell>{n.isPinned ? "Yes" : "No"}</TableCell>
                            <TableCell>{new Date(n.createdAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </>
                  )}
                  {tab === 1 && (
                    <>
                      <TableHead>
                        <TableRow>
                          <TableCell>Scholarship</TableCell>
                          <TableCell>Provider</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Deadline</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {scholarships.map((s) => (
                          <TableRow key={s._id}>
                            <TableCell>{s.name}</TableCell>
                            <TableCell>{s.provider}</TableCell>
                            <TableCell>{s.amount}</TableCell>
                            <TableCell><Chip size="small" label={s.status} color={s.status === "Open" ? "success" : "default"} /></TableCell>
                            <TableCell>{new Date(s.deadline).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </>
                  )}
                  {tab === 2 && (
                    <>
                      <TableHead>
                        <TableRow>
                          <TableCell>Title</TableCell>
                          <TableCell>Author</TableCell>
                          <TableCell>Category</TableCell>
                          <TableCell>Available / Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {books.map((b) => (
                          <TableRow key={b._id}>
                            <TableCell>{b.title}</TableCell>
                            <TableCell>{b.author}</TableCell>
                            <TableCell>{b.category}</TableCell>
                            <TableCell>{b.availableCopies} / {b.totalCopies}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </>
                  )}
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}
