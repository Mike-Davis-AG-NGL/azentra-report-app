import { Add, EditSquare, Remove } from "@mui/icons-material";
import { Alert, Backdrop, Box, Button, ButtonGroup, Card, Grid, Paper, Snackbar, Typography, } from "@mui/material";
import { DataGrid, GridCell } from "@mui/x-data-grid";
import { UseTheme } from "../../Controllers/UseTheme";
import axios from "axios";
import { useEffect, useState } from "react";
import { AddEditDepartment } from "./AddEditDepartment";

export const Department = () => {
  const theme = UseTheme();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openDeleteBackdrop, setOpenDeleteBackdrop] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
    setSelectedDepartment(null);
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  const getDepartments = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        "http://localhost:5000/api/department/"
      );

      setRows(response.data.departments || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load departments"
      );
      setSuccess("");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDepartments();
  }, []);

  const confirmDeleteDepartment = async () => {
    if (!selectedDepartment?.id) return;

    try {
      setDeleteLoading(true);
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      const response = await axios.delete(
        `http://localhost:5000/api/department/${selectedDepartment.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(
        response.data.message || "Department deleted successfully"
      );
      setOpenSnackbar(true);
      setOpenDeleteBackdrop(false);
      setSelectedDepartment(null);
      setSelectedRows([]);

      await getDepartments();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete department"
      );
      setSuccess("");
      setOpenSnackbar(true);
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      field: "sno",
      headerName: "S.No",
      width: 80,
      sortable: false,
      renderCell: (params) =>
        rows.findIndex((row) => row.id === params.row.id) + 1,
    },
    {
      field: "department_name",
      headerName: "Department Name",
      flex: 1,
      minWidth: 180,
    },
    {
      field: "department_code",
      headerName: "Department Code",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "college_names",
      headerName: "College Names",
      flex: 1,
      minWidth: 250,
      sortable: false,
      renderCell: (params) => Array.isArray(params.row.college_names) ? params.row.college_names.join(", ") : "",
    },
    {
      field: "status",
      headerName: "Status",
      width: 110,
    },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  function renderRowHeaderCell(props) {
    return (
      <GridCell
        {...props}
        role={
          props.column.field === "department_name"
            ? "rowheader"
            : "gridcell"
        }
      />
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid size={12}>
          <Card
            sx={{
              mb: 2,
              bgcolor: theme.cardBg,
              borderColor: theme.cardBorder,
            }}
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
                      Department Management
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
                        onClick={() => {
                          setSelectedDepartment(null);
                          setOpenBackdrop(true);
                        }}
                        sx={{
                          color: theme.secondaryText,
                          bgcolor: theme.secondaryAccent,
                          border: 'none',
                          "&.Mui-disabled": {
                            color: theme.mutedText,
                          },
                        }}
                      >
                        <Add />
                      </Button>

                      <Button
                        onClick={() => {
                          const department = rows.find(
                            (row) => row.id === selectedRows[0]
                          );

                          if (department) {
                            setSelectedDepartment(department);
                            setOpenBackdrop(true);
                          }
                        }}
                        disabled={selectedRows.length !== 1}
                        sx={{
                          color: theme.secondaryText,
                          bgcolor: theme.secondaryAccent,
                          border: 'none',
                          "&.Mui-disabled": {
                            color: theme.mutedText,
                          },
                        }}
                      >
                        <EditSquare />
                      </Button>

                      <Button
                        onClick={() => {
                          const department = rows.find(
                            (row) => row.id === selectedRows[0]
                          );

                          if (department) {
                            setSelectedDepartment(department);
                            setOpenDeleteBackdrop(true);
                          }
                        }}
                        disabled={selectedRows.length !== 1}
                        sx={{
                          color: theme.secondaryText,
                          bgcolor: theme.secondaryAccent,
                          border: 'none',
                          "&.Mui-disabled": {
                            color: theme.mutedText,
                          },
                        }}
                      >
                        <Remove />
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
              getRowId={(row) => row.id}
              initialState={{
                pagination: { paginationModel },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              slots={{ cell: renderRowHeaderCell }}
              rowSelectionModel={selectedRows}
              onRowSelectionModelChange={(newSelection) => {
                setSelectedRows(
                  Array.isArray(newSelection)
                    ? newSelection
                    : Array.from(newSelection.ids)
                );
              }}
              sx={{
                border: 0,
                bgcolor: theme.cardBg,

                "--DataGrid-containerBackground": `${theme.secondaryAccent} !important`,
                "--DataGrid-t-header-background-base": `${theme.secondaryAccent} !important`,

                "& .MuiDataGrid-main": {
                  bgcolor: theme.cardBg,
                },

                "& .MuiDataGrid-virtualScroller": {
                  bgcolor: theme.cardBg,
                },

                "& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader, & .MuiDataGrid-filler, & .MuiDataGrid-scrollbarFiller": {
                  backgroundColor: `${theme.secondaryAccent} !important`,
                },

                "& .MuiDataGrid-columnHeaders": {
                  color: theme.primaryText,
                  borderBottom: `1px solid ${theme.cardBorder}`,
                },

                "& .MuiDataGrid-columnHeader": {
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

      <Backdrop
        sx={(themes) => ({
          color: theme.primaryText,
          zIndex: themes.zIndex.drawer + 1,
        })}
        open={openBackdrop}
        onClick={handleCloseBackdrop}
      >
        <Box onClick={(event) => event.stopPropagation()}>
          {openBackdrop && (
            <AddEditDepartment
              department={selectedDepartment}
              onClose={handleCloseBackdrop}
              onUpdated={getDepartments}
            />
          )}
        </Box>
      </Backdrop>

      <Backdrop
        sx={{
          color: theme.primaryText,
          zIndex: (themes) => themes.zIndex.drawer + 1,
        }}
        open={openDeleteBackdrop}
        onClick={() => {
          if (!deleteLoading) {
            setOpenDeleteBackdrop(false);
            setSelectedDepartment(null);
          }
        }}
      >
        <Card
          onClick={(event) => event.stopPropagation()}
          sx={{
            p: 3,
            minWidth: 250,
            maxWidth: "70vw",
            bgcolor: theme.cardBg,
            color: theme.primaryText,
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Delete Department
          </Typography>

          <Typography sx={{ mb: 3 }}>
            Are you sure you want to delete{" "}
            {selectedDepartment?.department_name}?
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <Button
              disabled={deleteLoading}
              onClick={() => {
                setOpenDeleteBackdrop(false);
                setSelectedDepartment(null);
              }}
              sx={{ color: theme.primaryText }}
            >
              Cancel
            </Button>

            <Button
              onClick={confirmDeleteDepartment}
              disabled={deleteLoading}
              variant="contained"
              color="error"
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </Box>
        </Card>
      </Backdrop>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          variant="filled"
          severity={error ? "error" : "success"}
          sx={{
            backgroundColor: error ? theme.error : theme.success,
          }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
};