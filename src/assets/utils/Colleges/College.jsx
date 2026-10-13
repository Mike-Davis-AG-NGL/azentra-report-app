// import React from 'react'

import { EditSquare, PersonAdd, PersonRemove } from "@mui/icons-material";
import { Alert, Backdrop, Box, Button, ButtonGroup, Card, Grid, Paper, Snackbar, Typography } from "@mui/material";
import { DataGrid, GridCell } from "@mui/x-data-grid";
import { UseTheme } from "../../Controllers/UseTheme";
import axios from "axios";
import { useEffect, useState } from "react";
import { AddEditCollege } from "./AddEditCollege";

export const College = () => {
  const theme = UseTheme()

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);

  // Backdrop
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openDeleteBackdrop, setOpenDeleteBackdrop] = useState(false);
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
    setSelectedCollege(null);
  };

  // Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const getColleges = async () => {
    setLoading(true);

    try {
      const response = await axios.get("http://localhost:5000/api/college/");
      setRows(response.data.colleges);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load colleges");
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getColleges();
  }, []);

  const confirmDeleteCollege = async () => {
    if (!selectedCollege?.id) return;

    try {
      setDeleteLoading(true);
      setError("");
      setSuccess("");

      const token =
        localStorage.getItem("token") ||
        sessionStorage.getItem("token");

      const response = await axios.delete(
        `http://localhost:5000/api/college/${selectedCollege.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(response.data.message || "College deleted successfully");
      setOpenSnackbar(true);
      setOpenDeleteBackdrop(false);
      setSelectedCollege(null);
      setSelectedRows([]);

      await getColleges();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete college"
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
    { field: "college_name", headerName: "College Name", flex: 1, minWidth: 180 },
    { field: "college_code", headerName: "College Code", flex: 1, minWidth: 130 },
    { field: "city", headerName: "City", flex: 1, minWidth: 120 },
    { field: "state", headerName: "State", flex: 1, minWidth: 120 },
    { field: "contact_person", headerName: "Contact Person", flex: 1, minWidth: 160 },
    { field: "contact_email", headerName: "Email", flex: 1, minWidth: 180 },
    { field: "contact_mobile", headerName: "Mobile", flex: 1, minWidth: 130 },
    { field: "status", headerName: "Status", width: 110 },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  function renderRowHeaderCell(props) {
    return (
      <GridCell
        {...props}
        role={props.column.field === "college_name" ? "rowheader" : "gridcell"}
      />
    );
  }

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
                      College Management
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
                          setSelectedCollege(null);
                          setOpenBackdrop(true);
                        }}
                        sx={{
                          color: theme.secondaryText,
                          bgcolor: theme.secondaryAccent,
                          borderColor: theme.secondaryText,
                          "&.Mui-disabled": {
                            color: theme.mutedText
                          },
                        }}
                      >
                        <PersonAdd />
                      </Button>
                      <Button
                        onClick={() => {
                          const college = rows.find((row) => row.id === selectedRows[0]);
                          if (college) {
                            setSelectedCollege(college);
                            setOpenBackdrop(true);
                          }
                        }}
                        disabled={selectedRows.length !== 1}
                        sx={{
                          color: theme.secondaryText,
                          bgcolor: theme.secondaryAccent,
                          borderColor: theme.secondaryText,
                          "&.Mui-disabled": {
                            color: theme.mutedText,
                          },
                        }}
                      >
                        <EditSquare />
                      </Button>
                      <Button
                        onClick={() => {
                          const college = rows.find((row) => row.id === selectedRows[0]);
                          if (college) {
                            setSelectedCollege(college);
                            setOpenDeleteBackdrop(true);
                          }
                        }}
                        disabled={selectedRows.length !== 1}
                        sx={{
                          color: theme.secondaryText,
                          bgcolor: theme.secondaryAccent,
                          borderColor: theme.secondaryText,
                          "&.Mui-disabled": {
                            color: theme.mutedText,
                          },
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
              getRowId={(row) => row.id}
              initialState={{ pagination: { paginationModel } }}
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
        sx={(themes) => ({ color: theme.primaryText, zIndex: themes.zIndex.drawer + 1 })}
        open={openBackdrop} onClick={handleCloseBackdrop}
      >
        <Box onClick={(event) => event.stopPropagation()}>
          {openBackdrop && (
            <AddEditCollege college={selectedCollege} onClose={handleCloseBackdrop} onUpdated={getColleges} />
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
            setSelectedCollege(null);
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
            Delete College
          </Typography>

          <Typography sx={{ mb: 3 }}>
            Are you sure you want to delete{" "}
            {selectedCollege?.college_name}?
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              disabled={deleteLoading}
              onClick={() => {
                setOpenDeleteBackdrop(false);
                setSelectedCollege(null);
              }}
              sx={{ color: theme.primaryText }}
            >
              Cancel
            </Button>

            <Button
              onClick={confirmDeleteCollege}
              disabled={deleteLoading}
              variant="contained"
              color="error"
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </Box>
        </Card>
      </Backdrop>
      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} variant='filled' severity={error ? 'error' : 'success'}
          sx={{
            backgroundColor: error ? theme.error : theme.success
          }}>
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  )
}
