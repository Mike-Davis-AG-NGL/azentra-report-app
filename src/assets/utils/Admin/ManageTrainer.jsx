import { useState, useEffect } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { DataGrid, GridCell } from "@mui/x-data-grid";
import { PersonAdd, EditSquare, PersonRemove } from "@mui/icons-material";
import { UseTheme } from "../../Controllers/UseTheme";
import axios from "axios";

const columns = [
  { field: "id", headerName: "S.No.", width: 90 },
  { field: "trainer_id", headerName: "Trainer ID", width: 130 },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 180,
    valueGetter: (value, row) => `${row.fname || ""} ${row.lname || ""}`.trim(),
  },

  { field: "email", headerName: "Email", width: 200 },
  { field: "mobile", headerName: "Mobile", width: 130 },
  {
    field: "specialization",
    headerName: "Specialization",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 180,
  },
  {
    field: "role",
    headerName: "Role",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 180,
  },
  {
    field: "status",
    headerName: "Status",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 180,
  },
];

const paginationModel = { page: 0, pageSize: 5 };

function renderRowHeaderCell(props) {
  return (
    <GridCell
      {...props}
      role={props.column.field === "fullName" ? "rowheader" : "gridcell"}
    />
  );
}

export const ManageTrainer = () => {
  const theme = UseTheme();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTrainers();
  }, []);

  const getTrainers = async () => {
    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/auth/trainer/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setRows(response.data.trainers || []);
    } catch (error) {
      console.error(
        "Error fetching trainers:",
        error.response?.data?.message || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid size={12}>
          <Card
            sx={{ mb: 2, bgcolor: theme.cardBg, borderColor: theme.cardBorder }}
          >
            <Box sx={{ flexGrow: 1, p: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: {
                        lg: "left",
                        md: "left",
                        sm: "center",
                        xs: "center",
                      },
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: theme.primaryText,
                        fontWeight: "bold",
                      }}
                    >
                      Trainer Management
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: {
                        lg: "right",
                        md: "right",
                        sm: "center",
                        xs: "center",
                      },
                      alignItems: "center",
                    }}
                  >
                    <ButtonGroup>
                      <Button
                        sx={{
                          color: theme.secondaryText,
                          bgcolor: theme.secondaryAccent,
                          borderColor: theme.secondaryText,
                        }}
                      >
                        <PersonAdd />
                      </Button>
                      <Button
                        sx={{
                          color: theme.secondaryText,
                          bgcolor: theme.secondaryAccent,
                          borderColor: theme.secondaryText,
                        }}
                      >
                        <EditSquare />
                      </Button>
                      <Button
                        sx={{
                          color: theme.secondaryText,
                          bgcolor: theme.secondaryAccent,
                          borderColor: theme.secondaryText,
                        }}
                      >
                        <PersonRemove />
                      </Button>
                    </ButtonGroup>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
        <Grid size={12}>
          <Paper
            sx={{
              height: 400,
              width: "100%",
              bgcolor: theme.cardBg,
              borderColor: theme.cardBorder,
            }}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              loading={loading}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              slots={{ cell: renderRowHeaderCell }}
              sx={{
                border: 0,
                bgcolor: theme.cardBg,

                "--DataGrid-t-header-background-base": `${theme.secondaryAccent} !important`,

                "& .MuiDataGrid-main": {
                  bgcolor: theme.cardBg,
                },

                "& .MuiDataGrid-virtualScroller": {
                  bgcolor: theme.cardBg,
                },

                "& .MuiDataGrid-columnHeaders": {
                  bgcolor: theme.secondaryAccent,
                  color: theme.primaryText,
                  borderBottom: `1px solid ${theme.cardBorder}`,
                },

                "& .MuiDataGrid-columnHeader": {
                  bgcolor: theme.secondaryAccent,
                  color: theme.primaryText,
                },

                "& .MuiDataGrid-columnHeaderTitle": {
                  color: theme.primaryText,
                  fontWeight: "bold",
                },

                "& .MuiDataGrid-row": {
                  bgcolor: theme.cardBg,
                },

                "& .MuiDataGrid-row:hover": {
                  bgcolor: theme.accentHover,
                },

                "& .MuiDataGrid-row:hover .MuiDataGrid-cell": {
                  color: theme.primaryText,
                },

                "& .MuiDataGrid-cell": {
                  color: theme.primaryText,
                  borderBottom: `1px solid ${theme.cardBorder}`,
                },

                "& .MuiDataGrid-row.Mui-selected": {
                  bgcolor: theme.accentHover,
                },

                "& .MuiDataGrid-row.Mui-selected:hover": {
                  bgcolor: theme.accentHover,
                },

                "& .MuiDataGrid-checkboxInput": {
                  color: theme.secondaryText,
                },

                "& .MuiDataGrid-checkboxInput.Mui-checked": {
                  color: theme.primaryText,
                },

                "& .MuiDataGrid-footerContainer": {
                  bgcolor: theme.cardBg,
                  color: theme.primaryText,
                  borderTop: `1px solid ${theme.cardBorder}`,
                },

                "& .MuiTablePagination-root": {
                  color: theme.primaryText,
                },

                "& .MuiIconButton-root": {
                  color: theme.primaryText,
                },
              }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
