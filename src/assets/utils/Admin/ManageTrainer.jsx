import { useState, useEffect, useRef } from "react";
import { Alert, Backdrop, Box, Button, ButtonGroup, Card, Grid, Paper, Snackbar, Typography, } from "@mui/material";
import { DataGrid, GridCell } from "@mui/x-data-grid";
import { EditSquare, PersonRemove, SimCardDownload } from "@mui/icons-material";
import { UseTheme } from "../../Controllers/UseTheme";
import axios from "axios";
import { EditTrainer } from "./EditTrainer";
import html2canvas from "html2canvas"

const columns = [
  {
    field: "serialNumber",
    headerName: "S.No.",
    width: 90,
    sortable: false,
    filterable: false,
    renderCell: (params) =>
      params.api.getRowIndexRelativeToVisibleRows(params.id) + 1,
  },
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

  const [deleteLoading, setDeleteLoading] = useState(false)
  const [openDeleteBackdrop, setOpenDeleteBackdrop] = useState(false);

  const [downloadLoading, setDownloadLoading] = useState(false)
  const [openDownloadBackdrop, setOpenDownloadBackdrop] = useState(false)

  const [trainerCredentials, setTrainerCredentials] = useState({
    trainer_id: "", email: "", temporary_password: ""
  })

  const [downloadReady, setDownloadReady] = useState(false)
  const trainerCardRef = useRef()

  const [selectedTrainer, setSelectedTrainer] = useState(null)
  const [selectedRows, setSelectedRows] = useState([])

  // Backdrop
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false)
    setSelectedTrainer(null)
  }

  // snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return
    setOpenSnackbar(false)
  }

  const handleEditTrainer = () => {
    if (selectedRows.length !== 1) {
      return;
    }

    const trainer = rows.find(
      (row) => row.id === selectedRows[0]
    );

    if (trainer) {
      setSelectedTrainer(trainer);
      setOpenBackdrop(true);
    }
  };

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
      console.error("Error fetching trainers:", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrainer = () => {
    if (selectedRows.length !== 1) return;

    const trainer = rows.find((row) => row.id === selectedRows[0]);
    if (!trainer) return;

    setSelectedTrainer(trainer);
    setOpenDeleteBackdrop(true);
  }

  const confirmDeleteTrainer = async () => {
    if (!selectedTrainer) return
    try {
      setDeleteLoading(true)
      setError("")
      setSuccess("")
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      const response = await axios.delete(`http://localhost:5000/api/auth/trainer/delete/${selectedTrainer.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setSuccess(response.data.message || "Trainer deleted successfully");
      setOpenSnackbar(true);
      setOpenDeleteBackdrop(false);
      setSelectedTrainer(null);
      setSelectedRows([]);

      await getTrainers();
    } catch (error) {
      setSuccess("")
      setError(error.response?.data?.message || "Failed to delete trainer");
      setOpenSnackbar(true);
    } finally {
      setDeleteLoading(false)
    }
  }

  const handleDownloadTrainer = () => {
    if (selectedRows.length !== 1) return
    const trainer = rows.find((row) => row.id === selectedRows[0])
    if (!trainer) return
    setSelectedTrainer(trainer)
    setOpenDownloadBackdrop(true)
  }

  const confirmDownloadTrainer = async () => {
    if (!selectedTrainer) return
    try {
      setDownloadLoading(true)
      setError("")
      setSuccess("")
      const token = localStorage.getItem("token") || sessionStorage.getItem("token")
      const response = await axios.post(`http://localhost:5000/api/auth/trainer/profile/download/${selectedTrainer.id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      setTrainerCredentials(response.data.credentials)
      setOpenDownloadBackdrop(false)
      setDownloadReady(true)
    } catch (error) {
      setSuccess("")
      setError(error.response?.data?.message || "Failed to reset password and download trainer profile");
      setOpenSnackbar(true);
    } finally {
      setDownloadLoading(false)
    }
  }

  useEffect(() => {
    if (!downloadReady || !trainerCardRef.current) return
    const handlePrint = async () => {
      try {
        const canvas = await html2canvas(trainerCardRef.current, {
          backgroundColor: theme.cardBg,
          scale: 2,
          useCORS: true
        })
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");

        link.href = image;
        link.download = `${trainerCredentials.trainer_id}-credentials.png`;
        link.click();
        setSuccess("Trainer profile downloaded successfully");
        setError("");
        setOpenSnackbar(true);
      } catch (error) {
        setSuccess("")
        setError(error.response?.data?.message || "Unable to generate trainer credential card")
        setOpenSnackbar(true)
      } finally {
        setDownloadReady(false)
      }
    }
    handlePrint()
  }, [downloadReady, trainerCredentials, theme])

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
                        onClick={handleDownloadTrainer}
                        disabled={selectedRows.length !== 1 || downloadLoading}
                        sx={{
                          color: theme.secondaryText,
                          bgcolor: theme.secondaryAccent,
                          borderColor: theme.secondaryText,
                          "&.Mui-disabled": {
                            color: theme.mutedText
                          },
                        }}
                      >
                        <SimCardDownload />
                      </Button>
                      <Button
                        onClick={handleEditTrainer}
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
                        onClick={handleDeleteTrainer}
                        disabled={selectedRows.length != 1 || deleteLoading}
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
          {selectedTrainer && (
            <EditTrainer trainer={selectedTrainer} onClose={handleCloseBackdrop} onUpdated={getTrainers} />
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
            setSelectedTrainer(null);
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
            Delete Trainer
          </Typography>

          <Typography sx={{ mb: 3 }}>
            Are you sure you want to delete{" "}
            {selectedTrainer?.fname} {selectedTrainer?.lname}?
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              disabled={deleteLoading}
              onClick={() => {
                setOpenDeleteBackdrop(false);
                setSelectedTrainer(null);
              }}
              sx={{ color: theme.primaryText }}
            >
              Cancel
            </Button>

            <Button
              onClick={confirmDeleteTrainer}
              disabled={deleteLoading}
              variant="contained"
              color="error"
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </Box>
        </Card>
      </Backdrop>
      <Backdrop
        sx={{
          color: theme.primaryText,
          zIndex: (themes) => themes.zIndex.drawer + 1,
        }}
        open={openDownloadBackdrop}
        onClick={() => {
          if (!downloadLoading) {
            setOpenDownloadBackdrop(false);
            setSelectedTrainer(null);
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
            border: `1px solid ${theme.cardBorder}`,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Download Trainer Profile
          </Typography>

          <Typography sx={{ mb: 3, color: theme.secondaryText }}>
            Downloading this profile will reset the trainer's password
            and generate a new temporary password. The trainer must
            change this password on their next login.
            <br />
            <br />
            Do you want to continue?
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
            }}
          >
            <Button
              disabled={downloadLoading}
              onClick={() => {
                setOpenDownloadBackdrop(false);
                setSelectedTrainer(null);
              }}
              sx={{ color: theme.primaryText }}
            >
              Cancel
            </Button>

            <Button
              onClick={confirmDownloadTrainer}
              disabled={downloadLoading}
              variant="contained"
            >
              {downloadLoading ? "Processing..." : "Confirm Download"}
            </Button>
          </Box>
        </Card>
      </Backdrop>
      <Box
        sx={{
          position: "fixed",
          left: "-10000px",
          top: 0,
          width: 360,
          bgcolor: theme.cardBg,
        }}
      >
        <Card
          ref={trainerCardRef}
          sx={{
            width: 360,
            bgcolor: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            borderRadius: 2,
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography
              gutterBottom
              sx={{
                color: theme.success,
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              Trainer Credentials Reset Successfully
            </Typography>
            <Typography sx={{ color: theme.secondaryText, mb: 2 }}>
              Trainer email:
              <br />
              <span style={{ color: theme.primaryText }}>
                {trainerCredentials.email}
              </span>
            </Typography>
            <Typography sx={{ color: theme.secondaryText, mb: 2 }}>
              Trainer ID:
              <br />
              <span style={{ color: theme.primaryText }}>
                {trainerCredentials.trainer_id}
              </span>
            </Typography>
            <Typography sx={{ color: theme.secondaryText, mb: 2 }}>
              Temporary password:
              <br />
              <span style={{ color: theme.primaryText }}>
                {trainerCredentials.temporary_password}
              </span>
            </Typography>
            <Typography
              sx={{
                color: theme.error,
                fontSize: 13,
                mt: 3,
              }}
            >
              Please save these credentials securely. The trainer must
              change the temporary password during their next login.
            </Typography>
          </Box>
        </Card>
      </Box>
      <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} variant='filled' severity={error ? 'error' : 'success'}
          sx={{
            backgroundColor: error ? theme.error : theme.success
          }}>
          {error || success}
        </Alert>
      </Snackbar>
    </Box>
  );
};
